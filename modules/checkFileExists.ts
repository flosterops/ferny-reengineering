const fs = require("fs");

function checkFileExists(path): Promise<boolean> {
    return new Promise((resolve) => {
        fs.exists(path, (exists: boolean) => {
            if(exists) {
                resolve(true);
            } else {
                fs.writeFile(path, "", () => {
                    resolve(false);
                });
            }
        });
    });
}

export {}
module.exports = checkFileExists;
