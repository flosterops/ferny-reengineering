import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";
import { FindInPageSubMenuBuilder } from "./FindInPageSubMenuBuilder";

class PageSubMenuBuilder extends SideMenuBuilder {
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

  onDownloadPageClick() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().downloadPage();
    }
  }

  onViewPageSource() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().viewPageSource();
    }
  }

  onDevTools() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().openDevTools();
    }
  }

  getFindInPageSubMenu() {
    const findInPageSubMenuBuilder = new FindInPageSubMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    findInPageSubMenuBuilder.createList();
    return findInPageSubMenuBuilder.getList();
  }

  createList() {
    this.addListItem(
      new SideMenuItem({
        label: "Find in page",
        icon: this.getIconPath("/assets/imgs/icons16/zoom.png"),
        submenu: this.getFindInPageSubMenu(),
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Certificate info",
        icon: this.getIconPath("/assets/imgs/icons16/license.png"),
        enabled: false,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Download page",
        icon: this.getIconPath("/assets/imgs/icons16/download.png"),
        accelerator: "CmdOrCtrl+Shift+S",
        click: this.onDownloadPageClick,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "View page source",
        icon: this.getIconPath("/assets/imgs/icons16/code.png"),
        accelerator: "CmdOrCtrl+U",
        click: this.onViewPageSource,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Developer tools",
        icon: this.getIconPath("/assets/imgs/icons16/tool.png"),
        accelerator: "F12",
        click: this.onDevTools,
      })
    );
  }
}

export { PageSubMenuBuilder };
module.exports = { PageSubMenuBuilder };
