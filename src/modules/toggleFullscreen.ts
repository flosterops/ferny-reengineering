import { tabManagerController } from "../widgets/TabManager";
import { mainWindowController } from "../widgets/MainWindow";
import { overlayController } from "../widgets/Overlay";

class ToggleFullscreen {
  static toggleFullscreen() {
    const isFullscreen = mainWindowController.mainWindow.isFullScreen();

    mainWindowController.mainWindow.setFullScreen(!isFullscreen);
    tabManagerController.tabManager.setFullscreen(isFullscreen);
    overlayController.overlay.setFullscreen(isFullscreen);
  }
}

export { ToggleFullscreen };
module.exports = { ToggleFullscreen };
