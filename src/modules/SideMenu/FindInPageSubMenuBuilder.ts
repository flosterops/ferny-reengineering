import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";

class FindInPageSubMenuBuilder extends SideMenuBuilder {
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

  onFindNext() {
    this.mainWindowController.mainWindow.webContents.focus();
    this.mainWindowController.mainWindow.webContents.send(
      "findInPage-findNext"
    );
  }

  onFindPrevious() {
    this.mainWindowController.mainWindow.webContents.focus();
    this.mainWindowController.mainWindow.webContents.send(
      "findInPage-findPrev"
    );
  }

  createList() {
    this.addListItem(
      new SideMenuItem({
        label: "Find next",
        icon: this.getIconPath("/assets/imgs/icons16/zoom.png"),
        accelerator: "CmdOrCtrl+F",
        click: this.onFindNext,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Find previous",
        icon: this.getIconPath("/assets/imgs/icons16/prev.png"),
        accelerator: "CmdOrCtrl+Shift+F",
        click: this.onFindPrevious,
      })
    );
  }
}

export { FindInPageSubMenuBuilder };
module.exports = { FindInPageSubMenuBuilder };
