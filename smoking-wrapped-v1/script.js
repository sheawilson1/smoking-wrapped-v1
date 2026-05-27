const controls = {
  daysWeek: document.querySelector("#days-week"),
  typicalDay: document.querySelector("#typical-day-cigarettes"),
  night: document.querySelector("#night-cigarettes"),
  nightsMonth: document.querySelector("#nights-month"),
  years: document.querySelector("#years-smoking"),
};

const labels = {
  daysWeek: document.querySelector("#days-week-value"),
  typicalDay: document.querySelector("#typical-day-cigarettes-value"),
  night: document.querySelector("#night-cigarettes-value"),
  nightsMonth: document.querySelector("#nights-month-value"),
  years: document.querySelector("#years-smoking-value"),
};

const output = {
  yearlyTotal: document.querySelector("#yearly-total"),
  packTotal: document.querySelector("#pack-total"),
  moneyTotal: document.querySelector("#money-total"),
  hoursTotal: document.querySelector("#hours-total"),
  lifetimeTotal: document.querySelector("#lifetime-total"),
  shareLine: document.querySelector("#share-line"),
  closerCopy: document.querySelector("#closer-copy"),
  packStack: document.querySelector("#pack-stack"),
};

const screens = {
  opening: document.querySelector("#opening-screen"),
  calculator: document.querySelector("#calculator-screen"),
};

const copy = {
  social: {
    label: "Social smoker",
    word: "social smoking",
    years: "Years you’ve been a social smoker",
    share: "Social smoking. It all adds up.",
    closer: "Every time you smoke on a night out, you’re impacting your fitness and aging your skin.",
    defaults: { daysWeek: 0, typicalDay: 0, night: 4, nightsMonth: 6, years: 3 },
  },
  light: {
    label: "Light smoker",
    word: "light smoking",
    years: "Years you’ve been a light smoker",
    share: "Light smoking. It all adds up.",
    closer: "Every time you smoke, you’re damaging your health, impacting your fitness and aging your skin.",
    defaults: { daysWeek: 3, typicalDay: 3, night: 4, nightsMonth: 4, years: 3 },
  },
};

const cigarettePrice = 0.735;
const cigarettesPerPack = 20;
const minutesPerCigarette = 6;
let activeAudience = null;

function numberFormat(value) {
  return new Intl.NumberFormat("en-GB").format(Math.round(value));
}

function moneyFormat(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

function setStatText(element, text) {
  element.textContent = text;
  const digitCount = text.replace(/\D/g, "").length;
  element.dataset.digits = String(digitCount);
}

function renderPackStack(packCount) {
  output.packStack.innerHTML = "";
  const visiblePacks = Math.min(Math.max(Math.round(packCount), 1), 25);

  for (let i = 0; i < visiblePacks; i += 1) {
    const pack = document.createElement("span");
    pack.className = "pack";
    output.packStack.appendChild(pack);
  }
}

function setAudience(audience) {
  activeAudience = audience;
  const audienceCopy = copy[audience];

  document.querySelector("#audience-label").textContent = audienceCopy.label;
  document.querySelector("#audience-word").textContent = audienceCopy.word;
  document.querySelector("#years-label").textContent = audienceCopy.years;
  output.shareLine.textContent = audienceCopy.share;
  output.closerCopy.textContent = audienceCopy.closer;

  Object.entries(audienceCopy.defaults).forEach(([key, value]) => {
    controls[key].value = value;
  });

  document.querySelectorAll(".audience-card").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.audience === audience);
  });

  document.querySelector("#start-calculator").disabled = false;

  document.querySelectorAll("[data-control]").forEach((block) => {
    const isLightOnly = ["daysWeek", "typicalDay"].includes(block.dataset.control);
    block.classList.toggle("is-hidden", audience === "social" && isLightOnly);
  });

  update();
}

function showCalculator() {
  if (!activeAudience) return;
  screens.opening.classList.add("is-hidden");
  screens.calculator.classList.remove("is-hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showOpening() {
  screens.calculator.classList.add("is-hidden");
  screens.opening.classList.remove("is-hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function update() {
  const daysWeek = Number(controls.daysWeek.value);
  const typicalDay = Number(controls.typicalDay.value);
  const night = Number(controls.night.value);
  const nightsMonth = Number(controls.nightsMonth.value);
  const years = Number(controls.years.value);

  labels.daysWeek.textContent = daysWeek;
  labels.typicalDay.textContent = typicalDay;
  labels.night.textContent = night;
  labels.nightsMonth.textContent = nightsMonth;
  labels.years.textContent = years;

  const yearlyFromNights = night * nightsMonth * 12;
  const yearlyFromDays = activeAudience === "light" ? daysWeek * typicalDay * 52 : 0;
  const yearlyTotal = yearlyFromNights + yearlyFromDays;
  const packTotal = yearlyTotal / cigarettesPerPack;
  const moneyTotal = yearlyTotal * cigarettePrice;
  const hoursTotal = (yearlyTotal * minutesPerCigarette) / 60;
  const lifetimeTotal = yearlyTotal * years;

  setStatText(output.yearlyTotal, numberFormat(yearlyTotal));
  output.packTotal.textContent = numberFormat(packTotal);
  setStatText(output.moneyTotal, moneyFormat(moneyTotal));
  setStatText(output.hoursTotal, numberFormat(hoursTotal));
  setStatText(output.lifetimeTotal, numberFormat(lifetimeTotal));
  renderPackStack(packTotal);
}

Object.values(controls).forEach((control) => {
  control.addEventListener("input", update);
});

document.querySelectorAll(".audience-card").forEach((button) => {
  button.addEventListener("click", () => setAudience(button.dataset.audience));
});

document.querySelector("#start-calculator").addEventListener("click", showCalculator);
document.querySelector("#change-audience").addEventListener("click", showOpening);

setAudience("social");
showOpening();
document.querySelectorAll(".audience-card").forEach((button) => button.classList.remove("is-selected"));
document.querySelector("#start-calculator").disabled = true;
activeAudience = null;
