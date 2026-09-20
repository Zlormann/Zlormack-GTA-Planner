const businesses = [
  "Labo d’acide",
  "Agence",
  "Kosatka",
  "Bunker",
  "Boîte de nuit",
  "Club de motards",
  "Atelier auto",
  "Hangar"
];

const tasks = [
  "Vérifier les stocks",
  "Réapprovisionner les productions",
  "Récupérer les revenus passifs",
  "Faire une activité principale",
  "Vendre les stocks prêts",
  "Mettre à jour le solde GTA$"
];

let state = JSON.parse(
  localStorage.getItem("zlormack-gta-planner") ||
  JSON.stringify({
    player: "Zlormack",
    platform: "Xbox Series X|S",
    money: 0,
    goal: 2000000,
    businesses: [],
    tasks: [],
    nextPurchase: "",
    nextCost: 0,
    autoRefresh: true
  })
);

const $ = id => document.getElementById(id);

function money(value) {
  return Math.max(0, Number(value) || 0)
    .toLocaleString("fr-FR") + " GTA$";
}

function save() {
  localStorage.setItem(
    "zlormack-gta-planner",
    JSON.stringify(state)
  );
}

function updateDashboard() {
  $("moneyDisplay").textContent = money(state.money);
  $("goalDisplay").textContent = money(state.goal);

  const pct = Math.min(
    100,
    Math.round((state.money / Math.max(1, state.goal)) * 100)
  );

  $("percent").textContent = pct + " %";
  $("progressBar").style.width = pct + "%";

  $("remaining").textContent =
    state.money >= state.goal
      ? "Objectif atteint !"
      : "Reste " + money(state.goal - state.money);

  $("businessCount").textContent =
    state.businesses.length + " / " + businesses.length;

  updatePurchase();
}

function updatePurchase() {
  if (!state.nextPurchase || !state.nextCost) {
    $("purchaseStatus").textContent =
      "Ajoute ton prochain achat.";
    return;
  }

  if (state.money >= state.nextCost) {
    $("purchaseStatus").textContent =
      "✓ " + state.nextPurchase +
      " est finançable. Il restera " +
      money(state.money - state.nextCost) + ".";
  } else {
    $("purchaseStatus").textContent =
      "Il manque " +
      money(state.nextCost - state.money) +
      " pour " + state.nextPurchase + ".";
  }
}

function renderBusinesses() {
  const box = $("businessList");
  box.innerHTML = "";

  businesses.forEach(name => {
    const label = document.createElement("label");
    label.className = "business-item";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = state.businesses.includes(name);

    input.addEventListener("change", () => {
      if (input.checked) {
        if (!state.businesses.includes(name))
          state.businesses.push(name);
      } else {
        state.businesses =
          state.businesses.filter(x => x !== name);
      }

      save();
      updateDashboard();
    });

    label.append(input, document.createTextNode(name));
    box.appendChild(label);
  });
}

function renderTasks() {
  const box = $("taskList");
  box.innerHTML = "";

  tasks.forEach(name => {
    const label = document.createElement("label");
    label.className = "task-item";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = state.tasks.includes(name);

    input.addEventListener("change", () => {
      if (input.checked) {
        if (!state.tasks.includes(name))
          state.tasks.push(name);
      } else {
        state.tasks = state.tasks.filter(x => x !== name);
      }

      save();
    });

    label.append(input, document.createTextNode(name));
    box.appendChild(label);
  });
}

document.querySelectorAll(".nav").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".nav")
      .forEach(x => x.classList.remove("active"));

    document.querySelectorAll(".page")
      .forEach(x => x.classList.remove("active"));

    button.classList.add("active");
    $(button.dataset.page).classList.add("active");
  });
});

$("money").value = state.money;
$("goal").value = state.goal;
$("nextPurchase").value = state.nextPurchase;
$("nextCost").value = state.nextCost;
$("playerName").value = state.player;
$("platform").value = state.platform;
$("autoRefresh").checked = state.autoRefresh;

$("money").addEventListener("input", e => {
  state.money = Math.max(0, Number(e.target.value) || 0);
  save();
  updateDashboard();
});

$("goal").addEventListener("input", e => {
  state.goal = Math.max(1, Number(e.target.value) || 1);
  save();
  updateDashboard();
});

$("nextPurchase").addEventListener("input", e => {
  state.nextPurchase = e.target.value;
  save();
  updatePurchase();
});

$("nextCost").addEventListener("input", e => {
  state.nextCost = Math.max(0, Number(e.target.value) || 0);
  save();
  updatePurchase();
});

$("playerName").addEventListener("input", e => {
  state.player = e.target.value;
  save();
});

$("platform").addEventListener("change", e => {
  state.platform = e.target.value;
  save();
});

$("autoRefresh").addEventListener("change", e => {
  state.autoRefresh = e.target.checked;
  save();
});

$("resetTasks").addEventListener("click", () => {
  state.tasks = [];
  save();
  renderTasks();
});

$("resetData").addEventListener("click", () => {
  if (confirm("Réinitialiser toutes les données du Planner ?")) {
    localStorage.removeItem("zlormack-gta-planner");
    location.reload();
  }
});

function rockstarPrototype() {
  $("syncStatus").textContent =
    "Connecteur Rockstar à installer";

  $("lastUpdate").textContent =
    "La récupération automatique sera ajoutée à l’étape suivante.";
}

$("refreshRockstar").addEventListener(
  "click",
  rockstarPrototype
);

$("refreshRockstar2").addEventListener(
  "click",
  rockstarPrototype
);

renderBusinesses();
renderTasks();
updateDashboard();
