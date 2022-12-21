const fs = require("fs");
const path = require("path");

const loadFileFromJsonFolder = require("../modules/loadFileFromJsonFolder.js");

interface ITheme {
    theme: any;
    dark: boolean
}

function loadTheme(name: string): Promise<ITheme> {
    return new Promise(function(resolve) {
        let theme = {
            name: "ferny",
            dark: false
        };

        if(name) {
            theme.name = name;
        }

        loadFileFromJsonFolder(null, "theme").then((data) => {
            if(data.toString().length > 0) {
                theme = JSON.parse(data);
            }
            fs.readFile(path.join(__dirname, "/../assets/themes/", theme.name + ".json"), (err, objStr) => {
                resolve({ theme: JSON.parse(objStr), dark: theme.dark });
            });
        });
    }); 
}

export {}
module.exports = loadTheme;
