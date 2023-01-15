import { EAppEventTypes } from "./types/app";
import { appController } from "./widgets/App";

import { app } from "electron";

import { DownloadCounterController } from "./modules/downloadCounter";
import { DownloadsController } from "./modules/downloads";
import { mainWindowController } from "./widgets/MainWindow";
import { overlayController } from "./widgets/Overlay";
import { IpcMainController } from "./widgets/IpcMain";

const downloadsCounterController = new DownloadCounterController();
const downloadsController = new DownloadsController(downloadsCounterController);

appController.init(app);

const ipcMainController = new IpcMainController(
  overlayController,
  mainWindowController,
  downloadsController
);

appController.goToTheLockCall();

appController.app.on(EAppEventTypes.windowAllClosed, () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

appController.initOnReadyListeners(downloadsController);

ipcMainController.initIpcListeners();
