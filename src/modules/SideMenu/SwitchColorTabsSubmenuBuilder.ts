import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";

class SwitchColorTabsSubmenuBuilder extends SideMenuBuilder {
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

  createList() {
    this.addListItem(
      new SideMenuItem({
        label: "Green",
        icon: this.getIconPath("/assets/imgs/icons16/one.png"),
        accelerator: "CmdOrCtrl+Shift+1",
        click: () => this.tabManagerController.tabManager.switchTabGroup(0),
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Blue",
        accelerator: "CmdOrCtrl+Shift+2",
        click: () => this.tabManagerController.tabManager.switchTabGroup(1),
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Orange",
        accelerator: "CmdOrCtrl+Shift+3",
        click: () => this.tabManagerController.tabManager.switchTabGroup(2),
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        enabled: false,
        label: "Incognito",
        icon: this.getIconPath("/assets/imgs/icons16/incognito.png"),
        accelerator: "CmdOrCtrl+I",
        click: () => undefined,
      })
    );
  }
}

export { SwitchColorTabsSubmenuBuilder };
module.exports = { SwitchColorTabsSubmenuBuilder };
