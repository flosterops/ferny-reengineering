const ppath = require("persist-path")("Ferny");
const fs = require("fs");

import { SaveFileUtility } from "./saveFileToJsonFolder";

export interface IWindowControls {
  systemTitlebar: boolean;
  [key: string]: any;
}

class LoadWinControlsUtility {
  static loadWinControls(): Promise<IWindowControls> {
    return new Promise(function (resolve) {
      const defaultValue = {
        systemTitlebar: false,
      };
      try {
        fs.readFile(ppath + "/json/wincontrols.json", (err, data) => {
          if (err) {
            resolve(defaultValue);
          } else {
            resolve(JSON.parse(data));
          }
        });
      } catch (e) {
        SaveFileUtility.saveFileToJsonFolder(
          null,
          "wincontrols",
          JSON.stringify(defaultValue)
        ).then(() => {
          resolve(defaultValue);
        });
      }
    });
  }
}

export { LoadWinControlsUtility };
module.exports = { LoadWinControlsUtility };
