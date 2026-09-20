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
