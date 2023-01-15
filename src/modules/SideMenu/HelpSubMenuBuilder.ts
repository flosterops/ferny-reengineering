import { SideMenuBuilder } from "./SideMenuBuilder";
import { ShowAboutWindowUtility } from "../showAboutWindow";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";

class HelpSubMenuBuilder extends SideMenuBuilder {
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

  onCheckForUpdates() {
    this.autoUpdaterController.checkForUpdates();
  }

  onAbout() {
    ShowAboutWindowUtility.showAboutWindow();
  }

  onReportAnIssue() {
    this.tabManagerController.tabManager.addTab(
      "https://github.com/ModuleArt/ferny/issues",
      true
    );
  }

  createList() {
    this.addListItem(
      new SideMenuItem({
        label: "Check for updates",
        icon: this.getIconPath("/assets/imgs/icons16/reload.png"),
        accelerator: "CmdOrCtrl+Shift+U",
        click: this.onCheckForUpdates,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "About",
        icon: this.getIconPath("/assets/imgs/icons16/info.png"),
        accelerator: "CmdOrCtrl+Shift+F1",
        click: this.onAbout,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Report an issue",
        icon: this.getIconPath("/assets/imgs/icons16/bug-report.png"),
        accelerator: "CmdOrCtrl+Shift+I",
        click: this.onReportAnIssue,
      })
    );
  }
}

export { HelpSubMenuBuilder };
module.exports = { HelpSubMenuBuilder };
