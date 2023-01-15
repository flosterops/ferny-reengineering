import { ipcRenderer } from "electron";
import fs from "fs";
import path from "path";

import { SaveFileUtility } from "../../src/modules/saveFileToJsonFolder";
import { LoadFileUtility } from "../../src/modules/loadFileFromJsonFolder";
import { LoadThemeUtility } from "../../src/modules/loadTheme";
import { ApplyThemeUtility } from "../../src/modules/applyTheme";
import { BytesUtility } from "../../src/modules/bytesToSize";
import { ApplyWinControlsUtility } from "../../src/modules/applyWinControls";
import { LoadLastTabUtility } from "../../src/modules/loadLastTab";
import { LoadSearchEngineUtility } from "../../src/modules/loadSearchEngine";
import { LoadStartupUtility } from "../../src/modules/loadStartup";
import { LoadTabClosedUtility } from "../../src/modules/loadTabClosed";
import { LoadWinControlsUtility } from "../../src/modules/loadWinControls";

class ThemeUtility {
  static init() {
    ThemeUtility.updateTheme();
    ThemeUtility.loadThemesFromFolder();
  }

  static updateTheme() {
    LoadThemeUtility.loadTheme().then(({ theme, dark }) => {
      ApplyThemeUtility.applyTheme(theme, dark);
    });
  }

  static loadThemesFromFolder() {
    const themesFolder = path.join(__dirname, "..", "assets/themes");
    const themeManager = document.getElementById("theme-manager");

    fs.readdir(themesFolder, (err, files) => {
      LoadFileUtility.loadFileFromJsonFolder(null, "theme").then((data) => {
        let loadedTheme = {
          name: "ferny",
          dark: false,
        };
        if (data.toString().length > 0) {
          loadedTheme = JSON.parse(data);
        }

        files.forEach((file) => {
          fs.readFile(path.join(themesFolder, file), (err, data: any) => {
            const themeObj = JSON.parse(data);

            const fileName = file.split(".")[0];

            let darkValue: any =
              fileName == loadedTheme.name && loadedTheme.dark;
            let lightValue = "";
            if (darkValue) {
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

            ThemeUtility.updateTheme();
          });
        });
      });
    });
  }

  static requestTheme(theme, dark) {
    let cbName = theme;
    if (dark) {
      cbName += "-dark-theme-checkbox";
    } else {
      cbName += "-light-theme-checkbox";
    }
    const cb = document.getElementById(cbName);
    if (!(cb as any).checked) {
      (cb as any).checked = true;
    }

    SaveFileUtility.saveFileToJsonFolder(
      null,
      "theme",
      JSON.stringify({ name: theme, dark: dark })
    ).then(() => {
      ipcRenderer.send("main-updateTheme");
      ThemeUtility.updateTheme();
    });
  }
}

class WindowUtility {
  static closeWindow() {
    ipcRenderer.send("settings-closeWindow");
  }
}

class SearchEngineUtility {
  static init() {
    SearchEngineUtility.loadSearchEngine();
  }

  static requestSearchEngine(engine) {
    SaveFileUtility.saveFileToJsonFolder(null, "search-engine", engine).then(
      function () {
        ipcRenderer.send("overlay-setSearchEngine", engine);
        ipcRenderer.send("main-addStatusNotif", {
          text: `Search engine changed: "${engine}"`,
          type: "success",
        });
      }
    );
  }

  static loadSearchEngine() {
    LoadSearchEngineUtility.loadSearchEngine().then((searchEngine) => {
      const radios = document.getElementsByName("search-engine");
      for (let i = 0; i < radios.length; i++) {
        if ((radios[i] as any).value === searchEngine) {
          (radios[i] as any).checked = true;
          break;
        }
      }
    });
  }
}

class FoldersUtility {
  static init() {
    FoldersUtility.loadDownloadsFolder();
  }

  static requestDownloadsFolder(folder) {
    if (folder === "?custom-folder?") {
      folder = document.getElementById("downloads-folder").innerHTML;
    }

    SaveFileUtility.saveFileToJsonFolder(
      "downloads",
      "downloads-folder",
      folder
    ).then(function () {
      ipcRenderer.send("main-setDownloadsFolder", folder);
      ipcRenderer.send("main-addStatusNotif", {
        text: "Downloads folder changed",
        type: "success",
      });
    });
  }

  static chooseDownloadsFolder() {
    ipcRenderer.send(
      "main-chooseDownloadsFolder",
      document.getElementById("downloads-folder").innerHTML
    );
  }

  static loadDownloadsFolder() {
    ipcRenderer.send("main-getDownloadsFolder");
    LoadFileUtility.loadFileFromJsonFolder(
      "downloads",
      "downloads-folder"
    ).then((data) => {
      let folder = data.toString();
      if (
        folder != "?ask?" &&
        folder != "?downloads?" &&
        folder != "?desktop?" &&
        folder.length > 0
      ) {
        document.getElementById("downloads-folder").innerHTML = folder;
        folder = "?custom-folder?";
      }
      const radios = document.getElementsByName("downloads-folder");
      for (let i = 0; i < radios.length; i++) {
        if ((radios[i] as any).value === folder) {
          (radios[i] as any).checked = true;
          break;
        }
      }
    });
  }

  static openDownloadsFolder() {
    ipcRenderer.send("main-openDownloadsFolder");
  }
}

class TabUtility {
  static init() {
    TabUtility.loadTabClosed();
    TabUtility.loadLastTab();
  }

  static requestTabClosed(tabClosed: string) {
    SaveFileUtility.saveFileToJsonFolder(null, "tabclosed", tabClosed).then(
      function () {
        ipcRenderer.send("tabManager-setTabClosedAction", tabClosed);
        ipcRenderer.send("main-addStatusNotif", {
          text: "Active tab closed action changed",
          type: "success",
        });
      }
    );
  }

  static loadTabClosed() {
    LoadTabClosedUtility.loadTabClosed().then((tabClosed: string) => {
      const radios = document.getElementsByName("tabclosed");
      for (let i = 0; i < radios.length; i++) {
        if ((radios[i] as any).value === tabClosed) {
          (radios[i] as any).checked = true;
          break;
        }
      }
    });
  }

  static requestLastTab(lastTab: string) {
    SaveFileUtility.saveFileToJsonFolder(null, "lasttab", lastTab).then(
      function () {
        ipcRenderer.send("main-addStatusNotif", {
          text: "Last tab closed action changed",
          type: "success",
        });
      }
    );
  }

  static loadLastTab() {
    LoadLastTabUtility.loadLastTab().then((lastTab) => {
      const radios = document.getElementsByName("lasttab");
      for (let i = 0; i < radios.length; i++) {
        if ((radios[i] as any).value === lastTab) {
          (radios[i] as any).checked = true;
          break;
        }
      }
    });
  }
}

class StartupUtility {
  static init() {
    StartupUtility.loadStartup();
  }

  static requestStartup(startup: string) {
    SaveFileUtility.saveFileToJsonFolder(null, "startup", startup).then(() => {
      ipcRenderer.send("main-addStatusNotif", {
        text: "Startup action changed",
        type: "success",
      });
    });
  }

  static loadStartup() {
    LoadStartupUtility.loadStartup().then((startup: string) => {
      const radios = document.getElementsByName("startup");
      for (let i = 0; i < radios.length; i++) {
        if ((radios[i] as any).value === startup) {
          (radios[i] as any).checked = true;
          break;
        }
      }
    });
  }
}

class HomePageUtility {
  static init() {
    HomePageUtility.loadHomePage();
  }

  static loadHomePage() {
    LoadFileUtility.loadFileFromJsonFolder(null, "home").then((data) => {
      const Data = JSON.parse(data);
      (document.getElementById("home-page-input") as any).value = Data.url;
      if (Data.on === 1) {
        (document.getElementById("home-page-checkbox") as any).checked = true;
      }
    });
  }

  static saveHomePage() {
    const url = (document.getElementById("home-page-input") as any).value;
    let on = (document.getElementById("home-page-checkbox") as any).checked;

    if (url.length <= 0) {
      ipcRenderer.send("main-addStatusNotif", {
        text: "First enter the home page URL",
        type: "warning",
      });
    } else {
      if (on) {
        on = 1;
      } else {
        on = 0;
      }

      SaveFileUtility.saveFileToJsonFolder(
        null,
        "home",
        JSON.stringify({ url, on })
      ).then(() => {
        ipcRenderer.send("main-addStatusNotif", {
          text: `Home page saved: "` + url + `"`,
          type: "success",
        });
        ipcRenderer.send("tabManager-setHomePage", { url, on });
      });
    }
  }

  static useHomePage(url) {
    (document.getElementById("home-page-input") as any).value = url;
    HomePageUtility.saveHomePage();
  }
}

class ClearDataUtility {
  static clearBrowsingData() {
    const clearCache = (document.getElementById("clear-cache-checkbox") as any)
      .checked;
    const clearStorage = (
      document.getElementById("clear-storage-checkbox") as any
    ).checked;
    if (!clearCache && !clearStorage) {
      ipcRenderer.send("main-addStatusNotif", {
        text: "First check something",
        type: "error",
      });
    } else {
      const Data = {
        cache: clearCache,
        storage: clearStorage,
      };

      ipcRenderer.send("request-clear-browsing-data", Data);
    }
  }
}

class WinControlsUtility {
  static requestWinControls(bool) {
    SaveFileUtility.saveFileToJsonFolder(
      null,
      "wincontrols",
      JSON.stringify({ systemTitlebar: bool })
    ).then(() => {
      if (bool) {
        ipcRenderer.send("main-addStatusNotif", {
          text: "System titlebar turned on",
          type: "success",
        });
      } else {
        ipcRenderer.send("main-addStatusNotif", {
          text: "System titlebar turned off",
          type: "info",
        });
      }
    });
  }
}

class CategoryUtility {
  static showCategory(id: string) {
    const containers = document.getElementsByClassName("container");
    const buttons = document
      .getElementById("sidebar")
      .getElementsByClassName("nav-btn");
    for (let i = 0; i < containers.length; i++) {
      if (containers[i].id === id) {
        containers[i].classList.add("active");
        buttons[i].classList.add("active");
      } else {
        containers[i].classList.remove("active");
        buttons[i].classList.remove("active");
      }
    }
  }
}

class IpcRendererUtility {
  static init() {
    IpcRendererUtility.setCacheSize();
    IpcRendererUtility.windowBlur();
    IpcRendererUtility.windowFocus();
    IpcRendererUtility.setDownloadsFolder();
  }

  static setCacheSize() {
    ipcRenderer.on("action-set-cache-size", (event, arg) => {
      document.getElementById("cache-size-label").innerHTML =
        "Cache size: " + BytesUtility.bytesToSize(arg.cacheSize);
    });
  }

  static windowBlur() {
    ipcRenderer.on("window-blur", () => {
      document.getElementById("titlebar").classList.add("blur");
    });
  }

  static windowFocus() {
    ipcRenderer.on("window-focus", () => {
      document.getElementById("titlebar").classList.remove("blur");
    });
  }

  static setDownloadsFolder() {
    ipcRenderer.on("settings-setDownloadsFolder", (event, path) => {
      document.getElementById("downloads-folder").innerHTML = path;
      if ((document.getElementById("custom-folder-radio") as any).checked) {
        FoldersUtility.requestDownloadsFolder("?custom-folder?");
      }
    });
  }

  static showCategory() {
    ipcRenderer.on("settings-showCategory", (event, categoryId) => {
      if (categoryId) {
        CategoryUtility.showCategory(categoryId);
      }
    });
  }
}

class DocumentUtility {
  static init() {
    DocumentUtility.closeWindow();
  }

  static closeWindow() {
    document.onkeyup = function (e) {
      if (e.which == 27) {
        WindowUtility.closeWindow();
      }
    };
  }
}

class InitializerUtility {
  static init() {
    InitializerUtility.initBeforeReadyStateChange();

    document.onreadystatechange = () => {
      if (document.readyState === "complete") {
        InitializerUtility.initAfterReadyStateChange();
      }
    };
  }

  static initBeforeReadyStateChange() {
    InitializerUtility.initIpcRenderer();
    InitializerUtility.initDocumentUtilities();
  }

  static initIpcRenderer() {
    IpcRendererUtility.init();
  }

  static initDocumentUtilities() {
    DocumentUtility.init();
  }

  static initAfterReadyStateChange() {
    InitializerUtility.initWindowControls();
    InitializerUtility.initTheme();
    InitializerUtility.initHomePage();
    InitializerUtility.initSearchEngine();
    InitializerUtility.initStartup();
    InitializerUtility.initTab();
    InitializerUtility.initFolders();
    InitializerUtility.sendIpcRendererCacheSize();
  }

  static initWindowControls() {
    LoadWinControlsUtility.loadWinControls().then((winControls) => {
      ApplyWinControlsUtility.applyWinControls(
        winControls.systemTitlebar,
        "only-close"
      );
      (document.getElementById("system-titlebar-checkbox") as any).checked =
        winControls.systemTitlebar;
    });
  }

  static initTheme() {
    ThemeUtility.init();
  }

  static initHomePage() {
    HomePageUtility.init();
  }

  static initSearchEngine() {
    SearchEngineUtility.init();
  }

  static initStartup() {
    StartupUtility.init();
  }

  static initTab() {
    TabUtility.init();
  }

  static initFolders() {
    FoldersUtility.init();
  }

  static sendIpcRendererCacheSize() {
    ipcRenderer.send("request-set-cache-size");
  }
}

InitializerUtility.init();

export {};
