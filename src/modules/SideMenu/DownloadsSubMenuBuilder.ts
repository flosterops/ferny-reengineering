import { SideMenuBuilder } from "./SideMenuBuilder";
import { OpenDownloadsFolderUtility } from "../openDownloadsFolder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";

class DownloadsSubMenuBuilder extends SideMenuBuilder {
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

  onDownloadClick() {
    this.overlayController.overlay.scrollToId("downloads-title");
  }

  onOpenDownloadsFolder() {
    OpenDownloadsFolderUtility.openDownloadsFolder(this.downloadsController);
  }

  createList() {
    this.addListItem(
      new SideMenuItem({
        label: "Downloads",
        accelerator: "CmdOrCtrl+D",
        icon: this.getIconPath("/assets/imgs/icons16/download.png"),
        click: this.onDownloadClick,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Open folder",
        icon: this.getIconPath("/assets/imgs/icons16/folder.png"),
        click: this.onOpenDownloadsFolder,
      })
    );
  }
}

export { DownloadsSubMenuBuilder };
module.exports = { DownloadsSubMenuBuilder };
