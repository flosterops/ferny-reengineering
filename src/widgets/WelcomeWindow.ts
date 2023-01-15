import { app, BrowserWindow } from "electron";
import { appController } from "./App";

class WelcomeWindowController {
  welcomeWindow: BrowserWindow;

  init(mainWindow: BrowserWindow, backgroundColor) {
    this.welcomeWindow = new BrowserWindow({
      width: 480,
      height: 350,
      frame: false,
      show: false,
      modal: true,
      parent: mainWindow,
      icon: appController.getAppPath() + "/imgs/icon.ico",
      minimizable: false,
      maximizable: false,
      resizable: false,
      webPreferences: { nodeIntegration: true },
      backgroundColor: backgroundColor,
    });
  }

  loadWelcomePage() {
    this.welcomeWindow.loadFile(
      app.getAppPath() + "/pages/welcome/welcome.html"
    );
  }

  initMenu() {
    this.welcomeWindow.setMenu(null);
  }

  initOnFocusListener() {
    this.welcomeWindow.on("focus", () => {
      this.welcomeWindow.webContents.send("action-focus-window");
    });
  }

  initOnBlurListener() {
    this.welcomeWindow.on("blur", () => {
      this.welcomeWindow.webContents.send("action-blur-window");
    });
  }

  initOnReadyToShowListener() {
    this.welcomeWindow.once("ready-to-show", () => {
      this.welcomeWindow.show();
    });
  }
}

const welcomeWindowController = new WelcomeWindowController();

export { welcomeWindowController, WelcomeWindowController };
module.exports = { welcomeWindowController, WelcomeWindowController };
