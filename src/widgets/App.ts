import { App as AppInterface } from "electron";
import { TabManagerHandlers } from "./TabManagerHandlers";
import { EAppEventTypes } from "../types/app";
import { tabManagerController } from "./TabManager";
import { overlayController } from "./Overlay";
import { mainWindowController } from "./MainWindow";
import { autoUpdaterController } from "./AutoUpdater";
import { SessionDownloader } from "../modules/sessionDownloader";
import { ShowMainWindowUtility } from "../modules/showMainWindow";
import { DownloadsController } from "../modules/downloads";

export class AppController {
  app: AppInterface;
  tabManagerHandlers: TabManagerHandlers;

  init(app: AppInterface) {
    this.app = app;
  }

  initTabManagerHandlers(tabManagerHandlers: TabManagerHandlers) {
    this.tabManagerHandlers = tabManagerHandlers;
  }

  getAppPath(): string {
    return this.app.getAppPath();
  }

  isGoToTheLock(): boolean {
    return !!this.app.requestSingleInstanceLock();
  }

  goToTheLockCall() {
    if (!this.isGoToTheLock()) {
      this.app.quit();
    } else {
      this.app.on(EAppEventTypes.secondInstance, (event, argv) => {
        if (argv.length > 1) {
          for (let i = 1; i < argv.length; i++) {
            if (argv[i].substr(0, 2) == "--") {
              if (argv[i] == "--new-tab") {
                tabManagerController.tabManager.newTab();
              } else if (argv[i] == "--overlay") {
                overlayController.overlay.show();
              }
            } else {
              tabManagerController.tabManager.addTab("file://" + argv[i], true);
            }
          }
        }
        if (mainWindowController.mainWindow) {
          mainWindowController.mainWindow.focus();
          mainWindowController.mainWindow.webContents.send("console-log", argv);
        }
      });
    }
  }

  initUserTasks() {
    this.app.whenReady().then(() => {
      this.app?.setUserTasks([
        {
          program: process.execPath,
          arguments: "--new-tab",
          iconPath: process.execPath,
          iconIndex: 0,
          title: "New tab",
          description: "Open a new browser tab",
        },
        {
          program: process.execPath,
          arguments: "--overlay",
          iconPath: process.execPath,
          iconIndex: 0,
          title: "Show overlay",
          description: "Open the overlay tab",
        },
      ]);
    });
  }

  initOnRead(downloadsController: DownloadsController) {
    this.app.on(EAppEventTypes.ready, () => {
      autoUpdaterController.initListeners(mainWindowController.mainWindow);

      const sessionDownloaderUtility = new SessionDownloader(
        downloadsController,
        overlayController,
        mainWindowController
      );

      sessionDownloaderUtility.sessionWillLoadListener();

      downloadsController.downloadsCounterController.loadDownloadCounter();
      downloadsController.downloadsCounterController.loadDownloadsFolder();

      ShowMainWindowUtility.showMainWindow(downloadsController);
    });
  }

  initOnReadyListeners(downloadsController: DownloadsController) {
    this.initUserTasks();
    this.initOnRead(downloadsController);
  }
}

const appController = new AppController();
export { appController };
