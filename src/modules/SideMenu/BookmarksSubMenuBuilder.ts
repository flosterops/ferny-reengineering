import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";

class BookmarksSubMenuBuilder extends SideMenuBuilder {
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

  onBookmarkManagerClick() {
    this.overlayController.overlay.scrollToId("bookmarks-title");
  }

  onBookmarkThisPageClick() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      const activeTab = this.tabManagerController.tabManager.getActiveTab();

      this.overlayController.overlay.addBookmark(
        activeTab.getTitle(),
        activeTab.getURL()
      );
      this.overlayController.overlay.scrollToId("bookmarks-title");
    }
  }

  onBookmarkAllTabs() {
    if (!this.tabManagerController.tabManager.hasTabs()) {
      return this.mainWindowController.sendNotificationManagerAddStatusNotif({
        text: "There is no tabs",
        type: "error",
      });
    }

    this.mainWindowController.mainWindow.webContents.send(
      "notificationManager-addQuestNotif",
      {
        text: "Are you sure to bookmark all opened tabs?",
        ops: [
          {
            text: "Bookmark tabs",
            icon: "add-bookmark-16",
            click: "bookmarkAllTabs();",
          },
        ],
      }
    );
  }

  createList(hasActiveTab: boolean, hasTabs: boolean) {
    this.addListItem(
      new SideMenuItem({
        label: "Bookmark manager",
        icon: this.getIconPath("/assets/imgs/icons16/bookmarks.png"),
        accelerator: "CmdOrCtrl+B",
        click: this.onBookmarkManagerClick,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Bookmark this page",
        enabled: hasActiveTab,
        icon: this.getIconPath("/assets/imgs/icons16/add-bookmark.png"),
        accelerator: "CmdOrCtrl+Shift+B",
        click: this.onBookmarkThisPageClick,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Bookmark all tabs",
        enabled: hasTabs,
        icon: this.getIconPath("/assets/imgs/icons16/blocks.png"),
        click: this.onBookmarkAllTabs,
      })
    );
  }
}

export { BookmarksSubMenuBuilder };
module.exports = { BookmarksSubMenuBuilder };
