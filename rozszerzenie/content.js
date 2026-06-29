(() => {
  "use strict";

  if (window.top !== window || document.querySelector("#irza-host")) {
    return;
  }

  const STORAGE_KEY = "irzaActivityNumber";
  const ACTIVITY_PATTERN = /\b\d{9}-\d{3}\b/g;
  const browserStorage = globalThis.browser?.storage?.local;

  const state = {
    activityNumber: "",
    collapsed: false,
    messageTimer: null,
    collecting: false
  };

  const storage = {
    async get(key) {
      if (browserStorage) {
        const result = await browserStorage.get(key);
        return result[key] ?? "";
      }
      return localStorage.getItem(key) ?? "";
    },
    async set(key, value) {
      if (browserStorage) {
        await browserStorage.set({ [key]: value });
        return;
      }
      localStorage.setItem(key, value);
    }
  };

  const host = document.createElement("div");
  host.id = "irza-host";
  host.setAttribute("data-irza", "true");
  document.documentElement.append(host);

  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      :host {
        all: initial;
        color-scheme: light;
      }

      * {
        box-sizing: border-box;
        letter-spacing: 0;
      }

      .panel,
      .tab {
        position: fixed;
        z-index: 2147483647;
        right: 14px;
        font-family: "Segoe UI", Arial, sans-serif;
        color: #1d2935;
      }

      .panel {
        top: 82px;
        width: min(338px, calc(100vw - 28px));
        max-height: calc(100vh - 98px);
        overflow: auto;
        background: #ffffff;
        border: 1px solid #b8c5cf;
        border-top: 4px solid #176a5b;
        border-radius: 6px;
        box-shadow: 0 8px 24px rgba(21, 35, 46, 0.18);
      }

      .panel[hidden],
      .tab[hidden] {
        display: none;
      }

      .tab {
        top: 96px;
        min-height: 40px;
        border: 1px solid #176a5b;
        border-radius: 5px;
        padding: 0 12px;
        background: #176a5b;
        color: #ffffff;
        font: 600 14px/1 "Segoe UI", Arial, sans-serif;
        cursor: pointer;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 14px;
        border-bottom: 1px solid #d8e0e6;
      }

      .title {
        margin: 0;
        font-size: 16px;
        line-height: 1.25;
        font-weight: 700;
      }

      .module {
        margin-top: 3px;
        color: #5f6d78;
        font-size: 12px;
        line-height: 1.25;
      }

      .icon-button {
        flex: 0 0 32px;
        width: 32px;
        height: 32px;
        border: 1px solid transparent;
        border-radius: 4px;
        background: transparent;
        color: #36505f;
        font: 700 19px/1 "Segoe UI", Arial, sans-serif;
        cursor: pointer;
      }

      .icon-button:hover,
      .icon-button:focus-visible {
        border-color: #9eacb6;
        background: #eef3f5;
        outline: none;
      }

      .body {
        padding: 14px;
      }

      .section + .section {
        margin-top: 16px;
        padding-top: 15px;
        border-top: 1px solid #d8e0e6;
      }

      .section-title {
        margin: 0 0 9px;
        font-size: 13px;
        line-height: 1.25;
        font-weight: 700;
      }

      label {
        display: block;
        margin-bottom: 5px;
        color: #465763;
        font-size: 12px;
        line-height: 1.25;
      }

      input {
        width: 100%;
        height: 38px;
        border: 1px solid #8797a3;
        border-radius: 4px;
        padding: 0 10px;
        background: #ffffff;
        color: #17232d;
        font: 15px/1 "Segoe UI", Arial, sans-serif;
      }

      input:focus {
        border-color: #0b5cab;
        box-shadow: 0 0 0 2px rgba(11, 92, 171, 0.18);
        outline: none;
      }

      .actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-top: 8px;
      }

      button.action {
        min-height: 36px;
        border: 1px solid #0b5cab;
        border-radius: 4px;
        padding: 7px 10px;
        background: #ffffff;
        color: #0b5cab;
        font: 600 13px/1.25 "Segoe UI", Arial, sans-serif;
        cursor: pointer;
      }

      button.action.primary {
        width: 100%;
        min-height: 40px;
        background: #0b5cab;
        color: #ffffff;
      }

      button.action:hover,
      button.action:focus-visible {
        filter: brightness(0.96);
        outline: 2px solid rgba(11, 92, 171, 0.25);
        outline-offset: 1px;
      }

      button.action:disabled {
        border-color: #bcc6cd;
        background: #e8edef;
        color: #6d7982;
        cursor: not-allowed;
        filter: none;
      }

      .range {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin: 0 0 9px;
        color: #536571;
        font-size: 12px;
        line-height: 1.3;
      }

      .control-date {
        margin-bottom: 9px;
      }

      .message {
        min-height: 32px;
        margin-top: 12px;
        border-left: 3px solid #176a5b;
        padding: 7px 9px;
        background: #eaf4f1;
        color: #23463f;
        font-size: 12px;
        line-height: 1.35;
      }

      .message.error {
        border-left-color: #b42318;
        background: #fff0ee;
        color: #7a271a;
      }

      .footer {
        padding: 9px 14px;
        border-top: 1px solid #d8e0e6;
        background: #f5f7f8;
        color: #667681;
        font-size: 11px;
        line-height: 1.35;
      }
    </style>
    <aside class="panel" aria-label="IRZplus Asystent">
      <div class="header">
        <div>
          <h2 class="title">IRZplus Asystent</h2>
          <div class="module" id="irza-module">Aktualny widok</div>
        </div>
        <button class="icon-button" id="irza-collapse" type="button" title="Zwiń panel" aria-label="Zwiń panel">&gt;</button>
      </div>
      <div class="body">
        <section class="section">
          <h3 class="section-title">Kontekst działalności</h3>
          <label for="irza-activity">Numer działalności</label>
          <input id="irza-activity" inputmode="numeric" autocomplete="off" placeholder="NNNNNNNNN-NNN" maxlength="13">
          <div class="actions">
            <button class="action" id="irza-save" type="button">Zapisz</button>
            <button class="action" id="irza-detect" type="button">Pobierz ze strony</button>
          </div>
        </section>
        <section class="section" id="irza-report-section">
          <h3 class="section-title">Raport terminowości</h3>
          <p class="range"><span id="irza-date-from"></span><span id="irza-date-to"></span></p>
          <button class="action primary" id="irza-fill-report" type="button">Uzupełnij formularz</button>
        </section>
        <section class="section" id="irza-list-section" hidden>
          <h3 class="section-title">Lista kontrolna zwierząt</h3>
          <label for="irza-control-date">Stan na dzień</label>
          <input class="control-date" id="irza-control-date" inputmode="numeric" placeholder="DD-MM-RRRR" maxlength="10">
          <button class="action primary" id="irza-create-list" type="button">Przygotuj listę</button>
        </section>
        <div class="message" id="irza-message" role="status">Asystent jest gotowy.</div>
      </div>
      <div class="footer">Wersja testowa. Dane pozostają w tej przeglądarce.</div>
    </aside>
    <button class="tab" id="irza-expand" type="button" hidden>Asystent</button>
  `;

  const elements = {
    panel: shadow.querySelector(".panel"),
    tab: shadow.querySelector("#irza-expand"),
    collapse: shadow.querySelector("#irza-collapse"),
    module: shadow.querySelector("#irza-module"),
    activity: shadow.querySelector("#irza-activity"),
    save: shadow.querySelector("#irza-save"),
    detect: shadow.querySelector("#irza-detect"),
    reportSection: shadow.querySelector("#irza-report-section"),
    fillReport: shadow.querySelector("#irza-fill-report"),
    listSection: shadow.querySelector("#irza-list-section"),
    controlDate: shadow.querySelector("#irza-control-date"),
    createList: shadow.querySelector("#irza-create-list"),
    dateFrom: shadow.querySelector("#irza-date-from"),
    dateTo: shadow.querySelector("#irza-date-to"),
    message: shadow.querySelector("#irza-message")
  };

  function normalize(value) {
    return String(value ?? "").replace(/\s+/g, " ").trim();
  }

  function currentModule() {
    const heading = document.querySelector("h1, h2.module-header, h2");
    if (heading && !host.contains(heading)) {
      const text = normalize(heading.textContent);
      if (text) {
        return text;
      }
    }

    const activeLink = document.querySelector(".nav-link.active");
    return normalize(activeLink?.textContent) || "Aktualny widok";
  }

  function isReportForm() {
    const labels = [...document.querySelectorAll("label")].map((label) => normalize(label.textContent));
    return labels.includes("Data wpływu od") && labels.includes("Data zdarzenia do");
  }

  function isAnimalList() {
    return Boolean(findAnimalTable());
  }

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}-${month}-${date.getFullYear()}`;
  }

  function reportRange() {
    const today = new Date();
    return {
      from: `01-01-${today.getFullYear()}`,
      to: formatDate(today)
    };
  }

  function showMessage(text, isError = false) {
    clearTimeout(state.messageTimer);
    elements.message.textContent = text;
    elements.message.classList.toggle("error", isError);
    state.messageTimer = setTimeout(() => {
      elements.message.textContent = "Asystent jest gotowy.";
      elements.message.classList.remove("error");
    }, 6000);
  }

  function validateActivity(value) {
    return /^\d{9}-\d{3}$/.test(normalize(value));
  }

  function pageActivityNumbers() {
    const values = [];
    const addMatches = (text) => {
      const matches = String(text ?? "").match(ACTIVITY_PATTERN) ?? [];
      values.push(...matches);
    };

    document.querySelectorAll("input").forEach((input) => addMatches(input.value));
    addMatches(document.body.innerText);
    return [...new Set(values)];
  }

  function findControl(labelText) {
    const label = [...document.querySelectorAll("label")].find(
      (candidate) => normalize(candidate.textContent) === labelText
    );
    if (!label) {
      return null;
    }

    if (label.htmlFor) {
      const byId = document.getElementById(label.htmlFor);
      if (byId) {
        return byId;
      }
    }

    return label.querySelector("input, textarea, select")
      || label.parentElement?.querySelector("input, textarea, select")
      || null;
  }

  function setControlValue(control, value) {
    const prototype = control instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
    descriptor?.set?.call(control, value);
    control.dispatchEvent(new Event("input", { bubbles: true }));
    control.dispatchEvent(new Event("change", { bubbles: true }));
    control.dispatchEvent(new Event("blur", { bubbles: true }));
  }

  function tableHeaders(table) {
    return [...table.querySelectorAll("thead th")].map((cell) => normalize(cell.textContent));
  }

  function findAnimalTable() {
    return [...document.querySelectorAll("table")].find((table) => {
      const headers = tableHeaders(table).join(" | ");
      return headers.includes("Numer identyfikacyjny zwierzęcia")
        && headers.includes("Data urodzenia")
        && headers.includes("Płeć");
    }) ?? null;
  }

  function matchingHeaderIndex(headers, expected) {
    return headers.findIndex((header) => normalize(header).includes(expected));
  }

  function cellValue(cells, index) {
    return index >= 0 && cells[index] ? normalize(cells[index].textContent) : "";
  }

  function extractAnimalsFromTable() {
    const table = findAnimalTable();
    if (!table) {
      return [];
    }

    const headers = tableHeaders(table);
    const indexes = {
      id: matchingHeaderIndex(headers, "Numer identyfikacyjny zwierzęcia"),
      activity: matchingHeaderIndex(headers, "Numer działalności"),
      breed: matchingHeaderIndex(headers, "Rasa"),
      sex: matchingHeaderIndex(headers, "Płeć"),
      birthDate: matchingHeaderIndex(headers, "Data urodzenia"),
      status: matchingHeaderIndex(headers, "Status zwierzęcia")
    };

    return [...table.querySelectorAll("tbody tr")].flatMap((row) => {
      const cells = [...row.querySelectorAll("td")];
      const rowText = normalize(row.textContent);
      const id = cellValue(cells, indexes.id).match(/\bPL\d{12}\b/)?.[0]
        ?? rowText.match(/\bPL\d{12}\b/)?.[0];
      if (!id) {
        return [];
      }

      const activity = cellValue(cells, indexes.activity).match(ACTIVITY_PATTERN)?.[0]
        ?? rowText.match(ACTIVITY_PATTERN)?.[0]
        ?? "";

      return [{
        id,
        activity,
        breed: cellValue(cells, indexes.breed),
        sex: cellValue(cells, indexes.sex),
        birthDate: cellValue(cells, indexes.birthDate),
        status: cellValue(cells, indexes.status)
      }];
    });
  }

  function totalRecords() {
    const match = document.body.innerText.match(/\((\d+)\s+rekord(?:ów|y)?\)/i);
    return match ? Number(match[1]) : null;
  }

  function findPageSizeButton() {
    return [...document.querySelectorAll("button")].find((button) => {
      if (normalize(button.textContent) !== "50" || button.disabled) {
        return false;
      }
      const context = normalize(button.parentElement?.parentElement?.textContent);
      return context.includes("Wyświetl na stronie");
    }) ?? null;
  }

  function findNextPageButton() {
    const pagination = [...document.querySelectorAll(
      "irz-pagination, ngb-pagination, nav, [class*='pagination']"
    )].find((candidate) => {
      const text = normalize(candidate.textContent);
      return text.includes("Strona") && /rekord/i.test(text);
    });
    if (!pagination) {
      return null;
    }

    return [...pagination.querySelectorAll("button")].find((button) => {
      if (button.disabled) {
        return false;
      }
      const description = normalize([
        button.getAttribute("aria-label"),
        button.getAttribute("title"),
        button.className,
        button.innerHTML
      ].join(" ")).toLowerCase();
      return /następn|dalej|next|chevron-right|angle-right|arrow-right/.test(description);
    }) ?? null;
  }

  function firstAnimalId() {
    return extractAnimalsFromTable()[0]?.id ?? "";
  }

  async function waitForTableChange(previousFirstId, timeout = 8000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const currentId = firstAnimalId();
      if (currentId && currentId !== previousFirstId) {
        return true;
      }
    }
    return false;
  }

  async function collectAllAnimalPages() {
    const collected = new Map();
    const expectedTotal = totalRecords();
    let rows = extractAnimalsFromTable();

    if (expectedTotal && rows.length < expectedTotal) {
      const pageSizeButton = findPageSizeButton();
      if (pageSizeButton) {
        const previousId = firstAnimalId();
        pageSizeButton.click();
        await waitForTableChange(previousId, 5000);
      }
    }

    for (let page = 0; page < 200; page += 1) {
      rows = extractAnimalsFromTable();
      rows.forEach((animal) => collected.set(animal.id, animal));

      if (!expectedTotal || collected.size >= expectedTotal) {
        break;
      }

      const nextButton = findNextPageButton();
      if (!nextButton) {
        break;
      }

      const previousId = firstAnimalId();
      nextButton.click();
      const changed = await waitForTableChange(previousId);
      if (!changed) {
        break;
      }
    }

    return {
      animals: [...collected.values()],
      expectedTotal
    };
  }

  function romanValue(value) {
    const roman = normalize(value).toUpperCase();
    if (!/^(?:I|V|X|L|C)+$/.test(roman)) {
      return 0;
    }
    const values = { I: 1, V: 5, X: 10, L: 50, C: 100 };
    let total = 0;
    for (let index = 0; index < roman.length; index += 1) {
      const current = values[roman[index]];
      const next = values[roman[index + 1]] ?? 0;
      total += current < next ? -current : current;
    }
    return total;
  }

  function extractLatestDuplicate() {
    const table = [...document.querySelectorAll("table")].find(
      (candidate) => normalize(candidate.textContent).includes("Numer duplikatu")
    );
    if (!table) {
      return "-";
    }

    const candidates = [...table.querySelectorAll("td")]
      .map((cell) => normalize(cell.textContent))
      .filter((value) => romanValue(value) > 0)
      .sort((left, right) => romanValue(right) - romanValue(left));
    return candidates[0] ?? "-";
  }

  function valueAfterLabel(pageText, label) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = pageText.match(new RegExp(`${escaped}\\s+([^\\n]+)`, "i"));
    return normalize(match?.[1]);
  }

  function birthReportedByActivity(activityNumber) {
    const eventTable = [...document.querySelectorAll("table")].find((table) => {
      const headers = tableHeaders(table).join(" | ");
      return headers.includes("Typ zdarzenia") && headers.includes("Zgłaszająca działalność");
    });
    if (!eventTable) {
      return false;
    }

    const headers = tableHeaders(eventTable);
    const typeIndex = matchingHeaderIndex(headers, "Typ zdarzenia");
    const reporterIndex = matchingHeaderIndex(headers, "Zgłaszająca działalność");
    return [...eventTable.querySelectorAll("tbody tr")].some((row) => {
      const cells = [...row.querySelectorAll("td")];
      const type = cellValue(cells, typeIndex);
      const reporter = cellValue(cells, reporterIndex);
      return type.includes("Oznakowanie zwierzęcia urodzonego")
        && reporter.includes(activityNumber);
    });
  }

  function extractAnimalDetail(activityNumber) {
    const pageText = document.body.innerText;
    const arrivalDate = valueAfterLabel(pageText, "Data przybycia do działalności").match(/\d{2}-\d{2}-\d{4}/)?.[0] ?? "-";
    const birthDate = valueAfterLabel(pageText, "Data urodzenia").match(/\d{2}-\d{2}-\d{4}/)?.[0] ?? "-";
    const duplicateNumber = extractLatestDuplicate();
    const birthAtActivity = birthReportedByActivity(activityNumber);
    const origin = birthDate !== "-" && birthDate === arrivalDate && birthAtActivity ? "U" : "K";

    return {
      ready: arrivalDate !== "-" && pageText.includes("Środki identyfikacji"),
      data: { arrivalDate, duplicateNumber, origin }
    };
  }

  async function createControlList() {
    if (state.collecting) {
      return;
    }

    if (!validateActivity(elements.activity.value)) {
      const numbers = pageActivityNumbers();
      if (numbers.length > 0) {
        elements.activity.value = numbers[0];
      }
    }
    if (!await saveActivity()) {
      return;
    }

    const stateDate = normalize(elements.controlDate.value);
    if (!/^\d{2}-\d{2}-\d{4}$/.test(stateDate)) {
      showMessage("Wpisz datę kontroli w formacie DD-MM-RRRR.", true);
      elements.controlDate.focus();
      return;
    }

    state.collecting = true;
    elements.createList.disabled = true;
    showMessage("Zbieram zwierzęta z tabeli...");

    try {
      const { animals, expectedTotal } = await collectAllAnimalPages();
      if (animals.length === 0) {
        throw new Error("Nie znaleziono zwierząt w tabeli wyników.");
      }
      if (expectedTotal && animals.length < expectedTotal) {
        throw new Error(`Zebrano ${animals.length} z ${expectedTotal} zwierząt. Sprawdź paginację tabeli.`);
      }
      if (!globalThis.browser?.runtime?.sendMessage) {
        throw new Error("Generowanie listy jest dostępne po wczytaniu rozszerzenia w Firefoksie.");
      }

      const result = await browser.runtime.sendMessage({
        type: "irza-start-control-list",
        animals,
        activityNumber: state.activityNumber,
        stateDate
      });
      showMessage(`Przygotowano listę dla ${result.count} zwierząt.`);
    } catch (error) {
      showMessage(error?.message || "Nie udało się przygotować listy.", true);
    } finally {
      state.collecting = false;
      elements.createList.disabled = false;
    }
  }

  async function saveActivity() {
    const value = normalize(elements.activity.value);
    if (!validateActivity(value)) {
      showMessage("Wpisz numer w formacie NNNNNNNNN-NNN.", true);
      elements.activity.focus();
      return false;
    }

    state.activityNumber = value;
    elements.activity.value = value;
    await storage.set(STORAGE_KEY, value);
    showMessage("Numer działalności został zapisany.");
    return true;
  }

  async function detectActivity() {
    const numbers = pageActivityNumbers();
    if (numbers.length === 0) {
      showMessage("Na tej stronie nie znaleziono numeru działalności.", true);
      return;
    }

    const selected = numbers.includes(state.activityNumber) ? state.activityNumber : numbers[0];
    elements.activity.value = selected;
    state.activityNumber = selected;
    await storage.set(STORAGE_KEY, selected);
    showMessage(numbers.length === 1
      ? "Pobrano i zapisano numer działalności."
      : `Znaleziono ${numbers.length} numerów. Zapisano pierwszy z nich.`);
  }

  async function fillReport() {
    const activitySaved = await saveActivity();
    if (!activitySaved) {
      return;
    }

    const range = reportRange();
    const fields = new Map([
      ["Numer działalności", state.activityNumber],
      ["Data wpływu od", range.from],
      ["Data wpływu do", range.to],
      ["Data zdarzenia od", range.from],
      ["Data zdarzenia do", range.to]
    ]);

    const missing = [];
    for (const [label, value] of fields) {
      const control = findControl(label);
      if (!control) {
        missing.push(label);
        continue;
      }
      setControlValue(control, value);
    }

    if (missing.length > 0) {
      showMessage(`Nie znaleziono pól: ${missing.join(", ")}.`, true);
      return;
    }

    showMessage("Formularz uzupełniony. Wybierz gatunek i sprawdź dane.");
  }

  function updateContext() {
    elements.module.textContent = currentModule();
    elements.reportSection.hidden = !isReportForm();
    elements.listSection.hidden = !isAnimalList();
    const range = reportRange();
    elements.dateFrom.textContent = range.from;
    elements.dateTo.textContent = range.to;
  }

  elements.collapse.addEventListener("click", () => {
    elements.panel.hidden = true;
    elements.tab.hidden = false;
  });

  elements.tab.addEventListener("click", () => {
    elements.tab.hidden = true;
    elements.panel.hidden = false;
  });

  elements.save.addEventListener("click", saveActivity);
  elements.detect.addEventListener("click", detectActivity);
  elements.fillReport.addEventListener("click", fillReport);
  elements.createList.addEventListener("click", createControlList);
  elements.activity.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveActivity();
    }
  });

  let updateTimer = null;
  const observer = new MutationObserver(() => {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(updateContext, 250);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  if (globalThis.browser?.runtime?.onMessage) {
    browser.runtime.onMessage.addListener((message) => {
      if (message?.type === "irza-extract-animal-detail") {
        return Promise.resolve(extractAnimalDetail(message.activityNumber));
      }
      if (message?.type === "irza-control-list-progress") {
        showMessage(`Uzupełniam dane ${message.current} z ${message.total}: ${message.animalId}`);
      }
      return undefined;
    });
  }

  (async () => {
    state.activityNumber = normalize(await storage.get(STORAGE_KEY));
    elements.activity.value = state.activityNumber;
    elements.controlDate.value = formatDate(new Date());
    updateContext();
  })();

  if (["127.0.0.1", "localhost"].includes(location.hostname)) {
    globalThis.__irzaTest = {
      extractAnimalsFromTable,
      extractAnimalDetail
    };
  }
})();
