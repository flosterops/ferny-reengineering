import { BrowserWindow } from "electron";
import { IWindowControls } from "../modules/loadWinControls";
import { appController } from "./App";

class SettingsWindowController {
  settingsWindow: BrowserWindow;

  init(
    mainWindow: BrowserWindow,
    winControls: IWindowControls,
    backgroundColor: string
  ) {
    this.settingsWindow = new BrowserWindow({
      title: "Settings",
      modal: true,
      frame: winControls.systemTitlebar,
      parent: mainWindow,
      width: 640,
      height: 480,
      resizable: false,
      show: false,
      icon: appController.getAppPath() + "/assets/imgs/icon.ico",
      webPreferences: {
        nodeIntegration: true,
      },
      backgroundColor: backgroundColor,
    });
  }

  loadSettingsPage(categoryId: string) {
    this.settingsWindow
      .loadFile(appController.getAppPath() + "/pages/settings/settings.html")
      .then(() => {
        settingsWindowController.settingsWindow.webContents.send(
          "settings-showCategory",
          categoryId
        );
      });
  }

  initOnFocusListener() {
    this.settingsWindow.on("focus", () => {
      this.settingsWindow.webContents.send("window-focus");
    });
  }

  initOnBlurListener() {
    this.settingsWindow.on("blur", () => {
      this.settingsWindow.webContents.send("window-blur");
    });
  }

  initReadyToShowListener() {
    this.settingsWindow.once("ready-to-show", () => {
      this.settingsWindow.show();
    });
  }
}

const settingsWindowController = new SettingsWindowController();

export { settingsWindowController, SettingsWindowController };
module.exports = { settingsWindowController, SettingsWindowController };
