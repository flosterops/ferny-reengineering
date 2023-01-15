import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";
import { app } from "electron";
import { HelpSubMenuBuilder } from "./HelpSubMenuBuilder";

class HelpSideMenuBuilder extends SideMenuBuilder {
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

  getHelpSubMenu() {
    const helpSubMenuBuilder = new HelpSubMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    helpSubMenuBuilder.createList();
    return helpSubMenuBuilder.getList();
  }

  getSideMenuItem() {
    return new SideMenuItem({
      label: "Help",
      icon: app.getAppPath() + "/assets/imgs/icons16/help.png",
      submenu: this.getHelpSubMenu(),
    });
  }
}

export { HelpSideMenuBuilder };
module.exports = { HelpSideMenuBuilder };
