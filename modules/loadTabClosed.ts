const ppath = require("persist-path")("Ferny");
const fs = require("fs");

const saveFileToJsonFolder = require("./saveFileToJsonFolder");

function loadTabClosed(): Promise<string> {
    return new Promise((resolve) => {
        const defaultValue = "prev-tab";
        const possibleValues = ["overlay", "next-tab", "prev-tab"];
        try {
            fs.readFile(ppath + "/json/tabclosed.json", (err, data) => {
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
            saveFileToJsonFolder(null, "tabclosed", defaultValue).then(() => {
                resolve(defaultValue);
            });
        }
    });
}

export {}
module.exports = loadTabClosed;
