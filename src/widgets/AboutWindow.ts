import { app, BrowserWindow } from "electron";
import { IWindowControls } from "../modules/loadWinControls";
import { appController } from "./App";

class AboutWindowController {
  aboutWindow: BrowserWindow = {} as BrowserWindow;

  constructor() {
    this.aboutWindow = {} as BrowserWindow;
  }

  init(
    mainWindow: BrowserWindow,
    winControls: IWindowControls,
    backgroundColor: string
  ) {
    this.aboutWindow = new BrowserWindow({
      title: "About Ferny",
      modal: true,
      parent: mainWindow,
      width: 480,
      height: 350,
      resizable: false,
      show: false,
      frame: winControls.systemTitlebar,
      icon: appController.getAppPath() + "/assets/imgs/icon.ico",
      webPreferences: { nodeIntegration: true },
      backgroundColor: backgroundColor,
    });
  }

  initLoadPage() {
    this.aboutWindow.loadFile(app.getAppPath() + "/pages/about/about.html");
  }

  initOnFocusListener() {
    this.aboutWindow.on("focus", () => {
      this.aboutWindow.webContents.send("window-focus");
    });
  }

  initOnBlurListener() {
    this.aboutWindow.on("blur", () => {
      this.aboutWindow.webContents.send("window-blur");
    });
  }

  initOnReadyToShowListener() {
    this.aboutWindow.once("ready-to-show", () => {
      this.aboutWindow.show();
    });
  }
}

const aboutWindowController = new AboutWindowController();

export { aboutWindowController, AboutWindowController };
module.exports = { aboutWindowController, AboutWindowController };
