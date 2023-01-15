import { SideMenuBuilder } from "./SideMenuBuilder";
import { app } from "electron";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { ActiveMoveTabSubMenuBuilder } from "./ActiveMoveTabSubMenuBuilder";
import { DownloadsController } from "../downloads";

class ActiveTabSubMenuBuilder extends SideMenuBuilder {
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

  onGoBackClick() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().goBack();
    }
  }

  onForwardClick() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().goForward();
    }
  }

  onReloadClick() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().reload();
    }
  }

  onReloadIgnoringCache() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().reloadIgnoringCache();
    }
  }

  onDuplicateClick() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().duplicate();
    }
  }

  onCopyUrl() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().copyURL();
    }
  }

  onGoHome() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().goHome();
    }
  }

  onCloseTabOnTheRight() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().closeToTheRight();
    }
  }

  onCloseOthers() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().closeOthers();
    }
  }

  onCloseTab() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().close();
    }
  }

  getActiveMoveTabSubMenu() {
    const activeMoveTabSubMenuBuilder = new ActiveMoveTabSubMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    activeMoveTabSubMenuBuilder.createList();
    return activeMoveTabSubMenuBuilder.getList();
  }

  createList() {
    this.addListItem(
      new SideMenuItem({
        label: "Back",
        accelerator: "Alt+Left",
        icon: this.getIconPath("/assets/imgs/icons16/back.png"),
        click: this.onGoBackClick,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Forward",
        accelerator: "Alt+Right",
        icon: this.getIconPath("/assets/imgs/icons16/forward.png"),
        click: this.onForwardClick,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Reload",
        icon: app.getAppPath() + "/assets/imgs/icons16/reload.png",
        accelerator: "F5",
        click: this.onReloadClick,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Reload ignoring cache",
        icon: app.getAppPath() + "/assets/imgs/icons16/db-reload.png",
        accelerator: "CmdOrCtrl+Shift+F5",
        click: this.onReloadIgnoringCache,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Duplicate",
        icon: app.getAppPath() + "/assets/imgs/icons16/copy.png",
        accelerator: "CmdOrCtrl+Shift+D",
        click: this.onDuplicateClick,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Copy URL",
        icon: app.getAppPath() + "/assets/imgs/icons16/link.png",
        accelerator: "CmdOrCtrl+Shift+C",
        click: this.onCopyUrl,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Go home",
        icon: app.getAppPath() + "/assets/imgs/icons16/home.png",
        accelerator: "CmdOrCtrl+Shift+H",
        click: this.onGoHome,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Move tab",
        icon: app.getAppPath() + "/assets/imgs/icons16/move-horizontal.png",
        submenu: this.getActiveMoveTabSubMenu(),
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Close tabs to the right",
        icon: app.getAppPath() + "/assets/imgs/icons16/swipe-right.png",
        click: this.onCloseTabOnTheRight,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Close others",
        icon: app.getAppPath() + "/assets/imgs/icons16/swipe-both.png",
        accelerator: "CmdOrCtrl+Shift+W",
        click: this.onCloseOthers,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Close tab",
        icon: app.getAppPath() + "/assets/imgs/icons16/close.png",
        accelerator: "CmdOrCtrl+W",
        click: this.onCloseTab,
      })
    );
  }
}

export { ActiveTabSubMenuBuilder };
module.exports = { ActiveTabSubMenuBuilder };
