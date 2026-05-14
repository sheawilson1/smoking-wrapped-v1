const controls = {
  night: document.querySelector("#night-cigarettes"),
  nightsMonth: document.querySelector("#nights-month"),
  borrowedPercent: document.querySelector("#borrowed-percent"),
  weekday: document.querySelector("#weekday-cigarettes"),
};

const labels = {
  night: document.querySelector("#night-cigarettes-value"),
  nightsMonth: document.querySelector("#nights-month-value"),
  borrowedPercent: document.querySelector("#borrowed-percent-value"),
  weekday: document.querySelector("#weekday-cigarettes-value"),
};

const output = {
  yearlyTotal: document.querySelector("#yearly-total"),
  heroBorrowedTotal: document.querySelector("#hero-borrowed-total"),
  borrowedTotal: document.querySelector("#borrowed-total"),
  packTotal: document.querySelector("#pack-total"),
  moneyTotal: document.querySelector("#money-total"),
  minutesTotal: document.querySelector("#minutes-total"),
  identityLine: document.querySelector("#identity-line"),
  borrowedLine: document.querySelector("#borrowed-line"),
  shareLine: document.querySelector("#share-line"),
  packStack: document.querySelector("#pack-stack"),
};

const cigarettePrice = 0.735;
const minutesPerCigarette = 5;

const profiles = [
  { night: 3, nightsMonth: 4, borrowedPercent: 85, weekday: 1, identity: "No" },
  { night: 7, nightsMonth: 7, borrowedPercent: 60, weekday: 4, identity: "Sometimes" },
  { night: 2, nightsMonth: 10, borrowedPercent: 95, weekday: 0, identity: "No" },
  { night: 10, nightsMonth: 5, borrowedPercent: 45, weekday: 6, identity: "Yes" },
];

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

function selectedIdentity() {
  return document.querySelector('input[name="identity"]:checked').value;
}

function setIdentity(value) {
  const input = document.querySelector(`input[name="identity"][value="${value}"]`);
  if (input) input.checked = true;
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

function getIdentityLine(identity, yearlyTotal) {
  if (yearlyTotal === 0) return "This year is clean. Keep it that way.";
  if (identity === "Yes") return "At least your label and your lungs agree.";
  if (identity === "Sometimes") return "Depends who's asking. The number already answered.";
  if (yearlyTotal < 120) return "You said no. The occasional ones still added up.";
  return "You said no. Your year says otherwise.";
}

function getBorrowedLine(borrowedTotal) {
  if (borrowedTotal === 0) return "No borrowed cigarettes. The count still counts.";
  if (borrowedTotal < 100) return "A few favours became a yearly total.";
  if (borrowedTotal < 300) return "That is a lot of other people's packs.";
  return "Your lungs do not know who bought the pack.";
}

function getShareLine(total, borrowed) {
  if (total === 0) return "Next year, keep the total at zero.";
  if (borrowed / total > 0.65) return "You do not have to buy a pack to be a smoker.";
  if (total > 700) return "Only on nights out can still become a habit.";
  return "The habit you do not count, counted.";
}

function update() {
  const night = Number(controls.night.value);
  const nightsMonth = Number(controls.nightsMonth.value);
  const borrowedPercent = Number(controls.borrowedPercent.value);
  const weekday = Number(controls.weekday.value);

  labels.night.textContent = night;
  labels.nightsMonth.textContent = nightsMonth;
  labels.borrowedPercent.textContent = `${borrowedPercent}%`;
  labels.weekday.textContent = weekday;

  const yearlyFromNights = night * nightsMonth * 12;
  const yearlyFromWeekdays = weekday * 52;
  const yearlyTotal = yearlyFromNights + yearlyFromWeekdays;
  const borrowedTotal = yearlyTotal * (borrowedPercent / 100);
  const packTotal = yearlyTotal / 20;
  const moneyTotal = yearlyTotal * cigarettePrice;
  const hoursTotal = (yearlyTotal * minutesPerCigarette) / 60;
  const identity = selectedIdentity();

  output.yearlyTotal.textContent = numberFormat(yearlyTotal);
  output.heroBorrowedTotal.textContent = numberFormat(borrowedTotal);
  output.borrowedTotal.textContent = numberFormat(borrowedTotal);
  output.packTotal.textContent = numberFormat(packTotal);
  output.moneyTotal.textContent = moneyFormat(moneyTotal);
  output.minutesTotal.textContent = numberFormat(hoursTotal);
  output.identityLine.textContent = getIdentityLine(identity, yearlyTotal);
  output.borrowedLine.textContent = getBorrowedLine(borrowedTotal);
  output.shareLine.textContent = getShareLine(yearlyTotal, borrowedTotal);
  renderPackStack(packTotal);
}

Object.values(controls).forEach((control) => {
  control.addEventListener("input", update);
});

document.querySelectorAll('input[name="identity"]').forEach((input) => {
  input.addEventListener("change", update);
});

document.querySelector("#randomise").addEventListener("click", () => {
  const profile = profiles[Math.floor(Math.random() * profiles.length)];
  controls.night.value = profile.night;
  controls.nightsMonth.value = profile.nightsMonth;
  controls.borrowedPercent.value = profile.borrowedPercent;
  controls.weekday.value = profile.weekday;
  setIdentity(profile.identity);
  update();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

update();
