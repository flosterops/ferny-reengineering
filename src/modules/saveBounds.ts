import { SaveFileUtility } from "./saveFileToJsonFolder";
import { mainWindowController } from "../widgets/MainWindow";

class SaveBoundsUtility {
  static saveBounds() {
    const data = {
      x: mainWindowController.mainWindow.getBounds().x,
      y: mainWindowController.mainWindow.getBounds().y,
      width: mainWindowController.mainWindow.getBounds().width,
      height: mainWindowController.mainWindow.getBounds().height,
      maximize:
        mainWindowController.mainWindow.isMaximized() ||
        mainWindowController.mainWindow.isFullScreen(),
    };

    SaveFileUtility.saveFileToJsonFolder(null, "bounds", JSON.stringify(data));
  }
}

export { SaveBoundsUtility };
module.exports = { SaveBoundsUtility };
