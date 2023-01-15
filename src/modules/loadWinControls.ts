import pp from "persist-path";
import fs from "fs";

import { SaveFileUtility } from "./saveFileToJsonFolder";

export interface IWindowControls {
  systemTitlebar: boolean;
  [key: string]: any;
}

const ppath = pp("Ferny");

class LoadWinControlsUtility {
  static loadWinControls(): Promise<IWindowControls> {
    return new Promise(function (resolve) {
      const defaultValue = {
        systemTitlebar: false,
      };
      try {
        fs.readFile(ppath + "/json/wincontrols.json", (err, data: any) => {
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
