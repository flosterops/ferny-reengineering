const { ipcRenderer } = require('electron');
const getTitleAtUrl = require('get-title-at-url');

/*
.########.##.....##.##....##..######..########.####..#######..##....##..######.
.##.......##.....##.###...##.##....##....##.....##..##.....##.###...##.##....##
.##.......##.....##.####..##.##..........##.....##..##.....##.####..##.##......
.######...##.....##.##.##.##.##..........##.....##..##.....##.##.##.##..######.
.##.......##.....##.##..####.##..........##.....##..##.....##.##..####.......##
.##.......##.....##.##...###.##....##....##.....##..##.....##.##...###.##....##
.##........#######..##....##..######.....##....####..#######..##....##..######.
*/

// appearance
function changeTheme(color) {
  // document.body.style.backgroundColor = color;

  if(checkIfDark(color)) {
    setIconsStyle('light');

    document.documentElement.style.setProperty('--color-top', 'white');
    document.documentElement.style.setProperty('--color-over', 'rgba(0, 0, 0, 0.3)');
  } else {
    setIconsStyle('dark');

    document.documentElement.style.setProperty('--color-top', 'black');
    document.documentElement.style.setProperty('--color-over', 'rgba(0, 0, 0, 0.15)');
  }
}
function setIconsStyle(str) {
  var icons = document.getElementsByClassName('theme-icon');

  for(var i = 0; i < icons.length; i++) {
    icons[i].src = "../themes/" + str + "/icons/" + icons[i].name + ".png";
  }
}
function checkIfDark(color) {
    var r, g, b, hsp;
    if (String(color).match(/^rgb/)) {
        color = String(color).match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

        r = color[1];
        g = color[2];
        b = color[3];
    } else {
        color = +("0x" + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }

    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

    if (hsp > 127.5) {
        return false;
    } else {
        return true;
    }
}
function loadTheme() {
  var fs = require("fs");
  var ppath = require('persist-path')('ArrowBrowser');

  try {
    var themeColor = fs.readFileSync(ppath + "\\json\\theme.json");
    changeTheme(themeColor);
  } catch (e) {

  }
}
function loadBorderRadius() {
  var fs = require("fs");
  var ppath = require('persist-path')('ArrowBrowser');

  try {
    var borderRadius = fs.readFileSync(ppath + "\\json\\radius.json");
    changeBorderRadius(borderRadius);

    var radios = document.getElementsByName("border-radius");
    for(var i = 0; i < radios.length; i++) {
      if(radios[i].value == borderRadius) {
        radios[i].checked = true;
      }
    }
  } catch (e) {

  }
}
function changeBorderRadius(size) {
  document.documentElement.style.setProperty('--px-radius', size + 'px');
}

// history
function clearHistory() {
  var container = document.getElementById('history');
  container.innerHTML = "";
  ipcRenderer.send('request-clear-history');
  notif('History cleared', 'success')
}

function loadHistory() {
  var fs = require("fs");
  var ppath = require('persist-path')('ArrowBrowser');

  try {
    var jsonstr = fs.readFileSync(ppath + "\\json\\history.json");
    var arr = JSON.parse(jsonstr);
    var i;
    for (i = 0; i < arr.length; i++) {
      createHistoryItem(arr[i].index, arr[i].url, arr[i].time);
    }
  } catch (e) {

  }
}

function createHistoryItem(index, url, time) {
  var div = document.createElement('div');
  div.classList.add('history-item');
  div.id = "history-" + index;
  div.innerHTML = `<img class="history-icon" src="` + 'http://www.google.com/s2/favicons?domain=' + url + `"><label class="history-name">Loading...</label><hr>
                  Url: <label class="history-url" title="` + url + `">` + url + `</label><br>
                  Date: <label class="history-date">` + epochToDate(time) + `</label> / <label>Time: </label><label class="history-time">` + epochToTime(time) + `</label><hr>
                  <center class="history-buttons">
                    <div class="nav-btn" onclick="openUrl('` + url + `')" title="Open url">
                      <img class="nav-btn-icon theme-icon" name="url">
                      <label>Open</label>
                    </div>
                    <div class="nav-btn" onclick="openUrlInNewTab('` + url + `')" title="Open url in new tab">
                      <img class="nav-btn-icon theme-icon" name="tab">
                      <label>New tab</label>
                    </div>
                    <div class="nav-btn" onclick="removeHistoryItem(` + index + `)">
                      <img class="nav-btn-icon theme-icon" name="delete">
                      <label>Remove</label>
                    </div>
                  </center>`;
  div.addEventListener('auxclick', (e) => {
    e.preventDefault();
    if(e.which == 2) {
      ipcRenderer.send('request-open-url-in-new-tab', url);
    }
  }, false);
  var container = document.getElementById('history');
  container.insertBefore(div, container.firstChild);

  applyTitle(url, index);

  loadTheme();
}

function removeHistoryItem(index) {
  var div = document.getElementById('history-' + index);
  div.parentNode.removeChild(div);
  ipcRenderer.send('request-remove-history-item', index);
}

function applyTitle(url, index) {
  getTitleAtUrl(url, function(title) {
    var div = document.getElementById('history-' + index);
    var name = div.getElementsByClassName('history-name')[0];
    if(typeof(title) == "undefined") {
      name.innerHTML = "Failed to load";
    } else {
      name.title = title;
      name.innerHTML = title;
    }
  });
}

function openUrl(url) {
  ipcRenderer.send('request-open-url', url);
}

function openUrlInNewTab(url) {
  ipcRenderer.send('request-open-url-in-new-tab', url);
}


function notif(text, type) {
  let Data = {
    text: text,
    type: type
  };
  ipcRenderer.send('request-notif', Data)
}

function epochToDate(time) {
  let date = new Date(0);
  date.setUTCSeconds(time);
  var str = date.getDate() + " " + numberToMonth(date.getMonth()) + " " + date.getFullYear(); 
  return str;
}

function epochToTime(time) {
  let date = new Date(0);
  date.setUTCSeconds(time);

  var minutes = date.getMinutes();
  var hours = date.getHours()

  if(minutes <= 9) {
    minutes = "0" + minutes;
  }

  if(hours <= 9) {
    hours = "0" + hours;
  }

  var str = hours + ":" + minutes;
  return str;
}

function numberToMonth(number) {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[number];
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

ipcRenderer.on('action-add-history-item', (event, arg) => {
  createHistoryItem(arg.index, arg.url, arg.time);
});

ipcRenderer.on('action-load-theme', (event, arg) => {
  loadTheme();
});

ipcRenderer.on('action-load-border-radius', (event, arg) => {
  loadBorderRadius();
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
  loadHistory();
  loadTheme();
  loadBorderRadius();

  document.getElementById("search").addEventListener("keyup", function(event) {
    if(document.getElementById("search").value.length > 0) {
      var search = document.getElementById("search").value.toLowerCase();
      var elements = document.getElementsByClassName('history-item');
      for(var i = 0; i < elements.length; i++) {
        var name = elements[i].getElementsByClassName('history-name')[0].innerHTML.toLowerCase();
        var url = elements[i].getElementsByClassName('history-url')[0].innerHTML.toLowerCase();
        var date = elements[i].getElementsByClassName('history-date')[0].innerHTML.toLowerCase();
        var time = elements[i].getElementsByClassName('history-time')[0].innerHTML.toLowerCase();
        var text = name + " " + url + " " + date + " " + time;
        if(text.indexOf(search) != -1) {
          elements[i].style.display = "";
        } else {
          elements[i].style.display = "none";
        }
      }
    } else {
      var elements = document.getElementsByClassName('history-item');
      for(var i = 0; i < elements.length; i++) {
        elements[i].style.display = "";
      }
    }
  });
}

document.onreadystatechange =  () => {
  if (document.readyState == "complete") {
    init();
  }
};

/*
.########.##.....##.########....########.##....##.########.
....##....##.....##.##..........##.......###...##.##.....##
....##....##.....##.##..........##.......####..##.##.....##
....##....#########.######......######...##.##.##.##.....##
....##....##.....##.##..........##.......##..####.##.....##
....##....##.....##.##..........##.......##...###.##.....##
....##....##.....##.########....########.##....##.########.
*/