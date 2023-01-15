import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";
import { ToggleFullscreen } from "../toggleFullscreen";

class ZoomSubMenuBuilder extends SideMenuBuilder {
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

  onZoomIn() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().zoomIn();
    }
  }

  onZoomOut() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().zoomOut();
    }
  }

  onActualSize() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().zoomToActualSize();
    }
  }

  onFullscreen() {
    ToggleFullscreen.toggleFullscreen();
  }

  createList(hasActiveTab: boolean) {
    this.addListItem(
      new SideMenuItem({
        label: "Zoom in",
        enabled: hasActiveTab,
        icon: this.getIconPath("/assets/imgs/icons16/zoom-in.png"),
        accelerator: "CmdOrCtrl+=",
        click: this.onZoomIn,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Zoom out",
        enabled: hasActiveTab,
        icon: this.getIconPath("/assets/imgs/icons16/zoom-out.png"),
        accelerator: "CmdOrCtrl+-",
        click: this.onZoomOut,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Actual size",
        enabled: hasActiveTab,
        icon: this.getIconPath("/assets/imgs/icons16/one.png"),
        accelerator: "CmdOrCtrl+0",
        click: this.onActualSize,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Fullscreen",
        icon: this.getIconPath("/assets/imgs/icons16/fullscreen.png"),
        accelerator: "F11",
        click: this.onFullscreen,
      })
    );
  }
}

export { ZoomSubMenuBuilder };
module.exports = { ZoomSubMenuBuilder };
