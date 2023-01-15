import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";
import { MoreSubMenuBuilder } from "./MoreSubMenuBuilder";

class MoreSideMenuBuilder extends SideMenuBuilder {
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

  getMoreSubMenu(hasActiveTab: boolean) {
    const moreSubMenuBuilder = new MoreSubMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    moreSubMenuBuilder.createList(hasActiveTab);
    return moreSubMenuBuilder.getList();
  }

  getSideMenuItem(hasActiveTab: boolean) {
    return new SideMenuItem({
      label: "More",
      icon: this.getIconPath("/assets/imgs/icons16/more.png"),
      submenu: this.getMoreSubMenu(hasActiveTab),
    });
  }
}

export { MoreSideMenuBuilder };
module.exports = { MoreSideMenuBuilder };
