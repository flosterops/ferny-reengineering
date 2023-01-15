import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";

class DeveloperDangerSubMenuBuilder extends SideMenuBuilder {
  list: SideMenuItem[] & ISeparator[] = [];
  appController: AppController;
  mainWindowController: MainWindowController;
  overlayController: OverlayController;
  tabManagerController: TabManagerController;
  autoUpdaterController: AutoUpdaterController;
  downloadsController: DownloadsController;

  constructor(
    appController: AppController,
    mainWindowController: MainWindowController,
    overlayController: OverlayController,
    tabManagerController: TabManagerController,
    downloadsController: DownloadsController
  ) {
    super(
      appController,
      mainWindowController,
      overlayController,
      tabManagerController,
      downloadsController
    );
  }

  onDevelopModeMainWindow() {
    this.mainWindowController.mainWindow.webContents.openDevTools();
  }

  onDeveloperModeOverlay() {
    this.overlayController.overlay.openDevTools();
  }

  createList() {
    this.addListItem(
      new SideMenuItem({
        label: "Developer mode (Main window)",
        icon: this.getIconPath("/assets/imgs/icons16/window.png"),
        accelerator: "CmdOrCtrl+Shift+F12",
        click: this.onDevelopModeMainWindow,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Developer mode (Overlay)",
        icon: this.getIconPath("/assets/imgs/icons16/overlay.png"),
        accelerator: "CmdOrCtrl+Shift+F11",
        click: this.onDeveloperModeOverlay,
      })
    );
  }
}

export { DeveloperDangerSubMenuBuilder };
module.exports = { DeveloperDangerSubMenuBuilder };
