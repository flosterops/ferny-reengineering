import { SideMenuBuilder } from "./SideMenuBuilder";
import { dialog } from "electron";
import { ShowSettingsWindowUtility } from "../showSettingsWindow";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";
import { AdditionalHotKeysSubMenuBuilder } from "./AdditionalHotKeysSubMenuBuilder";
import { DeveloperDangerSubMenuBuilder } from "./DeveloperDangerSubMenuBuilder";

class MoreSubMenuBuilder extends SideMenuBuilder {
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

  onClearBrowsingData() {
    ShowSettingsWindowUtility.showSettingsWindow("clear-browsing-data");
  }

  onOpenFiles() {
    dialog
      .showOpenDialog(this.mainWindowController.mainWindow, {
        properties: ["multiSelections"],
      })
      .then(({ filePaths }) => {
        filePaths.forEach((item) => {
          this.tabManagerController.tabManager.addTab("file://" + item, true);
        });
      });
  }

  onShowOverlay() {
    this.overlayController.overlay.show();
  }

  onOpenSearch() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.overlayController.overlay.goToSearch(
        this.tabManagerController.tabManager.getActiveTab().getURL()
      );
    } else {
      this.overlayController.overlay.goToSearch();
    }
  }

  getAdditionalHotKeysSubMenu(hasActiveTab: boolean) {
    const additionalHotKeysSubMenuBuilder = new AdditionalHotKeysSubMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    additionalHotKeysSubMenuBuilder.createList(hasActiveTab);
    return additionalHotKeysSubMenuBuilder.getList();
  }

  getDeveloperDangerSubMenu() {
    const developerDangerSubMenuBuilder = new DeveloperDangerSubMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    developerDangerSubMenuBuilder.createList();
    return developerDangerSubMenuBuilder.getList();
  }

  createList(hasActiveTab: boolean) {
    this.addListItem(
      new SideMenuItem({
        label: "Clear browsing data",
        icon: this.getIconPath("/assets/imgs/icons16/clean.png"),
        accelerator: "CmdOrCtrl+Shift+Delete",
        click: this.onClearBrowsingData,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Open files",
        icon: this.getIconPath("/assets/imgs/icons16/folder.png"),
        accelerator: "CmdOrCtrl+O",
        click: this.onOpenFiles,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Show overlay",
        enabled: hasActiveTab,
        icon: this.getIconPath("/assets/imgs/icons16/overlay.png"),
        accelerator: "F1",
        click: this.onShowOverlay,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Open search",
        icon: this.getIconPath("/assets/imgs/icons16/zoom.png"),
        accelerator: "F6",
        click: this.onOpenSearch,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Additional hotkeys",
        icon: this.getIconPath("/assets/imgs/icons16/key.png"),
        submenu: this.getAdditionalHotKeysSubMenu(hasActiveTab),
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Developer [Danger]",
        icon: this.getIconPath("/assets/imgs/icons16/code.png"),
        submenu: this.getDeveloperDangerSubMenu(),
      })
    );
  }
}

export { MoreSubMenuBuilder };
module.exports = { MoreSubMenuBuilder };
