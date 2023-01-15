import { shell } from "electron";
import { DownloadsController } from "./downloads";
import { appController } from "../widgets/App";

class OpenDownloadsFolderUtility {
  static openDownloadsFolder(downloadsController: DownloadsController) {
    switch (downloadsController.downloadsFolder) {
      case "?ask?":
        return shell.openExternal(appController.app.getPath("downloads"));
      case "?downloads?":
        return shell.openExternal(appController.app.getPath("downloads"));
      case "?desktop?":
        return shell.openExternal(appController.app.getPath("desktop"));
      default:
        return shell.openExternal(downloadsController.downloadsFolder);
    }
  }
}

export { OpenDownloadsFolderUtility };
module.exports = { OpenDownloadsFolderUtility };
