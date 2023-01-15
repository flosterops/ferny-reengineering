import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { BookmarksSubMenuBuilder } from "./BookmarksSubMenuBuilder";
import { DownloadsController } from "../downloads";

class BookmarksSideMenuBuilder extends SideMenuBuilder {
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

  getBookmarksSubmenu(hasActiveTab, hasTabs) {
    const bookmarksSubMenuBuilder = new BookmarksSubMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    bookmarksSubMenuBuilder.createList(hasActiveTab, hasTabs);
    return bookmarksSubMenuBuilder.getList();
  }

  getSideMenuItem(hasActiveTab: boolean, hasTabs: boolean) {
    return new SideMenuItem({
      label: "Bookmarks",
      icon: this.getIconPath("/assets/imgs/icons16/bookmarks.png"),
      submenu: this.getBookmarksSubmenu(hasActiveTab, hasTabs),
    });
  }
}

export { BookmarksSideMenuBuilder };
module.exports = { BookmarksSideMenuBuilder };
