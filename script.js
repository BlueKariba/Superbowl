const kickoffISO = "2026-02-08T18:30:00-05:00"; // Beispiel: Passe den ISO-String an

const countdownEl = document.getElementById("countdown");
const themeToggle = document.getElementById("themeToggle");
const checklistEl = document.getElementById("checklist");
const saveChecklistBtn = document.getElementById("saveChecklist");
const saveStatus = document.getElementById("saveStatus");
const scoreAEl = document.getElementById("scoreA");
const scoreBEl = document.getElementById("scoreB");
const resetScoresBtn = document.getElementById("resetScores");

let scoreA = 0;
let scoreB = 0;

const themeKey = "biggame-theme";
const checklistKey = "biggame-checklist";

function setTheme(theme) {
  document.documentElement.classList.toggle("light", theme === "light");
  localStorage.setItem(themeKey, theme);
}

function initTheme() {
  const stored = localStorage.getItem(themeKey);
  if (stored) {
    setTheme(stored);
    return;
  }
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(prefersLight ? "light" : "dark");
}

function toggleTheme() {
  const isLight = document.documentElement.classList.contains("light");
  setTheme(isLight ? "dark" : "light");
}

function formatCountdown(diffMs) {
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days} Tage ${hours} Std ${minutes} Min ${seconds} Sek`;
}

function updateCountdown() {
  const kickoff = new Date(kickoffISO);
  const now = new Date();
  const diff = kickoff.getTime() - now.getTime();
  if (diff <= 0) {
    countdownEl.textContent = "🏈 Es geht los!";
    return;
  }
  countdownEl.textContent = formatCountdown(diff);
}

function loadChecklist() {
  const stored = localStorage.getItem(checklistKey);
  if (!stored) return;
  try {
    const values = JSON.parse(stored);
    const inputs = checklistEl.querySelectorAll("input[type='checkbox']");
    inputs.forEach((input, index) => {
      input.checked = Boolean(values[index]);
    });
  } catch {
    // Ignoriert fehlerhafte Daten
  }
}

function saveChecklist() {
  const inputs = checklistEl.querySelectorAll("input[type='checkbox']");
  const values = Array.from(inputs).map((input) => input.checked);
  localStorage.setItem(checklistKey, JSON.stringify(values));
  saveStatus.textContent = "Gespeichert!";
  setTimeout(() => {
    saveStatus.textContent = "";
  }, 2000);
}

function updateScores() {
  scoreAEl.textContent = scoreA.toString();
  scoreBEl.textContent = scoreB.toString();
}

function changeScore(team, delta) {
  if (team === "A") {
    scoreA = Math.max(0, scoreA + delta);
  } else {
    scoreB = Math.max(0, scoreB + delta);
  }
  updateScores();
}

function initScoreboard() {
  document.querySelectorAll("[data-team]").forEach((button) => {
    button.addEventListener("click", () => {
      const team = button.getAttribute("data-team");
      const delta = Number(button.getAttribute("data-delta"));
      changeScore(team, delta);
    });
  });

  resetScoresBtn.addEventListener("click", () => {
    scoreA = 0;
    scoreB = 0;
    updateScores();
  });

  updateScores();
}

initTheme();
updateCountdown();
setInterval(updateCountdown, 1000);
loadChecklist();
initScoreboard();

themeToggle.addEventListener("click", toggleTheme);
saveChecklistBtn.addEventListener("click", saveChecklist);
