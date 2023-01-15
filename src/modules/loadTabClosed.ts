import pp from "persist-path";
import fs from "fs";
import { SaveFileUtility } from "./saveFileToJsonFolder";

const ppath = pp("Ferny");

class LoadTabClosedUtility {
  static loadTabClosed(): Promise<string> {
    return new Promise((resolve) => {
      const defaultValue = "prev-tab";
      const possibleValues = ["overlay", "next-tab", "prev-tab"];
      try {
        fs.readFile(ppath + "/json/tabclosed.json", (err, data: any) => {
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
          "tabclosed",
          defaultValue
        ).then(() => {
          resolve(defaultValue);
        });
      }
    });
  }
}

export { LoadTabClosedUtility };
module.exports = { LoadTabClosedUtility };
