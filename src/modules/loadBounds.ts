import { LoadFileUtility } from "./loadFileFromJsonFolder";

interface ILoadBounds {
  x: null | number;
  y: null | number;
  width: number;
  height: number;
  maximize: boolean;
  [key: string]: any;
}

class BoundsUtility {
  static loadBounds(): Promise<ILoadBounds> {
    return new Promise(function (resolve) {
      let Data = {
        x: null,
        y: null,
        width: 1150,
        height: 680,
        maximize: false,
      };

      LoadFileUtility.loadFileFromJsonFolder(null, "bounds").then((data) => {
        if (data.toString().length > 0) {
          Data = JSON.parse(data);
        }
        resolve(Data);
      });
    });
  }
}

export { BoundsUtility };
module.exports = { BoundsUtility };
