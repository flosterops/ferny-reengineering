const fs = require("fs");

class FSUtility {
  static checkFileExists(path): Promise<boolean> {
    return new Promise((resolve) => {
      fs.exists(path, (exists: boolean) => {
        if (exists) {
          resolve(true);
        } else {
          fs.writeFile(path, "", () => {
            resolve(false);
          });
        }
      });
    });
  }
}

export { FSUtility };
module.exports = FSUtility;
