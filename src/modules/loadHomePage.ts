import { SaveFileUtility } from "./saveFileToJsonFolder";
import pp from "persist-path";
import fs from "fs";

const ppath = pp("Ferny");

class LoadHomePageUtility {
  static loadHomePage(): Promise<any> {
    return new Promise(function (resolve) {
      let Data = {
        url: "https://duckduckgo.com",
        on: 0,
      };

      try {
        const jsonstr: any = fs.readFileSync(ppath + "/json/home.json");
        Data = JSON.parse(jsonstr);
      } catch (e) {
        SaveFileUtility.saveFileToJsonFolder(
          null,
          "home",
          JSON.stringify(Data)
        );
      }

      resolve(Data);
    });
  }
}

export { LoadHomePageUtility };
module.exports = { LoadHomePageUtility };
