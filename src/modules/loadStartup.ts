const ppath = require("persist-path")("Ferny");
const fs = require("fs");

import { SaveFileUtility } from "./saveFileToJsonFolder";

class LoadStartupUtility {
  static loadStartup(): Promise<string> {
    return new Promise((resolve) => {
      const defaultValue = "overlay";
      const possibleValues = ["overlay", "new-tab"];
      try {
        fs.readFile(ppath + "/json/startup.json", (err, data) => {
          if (err) {
            resolve(defaultValue);
          } else {
            data = data.toString();
            if (possibleValues.includes(data)) {
              resolve(data);
            } else {
              resolve(defaultValue);
            }
          }
        });
      } catch (e) {
        SaveFileUtility.saveFileToJsonFolder(
          null,
          "startup",
          defaultValue
        ).then(() => {
          resolve(defaultValue);
        });
      }
    });
  }
}

export { LoadStartupUtility };
module.exports = { LoadStartupUtility };
