import fs from "fs";
import pp from "persist-path";
const ppath = pp("Ferny");

class DownloadCounterController {
  counter: number;

  constructor(counter = 0) {
    this.counter = counter;
  }

  increment() {
    this.counter++;
  }

  loadDownloadsFolder() {
    try {
      fs.readFile(
        ppath + "/json/downloads/downloads-folder.json",
        (err, data) => {
          if (!err) {
            return data.toString();
          }
        }
      );
    } catch (e) {}
  }

  loadDownloadCounter() {
    try {
      fs.readFile(
        ppath + "/json/downloads/download-counter.json",
        (err, data) => {
          if (!err) {
            return Number(data);
          }
        }
      );
    } catch (e) {}
  }

  saveDownloadCounter() {
    try {
      fs.writeFile(
        ppath + "/json/downloads/download-counter.json",
        String(this.counter),
        () => null
      );
    } catch (e) {}
  }
}

export { DownloadCounterController };
module.exports = { DownloadCounterController };
