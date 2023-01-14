/*
.##.....##....###....####.##....##
.###...###...##.##....##..###...##
.####.####..##...##...##..####..##
.##.###.##.##.....##..##..##.##.##
.##.....##.#########..##..##..####
.##.....##.##.....##..##..##...###
.##.....##.##.....##.####.##....##
*/

const { ipcRenderer } = require('electron');
const ppath = require('persist-path')('Ferny');
const fs = require("fs");

/*
.##.....##..#######..########..##.....##.##.......########..######.
.###...###.##.....##.##.....##.##.....##.##.......##.......##....##
.####.####.##.....##.##.....##.##.....##.##.......##.......##......
.##.###.##.##.....##.##.....##.##.....##.##.......######....######.
.##.....##.##.....##.##.....##.##.....##.##.......##.............##
.##.....##.##.....##.##.....##.##.....##.##.......##.......##....##
.##.....##..#######..########...#######..########.########..######.
*/

const saveFileToJsonFolder = require("../modules/saveFileToJsonFolder.js");
const loadTheme = require("../modules/loadTheme.js");
const applyTheme = require("../modules/applyTheme.js");
const applyWinControls = require("../modules/applyWinControls.js");

/*
.########.##.....##.##....##..######..########.####..#######..##....##..######.
.##.......##.....##.###...##.##....##....##.....##..##.....##.###...##.##....##
.##.......##.....##.####..##.##..........##.....##..##.....##.####..##.##......
.######...##.....##.##.##.##.##..........##.....##..##.....##.##.##.##..######.
.##.......##.....##.##..####.##..........##.....##..##.....##.##..####.......##
.##.......##.....##.##...###.##....##....##.....##..##.....##.##...###.##....##
.##........#######..##....##..######.....##....####..#######..##....##..######.
*/

function updateTheme() {
  loadTheme().then(function(theme) {
    applyTheme(theme);
  });
}

function requestTheme(theme) {
  saveFileToJsonFolder(null, 'theme', theme).then(function(bool) {
    loadTheme(theme).then(function(themeObj) {
      ipcRenderer.send('request-change-theme', themeObj);
      applyTheme(themeObj);
    });
  });
}

function chooseSlide(i) {
  let dots = document.getElementsByClassName('dot');
  let tabs = document.getElementsByClassName('tab');

  for(let j = 0; j < dots.length; j++) {
    dots[j].classList.remove('active');
    tabs[j].classList.remove('active');
  }

  dots[i].classList.add('active');
  tabs[i].classList.add('active');

  if(i == 0) {
    document.getElementById('prev-btn').classList.add('disable');
  } else {
    document.getElementById('prev-btn').classList.remove('disable');
  }
  if(i == dots.length - 1) {
    document.getElementById('next-btn').classList.add('disable');
    document.getElementById('skip-btn').classList.add('disable');
  } else {
    document.getElementById('next-btn').classList.remove('disable');
    document.getElementById('skip-btn').classList.remove('disable');
  }
}

function nextSlide() {
  let dots = document.getElementsByClassName('dot');
  for(let i = 0; i < dots.length - 1; i++) {
    if(dots[i].classList.contains('active')) {
      chooseSlide(i + 1);
      break;
    }
  }
}

function prevSlide() {
  let dots = document.getElementsByClassName('dot');
  for(let i = 1; i < dots.length; i++) {
    if(dots[i].classList.contains('active')) {
      chooseSlide(i - 1);
      break;
    }
  }
}

function loadSearchEngine() {
  try {
    let searchEngine = fs.readFileSync(ppath + "/json/searchengine.json");

    let radios = document.getElementsByName("search-engine");
    for(let i = 0; i < radios.length; i++) {
      if((radios[i] as any).value == searchEngine) {
        (radios[i] as any).checked = true;
        break;
      }
    }
  } catch (e) {

  }
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
  ipcRenderer.send('request-close-welcome');
}

function moreSettings(shortcutId) {
  ipcRenderer.send('request-open-settings', shortcutId);
}

function changeWelcome(bool) {
  if(bool) {
    saveFileToJsonFolder('welcome', 1);
  } else {
    saveFileToJsonFolder('welcome', 0);
  }
}

function openAppPage() {
  ipcRenderer.send('request-open-url-in-new-tab', "https://moduleart.github.io/ferny");
}

function openDeveloperPage() {
  ipcRenderer.send('request-open-url-in-new-tab', "https://moduleart.github.io/");
}

function loadStartPage() {
  try {
    let startPage = fs.readFileSync(ppath + "/json/startpage.json");
    (document.getElementById('start-page-input') as any).value = startPage;
  } catch (e) {

  }
}

function setStartPageLikeHomePage() {
  try {
    let jsonstr = fs.readFileSync(ppath + "/json/home.json");
    const Data = JSON.parse(jsonstr);
    (document.getElementById('start-page-input') as any).value = Data.url;
  } catch (e) {

  }
}

function saveStartPage() {
  let startPage = (document.getElementById('start-page-input') as any).value;

  saveFileToJsonFolder('startpage', startPage).then(function() {
    notif("Start page saved: " + startPage, "success");

    ipcRenderer.send('request-set-start-page', startPage);
  });
}

function loadBookmarksBar() {
  try {
    let jsonstr = fs.readFileSync(ppath + "/json/bookmarksbar.json");
    let Data = JSON.parse(jsonstr);

    if(Data.on) {
      (document.getElementById('bookmarks-bar-checkbox') as any).checked = true;
    }

    let radios = document.getElementsByName("bbar-layout");
    for(let i = 0; i < radios.length; i++) {
      if((radios[i] as any).value == Data.layout) {
        (radios[i] as any).checked = true;
        break;
      }
    }
  } catch (e) {

  }
}

function loadHomePage() {
  try {
    let jsonstr = fs.readFileSync(ppath + "/json/home.json");
    const Data = JSON.parse(jsonstr);
    (document.getElementById('home-page-input') as any).value = Data.url;
    if(Data.on == 1) {
      (document.getElementById('home-page-checkbox') as any).checked = true;
    }
  } catch (e) {

  }
}

function notif(text, type) {
  let Data = {
    text: text,
    type: type
  };
  ipcRenderer.send('request-add-status-notif', Data)
}

function moreInfo(btn) {
  btn.classList.toggle('active');
  btn.nextElementSibling.classList.toggle('active');
}

function requestSearchEngine(engine) {
  ipcRenderer.send('request-set-search-engine', engine);
}

function keyDown(e) {
  e = e || window.event;

  if (e.keyCode == '37') {
    prevSlide();
  } else if (e.keyCode == '39') {
    nextSlide();
  }
}

function loadWelcome() {
  try {
    let welcomeOn = fs.readFileSync(ppath + "/json/welcome.json");
    if(welcomeOn == 1) {
      (document.getElementById('welcome-checkbox') as any).checked = true;
    } else {
      (document.getElementById('welcome-checkbox') as any).checked = false;
    }
  } catch (e) {

  }
}

function saveHomePage() {
  let url = (document.getElementById('home-page-input') as any).value;
  let on = (document.getElementById('home-page-checkbox') as any).checked;

  if(url.length <= 0) {
    notif("First enter the home page URL", "warning");
  } else {
    if(on) {
      on = 1;
    } else {
      on = 0;
    }
  
    if(!fs.existsSync(ppath + "/json")) {
      fs.mkdirSync(ppath + "/json");
    } 
    saveFileToJsonFolder('home', JSON.stringify({ url: url, on: on })).then(function() {
      notif("Home page saved: " + url, "success");

      ipcRenderer.send('request-update-home-page');
    });
  }
}

function requestBookmarksBar(on, layout) {
  if(on != null) {
    if(on) {
      on = 1;
    } else {
      on = 0;
    }
  }

  let Data = {
    on: on,
    layout: layout
  };

  ipcRenderer.send('request-set-bookmarks-bar', Data);
}

/*
.####.########...######.....########..########.##....##.########..########.########..########.########.
..##..##.....##.##....##....##.....##.##.......###...##.##.....##.##.......##.....##.##.......##.....##
..##..##.....##.##..........##.....##.##.......####..##.##.....##.##.......##.....##.##.......##.....##
..##..########..##..........########..######...##.##.##.##.....##.######...########..######...########.
..##..##........##..........##...##...##.......##..####.##.....##.##.......##...##...##.......##...##..
..##..##........##....##....##....##..##.......##...###.##.....##.##.......##....##..##.......##....##.
.####.##.........######.....##.....##.########.##....##.########..########.##.....##.########.##.....##
*/

ipcRenderer.on('action-set-about', (event, arg) => {
  document.getElementById('version').innerHTML = "v" + arg.version + " / " + arg.arch + " / " + arg.platform;
});

ipcRenderer.on('action-blur-window', (event, arg) => {
  document.getElementById('titlebar').classList.add('blur');
});

ipcRenderer.on('action-focus-window', (event, arg) => {
  document.getElementById('titlebar').classList.remove('blur');
});

/*
.####.##....##.####.########
..##..###...##..##.....##...
..##..####..##..##.....##...
..##..##.##.##..##.....##...
..##..##..####..##.....##...
..##..##...###..##.....##...
.####.##....##.####....##...
*/

function init() {
  applyWinControls('only-close');

  updateTheme();
  
  loadSearchEngine();
  loadHomePage();
  loadStartPage();
  loadBookmarksBar();
  loadWelcome();

  ipcRenderer.send('request-set-about');

  document.onkeydown = keyDown;
}

document.onreadystatechange = () => {
  if (document.readyState == "complete") {
      init();
  }
}

/*
.########.##.....##.########....########.##....##.########.
....##....##.....##.##..........##.......###...##.##.....##
....##....##.....##.##..........##.......####..##.##.....##
....##....#########.######......######...##.##.##.##.....##
....##....##.....##.##..........##.......##..####.##.....##
....##....##.....##.##..........##.......##...###.##.....##
....##....##.....##.########....########.##....##.########.
*/

export {}
