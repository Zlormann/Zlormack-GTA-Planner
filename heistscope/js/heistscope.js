const themeButton =
  document.getElementById("themeButton");

const THEME_KEY =
  "heistscope-theme";

function getAutomaticTheme() {
  const hour = new Date().getHours();

  return hour >= 7 && hour < 20
    ? "light"
    : "dark";
}

function getSavedTheme() {
  return (
    localStorage.getItem(THEME_KEY) ||
    "auto"
  );
}

function getEffectiveTheme(mode) {
  return mode === "auto"
    ? getAutomaticTheme()
    : mode;
}

function applyTheme(mode) {
  const effective =
    getEffectiveTheme(mode);

  document.documentElement.dataset.theme =
    effective;

  localStorage.setItem(
    THEME_KEY,
    mode
  );

  if (themeButton) {
    themeButton.textContent =
      mode === "light"
        ? "☀"
        : mode === "dark"
          ? "☾"
          : "◐";

    themeButton.title =
      mode === "light"
        ? "Thème clair"
        : mode === "dark"
          ? "Thème sombre"
          : "Thème automatique";
  }

  document
    .querySelectorAll(".theme-option")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.themeMode === mode
      );
    });
}

function createThemeMenu() {
  if (!themeButton) {
    return;
  }

  const wrapper =
    document.createElement("div");

  wrapper.className = "theme-wrapper";

  themeButton.parentNode.insertBefore(
    wrapper,
    themeButton
  );

  wrapper.appendChild(themeButton);

  const menu =
    document.createElement("div");

  menu.className = "theme-menu";

  menu.innerHTML = `
    <div class="theme-menu-title">
      Apparence
    </div>

    <button
      class="theme-option"
      data-theme-mode="light"
    >
      <span>☀</span>
      Clair
    </button>

    <button
      class="theme-option"
      data-theme-mode="auto"
    >
      <span>◐</span>
      Automatique
    </button>

    <button
      class="theme-option"
      data-theme-mode="dark"
    >
      <span>☾</span>
      Sombre
    </button>
  `;

  wrapper.appendChild(menu);

  themeButton.addEventListener(
    "click",
    event => {
      event.stopPropagation();
      menu.classList.toggle("open");
    }
  );

  menu.addEventListener(
    "click",
    event => {
      const option =
        event.target.closest(
          ".theme-option"
        );

      if (!option) {
        return;
      }

      applyTheme(
        option.dataset.themeMode
      );

      menu.classList.remove("open");
    }
  );

  document.addEventListener(
    "click",
    event => {
      if (!wrapper.contains(event.target)) {
        menu.classList.remove("open");
      }
    }
  );
}

createThemeMenu();
applyTheme(getSavedTheme());

/*
  En mode automatique, on vérifie périodiquement
  si le passage jour/nuit doit être appliqué.
*/
setInterval(() => {
  if (getSavedTheme() === "auto") {
    applyTheme("auto");
  }
}, 60 * 1000);


/* =========================================
   PLATEFORME
   ========================================= */

const PLATFORM_KEY =
  "heistscope-platform";

const platforms = {
  ps5: {
    label: "PlayStation 5",
    shortLabel: "PS5",
    icon: "🎮",
    generation: "current"
  },

  xboxSeries: {
    label: "Xbox Series X|S",
    shortLabel: "Xbox Series X|S",
    icon: "🎮",
    generation: "current"
  },

  pcEnhanced: {
    label: "PC Enhanced",
    shortLabel: "PC Enhanced",
    icon: "🖥",
    generation: "current"
  },

  ps4: {
    label: "PlayStation 4",
    shortLabel: "PS4",
    icon: "🎮",
    generation: "previous"
  },

  xboxOne: {
    label: "Xbox One",
    shortLabel: "Xbox One",
    icon: "🎮",
    generation: "previous"
  },

  pcLegacy: {
    label: "PC Legacy",
    shortLabel: "PC Legacy",
    icon: "🖥",
    generation: "previous"
  }
};

const platformButton =
  document.getElementById(
    "platformButton"
  );

const platformValue =
  document.getElementById(
    "platformValue"
  );

function getSavedPlatform() {
  const saved =
    localStorage.getItem(
      PLATFORM_KEY
    );

  return platforms[saved]
    ? saved
    : "xboxSeries";
}

function applyPlatform(platformId) {
  const platform =
    platforms[platformId];

  if (!platform) {
    return;
  }

  localStorage.setItem(
    PLATFORM_KEY,
    platformId
  );

  if (platformButton) {
    platformButton.innerHTML = `
      <span>
        ${platform.icon}
        ${platform.shortLabel}
      </span>

      <span>⌄</span>
    `;
  }

  if (platformValue) {
    platformValue.textContent =
      platform.label;
  }

  document
    .querySelectorAll(
      ".platform-option"
    )
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.platform ===
          platformId
      );
    });

  document.documentElement.dataset.platform =
    platformId;

  window.dispatchEvent(
    new CustomEvent(
      "heistscope:platformchange",
      {
        detail: {
          id: platformId,
          ...platform
        }
      }
    )
  );
}

function createPlatformMenu() {
  if (!platformButton) {
    return;
  }

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "platform-wrapper";

  platformButton.parentNode.insertBefore(
    wrapper,
    platformButton
  );

  wrapper.appendChild(
    platformButton
  );

  const menu =
    document.createElement("div");

  menu.className =
    "platform-menu";

  menu.innerHTML = `
    <div class="platform-menu-title">
      Votre plateforme
    </div>

    <div class="platform-group-title">
      Génération actuelle
    </div>

    ${createPlatformOption(
      "ps5"
    )}

    ${createPlatformOption(
      "xboxSeries"
    )}

    ${createPlatformOption(
      "pcEnhanced"
    )}

    <div class="platform-separator"></div>

    <div class="platform-group-title">
      Versions précédentes
    </div>

    ${createPlatformOption(
      "ps4"
    )}

    ${createPlatformOption(
      "xboxOne"
    )}

    ${createPlatformOption(
      "pcLegacy"
    )}
  `;

  wrapper.appendChild(menu);

  platformButton.addEventListener(
    "click",
    event => {
      event.stopPropagation();

      menu.classList.toggle(
        "open"
      );
    }
  );

  menu.addEventListener(
    "click",
    event => {
      const option =
        event.target.closest(
          ".platform-option"
        );

      if (!option) {
        return;
      }

      applyPlatform(
        option.dataset.platform
      );

      menu.classList.remove(
        "open"
      );
    }
  );

  document.addEventListener(
    "click",
    event => {
      if (
        !wrapper.contains(
          event.target
        )
      ) {
        menu.classList.remove(
          "open"
        );
      }
    }
  );
}

function createPlatformOption(
  platformId
) {
  const platform =
    platforms[platformId];

  return `
    <button
      class="platform-option"
      data-platform="${platformId}"
    >
      <span class="platform-option-name">
        <span>${platform.icon}</span>
        <span>${platform.label}</span>
      </span>

      <span class="platform-check">
        ✓
      </span>
    </button>
  `;
}

createPlatformMenu();
applyPlatform(
  getSavedPlatform()
);


/* =========================================
   PROGRESSION DU JOUEUR
   ========================================= */

const PLAYER_DATA_KEY =
  "heistscope-player-data";

const moneyValue =
  document.getElementById("moneyValue");

const goalValue =
  document.getElementById("goalValue");

const progressValue =
  document.getElementById("progressValue");

const progressBar =
  document.getElementById("progressBar");

function getPlayerData() {
  const defaultData = {
    money: 0,
    goal: 2000000
  };

  try {
    const saved =
      JSON.parse(
        localStorage.getItem(
          PLAYER_DATA_KEY
        )
      );

    if (!saved) {
      return defaultData;
    }

    return {
      money:
        Number.isFinite(Number(saved.money))
          ? Math.max(
              0,
              Number(saved.money)
            )
          : defaultData.money,

      goal:
        Number.isFinite(Number(saved.goal))
          ? Math.max(
              0,
              Number(saved.goal)
            )
          : defaultData.goal
    };
  } catch {
    return defaultData;
  }
}

let playerData =
  getPlayerData();

function savePlayerData() {
  localStorage.setItem(
    PLAYER_DATA_KEY,
    JSON.stringify(playerData)
  );
}

function formatGTA(value) {
  return (
    "GTA$ " +
    Math.round(value).toLocaleString(
      "fr-FR"
    )
  );
}

function calculateProgress() {
  if (playerData.goal <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      (
        playerData.money /
        playerData.goal
      ) * 100
    )
  );
}

function renderPlayerProgress() {
  const progress =
    calculateProgress();

  if (moneyValue) {
    moneyValue.textContent =
      formatGTA(playerData.money);
  }

  if (goalValue) {
    goalValue.textContent =
      formatGTA(playerData.goal);
  }

  if (progressValue) {
    progressValue.textContent =
      `${Math.round(progress)} %`;
  }

  if (progressBar) {
    progressBar.style.width =
      `${progress}%`;
  }
}

function createPlayerDialog() {
  const backdrop =
    document.createElement("div");

  backdrop.className =
    "player-dialog-backdrop";

  backdrop.innerHTML = `
    <div
      class="player-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="playerDialogTitle"
    >
      <h3 id="playerDialogTitle">
        Modifier
      </h3>

      <p
        id="playerDialogDescription"
        class="player-dialog-description"
      ></p>

      <form id="playerDialogForm">

        <label
          for="playerDialogInput"
          id="playerDialogLabel"
        >
          Montant
        </label>

        <input
          id="playerDialogInput"
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          required
        >

        <div class="player-dialog-actions">

          <button
            type="button"
            class="dialog-button"
            id="playerDialogCancel"
          >
            Annuler
          </button>

          <button
            type="submit"
            class="dialog-button primary"
          >
            Enregistrer
          </button>

        </div>

      </form>
    </div>
  `;

  document.body.appendChild(backdrop);

  return backdrop;
}

const playerDialog =
  createPlayerDialog();

const playerDialogTitle =
  playerDialog.querySelector(
    "#playerDialogTitle"
  );

const playerDialogDescription =
  playerDialog.querySelector(
    "#playerDialogDescription"
  );

const playerDialogLabel =
  playerDialog.querySelector(
    "#playerDialogLabel"
  );

const playerDialogInput =
  playerDialog.querySelector(
    "#playerDialogInput"
  );

const playerDialogForm =
  playerDialog.querySelector(
    "#playerDialogForm"
  );

const playerDialogCancel =
  playerDialog.querySelector(
    "#playerDialogCancel"
  );

let editingField = null;

function openPlayerDialog(field) {
  editingField = field;

  if (field === "money") {
    playerDialogTitle.textContent =
      "Modifier votre solde";

    playerDialogDescription.textContent =
      "Indiquez votre solde GTA$ actuel.";

    playerDialogLabel.textContent =
      "Solde GTA$";

    playerDialogInput.value =
      playerData.money;
  }

  if (field === "goal") {
    playerDialogTitle.textContent =
      "Modifier votre objectif";

    playerDialogDescription.textContent =
      "Indiquez le montant GTA$ que vous souhaitez atteindre.";

    playerDialogLabel.textContent =
      "Objectif GTA$";

    playerDialogInput.value =
      playerData.goal;
  }

  playerDialog.classList.add("open");

  requestAnimationFrame(() => {
    playerDialogInput.focus();
    playerDialogInput.select();
  });
}

function closePlayerDialog() {
  playerDialog.classList.remove("open");
  editingField = null;
}

function makeStatEditable(
  element,
  field
) {
  if (!element) {
    return;
  }

  const card =
    element.closest(".stat-card");

  if (!card) {
    return;
  }

  card.classList.add("editable");
  card.tabIndex = 0;

  const hint =
    document.createElement("span");

  hint.className =
    "stat-edit-hint";

  hint.textContent =
    "Cliquer pour modifier";

  card.appendChild(hint);

  card.addEventListener(
    "click",
    () => openPlayerDialog(field)
  );

  card.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        openPlayerDialog(field);
      }
    }
  );
}

playerDialogForm.addEventListener(
  "submit",
  event => {
    event.preventDefault();

    const value =
      Number(playerDialogInput.value);

    if (
      !Number.isFinite(value) ||
      value < 0
    ) {
      return;
    }

    if (editingField === "money") {
      playerData.money =
        Math.round(value);
    }

    if (editingField === "goal") {
      playerData.goal =
        Math.round(value);
    }

    savePlayerData();
    renderPlayerProgress();
    closePlayerDialog();
  }
);

playerDialogCancel.addEventListener(
  "click",
  closePlayerDialog
);

playerDialog.addEventListener(
  "click",
  event => {
    if (event.target === playerDialog) {
      closePlayerDialog();
    }
  }
);

document.addEventListener(
  "keydown",
  event => {
    if (
      event.key === "Escape" &&
      playerDialog.classList.contains(
        "open"
      )
    ) {
      closePlayerDialog();
    }
  }
);

makeStatEditable(
  moneyValue,
  "money"
);

makeStatEditable(
  goalValue,
  "goal"
);

renderPlayerProgress();


/* =========================================
   HEISTSCOPE GAIN CALCULATOR
   ========================================= */

function createGainCalculator() {
  const progressionSection =
    moneyValue?.closest(
      ".dashboard-section"
    );

  if (!progressionSection) {
    return;
  }

  const section =
    document.createElement("section");

  section.className =
    "gain-calculator";

  section.innerHTML = `
    <h2>CALCULATEUR DE GAINS</h2>

    <div class="gain-calculator-grid">

      <div class="gain-field">
        <label for="gainStart">
          GTA$ AVANT
        </label>

        <input
          id="gainStart"
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          placeholder="500000"
        >
      </div>

      <div class="gain-field">
        <label for="gainEnd">
          GTA$ APRÈS
        </label>

        <input
          id="gainEnd"
          type="number"
          min="0"
          step="1"
          inputmode="numeric"
          placeholder="875000"
        >
      </div>

      <div
        id="gainResult"
        class="gain-result"
      >
        <span class="gain-result-label">
          RÉSULTAT
        </span>

        <strong>
          GTA$ 0
        </strong>

        <small>
          Entrez vos deux soldes
        </small>
      </div>

    </div>
  `;

  progressionSection.appendChild(
    section
  );

  const startInput =
    section.querySelector(
      "#gainStart"
    );

  const endInput =
    section.querySelector(
      "#gainEnd"
    );

  const result =
    section.querySelector(
      "#gainResult"
    );

  const resultValue =
    result.querySelector("strong");

  const resultInfo =
    result.querySelector("small");

  function calculateGain() {
    const start =
      Number(startInput.value);

    const end =
      Number(endInput.value);

    result.classList.remove(
      "positive",
      "negative"
    );

    if (
      startInput.value === "" ||
      endInput.value === "" ||
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      start < 0 ||
      end < 0
    ) {
      resultValue.textContent =
        "GTA$ 0";

      resultInfo.textContent =
        "Entrez vos deux soldes";

      return;
    }

    const gain =
      end - start;

    const sign =
      gain > 0
        ? "+"
        : gain < 0
          ? "-"
          : "";

    resultValue.textContent =
      `${sign}${formatGTA(
        Math.abs(gain)
      )}`;

    if (gain > 0) {
      result.classList.add(
        "positive"
      );
    }

    if (gain < 0) {
      result.classList.add(
        "negative"
      );
    }

    if (start > 0) {
      const percent =
        (gain / start) * 100;

      const percentSign =
        percent > 0
          ? "+"
          : "";

      resultInfo.textContent =
        `${percentSign}${percent.toFixed(1)} %`;
    } else if (gain > 0) {
      resultInfo.textContent =
        "Gain depuis GTA$ 0";
    } else {
      resultInfo.textContent =
        "Aucune variation";
    }
  }

  startInput.addEventListener(
    "input",
    calculateGain
  );

  endInput.addEventListener(
    "input",
    calculateGain
  );
}

createGainCalculator();
