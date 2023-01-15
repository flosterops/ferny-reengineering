import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";
import { ShowSettingsWindowUtility } from "../showSettingsWindow";

class SettingsSideMenuBuilder extends SideMenuBuilder {
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

  onSettings() {
    ShowSettingsWindowUtility.showSettingsWindow();
  }

  getSideMenuItem() {
    return new SideMenuItem({
      label: "Settings",
      icon: this.getIconPath("/assets/imgs/icons16/settings.png"),
      accelerator: "CmdOrCtrl+,",
      click: this.onSettings,
    });
  }
}

export { SettingsSideMenuBuilder };
module.exports = { SettingsSideMenuBuilder };
