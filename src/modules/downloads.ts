import { DownloadItem } from "electron";
import { DownloadCounterController } from "./downloadCounter";

export interface IDownloadItem {
  id: number;
  item: DownloadItem;
}

class DownloadsController {
  downloads: IDownloadItem[];
  downloadsCounterController: DownloadCounterController;
  downloadsFolder: string;

  constructor(
    downloadsCounterController: DownloadCounterController,
    downloadsFolder = "?downloads?"
  ) {
    this.downloads = [];
    this.downloadsFolder = downloadsFolder;
    this.downloadsCounterController = downloadsCounterController;
  }
}

export { DownloadsController };
module.exports = { DownloadsController };
