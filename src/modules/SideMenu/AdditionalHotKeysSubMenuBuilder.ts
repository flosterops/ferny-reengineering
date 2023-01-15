import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";

class AdditionalHotKeysSubMenuBuilder extends SideMenuBuilder {
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

  onNewTab() {
    this.tabManagerController.tabManager.newTab();
  }

  onReload() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().reload();
    }
  }

  onReloadIgnoringCache() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().reloadIgnoringCache();
    }
  }

  onRedo() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().redo();
    } else {
      this.overlayController.overlay.redo();
    }
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

  onDeveloperTools() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().openDevTools();
    }
  }

  createList(hasActiveTab: boolean) {
    this.addListItem(
      new SideMenuItem({
        label: "New tab",
        icon: this.getIconPath("/assets/imgs/icons16/create.png"),
        accelerator: "CmdOrCtrl+N",
        click: this.onNewTab,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Reload",
        enabled: hasActiveTab,
        icon: this.getIconPath("/assets/imgs/icons16/reload.png"),
        accelerator: "CmdOrCtrl+R",
        click: this.onReload,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Reload ignoring cache",
        enabled: hasActiveTab,
        icon: this.getIconPath("/assets/imgs/icons16/db-reload.png"),
        accelerator: "CmdOrCtrl+Shift+R",
        click: this.onReloadIgnoringCache,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Redo",
        icon: this.getIconPath("/assets/imgs/icons16/redo.png"),
        accelerator: "CmdOrCtrl+Y",
        click: this.onRedo,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Find next",
        enabled: hasActiveTab,
        icon: this.getIconPath("/assets/imgs/icons16/zoom.png"),
        accelerator: "F3",
        click: this.onFindNext,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Find previous",
        enabled: hasActiveTab,
        icon: this.getIconPath("/assets/imgs/icons16/prev.png"),
        accelerator: "F2",
        click: this.onFindPrevious,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Developer tools",
        enabled: hasActiveTab,
        icon: this.getIconPath("/assets/imgs/icons16/tool.png"),
        accelerator: "CmdOrCtrl+Shift+I",
        click: this.onDeveloperTools,
      })
    );
  }
}

export { AdditionalHotKeysSubMenuBuilder };
module.exports = { AdditionalHotKeysSubMenuBuilder };
