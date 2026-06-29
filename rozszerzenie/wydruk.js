"use strict";

const PRINT_DATA_KEY = "irzaLastControlList";
const BREED_CODES = new Map([
  ["polska holsztyńsko-fryzyjska odmiana czarno-biała", "HO"],
  ["simentaler", "SM"],
  ["mieszaniec", "MS"],
  ["mieszańce", "MS"]
]);

function normalize(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parsePolishDate(value) {
  const match = normalize(value).match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) {
    return null;
  }
  return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
}

function ageAt(birthDateText, stateDateText) {
  const birthDate = parsePolishDate(birthDateText);
  const stateDate = parsePolishDate(stateDateText);
  if (!birthDate || !stateDate || birthDate > stateDate) {
    return "-";
  }

  let years = stateDate.getFullYear() - birthDate.getFullYear();
  let months = stateDate.getMonth() - birthDate.getMonth();
  if (stateDate.getDate() < birthDate.getDate()) {
    months -= 1;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return `${years}l ${months}m`;
}

function displayDate(value) {
  const normalized = normalize(value);
  return /^\d{2}-\d{2}-\d{4}$/.test(normalized)
    ? normalized.replaceAll("-", ".")
    : normalized || "-";
}

function breedCode(value) {
  const raw = normalize(value);
  const normalized = raw.toLocaleLowerCase("pl");
  if (BREED_CODES.has(normalized)) {
    return BREED_CODES.get(normalized);
  }
  return /^[A-Z]{2,3}$/.test(raw) ? raw : "?";
}

function lastDigits(id) {
  return normalize(id).slice(-3);
}

function isFemale(sex) {
  return normalize(sex).toLocaleLowerCase("pl").startsWith("samic");
}

function isMale(sex) {
  return normalize(sex).toLocaleLowerCase("pl").startsWith("samiec");
}

function render(data) {
  const animals = [...(data.animals ?? [])].sort((left, right) => {
    return Number(lastDigits(left.id)) - Number(lastDigits(right.id))
      || normalize(left.id).localeCompare(normalize(right.id), "pl");
  });

  document.querySelector("#activity").textContent = data.activityNumber || "-";
  document.querySelector("#state-date").textContent = data.stateDate || "-";

  document.querySelector("#animals").innerHTML = animals.map((animal, index) => `
    <tr>
      <td class="center">${index + 1}</td>
      <td>${escapeHtml(animal.id)}</td>
      <td></td>
      <td class="last-digits">${escapeHtml(lastDigits(animal.id))}</td>
      <td class="center">${escapeHtml(animal.duplicateNumber || "-")}</td>
      <td class="${isMale(animal.sex) ? "male" : ""}">${escapeHtml(animal.sex || "-")}</td>
      <td class="center">${escapeHtml(breedCode(animal.breed))}</td>
      <td>${escapeHtml(displayDate(animal.birthDate))}</td>
      <td>${escapeHtml(displayDate(animal.arrivalDate))}</td>
      <td class="center">${escapeHtml(animal.origin || "?")}</td>
      <td>${escapeHtml(ageAt(animal.birthDate, data.stateDate))}</td>
    </tr>
  `).join("");

  const femaleCount = animals.filter((animal) => isFemale(animal.sex)).length;
  const maleCount = animals.filter((animal) => isMale(animal.sex)).length;
  const bornCount = animals.filter((animal) => animal.origin === "U").length;
  const boughtCount = animals.filter((animal) => animal.origin === "K").length;

  document.querySelector("#summary").innerHTML = `
    <tr>
      <td colspan="5">Razem:</td>
      <td class="sex-summary">${maleCount}&#9794; / ${femaleCount}&#9792;</td>
      <td colspan="3"></td>
      <td>${bornCount}u / ${boughtCount}k</td>
      <td>${animals.length} szt.</td>
    </tr>
  `;

  const incomplete = animals.filter((animal) => {
    return !animal.arrivalDate
      || animal.arrivalDate === "-"
      || animal.origin === "?"
      || breedCode(animal.breed) === "?";
  });
  if (incomplete.length > 0) {
    const warning = document.querySelector("#warning");
    warning.hidden = false;
    warning.textContent = `Nie udało się uzupełnić wszystkich danych dla ${incomplete.length} zwierząt.`;
  }
}

document.querySelector("#print").addEventListener("click", () => window.print());
document.querySelector("#close").addEventListener("click", () => window.close());

async function loadPrintData() {
  if (globalThis.browser?.storage?.local) {
    const result = await browser.storage.local.get(PRINT_DATA_KEY);
    return result[PRINT_DATA_KEY];
  }
  return globalThis.__irzaPrintData;
}

loadPrintData().then((data) => {
  if (!data) {
    document.querySelector("main").innerHTML = "<h1>Brak danych listy kontrolnej</h1>";
    return;
  }
  render(data);
});
