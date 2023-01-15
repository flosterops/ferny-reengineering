import { EventEmitter } from "events";
import prependFile from "prepend-file";
import pp from "persist-path";
import rp from "readline-promise";
import fs from "fs";

import { SaveFileUtility } from "../saveFileToJsonFolder";
import { LoadFileUtility } from "../loadFileFromJsonFolder";
import { FSUtility } from "../checkFileExists";

import { HistoryItem } from "./HistoryItem";

const ppath = pp("Ferny");
const readlPromise = rp.default;

interface IHistoryReadline {
  id: number;
  url: string;
  time: number;
  title: string;
}

class HistoryManager extends EventEmitter {
  history: any[] = [];
  historyContainer;
  historyCounter = 0;
  historyLimiter;

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
            SaveFileUtility.saveFileToJsonFolder(
              "history",
              "history-counter",
              this.historyCounter
            );
          }
        );
      } catch (error: any) {
        SaveFileUtility.saveFileToJsonFolder(
          "history",
          "history",
          JSON.stringify(Data)
        ).then((): void => {
          SaveFileUtility.saveFileToJsonFolder(
            "history",
            "history-counter",
            this.historyCounter
          );
        });
      }
    });

    if (this.historyLimiter && this.history.length > 16) {
      this.history.pop();
      this.historyContainer.removeChild(this.historyContainer.lastChild);
    }

    this.emit("history-item-added");
  }

  loadHistory(count: number | null = null): void {
    LoadFileUtility.loadFileFromJsonFolder("history", "history-counter").then(
      (historyCounter): void => {
        this.historyCounter = historyCounter;
      }
    );

    FSUtility.checkFileExists(ppath + "/json/history/history.json").then(
      (): void => {
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
      }
    );
  }

  askClearHistory(): void {
    if (this.history.length > 0) {
      this.emit("clear-history");
    } else {
      this.emit("history-already-cleared");
    }
  }

  clearHistory(): void {
    SaveFileUtility.saveFileToJsonFolder("history", "history-counter", 0).then(
      (): void => {
        this.historyCounter = 0;
        SaveFileUtility.saveFileToJsonFolder("history", "history", "").then(
          (): void => {
            this.history = [];
            this.historyContainer.innerHTML = "";
            this.emit("history-cleared");
          }
        );
      }
    );
  }

  deleteSelectedHistory(): void {
    const arr: any[] = [];

    for (let i = 0; i < this.history.length; i++) {
      if (this.history[i].isSelected()) {
        arr.push(this.history[i].getId());
        this.historyContainer.removeChild(this.history[i].getNode());
        this.history.splice(i, 1);
        i--;
      }
    }

    if (arr.length > 0) {
      FSUtility.checkFileExists(ppath + "/json/history/history.json").then(
        (): void => {
          fs.readFile(ppath + "/json/history/history.json", (err, data) => {
            const text = data.toString();
            const lines = text.split("\n");
            SaveFileUtility.saveFileToJsonFolder("history", "history", "").then(
              (): void => {
                for (let i = 0; i < lines.length - 1; i++) {
                  const obj = JSON.parse(lines[i]);
                  if (arr.includes(obj.id)) {
                    continue;
                  }
                  fs.appendFile(
                    ppath + "/json/history/history.json",
                    lines[i] + "\n",
                    () => null
                  );
                }
              }
            );
          });
        }
      );
    }
  }

  setLimiter(bool: boolean): void {
    this.historyLimiter = bool;
    if (bool) {
      //@ts-ignore
      document.getElementById("more-history-btn").style.display = "";
      //@ts-ignore
      document.getElementById("collapse-history-btn").style.display = "none";
      this.loadHistory(16);
    } else {
      //@ts-ignore
      document.getElementById("more-history-btn").style.display = "none";
      //@ts-ignore
      document.getElementById("collapse-history-btn").style.display = "";
      this.loadHistory();
    }
  }
}

export { HistoryManager };
module.exports = { HistoryManager };
