import { TabManager } from "../modules/TabManager/TabManager";
import {
  ETabManagerEventTypes,
  TTabManagerEventModel,
} from "../types/tabManager";
import { BrowserWindow } from "electron";
import { appController } from "./App";

class TabManagerController {
  tabManager: TabManager;

  init(mainWindow: BrowserWindow, appPath: string, theme: any) {
    this.tabManager = new TabManager(mainWindow, appPath, theme);
  }

  initTabManagerEvent({ eventType, eventHandler }: TTabManagerEventModel) {
    this.tabManager.on(eventType, eventHandler);
  }

  initializeTabManagerEvents() {
    this.initTabManagerEvent({
      eventType: ETabManagerEventTypes.activeTabClosed,
      eventHandler: appController.tabManagerHandlers.activeTabClosedHandler,
    });

    this.initTabManagerEvent({
      eventType: ETabManagerEventTypes.tabActivated,
      eventHandler: appController.tabManagerHandlers.tabActivatedHandler,
    });

    this.initTabManagerEvent({
      eventType: ETabManagerEventTypes.lastTabClosed,
      eventHandler: appController.tabManagerHandlers.lastTabClosedHandler,
    });

    this.initTabManagerEvent({
      eventType: ETabManagerEventTypes.addStatusNotif,
      eventHandler: appController.tabManagerHandlers.addStatusNotifHandler,
    });

    this.initTabManagerEvent({
      eventType: ETabManagerEventTypes.refreshZoomNotif,
      eventHandler: appController.tabManagerHandlers.refreshZoomNotifHandler,
    });

    this.initTabManagerEvent({
      eventType: ETabManagerEventTypes.addHistoryItem,
      eventHandler: appController.tabManagerHandlers.addHistoryItemHandler,
    });

    this.initTabManagerEvent({
      eventType: ETabManagerEventTypes.bookmarkTab,
      eventHandler: appController.tabManagerHandlers.bookmarkTabHandler,
    });

    this.initTabManagerEvent({
      eventType: ETabManagerEventTypes.showOverlay,
      eventHandler: appController.tabManagerHandlers.showOverlayHandler,
    });

    this.initTabManagerEvent({
      eventType: ETabManagerEventTypes.searchFor,
      eventHandler: appController.tabManagerHandlers.searchForHandler,
    });

    this.initTabManagerEvent({
      eventType: ETabManagerEventTypes.openHistory,
      eventHandler: appController.tabManagerHandlers.openHistoryHandler,
    });

    this.initTabManagerEvent({
      eventType: ETabManagerEventTypes.tabGroupSwitched,
      eventHandler: appController.tabManagerHandlers.tabGroupSwitchedHandler,
    });
  }
}

const tabManagerController = new TabManagerController();

export { tabManagerController, TabManagerController };
module.exports = { tabManagerController, TabManagerController };
