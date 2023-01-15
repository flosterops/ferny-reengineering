import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";
import { EditSubMenuBuilder } from "./EditSubMenuBuilder";

class EditSideMenuBuilder extends SideMenuBuilder {
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

  getEditableSubMenu() {
    const editSubMenuBuilder = new EditSubMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    editSubMenuBuilder.createList();
    return editSubMenuBuilder.getList();
  }

  getSideMenuItem() {
    return new SideMenuItem({
      label: "Edit",
      icon: this.getIconPath("/assets/imgs/icons16/edit.png"),
      submenu: this.getEditableSubMenu(),
    });
  }
}

export { EditSideMenuBuilder };
module.exports = { EditSideMenuBuilder };
