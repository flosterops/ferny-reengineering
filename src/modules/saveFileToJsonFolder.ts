const fs = require("fs");
const ppath = require("persist-path")("Ferny");

class SaveFileUtility {
  static saveFileToJsonFolder(
    subfolder: string | null,
    fileName: string | number,
    data?: any
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      SaveFileUtility.checkDirExists(ppath)
        .then(() => {
          SaveFileUtility.checkDirExists(ppath + "/json").then(() => {
            if (subfolder == null) {
              fs.writeFile(
                ppath + "/json/" + fileName + ".json",
                data,
                (err) => {
                  if (!err) {
                    resolve(true);
                  }
                }
              );
            } else {
              SaveFileUtility.checkDirExists(ppath + "/json/" + subfolder).then(
                () => {
                  fs.writeFile(
                    ppath + "/json/" + subfolder + "/" + fileName + ".json",
                    data,
                    (err) => {
                      if (!err) {
                        resolve(true);
                      }
                    }
                  );
                }
              );
            }
          });
        })
        .catch(() => {
          reject(false);
        });
    });
  }

  static checkDirExists(path: string): Promise<boolean> {
    return new Promise((resolve) => {
      fs.exists(path, (exists) => {
        if (exists) {
          resolve(true);
        } else {
          fs.mkdir(path, (err) => {
            if (err) {
              throw err;
            } else {
              resolve(true);
            }
          });
        }
      });
    });
  }
}

export { SaveFileUtility };
module.exports = { SaveFileUtility };
