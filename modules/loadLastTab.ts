const ppath = require("persist-path")("Ferny");
const fs = require("fs");

const saveFileToJsonFolder = require("./saveFileToJsonFolder");

function loadLastTab(): Promise<string> {
    return new Promise((resolve) => {
        const defaultValue = "overlay";
        const possibleValues = ["overlay", "new-tab", "new-tab-overlay", "quit"];
        try {
            fs.readFile(ppath + "/json/lasttab.json", (err, data) => {
                if(err) {
                    resolve(defaultValue);
                } else {
                    data = data.toString();
                    if(possibleValues.includes(data)) {
                        resolve(data);
                    } else {
                        resolve(defaultValue);
                    }
                }
            });
        } catch (e) {
            saveFileToJsonFolder(null, "lasttab", defaultValue).then(() => {
                resolve(defaultValue);
            })
        }
    });
}

export {}
module.exports = loadLastTab;
