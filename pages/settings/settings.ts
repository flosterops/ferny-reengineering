"use strict";

// Require

const { ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

const saveFileToJsonFolder = require("../../modules/saveFileToJsonFolder");
const loadFileFromJsonFolder = require("../../modules/loadFileFromJsonFolder");
const loadTheme = require("../../modules/loadTheme");
const applyTheme = require("../../modules/applyTheme");
const bytesToSize = require("../../modules/bytesToSize");
const applyWinControls = require("../../modules/applyWinControls");
const loadLastTabModule = require("../../modules/loadLastTab");
const loadSearchEngineModule = require("../../modules/loadSearchEngine");
const loadStartupModule = require("../../modules/loadStartup");
const loadTabClosedModule = require("../../modules/loadTabClosed");
const loadWinControlsModule = require("../../modules/loadWinControls");

// Functions themes

function updateTheme() {
  loadTheme().then(({ theme, dark }) => {
    applyTheme(theme, dark);
  });
}

function loadThemesFromFolder() {
  const themesFolder = path.join(__dirname, "..", "assets/themes");
  const themeManager = document.getElementById("theme-manager");

  fs.readdir(themesFolder, (err, files) => {
    loadFileFromJsonFolder(null, "theme").then((data) => {
      let loadedTheme = {
        name: "ferny",
        dark: false
      };
      if(data.toString().length > 0) {
        loadedTheme = JSON.parse(data);
      }

      files.forEach((file) => {
        fs.readFile(path.join(themesFolder, file), (err, data) => {
          const themeObj = JSON.parse(data);

          const fileName = file.split(".")[0];

          let darkValue: any = (fileName == loadedTheme.name) && loadedTheme.dark;
          let lightValue = "";
          if(darkValue) {
            darkValue = "checked";
            lightValue = "";
          } else {
            darkValue = "";
            lightValue = "checked";
          }
  
          const theme = document.createElement("div");
          theme.classList.add("theme");
          theme.innerHTML = `
            <label class="theme-name">${themeObj.name}</label>
            <label class="theme-description">${themeObj.description}</label><br>
            <img class="theme-image" src="../assets/previews/${themeObj.light.image}" onclick="requestTheme('${fileName}', false)">
            <img class="theme-image" src="../assets/previews/${themeObj.dark.image}" onclick="requestTheme('${fileName}', true)">
            <div class="nav-checkbox">
              <label>Light</label>
              <input id="${fileName}-light-theme-checkbox" type="radio" onclick="requestTheme(this.value, false)" 
                class="checkbox" checked name="theme" value="${fileName}" ${lightValue}>
            </div>
            <div class="nav-checkbox">
              <label>Dark</label>
              <input id="${fileName}-dark-theme-checkbox" type="radio" onclick="requestTheme(this.value, true)" 
                class="checkbox" name="theme" value="${fileName}" ${darkValue}>
            </div>
          `;
  
          themeManager.appendChild(theme);
  
          updateTheme();
        });
      });
    });
  });
}

function requestTheme(theme, dark) {
  let cbName = theme;
  if(dark) {
    cbName += "-dark-theme-checkbox";
  } else {
    cbName += "-light-theme-checkbox"
  }
  const cb = document.getElementById(cbName);
  if(!(cb as any).checked) {
    (cb as any).checked = true;
  }

  saveFileToJsonFolder(null, "theme", JSON.stringify({ name: theme, dark:dark })).then((bool) => {
    ipcRenderer.send("main-updateTheme");
    updateTheme();
  });
}

// Functions windows

function closeWindow() {
  ipcRenderer.send("settings-closeWindow");
}

// Functions search engine

function requestSearchEngine(engine) {
  saveFileToJsonFolder(null, "search-engine", engine).then(function(bool) {
    ipcRenderer.send("overlay-setSearchEngine", engine);
    ipcRenderer.send("main-addStatusNotif", { text: `Search engine changed: "${engine}"`, type: "success" });
  });
}

function loadSearchEngine() {
  loadSearchEngineModule().then((searchEngine) => {
    const radios = document.getElementsByName("search-engine");
    for(let i = 0; i < radios.length; i++) {
      if((radios[i] as any).value === searchEngine) {
        (radios[i] as any).checked = true;
        break;
      }
    }
  });
}

// Functions downloads

function requestDownloadsFolder(folder) {
  if(folder === "?custom-folder?") {
    folder = document.getElementById("downloads-folder").innerHTML;
  }

  saveFileToJsonFolder("downloads", "downloads-folder", folder).then(function(bool) {
    ipcRenderer.send("main-setDownloadsFolder", folder);
    ipcRenderer.send("main-addStatusNotif", { text: "Downloads folder changed", type: "success" });
  });
}

function chooseDownloadsFolder() {
  ipcRenderer.send("main-chooseDownloadsFolder", document.getElementById("downloads-folder").innerHTML);
}

function loadDownloadsFolder() {
  ipcRenderer.send("main-getDownloadsFolder");
  loadFileFromJsonFolder("downloads", "downloads-folder").then((data) => {
    let folder = data.toString();
    if(folder != "?ask?" && folder != "?downloads?" && folder != "?desktop?" && folder.length > 0) {
      document.getElementById("downloads-folder").innerHTML = folder;
      folder = "?custom-folder?";
    }
    const radios = document.getElementsByName("downloads-folder");
      for(let i = 0; i < radios.length; i++) {
        if((radios[i] as any).value === folder) {
          (radios[i] as any).checked = true;
          break;
        }
      }
  });
}

function openDownloadsFolder() {
  ipcRenderer.send("main-openDownloadsFolder");
}

// Functions tab closed

function requestTabClosed(tabClosed) {
  saveFileToJsonFolder(null, "tabclosed", tabClosed).then(function(bool) {
    ipcRenderer.send("tabManager-setTabClosedAction", tabClosed);
    ipcRenderer.send("main-addStatusNotif", { text: "Active tab closed action changed", type: "success" });
  });
}

function loadTabClosed() {
  loadTabClosedModule().then((tabClosed) => {
    const radios = document.getElementsByName("tabclosed");
    for(let i = 0; i < radios.length; i++) {
      if((radios[i] as any).value === tabClosed) {
        (radios[i] as any).checked = true;
        break;
      }
    }
  });
}

// Functions last tab

function requestLastTab(lastTab) {
  saveFileToJsonFolder(null, "lasttab", lastTab).then(function(bool) {
    ipcRenderer.send("main-addStatusNotif", { text: "Last tab closed action changed", type: "success" });
  });
}

function loadLastTab() {
  loadLastTabModule().then((lastTab) => {
    const radios = document.getElementsByName("lasttab");
    for(let i = 0; i < radios.length; i++) {
      if((radios[i] as any).value === lastTab) {
        (radios[i] as any).checked = true;
        break;
      }
    }
  });
}

// Functions startup

function requestStartup(startup) {
  saveFileToJsonFolder(null, "startup", startup).then(() => {
    ipcRenderer.send("main-addStatusNotif", { text: "Startup action changed", type: "success" });
  });
}

function loadStartup() {
  loadStartupModule().then((startup) => {
    const radios = document.getElementsByName("startup");
    for(let i = 0; i < radios.length; i++) {
      if((radios[i] as any).value === startup) {
        (radios[i] as any).checked = true;
        break;
      }
    }
  });
}

// Functions home page

function loadHomePage() {
  loadFileFromJsonFolder(null, "home").then((data) => {
    const Data = JSON.parse(data);
    (document.getElementById("home-page-input") as any).value = Data.url;
    if(Data.on === 1) {
      (document.getElementById("home-page-checkbox") as any).checked = true;
    }
  });
}

function saveHomePage() {
  const url = (document.getElementById("home-page-input") as any).value;
  let on = (document.getElementById("home-page-checkbox") as any).checked;

  if(url.length <= 0) {
    ipcRenderer.send("main-addStatusNotif", { text: "First enter the home page URL", type: "warning" });
  } else {
    if(on) {
      on = 1;
    } else {
      on = 0;
    }
  
    saveFileToJsonFolder(null, "home", JSON.stringify({ url, on })).then(() => {
      ipcRenderer.send("main-addStatusNotif", { text: `Home page saved: "` + url + `"`, type: "success" });
      ipcRenderer.send("tabManager-setHomePage", { url, on });
    });
  }
}

function useHomePage(url) {
  (document.getElementById("home-page-input") as any).value = url;
  saveHomePage();
}

// Functions clear data

function clearBrowsingData() {
  const clearCache = (document.getElementById("clear-cache-checkbox") as any).checked;
  const clearStorage = (document.getElementById("clear-storage-checkbox") as any).checked;
  if(!clearCache && !clearStorage) {
    ipcRenderer.send("main-addStatusNotif", { text: "First check something", type: "error" });
  } else {
    const Data = {
      cache: clearCache,
      storage: clearStorage
    };
  
    ipcRenderer.send("request-clear-browsing-data", Data);
  }
}

// Functions win controls

function requestWinControls(bool) {
  saveFileToJsonFolder(null, "wincontrols", JSON.stringify({ systemTitlebar: bool })).then(() => {
    if(bool) {
      ipcRenderer.send("main-addStatusNotif", { text: "System titlebar turned on", type: "success" });
    } else {
      ipcRenderer.send("main-addStatusNotif", { text: "System titlebar turned off", type: "info" });
    }
  });
}

// Functions categories

function showCategory(id) {
  const containers = document.getElementsByClassName("container");
  const buttons = document.getElementById("sidebar").getElementsByClassName("nav-btn");
  for(let i = 0; i < containers.length; i++) {
    if(containers[i].id === id) {
      containers[i].classList.add("active");
      buttons[i].classList.add("active");
    } else {
      containers[i].classList.remove("active");
      buttons[i].classList.remove("active");
    }
  }
}

// IPS cache

ipcRenderer.on("action-set-cache-size", (event, arg) => {
  document.getElementById("cache-size-label").innerHTML = "Cache size: " + bytesToSize(arg.cacheSize);
});

// IPS window

ipcRenderer.on("window-blur", (event) => {
  document.getElementById("titlebar").classList.add("blur");
});

ipcRenderer.on("window-focus", (event) => {
  document.getElementById("titlebar").classList.remove("blur");
});

// IPS settings

ipcRenderer.on("settings-setDownloadsFolder", (event, path) => {
  document.getElementById("downloads-folder").innerHTML = path;
  if((document.getElementById("custom-folder-radio") as any).checked) {
    requestDownloadsFolder("?custom-folder?");
  }
});

ipcRenderer.on("settings-showCategory", (event, categoryId) => {
  if(categoryId) {
    showCategory(categoryId);
  }
});

// Init

function init() {
  loadWinControlsModule().then((winControls) => {
    applyWinControls(winControls.systemTitlebar, "only-close");
    (document.getElementById("system-titlebar-checkbox") as any).checked = winControls.systemTitlebar;
  });

  updateTheme();

  loadThemesFromFolder();

  loadHomePage();
  loadSearchEngine();
  loadStartup();
  loadTabClosed();
  loadLastTab();
  loadDownloadsFolder();

  ipcRenderer.send("request-set-cache-size");
}

document.onkeyup = function(e) {
  if (e.which == 27) {
    closeWindow();
  } 
};

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
      init();
  }
};

export {}
