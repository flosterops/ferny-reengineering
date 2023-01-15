const ppath = require("persist-path")("Ferny");
const fs = require("fs");

import { SaveFileUtility } from "./saveFileToJsonFolder";

class LoadSearchEngineUtility {
  static loadSearchEngine(): Promise<string> {
    return new Promise((resolve) => {
      const defaultValue = "duckduckgo";
      const possibleValues = [
        "duckduckgo",
        "google",
        "bing",
        "wikipedia",
        "yahoo",
        "yandex",
        "mailru",
        "baidu",
        "naver",
        "qwant",
        "youtube",
        "youtube",
        "ecosia",
        "twitter",
        "amazon",
        "twitch",
        "github",
        "wolfram",
        "ebay",
      ];
      try {
        fs.readFile(ppath + "/json/search-engine.json", (err, data) => {
          if (err) {
            resolve(defaultValue);
          } else {
            data = data.toString();
            if (possibleValues.includes(data)) {
              resolve(data);
            } else {
              resolve(defaultValue);
            }
          }
        });
      } catch (e) {
        SaveFileUtility.saveFileToJsonFolder(
          null,
          "search-engine",
          defaultValue
        ).then(() => {
          resolve(defaultValue);
        });
      }
    });
  }
}

export { LoadSearchEngineUtility };
module.exports = { LoadSearchEngineUtility };
