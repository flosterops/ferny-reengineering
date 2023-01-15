import { ipcRenderer } from "electron";
import pp from "persist-path";
import fs from "fs";

import { SaveFileUtility } from "../../src/modules/saveFileToJsonFolder";
import { LoadThemeUtility } from "../../src/modules/loadTheme";
import { ApplyThemeUtility } from "../../src/modules/applyTheme";
import { ApplyWinControlsUtility } from "../../src/modules/applyWinControls";

const ppath = pp("Ferny");

function updateTheme() {
  LoadThemeUtility.loadTheme().then(function (theme) {
    ApplyThemeUtility.applyTheme(theme);
  });
}

function requestTheme(theme) {
  SaveFileUtility.saveFileToJsonFolder(null, "theme", theme).then(() => {
    LoadThemeUtility.loadTheme(theme).then(function (themeObj) {
      ipcRenderer.send("request-change-theme", themeObj);
      ApplyThemeUtility.applyTheme(themeObj);
    });
  });
}

function chooseSlide(i) {
  const dots = document.getElementsByClassName("dot");
  const tabs = document.getElementsByClassName("tab");

  for (let j = 0; j < dots.length; j++) {
    dots[j].classList.remove("active");
    tabs[j].classList.remove("active");
  }

  dots[i].classList.add("active");
  tabs[i].classList.add("active");

  if (i == 0) {
    document.getElementById("prev-btn").classList.add("disable");
  } else {
    document.getElementById("prev-btn").classList.remove("disable");
  }
  if (i == dots.length - 1) {
    document.getElementById("next-btn").classList.add("disable");
    document.getElementById("skip-btn").classList.add("disable");
  } else {
    document.getElementById("next-btn").classList.remove("disable");
    document.getElementById("skip-btn").classList.remove("disable");
  }
}

function nextSlide() {
  const dots = document.getElementsByClassName("dot");
  for (let i = 0; i < dots.length - 1; i++) {
    if (dots[i].classList.contains("active")) {
      chooseSlide(i + 1);
      break;
    }
  }
}

function prevSlide() {
  const dots = document.getElementsByClassName("dot");
  for (let i = 1; i < dots.length; i++) {
    if (dots[i].classList.contains("active")) {
      chooseSlide(i - 1);
      break;
    }
  }
}

function loadSearchEngine() {
  try {
    const searchEngine = fs.readFileSync(ppath + "/json/searchengine.json");

    const radios = document.getElementsByName("search-engine");

    for (let i = 0; i < radios.length; i++) {
      if ((radios[i] as any).value == searchEngine) {
        (radios[i] as any).checked = true;
        break;
      }
    }
  } catch (e) {}
}

function tabsWheel(event) {
  if (event.deltaY < 0) {
    prevSlide();
  }
  if (event.deltaY > 0) {
    nextSlide();
  }
}

function closeWindow() {
  ipcRenderer.send("request-close-welcome");
}

function moreSettings(shortcutId) {
  ipcRenderer.send("request-open-settings", shortcutId);
}

function changeWelcome(bool) {
  SaveFileUtility.saveFileToJsonFolder("welcome", bool ? 1 : 0);
}

function openAppPage() {
  ipcRenderer.send(
    "request-open-url-in-new-tab",
    "https://moduleart.github.io/ferny"
  );
}

function openDeveloperPage() {
  ipcRenderer.send(
    "request-open-url-in-new-tab",
    "https://moduleart.github.io/"
  );
}

function loadStartPage() {
  try {
    const startPage = fs.readFileSync(ppath + "/json/startpage.json");
    (document.getElementById("start-page-input") as any).value = startPage;
  } catch (e) {}
}

function setStartPageLikeHomePage() {
  try {
    const jsonstr: any = fs.readFileSync(ppath + "/json/home.json");
    const Data = JSON.parse(jsonstr);
    (document.getElementById("start-page-input") as any).value = Data.url;
  } catch (e) {}
}

function saveStartPage() {
  const startPage = (document.getElementById("start-page-input") as any).value;

  SaveFileUtility.saveFileToJsonFolder("startpage", startPage).then(() => {
    notif("Start page saved: " + startPage, "success");

    ipcRenderer.send("request-set-start-page", startPage);
  });
}

function loadBookmarksBar() {
  try {
    const jsonstr: any = fs.readFileSync(ppath + "/json/bookmarksbar.json");
    const Data = JSON.parse(jsonstr);

    if (Data.on) {
      (document.getElementById("bookmarks-bar-checkbox") as any).checked = true;
    }

    const radios = document.getElementsByName("bbar-layout");
    for (let i = 0; i < radios.length; i++) {
      if ((radios[i] as any).value == Data.layout) {
        (radios[i] as any).checked = true;
      }
    }
  } catch (e) {}
}

function loadHomePage() {
  try {
    const jsonstr: any = fs.readFileSync(ppath + "/json/home.json");
    const Data = JSON.parse(jsonstr);

    (document.getElementById("home-page-input") as any).value = Data.url;

    if (Data.on == 1) {
      (document.getElementById("home-page-checkbox") as any).checked = true;
    }
  } catch (e) {}
}

function notif(text, type) {
  const Data = {
    text: text,
    type: type,
  };

  ipcRenderer.send("request-add-status-notif", Data);
}

function moreInfo(btn) {
  btn.classList.toggle("active");
  btn.nextElementSibling.classList.toggle("active");
}

function requestSearchEngine(engine) {
  ipcRenderer.send("request-set-search-engine", engine);
}

function keyDown(e) {
  e = e || window.event;

  if (e.keyCode == "37") {
    prevSlide();
  } else if (e.keyCode == "39") {
    nextSlide();
  }
}

function loadWelcome() {
  try {
    const welcomeOn: any = fs.readFileSync(ppath + "/json/welcome.json");
    (document.getElementById("welcome-checkbox") as any).checked =
      welcomeOn === 1;
  } catch (e) {}
}

function saveHomePage() {
  const url = (document.getElementById("home-page-input") as any).value;
  let on = (document.getElementById("home-page-checkbox") as any).checked;

  if (url.length <= 0) {
    notif("First enter the home page URL", "warning");
  } else {
    if (on) {
      on = 1;
    } else {
      on = 0;
    }

    if (!fs.existsSync(ppath + "/json")) {
      fs.mkdirSync(ppath + "/json");
    }
    SaveFileUtility.saveFileToJsonFolder(
      "home",
      JSON.stringify({ url: url, on: on })
    ).then(function () {
      notif("Home page saved: " + url, "success");

      ipcRenderer.send("request-update-home-page");
    });
  }
}

function requestBookmarksBar(on, layout) {
  if (on != null) {
    if (on) {
      on = 1;
    } else {
      on = 0;
    }
  }

  const Data = {
    on: on,
    layout: layout,
  };

  ipcRenderer.send("request-set-bookmarks-bar", Data);
}

ipcRenderer.on("action-set-about", (event, arg) => {
  document.getElementById("version").innerHTML =
    "v" + arg.version + " / " + arg.arch + " / " + arg.platform;
});

ipcRenderer.on("action-blur-window", () => {
  document.getElementById("titlebar").classList.add("blur");
});

ipcRenderer.on("action-focus-window", () => {
  document.getElementById("titlebar").classList.remove("blur");
});

function init() {
  ApplyWinControlsUtility.applyWinControls(false, "only-close");

  updateTheme();

  loadSearchEngine();
  loadHomePage();
  loadStartPage();
  loadBookmarksBar();
  loadWelcome();

  ipcRenderer.send("request-set-about");

  document.onkeydown = keyDown;
}

document.onreadystatechange = () => {
  if (document.readyState == "complete") {
    init();
  }
};

export {};
