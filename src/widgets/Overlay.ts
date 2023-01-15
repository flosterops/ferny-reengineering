import { Overlay } from "../modules/Overlay/Overlay";
import { tabManagerController } from "./TabManager";
import { mainWindowController, MainWindowController } from "./MainWindow";
import { appController, AppController } from "./App";

class OverlayController {
  private mainWindowController: MainWindowController;
  private appController: AppController;
  overlay: Overlay;

  constructor(
    appController: AppController,
    mainWindowController: MainWindowController
  ) {
    this.mainWindowController = mainWindowController;
    this.appController = appController;
  }

  init() {
    this.overlay = new Overlay(
      this.mainWindowController.mainWindow,
      this.appController.getAppPath()
    );

    this.overlay.on("show", () => {
      tabManagerController.tabManager.unactivateAllTabs();
    });
  }
}

const overlayController = new OverlayController(
  appController,
  mainWindowController
);

export { overlayController, OverlayController };
module.exports = { overlayController, OverlayController };
