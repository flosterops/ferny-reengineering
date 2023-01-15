"use strict";

const EventEmitter = require("events");
const GetAvColor = require("color.js");
const { ipcRenderer, clipboard } = require("electron");
const parsePath = require("parse-path");
const fileExtension = require("file-extension");

const extToImagePath = require("../extToImagePath");
const rgbToRgbaString = require("../rgbToRgbaString");
const epochToDate = require("../epochToDate");
const epochToTime = require("../epochToTime");

class HistoryItem extends EventEmitter {
  history = [];
  node: HTMLButtonElement | null = null;
  url = null;
  id = null;
  time = null;
  title = null;

  constructor(id: number, url: string, time: number, title: string) {
    super();

    this.id = id;
    this.url = url;
    this.time = time;
    this.title = title;

    this.node = document.createElement("button");
    this.node.classList.add("history-item");
    this.node.name = String(id);
    this.node.id = `history-${id}`;
    this.node.innerHTML = `
            <label class='history-title'>${title}</label>
            <label class='history-url'>${url}</label>
            <label class="history-time">${epochToDate(time)} / ${epochToTime(
      time
    )}</label>
        `;
    this.node.onclick = (): void => {
      this.open();
    };
    this.node.onauxclick = (event: MouseEvent): void => {
      event.preventDefault();
      if (event.which === 2) {
        ipcRenderer.send("tabManager-addTab", url, false);
      }
    };
    this.node.onkeyup = (event: KeyboardEvent) => {
      event.preventDefault();
    };

    const historyIcon = document.createElement("img");
    historyIcon.classList.add("history-icon");
    if (parsePath(url).protocol === "file") {
      historyIcon.src = extToImagePath(fileExtension(url));
      const fileName = url.replace(/^.*[\\\/]/, "");
      this.setTitle(fileName);
    } else {
      historyIcon.src = "http://www.google.com/s2/favicons?domain=" + url;
      historyIcon.onerror = () => {
        historyIcon.src =
          __dirname + "/../../assets/imgs/old-icons16/history.png";
        this.updateHistoryIconColor();
      };
      if (title.substring(0, 4) == "http") {
        this.loadTitle().then((text: string): void => {
          this.setTitle(text);
        });
      }
    }
    this.node.appendChild(historyIcon);
    this.updateHistoryIconColor();

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("history-checkbox");
    checkbox.onclick = (event: MouseEvent): void => {
      event.stopPropagation();
    };
    this.node.appendChild(checkbox);

    const copyBtn = document.createElement("button");
    copyBtn.classList.add("history-copy");
    copyBtn.title = "Copy URL";
    copyBtn.innerHTML = `<img name="copy-12" class="theme-icon">`;
    copyBtn.onclick = (event: MouseEvent): void => {
      event.stopPropagation();
      this.copyURL();
    };
    this.node.appendChild(copyBtn);
  }

  updateHistoryIconColor(): void {
    const icon = this.node.querySelector<HTMLButtonElement>(".history-icon");
    const color = new GetAvColor(icon);
    color.mostUsed((result) => {
      if (Array.isArray(result)) {
        (icon.parentNode as HTMLElement).style.backgroundColor =
          rgbToRgbaString(result[0]);
      } else {
        (icon.parentNode as HTMLElement).style.backgroundColor =
          rgbToRgbaString(result);
      }
    });
  }

  loadTitle() {
    return new Promise((resolve): void => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = (): void => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          resolve(xhr.responseText);
        }
      };
      xhr.open("GET", "http://textance.herokuapp.com/title/" + this.url, true);
      xhr.send(null);
    });
  }

  open(): void {
    ipcRenderer.send("tabManager-addTab", this.url, true);
  }

  getNode(): HTMLButtonElement {
    return this.node;
  }

  getId(): number {
    return this.id;
  }

  getURL(): string {
    return this.url;
  }

  getTime(): number {
    return this.time;
  }

  getTitle(): string {
    return this.title;
  }

  setTitle(text: string): void {
    this.title = text;
    this.node.getElementsByClassName("history-title")[0].innerHTML = text;
    this.emit("title-updated", text);
  }

  isSelected(): boolean {
    return this.node.querySelector<HTMLInputElement>(".history-checkbox")
      .checked;
  }

  copyURL(): void {
    clipboard.writeText(this.url);
  }
}

export {};
module.exports = HistoryItem;
