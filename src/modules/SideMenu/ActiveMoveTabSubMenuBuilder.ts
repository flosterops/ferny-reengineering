import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";

class ActiveMoveTabSubMenuBuilder extends SideMenuBuilder {
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

  onMoveLeft() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().moveLeft();
    }
  }

  onMoveRight() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().moveRight();
    }
  }

  onMoveToStart() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().moveToStart();
    }
  }

  onMoveToEnd() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().moveToEnd();
    }
  }

  createList() {
    this.addListItem(
      new SideMenuItem({
        label: "Move left",
        accelerator: "CmdOrCtrl+Shift+PageUp",
        icon: this.getIconPath("/assets/imgs/icons16/prev.png"),
        click: this.onMoveLeft,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Move right",
        accelerator: "CmdOrCtrl+Shift+PageDown",
        icon: this.getIconPath("/assets/imgs/icons16/next.png"),
        click: this.onMoveRight,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Move to start",
        accelerator: "CmdOrCtrl+Shift+Home",
        icon: this.getIconPath("/assets/imgs/icons16/to-start.png"),
        click: this.onMoveToStart,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Move to end",
        accelerator: "CmdOrCtrl+Shift+End",
        icon: this.getIconPath("/assets/imgs/icons16/to-end.png"),
        click: this.onMoveToEnd,
      })
    );
  }
}

export { ActiveMoveTabSubMenuBuilder };
module.exports = { ActiveMoveTabSubMenuBuilder };
