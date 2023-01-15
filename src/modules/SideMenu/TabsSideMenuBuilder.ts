import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { SwitchTabsSubmenuBuilder } from "./SwitchTabsSubmenuBuilder";
import { SwitchColorTabsSubmenuBuilder } from "./SwitchColorTabsSubmenuBuilder";
import { DownloadsController } from "../downloads";

class TabsSideMenuBuilder extends SideMenuBuilder {
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

  getSwitchTabsSubmenu() {
    const switchTabsSubmenuBuilder = new SwitchTabsSubmenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    switchTabsSubmenuBuilder.createList();
    return switchTabsSubmenuBuilder.getList();
  }

  getSwitchColorTabsSubmenu() {
    const switchColorTabsSubmenuBuilder = new SwitchColorTabsSubmenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    switchColorTabsSubmenuBuilder.createList();
    return switchColorTabsSubmenuBuilder.getList();
  }

  getTabGroupSubmenu(hasTabs: boolean): (SideMenuItem | ISeparator)[] {
    return [
      new SideMenuItem({
        label: "New tab",
        icon: this.getIconPath("/assets/imgs/icons16/create.png"),
        accelerator: "CmdOrCtrl+T",
        click: () => this.tabManagerController.tabManager.newTab(),
      }),

      { type: "separator" },

      new SideMenuItem({
        label: "Switch tab",
        enabled: hasTabs,
        icon: this.getIconPath("/assets/imgs/icons16/list.png"),
        submenu: this.getSwitchTabsSubmenu(),
      }),

      { type: "separator" },

      new SideMenuItem({
        label: "Switch tab group",
        icon: this.getIconPath("/assets/imgs/icons16/blocks.png"),
        submenu: this.getSwitchColorTabsSubmenu(),
      }),

      { type: "separator" },

      new SideMenuItem({
        label: "Close all tabs",
        enabled: hasTabs,
        icon: this.getIconPath("/assets/imgs/icons16/close.png"),
        accelerator: "CmdOrCtrl+Q",
        click: () => this.tabManagerController.tabManager.closeAllTabs(),
      }),
    ];
  }

  getSideMenuItem(hasTabs): SideMenuItem {
    return new SideMenuItem({
      label: "Tab group",
      icon: this.getIconPath("/assets/imgs/icons16/blocks.png"),
      submenu: this.getTabGroupSubmenu(hasTabs),
    });
  }
}

export { TabsSideMenuBuilder };
module.exports = { TabsSideMenuBuilder };
