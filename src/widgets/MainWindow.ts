import { app, BrowserWindow, Menu } from "electron";
import { appController } from "./app";
import { overlayController } from "./Overlay";
import { MainContextMenuBuilder } from "../modules/MainContextMenu/MainContextMenuBuilder";
import { tabManagerController } from "./TabManager";
import { TabManagerHandlers } from "./TabManagerHandlers";
import { InitMenuUtility } from "../modules/initMenu";
import { LoadHomePageUtility } from "../modules/loadHomePage";
import { DownloadsController, IDownloadItem } from "../modules/downloads";
import { LoadStartupUtility } from "../modules/loadStartup";
import { autoUpdaterController } from "./AutoUpdater";
import { SaveBoundsUtility } from "../modules/saveBounds";

interface INotificationModel {
  type: string;
  text: string;
}

class MainWindowController {
  Data: any;
  mainWindow: BrowserWindow;

  init(Data, winControls, backgroundColor) {
    this.Data = Data;
    this.mainWindow = new BrowserWindow({
      x: Data.x,
      y: Data.y,
      width: Data.width,
      height: Data.height,
      minWidth: 400,
      minHeight: 240,
      frame: winControls.systemTitlebar,
      icon: appController.getAppPath() + "/assets/imgs/icon.ico",
      webPreferences: {
        nodeIntegration: true,
      },
      backgroundColor: backgroundColor,
    });
  }

  sendNotificationManagerAddStatusNotif(notification: INotificationModel) {
    this.mainWindow.webContents.send(
      "notificationManager-addStatusNotif",
      notification
    );
  }

  onLoadFile() {
    this.mainWindow.loadFile(app.getAppPath() + "/pages/browser/browser.html");
  }

  onContextMenuListener() {
    this.mainWindow.webContents.on("context-menu", (event, params) => {
      if (!params.isEditable) {
        return;
      }

      const mainContextMenuBuilder = new MainContextMenuBuilder(
        this,
        overlayController,
        params
      );

      mainContextMenuBuilder.createList();

      const searchMenu = Menu.buildFromTemplate(
        mainContextMenuBuilder.getList() as any
      );

      searchMenu.popup({ window: this.mainWindow });
    });
  }

  initOnFocusListener() {
    this.mainWindow.on("focus", () => {
      this.mainWindow.webContents.send("window-focus");
    });
  }

  initOnBlurListener() {
    this.mainWindow.on("blur", () => {
      this.mainWindow.webContents.send("window-blur");
    });
  }

  initOnMaximize() {
    this.mainWindow.on("maximize", () => {
      this.mainWindow.webContents.send("window-maximize");

      if (!tabManagerController.tabManager.hasActiveTab()) {
        return overlayController.overlay.refreshBounds();
      }

      tabManagerController.tabManager.getActiveTab().activate();
    });
  }

  initOnUnMaximize() {
    this.mainWindow.on("unmaximize", () => {
      this.mainWindow.webContents.send("window-unmaximize");
      setTimeout(() => {
        if (!tabManagerController.tabManager.hasActiveTab()) {
          return overlayController.overlay.refreshBounds();
        }

        tabManagerController.tabManager.getActiveTab().activate();
      }, 250);
    });
  }

  initOnConsoleLog() {
    this.mainWindow.webContents.send("console-log", process.argv);
  }

  initLoadTabs() {
    if (process.argv.length > 1 && process.argv[1] != ".") {
      for (let i = 1; i < process.argv.length; i++) {
        if (process.argv[i].substr(0, 2) != "--") {
          tabManagerController.tabManager.addTab(
            "file://" + process.argv[i],
            true
          );
        }
      }
    } else {
      LoadStartupUtility.loadStartup().then((startup) => {
        if (startup == "overlay") {
          overlayController.overlay.show();
        } else if (startup == "new-tab") {
          tabManagerController.tabManager.newTab();
        }
      });
    }
  }

  initMenu(downloadsController: DownloadsController) {
    InitMenuUtility.initMenu(downloadsController);
  }

  initHomePage() {
    LoadHomePageUtility.loadHomePage().then((homePage) => {
      tabManagerController.tabManager.setHomePage(homePage);
    });
  }

  initTabManager(theme: any) {
    tabManagerController.init(
      this.mainWindow,
      appController.getAppPath(),
      theme
    );

    const tabManagerHandlers = new TabManagerHandlers(
      app,
      this.mainWindow,
      tabManagerController.tabManager,
      overlayController.overlay
    );

    appController.initTabManagerHandlers(tabManagerHandlers);
  }

  initWindowView() {
    this.mainWindow.show();
    if (this.Data.maximize) {
      this.mainWindow.maximize();
    }
  }

  initOnDomReady(theme: any, downloadsController: DownloadsController) {
    overlayController.init();

    this.initTabManager(theme);

    this.initMenu(downloadsController);
    this.initHomePage();

    this.initWindowView();

    this.initOnConsoleLog();
    this.initLoadTabs();
  }

  onBrowserBackward() {
    if (!tabManagerController.tabManager.hasActiveTab()) {
      return;
    }

    const activeTab = tabManagerController.tabManager.getActiveTab();
    if (activeTab.canGoBack()) {
      activeTab.goBack();
    } else {
      overlayController.overlay.show();
    }
  }

  onBrowserForward() {
    if (tabManagerController.tabManager.hasActiveTab()) {
      tabManagerController.tabManager.getActiveTab().goForward();
    }
  }

  onBrowserHome() {
    if (tabManagerController.tabManager.hasActiveTab()) {
      tabManagerController.tabManager.getActiveTab().goHome();
    }
  }

  onBrowserRefresh() {
    if (tabManagerController.tabManager.hasActiveTab()) {
      tabManagerController.tabManager.getActiveTab().reload();
    }
  }

  onBrowserTop() {
    if (tabManagerController.tabManager.hasActiveTab()) {
      tabManagerController.tabManager.getActiveTab().stop();
    }
  }

  initAppCommands() {
    mainWindowController.mainWindow.on("app-command", (event, command) => {
      switch (command) {
        case "browser-backward":
          return this.onBrowserBackward();
        case "browser-forward":
          return this.onBrowserForward();
        case "browser-home":
          return this.onBrowserHome();
        case "browser-refresh":
          return this.onBrowserRefresh();
        case "browser-stop":
          return this.onBrowserTop();
        case "browser-search": {
          overlayController.overlay.show();
        }
      }
    });
  }

  initOnClose(downloadsController: DownloadsController) {
    mainWindowController.mainWindow.on("close", (event) => {
      event.preventDefault();

      const download = downloadsController.downloads.some(
        ({ item }: IDownloadItem) => item.getState() == "progressing"
      );

      const update = !!autoUpdaterController.updateCancellationToken;

      if (update) {
        return mainWindowController.mainWindow.webContents.send(
          "notificationManager-addQuestNotif",
          {
            text: "App update is in progress! Exit anyway?",
            ops: [{ text: "Exit", icon: "exit-16", click: "exitAppAnyway()" }],
          }
        );
      }

      if (download) {
        return mainWindowController.mainWindow.webContents.send(
          "notificationManager-addQuestNotif",
          {
            text: "Download is in progress! Exit anyway?",
            ops: [
              {
                text: "Exit",
                icon: "exit-16",
                click: "exitAppAnyway()",
              },
            ],
          }
        );
      }

      SaveBoundsUtility.saveBounds();
      app.exit();
    });
  }
}

const mainWindowController = new MainWindowController();

export { mainWindowController, MainWindowController };
