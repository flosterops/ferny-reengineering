import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { ActiveTabSubMenuBuilder } from "./ActiveTabSubMenuBuilder";
import { DownloadsController } from "../downloads";

class ActiveTabSideMenuBuilder extends SideMenuBuilder {
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

  getActiveTabSubMenu() {
    const activeTabSubMenuBuilder = new ActiveTabSubMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    activeTabSubMenuBuilder.createList();
    return activeTabSubMenuBuilder.getList();
  }

  getSideMenuItem(hasActiveTab: boolean) {
    return new SideMenuItem({
      label: "Active tab",
      enabled: hasActiveTab,
      icon: this.getIconPath("/assets/imgs/icons16/tab.png"),
      submenu: this.getActiveTabSubMenu(),
    });
  }
}

export { ActiveTabSideMenuBuilder };
module.exports = { ActiveTabSideMenuBuilder };
