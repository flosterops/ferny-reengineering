import { TabManager } from "../modules/TabManager/TabManager";
import { Overlay } from "../modules/Overlay/Overlay";
import { BrowserWindow, App as ElectronApp } from "electron";
import { LoadLastTabUtility } from "../modules/loadLastTab.js";

class TabManagerHandlers {
  mainWindow: BrowserWindow;
  tabManager: TabManager;
  overlay: Overlay;
  app: ElectronApp;

  constructor(
    app: ElectronApp,
    mainWindow: BrowserWindow,
    tabManager: TabManager,
    overlay: Overlay
  ) {
    this.mainWindow = mainWindow;
    this.tabManager = tabManager;
    this.overlay = overlay;
    this.app = app;
  }

  activeTabClosedHandler = (tabClosed: string, pos: number): void => {
    switch (tabClosed) {
      case "overlay":
        this.overlay.show();
        break;

      case "next-tab": {
        const nextTab = this.tabManager.getTabByPosition(pos + 1);
        if (nextTab != null) {
          nextTab.activate();
        } else {
          const prevTab = this.tabManager.getTabByPosition(pos - 1);
          if (prevTab != null) {
            prevTab.activate();
          }
        }
        break;
      }

      case "prev-tab": {
        const prevTab = this.tabManager.getTabByPosition(pos - 1);
        if (prevTab != null) {
          prevTab.activate();
        } else {
          const nextTab = this.tabManager.getTabByPosition(pos + 1);
          if (nextTab != null) {
            nextTab.activate();
          }
        }
        break;
      }
    }
  };

  tabActivatedHandler = () =>
    this.mainWindow.webContents.send("overlay-toggleButton", false);

  lastTabClosedHandler = () => {
    LoadLastTabUtility.loadLastTab().then((lastTab: string) => {
      switch (lastTab) {
        case "new-tab":
          return this.tabManager.newTab();
        case "quit":
          return this.app.quit();
        case "overlay":
          return this.overlay.show();
        case "new-tab-overlay":
          this.tabManager.newTab();
          return this.overlay.show();
      }
    });
  };

  addStatusNotifHandler = (text: string, type: string) => {
    this.mainWindow.webContents.send("notificationManager-addStatusNotif", {
      text: text,
      type: type,
    });
  };

  refreshZoomNotifHandler = (zoomFactor: any) => {
    this.mainWindow.webContents.send(
      "notificationManager-refreshZoomNotif",
      zoomFactor
    );
  };

  addHistoryItemHandler = (url: string) => {
    this.overlay.addHistoryItem(url);
  };

  bookmarkTabHandler = (title: string, url: string) => {
    if (this.tabManager.hasActiveTab()) {
      this.overlay.addBookmark(title, url);
      this.overlay.scrollToId("bookmarks-title");
    }
  };

  showOverlayHandler = () => {
    this.overlay.show();
  };

  searchForHandler = (text: string) => {
    this.overlay.performSearch(text);
  };

  openHistoryHandler = () => {
    this.overlay.scrollToId("history-title");
  };

  tabGroupSwitchedHandler = (tabGroup: any) => {
    this.overlay.switchTabGroup(tabGroup);
    this.overlay.show();
  };
}

export { TabManagerHandlers };
module.exports = { TabManagerHandlers };
