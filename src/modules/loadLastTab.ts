import pp from "persist-path";
import fs from "fs";
import { SaveFileUtility } from "./saveFileToJsonFolder";

const ppath = pp("Ferny");

class LoadLastTabUtility {
  static loadLastTab(): Promise<string> {
    return new Promise((resolve) => {
      const defaultValue = "overlay";
      const possibleValues = ["overlay", "new-tab", "new-tab-overlay", "quit"];
      try {
        fs.readFile(ppath + "/json/lasttab.json", (err, data: any) => {
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
          "lasttab",
          defaultValue
        ).then(() => {
          resolve(defaultValue);
        });
      }
    });
  }
}

export { LoadLastTabUtility };
module.exports = { LoadLastTabUtility };
