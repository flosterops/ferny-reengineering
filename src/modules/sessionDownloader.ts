import { app, DownloadItem, session } from "electron";
import { DownloadsController } from "./downloads";
import { MainWindowController } from "../widgets/MainWindow";
import { OverlayController } from "../widgets/Overlay";

class SessionDownloader {
  downloadsController: DownloadsController;
  overlayController: OverlayController;
  mainWindowController: MainWindowController;

  constructor(
    downloadsController: DownloadsController,
    overlayController: OverlayController,
    mainWindowController: MainWindowController
  ) {
    this.downloadsController = downloadsController;
    this.overlayController = overlayController;
    this.mainWindowController = mainWindowController;
  }

  saveItemPathByDownloadFolder(item: DownloadItem): void {
    switch (this.downloadsController.downloadsFolder) {
      case "?ask?":
        return;
      case "?downloads?":
        return item.setSavePath(
          app.getPath("downloads") + "/" + item.getFilename()
        );
      case "?desktop?":
        return item.setSavePath(
          app.getPath("desktop") + "/" + item.getFilename()
        );
      default:
        return item.setSavePath(
          this.downloadsController.downloadsFolder + "/" + item.getFilename()
        );
    }
  }

  addOnupdateListener(item: DownloadItem) {
    item.on("updated", (event, state) => {
      if (state === "interrupted") {
        this.overlayController.overlay.setDownloadStatusInterrupted({
          id: this.downloadsController.downloadsCounterController.counter,
          name: item.getFilename(),
        });

        this.mainWindowController.sendNotificationManagerAddStatusNotif({
          type: "error",
          text: `Download interrupted: "${item.getFilename()}"`,
        });
      }

      if (state === "progressing") {
        const data = {
          id: this.downloadsController.downloadsCounterController.counter,
          bytes: item.getReceivedBytes(),
          total: item.getTotalBytes(),
        };

        if (item.isPaused()) {
          this.overlayController.overlay.setDownloadStatusPause(data);
        } else {
          this.overlayController.overlay.setDownloadProcess(data);
        }
      }
    });
  }

  addOnDoneListener(item: DownloadItem) {
    item.once("done", (event, state) => {
      if (state === "completed") {
        this.overlayController.overlay.setDownloadStatusDone({
          id: this.downloadsController.downloadsCounterController.counter,
          path: item.getSavePath(),
          name: item.getFilename(),
        });

        return this.mainWindowController.sendNotificationManagerAddStatusNotif({
          type: "success",
          text: `Download completed: "${item.getFilename()}"`,
        });
      }

      this.overlayController.overlay.setDownloadStatusFailed({
        id: this.downloadsController.downloadsCounterController.counter,
        name: item.getFilename(),
      });

      this.mainWindowController.sendNotificationManagerAddStatusNotif({
        type: "error",
        text: `Download failed: "${item.getFilename()}"`,
      });
    });
  }

  sessionWillLoadListener() {
    session.defaultSession.on("will-download", (event, item) => {
      this.downloadsController.downloadsCounterController.increment();
      const index = this.downloadsController.downloadsCounterController.counter;

      this.saveItemPathByDownloadFolder(item);

      this.downloadsController.downloadsCounterController.saveDownloadCounter();

      this.downloadsController.downloads.push({ id: index, item });

      this.overlayController.overlay.createDownload({
        id: index,
        url: item.getURL(),
        name: item.getFilename(),
        time: item.getStartTime(),
      });

      this.mainWindowController.sendNotificationManagerAddStatusNotif({
        type: "info",
        text: `Download started: "${item.getFilename()}"`,
      });

      this.addOnupdateListener(item);

      this.addOnDoneListener(item);
    });
  }
}

export { SessionDownloader };
module.exports = { SessionDownloader };
