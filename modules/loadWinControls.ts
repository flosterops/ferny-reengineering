const ppath = require("persist-path")("Ferny");
const fs = require("fs");

const saveFileToJsonFolder = require("./saveFileToJsonFolder");

interface IWindowControls {
    systemTitlebar: boolean;
    [key: string]: any
}

function loadWinControls(): Promise<IWindowControls> {
    return new Promise(function(resolve) {
        const defaultValue = {
            systemTitlebar: false
        };
        try {
            fs.readFile(ppath + "/json/wincontrols.json", (err, data) => {
                if(err) {
                    resolve(defaultValue);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        } catch (e) {
            saveFileToJsonFolder(null, "wincontrols", JSON.stringify(defaultValue)).then(() => {
                resolve(defaultValue);
            });
        }
    });
}

export {}
module.exports = loadWinControls;
