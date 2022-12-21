const loadFileFromJsonFolder = require("../modules/loadFileFromJsonFolder.js");

interface ILoadBounds {
    x: null | number;
    y: null | number;
    width: number;
    height: number;
    maximize: boolean;
    [key: string]: any;
}

function loadBounds(): Promise<ILoadBounds> {
    return new Promise(function(resolve) {
        let Data = {
            x: null,
            y: null,
            width: 1150,
            height: 680,
            maximize: false
        };

        loadFileFromJsonFolder(null, "bounds").then((data) => {
            if(data.toString().length > 0) {
                Data = JSON.parse(data);
            }
            resolve(Data);
        });
    }); 
}

export {}
module.exports = loadBounds;
