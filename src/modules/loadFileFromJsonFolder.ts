import fs from "fs";
import pp from "persist-path";

import { FSUtility } from "./checkFileExists";

const ppath = pp("Ferny");

class LoadFileUtility {
  static checkDirExists(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      fs.exists(path, (exists: boolean) => {
        if (exists) {
          resolve(true);
        } else {
          fs.mkdir(path, (err) => {
            if (!err) {
              resolve(true);
            }
          });
        }
      });
    });
  }

  static loadFileFromJsonFolder(
    subfolder: string | null,
    fileName: string
  ): Promise<any> {
    return new Promise((resolve) => {
      LoadFileUtility.checkDirExists(ppath).then(() => {
        LoadFileUtility.checkDirExists(ppath + "/json").then(() => {
          if (subfolder == null) {
            FSUtility.checkFileExists(
              ppath + "/json/" + fileName + ".json"
            ).then(() => {
              fs.readFile(
                ppath + "/json/" + fileName + ".json",
                (err, data) => {
                  if (!err) {
                    resolve(data);
                  }
                }
              );
            });
          } else {
            LoadFileUtility.checkDirExists(ppath + "/json/" + subfolder).then(
              () => {
                FSUtility.checkFileExists(
                  ppath + "/json/" + subfolder + "/" + fileName + ".json"
                ).then(() => {
                  fs.readFile(
                    ppath + "/json/" + subfolder + "/" + fileName + ".json",
                    (err, data) => {
                      if (!err) {
                        resolve(data);
                      }
                    }
                  );
                });
              }
            );
          }
        });
      });
    });
  }
}

export { LoadFileUtility };
module.exports = { LoadFileUtility };
