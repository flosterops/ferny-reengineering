const fs = require("fs");
const ppath = require("persist-path")("Ferny");

const checkFileExists = require(__dirname + "/checkFileExists.js");

function checkDirExists(path: string): Promise<boolean> {
    return new Promise((resolve) => {
        fs.exists(path, (exists) => {
            if(exists) {
                resolve(true);
            } else {
                fs.mkdir(path, (err) => {
                    if(!err) {
                        resolve(true);
                    }
                });
            }
        });
    });
}

function loadFileFromJsonFolder(subfolder: string | null, fileName: string): Promise<any> {
    return new Promise((resolve) => {
        checkDirExists(ppath).then(() => {
            checkDirExists(ppath + "/json").then(() => {
                if(subfolder == null) {
                    checkFileExists(ppath + "/json/" + fileName + ".json").then(() => {
                        fs.readFile(ppath + "/json/" + fileName + ".json", (err, data) => {
                            if(!err) {
                                resolve(data);
                            }
                        });
                    });
                } else {
                    checkDirExists(ppath + "/json/" + subfolder).then(() => {
                        checkFileExists(ppath + "/json/" + subfolder + "/" + fileName + ".json").then(() => {
                            fs.readFile(ppath + "/json/" + subfolder + "/" + fileName + ".json", (err, data) => {
                                if(!err) {
                                    resolve(data);
                                }
                            });
                        });
                    });
                }
            });
        });
    });
}

export {}
module.exports = loadFileFromJsonFolder;
