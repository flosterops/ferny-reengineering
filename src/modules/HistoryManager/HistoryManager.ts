"use strict";

const EventEmitter = require("events");
const prependFile = require("prepend-file");
const ppath = require("persist-path")("Ferny");
const readlPromise = require("readline-promise").default;
const fs = require("fs");

const saveFileToJsonFolder = require("../saveFileToJsonFolder");
const loadFileFromJsonFolder = require("../loadFileFromJsonFolder");
const checkFileExists = require("../checkFileExists");

const HistoryItem = require("./HistoryItem");

interface IHistoryReadline {
  id: number;
  url: string;
  time: number;
  title: string;
}

class HistoryManager extends EventEmitter {
  history = [];
  historyContainer = null;
  historyCounter = 0;
  historyLimiter = true;

  constructor(historyContainer: HTMLElement) {
    super();

    this.historyContainer = historyContainer;

    this.setLimiter(true);
  }

  appendHistoryItem(
    id: number,
    url: string,
    time: number,
    title: string
  ): void {
    const historyItem = new HistoryItem(id, url, time, title);
    this.history.push(historyItem);
    this.historyContainer.appendChild(historyItem.getNode());

    this.emit("history-item-added");
  }

  insertBeforeHistoryItem(url: string): void {
    const Data = {
      id: this.historyCounter++,
      url: url,
      time: Math.floor(Date.now() / 1000),
      title: url,
    };

    const historyItem = new HistoryItem(
      Data.id,
      Data.url,
      Data.time,
      Data.title
    );
    this.history.unshift(historyItem);

    if (this.history.length <= 0) {
      this.historyContainer.appendChild(historyItem.getNode());
    } else {
      this.historyContainer.insertBefore(
        historyItem.getNode(),
        this.historyContainer.children[0]
      );
    }

    historyItem.on("title-updated", (title: string): void => {
      Data.title = title;

      try {
        prependFile(
          ppath + "/json/history/history.json",
          JSON.stringify(Data) + "\n",
          (): void => {
            saveFileToJsonFolder(
              "history",
              "history-counter",
              this.historyCounter
            );
          }
        );
      } catch (error: any) {
        saveFileToJsonFolder("history", "history", JSON.stringify(Data)).then(
          (): void => {
            saveFileToJsonFolder(
              "history",
              "history-counter",
              this.historyCounter
            );
          }
        );
      }
    });

    if (this.historyLimiter && this.history.length > 16) {
      this.history.pop();
      this.historyContainer.removeChild(this.historyContainer.lastChild);
    }

    this.emit("history-item-added");
  }

  loadHistory(count: number | null = null): void {
    loadFileFromJsonFolder("history", "history-counter").then(
      (historyCounter): void => {
        this.historyCounter = historyCounter;
      }
    );

    checkFileExists(ppath + "/json/history/history.json").then((): void => {
      this.historyContainer.innerHTML = "";

      const historyReadline = readlPromise.createInterface({
        terminal: false,
        input: fs.createReadStream(ppath + "/json/history/history.json"),
      });
      historyReadline.forEach((line: string, index: number): void => {
        const obj: IHistoryReadline = JSON.parse(line);
        if (count == null) {
          this.appendHistoryItem(obj.id, obj.url, obj.time, obj.title);
        } else {
          if (index < count) {
            this.appendHistoryItem(obj.id, obj.url, obj.time, obj.title);
          }
        }
      });
    });
  }

  askClearHistory(): void {
    if (this.history.length > 0) {
      this.emit("clear-history");
    } else {
      this.emit("history-already-cleared");
    }
  }

  clearHistory(): void {
    saveFileToJsonFolder("history", "history-counter", 0).then((): void => {
      this.historyCounter = 0;
      saveFileToJsonFolder("history", "history", "").then((): void => {
        this.history = [];
        this.historyContainer.innerHTML = "";
        this.emit("history-cleared");
      });
    });
  }

  deleteSelectedHistory(): void {
    const arr = [];

    for (let i = 0; i < this.history.length; i++) {
      if (this.history[i].isSelected()) {
        arr.push(this.history[i].getId());
        this.historyContainer.removeChild(this.history[i].getNode());
        this.history.splice(i, 1);
        i--;
      }
    }

    if (arr.length > 0) {
      checkFileExists(ppath + "/json/history/history.json").then((): void => {
        fs.readFile(ppath + "/json/history/history.json", (err, data) => {
          const text = data.toString();
          const lines = text.split("\n");
          saveFileToJsonFolder("history", "history", "").then((): void => {
            for (let i = 0; i < lines.length - 1; i++) {
              const obj = JSON.parse(lines[i]);
              if (arr.includes(obj.id)) {
                continue;
              }
              fs.appendFile(
                ppath + "/json/history/history.json",
                lines[i] + "\n"
              );
            }
          });
        });
      });
    }
  }

  setLimiter(bool: boolean): void {
    this.historyLimiter = bool;
    if (bool) {
      document.getElementById("more-history-btn").style.display = "";
      document.getElementById("collapse-history-btn").style.display = "none";
      this.loadHistory(16);
    } else {
      document.getElementById("more-history-btn").style.display = "none";
      document.getElementById("collapse-history-btn").style.display = "";
      this.loadHistory();
    }
  }
}

export {HistoryManager};
module.exports = { HistoryManager };
