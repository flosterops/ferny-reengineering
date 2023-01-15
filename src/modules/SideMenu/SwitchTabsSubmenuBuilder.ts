import { SideMenuBuilder } from "./SideMenuBuilder";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";

class SwitchTabsSubmenuBuilder extends SideMenuBuilder {
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

  getNumericTabs(): SideMenuItem[] {
    return Array.from(Array(9).keys()).map(
      (value: number) =>
        new SideMenuItem({
          label: `Tab ${value + 1}`,
          accelerator: `CmdOrCtrl+${value + 1}`,
          click: () =>
            this.tabManagerController.tabManager.switchTab(value + 1),
        })
    );
  }

  onNextTabClick() {
    if (!this.tabManagerController.tabManager.hasTabs()) {
      return;
    }

    if (!this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getTabByPosition(0).activate();
    }

    const hasMaxPosition =
      this.tabManagerController.tabManager.getActiveTab().getPosition() ===
      this.tabManagerController.tabManager.getMaxPosition();

    if (!hasMaxPosition) {
      return this.tabManagerController.tabManager.getActiveTab().nextTab();
    }

    this.overlayController.overlay.show();
  }

  onPreviousTabClick() {
    if (!this.tabManagerController.tabManager.hasTabs()) {
      return;
    }

    if (!this.tabManagerController.tabManager.hasActiveTab()) {
      return this.tabManagerController.tabManager
        .getTabByPosition(this.tabManagerController.tabManager.getMaxPosition())
        .activate();
    }

    if (
      this.tabManagerController.tabManager.getActiveTab().getPosition() !== 0
    ) {
      return this.tabManagerController.tabManager.getActiveTab().prevTab();
    }

    this.overlayController.overlay.show();
  }

  createList() {
    this.addListItem(
      new SideMenuItem({
        label: "Next tab",
        icon: this.getIconPath("/assets/imgs/icons16/next.png"),
        accelerator: "CmdOrCtrl+Tab",
        click: () => this.onNextTabClick(),
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Previous tab",
        icon: this.getIconPath("/assets/imgs/icons16/prev.png"),
        accelerator: "CmdOrCtrl+Shift+Tab",
        click: () => this.onPreviousTabClick(),
      })
    );

    this.addSeparator();

    this.getNumericTabs().forEach((item: SideMenuItem) => {
      this.addListItem(item);
    });
  }
}

export { SwitchTabsSubmenuBuilder };
module.exports = { SwitchTabsSubmenuBuilder };
