"use strict";

const PRINT_DATA_KEY = "irzaLastControlList";
const DETAIL_TIMEOUT_MS = 20000;

browser.runtime.onMessage.addListener((message, sender) => {
  if (message?.type === "irza-start-control-list") {
    return createControlList(message, sender);
  }
  return undefined;
});

async function createControlList(message, sender) {
  const sourceTabId = sender.tab?.id;
  const animals = Array.isArray(message.animals) ? message.animals : [];
  if (!sourceTabId || animals.length === 0) {
    throw new Error("Brak danych zwierząt do przygotowania listy.");
  }

  let workerTab = null;
  const enriched = [];

  try {
    for (let index = 0; index < animals.length; index += 1) {
      const animal = animals[index];
      await sendProgress(sourceTabId, index + 1, animals.length, animal.id);

      const url = detailUrl(animal.id);
      if (!workerTab) {
        workerTab = await browser.tabs.create({ active: false, url });
      } else {
        workerTab = await browser.tabs.update(workerTab.id, { active: false, url });
      }

      let detail;
      try {
        await waitForTabComplete(workerTab.id);
        detail = await requestAnimalDetail(workerTab.id, message.activityNumber);
      } catch {
        detail = { arrivalDate: "-", duplicateNumber: "-", origin: "?" };
      }
      enriched.push({ ...animal, ...detail });
    }
  } finally {
    if (workerTab?.id) {
      await browser.tabs.remove(workerTab.id).catch(() => undefined);
    }
  }

  const printData = {
    activityNumber: message.activityNumber,
    stateDate: message.stateDate,
    generatedAt: new Date().toISOString(),
    animals: enriched
  };

  await browser.storage.local.set({ [PRINT_DATA_KEY]: printData });
  await browser.tabs.create({ url: browser.runtime.getURL("wydruk.html") });
  return { count: enriched.length };
}

function detailUrl(animalId) {
  const encodedId = encodeURIComponent(animalId);
  return `https://irz.arimr.gov.pl/zwierzeta/indywidualne/${encodedId}/podglad?backUrl=%2Fzwierzeta%2Findywidualne%2Fzwierze`;
}

async function sendProgress(tabId, current, total, animalId) {
  await browser.tabs.sendMessage(tabId, {
    type: "irza-control-list-progress",
    current,
    total,
    animalId
  }).catch(() => undefined);
}

async function waitForTabComplete(tabId) {
  const current = await browser.tabs.get(tabId);
  if (current.status === "complete") {
    return;
  }

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      browser.tabs.onUpdated.removeListener(listener);
      reject(new Error("Przekroczono czas oczekiwania na kartę zwierzęcia."));
    }, DETAIL_TIMEOUT_MS);

    function listener(updatedTabId, changeInfo) {
      if (updatedTabId !== tabId || changeInfo.status !== "complete") {
        return;
      }
      clearTimeout(timeout);
      browser.tabs.onUpdated.removeListener(listener);
      resolve();
    }

    browser.tabs.onUpdated.addListener(listener);
  });
}

async function requestAnimalDetail(tabId, activityNumber) {
  const deadline = Date.now() + DETAIL_TIMEOUT_MS;
  let lastResult = null;

  while (Date.now() < deadline) {
    try {
      lastResult = await browser.tabs.sendMessage(tabId, {
        type: "irza-extract-animal-detail",
        activityNumber
      });
      if (lastResult?.ready) {
        return lastResult.data;
      }
    } catch {
      // Content script or Angular view may still be loading.
    }
    await delay(500);
  }

  return lastResult?.data ?? {
    arrivalDate: "-",
    duplicateNumber: "-",
    origin: "?"
  };
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
