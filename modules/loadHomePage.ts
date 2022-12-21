const saveFileToJsonFolder = require("./saveFileToJsonFolder");
const ppath = require('persist-path')('Ferny');
const fs = require("fs");

function loadHomePage(): Promise<any> {
    return new Promise(function(resolve) {
        let Data = {
            url: "https://duckduckgo.com",
            on: 0
        };
        
        try {
            const jsonstr = fs.readFileSync(ppath + "/json/home.json");
            Data = JSON.parse(jsonstr);
        } catch (e) {
            saveFileToJsonFolder(null, "home", JSON.stringify(Data))
        }
      
        resolve(Data);
    });
}

export {}
module.exports = loadHomePage;
