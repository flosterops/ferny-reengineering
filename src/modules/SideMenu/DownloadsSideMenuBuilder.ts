import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";
import { DownloadsSubMenuBuilder } from "./DownloadsSubMenuBuilder";

class DownloadsSideMenuBuilder extends SideMenuBuilder {
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

  private getDownloadsSubMenu() {
    const downloadsSubMenuBuilder = new DownloadsSubMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    downloadsSubMenuBuilder.createList();
    return downloadsSubMenuBuilder.getList();
  }

  getSideMenuItem() {
    return new SideMenuItem({
      label: "Downloads",
      icon: this.getIconPath("/assets/imgs/icons16/download.png"),
      submenu: this.getDownloadsSubMenu(),
    });
  }
}

export { DownloadsSideMenuBuilder };
module.exports = { DownloadsSideMenuBuilder };
