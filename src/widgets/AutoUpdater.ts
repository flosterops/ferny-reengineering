import { autoUpdater, BrowserWindow } from "electron";
import { AppUpdater } from "electron-updater";
import eLogger from "electron-log";
import { CancellationToken } from "electron-updater";
import { mainWindowController } from "./MainWindow";

interface IAutoUpdater extends AppUpdater {
  logger: typeof eLogger;
  autoDownload: boolean;
}

class AutoUpdaterController {
  autoUpdater: IAutoUpdater;
  updateCancellationToken: CancellationToken | null;

  constructor(autoUpdater: IAutoUpdater) {
    this.autoUpdater = autoUpdater;
    this.autoUpdater.logger = eLogger;
    this.autoUpdater.autoDownload = false;
  }

  public initListeners(mainWindow: BrowserWindow) {
    this.initCheckingForUpdateLister(mainWindow);
    this.initOnErrorListener(mainWindow);
    this.initUpdateNotAvailableListener(mainWindow);
    this.initUpdateAvailableListener(mainWindow);
    this.initUpdateDownloadedListener(mainWindow);
  }

  public checkForUpdates() {
    if (!this.updateCancellationToken) {
      return this.autoUpdater.checkForUpdates().then((downloadPromise) => {
        autoUpdaterController.setCancellationToken(
          downloadPromise.cancellationToken
        );
      });
    }

    mainWindowController.sendNotificationManagerAddStatusNotif({
      type: "warning",
      text: "The update has already started",
    });
  }

  public setCancellationToken(cancellationToken?: CancellationToken) {
    if (cancellationToken) {
      this.updateCancellationToken = cancellationToken;
    }
  }

  public cancelUpdate() {
    this.updateCancellationToken?.cancel();
  }

  public quitAndInstall() {
    this.autoUpdater.quitAndInstall();
  }

  private initCheckingForUpdateLister(mainWindow) {
    autoUpdater.on("checking-for-update", () => {
      mainWindow.webContents.send("notificationManager-addStatusNotif", {
        type: "info",
        text: "Checking for updates...",
      });
    });
  }

  private initOnErrorListener(mainWindow) {
    autoUpdater.on("error", (error) => {
      mainWindow.webContents.send("notificationManager-addStatusNotif", {
        type: "error",
        text: "Update error: " + error,
      });
    });
  }

  private initUpdateNotAvailableListener(mainWindow) {
    autoUpdater.on("update-not-available", () => {
      mainWindow.webContents.send("notificationManager-addStatusNotif", {
        type: "success",
        text: "App is up to date!",
      });
    });
  }

  private initUpdateAvailableListener(mainWindow) {
    autoUpdater.on("update-available", (info) => {
      mainWindow.webContents.send("notificationManager-addQuestNotif", {
        text: `Update is available: ${info.releaseName}`,
        ops: [
          {
            text: "Start download",
            icon: "download-16",
            click: "downloadUpdate();",
          },
        ],
      });
    });
  }

  private initUpdateDownloadedListener(mainWindow) {
    autoUpdater.on("update-downloaded", () => {
      this.updateCancellationToken = null;
      mainWindow.webContents.send("notificationManager-addQuestNotif", {
        text: "Update is downloaded!",
        ops: [
          { text: "Install now", icon: "check-16", click: "installUpdate();" },
        ],
      });
    });
  }
}

const autoUpdaterController = new AutoUpdaterController(
  autoUpdater as IAutoUpdater
);

export { autoUpdaterController, AutoUpdaterController };
module.exports = { autoUpdaterController, AutoUpdaterController };
