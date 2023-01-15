import { app, dialog, ipcMain, Menu, IpcMain } from "electron";
import { tabManagerController } from "./TabManager";
import { autoUpdater } from "electron-updater";
import { OverlayController } from "./Overlay";
import { mainWindowController, MainWindowController } from "./MainWindow";
import { DownloadsController } from "../modules/downloads";
import { ShowSettingsWindowUtility } from "../modules/showSettingsWindow";
import { settingsWindowController } from "./SettingsWindow";
import { autoUpdaterController } from "./AutoUpdater";
import os from "os";
import { ShowWelcomeWindowUtility } from "../modules/showWelcomeWindow";
import { appController } from "./App";
import { SaveBoundsUtility } from "../modules/saveBounds";
import { ToggleFullscreen } from "../modules/toggleFullscreen";
import { aboutWindowController } from "./AboutWindow";
import { TabItem } from "../modules/TabManager/TabItem";
import { EPageTabLabels } from "../types/tabLabels";
import { EPageTabImages } from "../types/tabImages";
import { EShortCutTypes } from "../types/shortCuts";
import { OpenDownloadsFolderUtility } from "../modules/openDownloadsFolder";
import { SideMenuBuilder } from "../modules/SideMenu/SideMenuBuilder";

class IpcMainController {
  overlayController: OverlayController;
  mainWindowController: MainWindowController;
  downloadsController: DownloadsController;
  ipcMain: IpcMain;

  constructor(
    overlayController: OverlayController,
    mainWindowController: MainWindowController,
    downloadsController: DownloadsController
  ) {
    this.overlayController = overlayController;
    this.mainWindowController = mainWindowController;
    this.downloadsController = downloadsController;
    this.ipcMain = ipcMain;
  }

  initIpcListeners() {
    this.initOpenDownloadsFolder();
    this.initBookmarkAllTabs();
    this.initPopupHomePageOptions();
    this.initSetDownloadsFolder();
    this.initChooseDownloadsFolder();
    this.initGetDownloadsFolder();
    this.initCancelUpdate();
    this.initInstallUpdate();
    this.initDownloadUpdate();
    this.initAddStatusNotif();
    this.initAddQuestNotif();
    this.initCheckForUpdates();
    this.initUpdateTheme();
    this.initUpdateBookmarkedButton();
    this.initClearBrowsingData();
    this.initSetCacheSize();
    this.initInfoContextMenu();
    this.initShowWelcomeScreen();
    this.initSetAbout();
    this.initSideMenu();
    this.initQuiteApp();
    this.initExitAppAnyway();
    this.initMinimizeWindow();
    this.initMaximizeWindow();
    this.initUnMaximizeWindow();
    this.initToggleFullscreen();
    this.initResumeDownload();
    this.initPauseDownload();
    this.initCancelDownload();
    this.initSettingCloseWindow();
    this.initAboutCloseWindow();
    this.initOverlayShow();
    this.initOverlayShowButtonMenu();
    this.initOverlayGoToSearch();
    this.initOverlayClearHistory();
    this.initOverlayClearDownloads();
    this.initOverlayRemoveFolder();
    this.initOverlayBookmarkThisPage();
    this.initOverlaySetSearchEngine();
    this.initOverlayCheckIfBookmarked();
    this.initOverlayShowBookmarkOptions();
    this.initOverlayShowMenu();
    this.initTabManagerNewTab();
    this.initTabManagerNewBackgroundTab();
    this.initTabManagerAddTab();
    this.initTabManagerActiveTab();
    this.initTabManagerCloseTab();
    this.initTabManagerGoBack();
    this.initTabManagerGoForward();
    this.initTabManagerReload();
    this.initTabManagerReloadIgnoringCache();
    this.initTabManagerStop();
    this.initTabManagerNavigate();
    this.initTabManagerShowTabList();
    this.initTabManagerShowTabMenu();
    this.initTabManagerUpdateTabsPositions();
    this.initTabManagerGoHome();
    this.initTabManagerSetHomePage();
    this.initTabManagerSetTabCloseAction();
    this.initTabManagerZoomOut();
    this.initTabManagerZoomIn();
    this.initTabManagerZoomToActualSize();
    this.initTabManagerPopupTabHistory();
    this.initTabManagerSwitchTabGroups();
    this.initTabManagerFindInPage();
    this.initTabManagerStopFindInPage();
    this.initTabManagerRequestTabPreview();
  }

  initOpenDownloadsFolder() {
    this.ipcMain.on("main-openDownloadsFolder", () => {
      OpenDownloadsFolderUtility.openDownloadsFolder(this.downloadsController);
    });
  }

  initBookmarkAllTabs() {
    ipcMain.on("main-bookmarkAllTabs", () => {
      const arr: { name: string; url: string }[] = [];
      tabManagerController.tabManager.getTabs().forEach((tab) => {
        arr.push({ name: tab.getTitle(), url: tab.getURL() });
      });
      this.overlayController.overlay.addFolderWithBookmarks(
        "Bookmarked tabs",
        arr
      );
    });
  }

  initPopupHomePageOptions() {
    ipcMain.on("main-popupHomePageOptions", () => {
      const homePageOptions = Menu.buildFromTemplate([
        {
          label: "Edit home page",
          click: () => {
            ShowSettingsWindowUtility.showSettingsWindow("home-page");
          },
          icon: app.getAppPath() + "/assets/imgs/icons16/edit.png",
        },
      ]);
      homePageOptions.popup({ window: this.mainWindowController.mainWindow });
    });
  }

  initSetDownloadsFolder() {
    ipcMain.on("main-setDownloadsFolder", (event, folder) => {
      this.downloadsController.downloadsFolder = folder;
    });
  }

  initChooseDownloadsFolder() {
    ipcMain.on("main-chooseDownloadsFolder", () => {
      dialog
        .showOpenDialog(this.mainWindowController.mainWindow, {
          properties: ["openDirectory"],
        })
        .then(({ filePaths }) => {
          if (filePaths[0]) {
            settingsWindowController.settingsWindow.webContents.send(
              "settings-setDownloadsFolder",
              filePaths[0]
            );
          }
        });
    });
  }

  initGetDownloadsFolder() {
    ipcMain.on("main-getDownloadsFolder", () => {
      settingsWindowController.settingsWindow.webContents.send(
        "settings-setDownloadsFolder",
        app.getPath("downloads")
      );
    });
  }

  initCancelUpdate() {
    ipcMain.on("main-cancelUpdate", () => {
      autoUpdaterController.cancelUpdate();
    });
  }

  initInstallUpdate() {
    ipcMain.on("main-installUpdate", () => {
      autoUpdaterController.quitAndInstall();
    });
  }

  initDownloadUpdate() {
    ipcMain.on("main-downloadUpdate", () => {
      autoUpdater
        .downloadUpdate(autoUpdaterController.updateCancellationToken)
        .then(() => {
          this.mainWindowController.sendNotificationManagerAddStatusNotif({
            type: "info",
            text: "Download started...",
          });
        });
    });
  }

  initAddStatusNotif() {
    ipcMain.on("main-addStatusNotif", (event, arg) => {
      this.mainWindowController.sendNotificationManagerAddStatusNotif(arg);
    });
  }

  initAddQuestNotif() {
    ipcMain.on("main-addQuestNotif", (event, arg) => {
      this.mainWindowController.sendNotificationManagerAddStatusNotif(arg);
    });
  }

  initCheckForUpdates() {
    ipcMain.on("main-checkForUpdates", () => {
      autoUpdaterController.checkForUpdates();
    });
  }

  initUpdateTheme() {
    ipcMain.on("main-updateTheme", () => {
      this.mainWindowController.mainWindow.webContents.send(
        "window-updateTheme"
      );
      this.overlayController.overlay.updateTheme();
    });
  }

  initUpdateBookmarkedButton() {
    ipcMain.on("main-updateBookmarkedButton", (event, exists, id) => {
      this.mainWindowController.mainWindow.webContents.send(
        "tabRenderer-updateBookmarkedButton",
        exists,
        id
      );
    });
  }

  initClearBrowsingData() {
    ipcMain.on("request-clear-browsing-data", (event, arg) => {
      const { session } = this.mainWindowController.mainWindow.webContents;

      if (arg.cache) {
        session.clearCache().then(() => {
          this.mainWindowController.sendNotificationManagerAddStatusNotif({
            text: "Cache cleared",
            type: "success",
          });
        });

        session.getCacheSize().then((value: number) => {
          event.sender.send("action-set-cache-size", { cacheSize: value });
        });
      }

      if (arg.storage) {
        session.clearStorageData().then(() => {
          this.mainWindowController.sendNotificationManagerAddStatusNotif({
            text: "Storage cleared",
            type: "success",
          });
        });
      }
    });
  }

  initSetCacheSize() {
    ipcMain.on("request-set-cache-size", (event) => {
      const { session } = this.mainWindowController.mainWindow.webContents;

      session.getCacheSize().then((value) => {
        event.sender.send("action-set-cache-size", { cacheSize: value });
      });
    });
  }

  initInfoContextMenu() {
    ipcMain.on("request-info-contextmenu", () => {
      const infoMenu = Menu.buildFromTemplate([
        {
          label: "Certificate info",
          icon: app.getAppPath() + "/assets/imgs/icons16/certificate.png",
          click: () => {
            this.mainWindowController.mainWindow.webContents.send(
              "action-page-certificate"
            );
          },
        },
      ]);
      infoMenu.popup({ window: this.mainWindowController.mainWindow });
    });
  }

  initShowWelcomeScreen() {
    ipcMain.on("action-show-welcome-screen", () => {
      ShowWelcomeWindowUtility.showWelcomeWindow();
    });
  }

  initSetAbout() {
    ipcMain.on("request-set-about", (event) => {
      event.sender.send("action-set-about", {
        version: appController.app.getVersion(),
        arch: os.arch(),
        platform: process.platform,
      });
    });
  }

  initSideMenu() {
    ipcMain.on("request-side-menu", () => {
      const hasActiveTab = tabManagerController.tabManager.hasActiveTab();
      const hasTab = tabManagerController.tabManager.hasTabs();

      const sideMenuBuilder = new SideMenuBuilder(
        appController,
        this.mainWindowController,
        this.overlayController,
        tabManagerController,
        this.downloadsController
      );

      sideMenuBuilder.createSideMenuList(hasActiveTab, hasTab);

      Menu.buildFromTemplate(sideMenuBuilder.getList() as any).popup({
        window: mainWindowController.mainWindow,
      });
    });
  }

  initQuiteApp() {
    ipcMain.on("request-quit-app", () => {
      appController.app.quit();
    });
  }

  initExitAppAnyway() {
    ipcMain.on("request-exit-app-anyway", () => {
      SaveBoundsUtility.saveBounds();

      if (!!autoUpdaterController.updateCancellationToken) {
        autoUpdaterController.updateCancellationToken.cancel();
      }

      appController.app.exit();
    });
  }

  initMinimizeWindow() {
    ipcMain.on("request-minimize-window", () => {
      mainWindowController.mainWindow.minimize();
    });
  }

  initMaximizeWindow() {
    ipcMain.on("request-maximize-window", () => {
      mainWindowController.mainWindow.maximize();
    });
  }

  initUnMaximizeWindow() {
    ipcMain.on("request-unmaximize-window", () => {
      mainWindowController.mainWindow.unmaximize();
    });
  }

  initToggleFullscreen() {
    ipcMain.on("request-toggle-fullscreen", () => {
      ToggleFullscreen.toggleFullscreen();
    });
  }

  initResumeDownload() {
    ipcMain.on("downloadManager-resumeDownload", (event, id) => {
      this.downloadsController.downloads.forEach((downloadItem) => {
        if (downloadItem.id === id) {
          downloadItem.item.resume();
        }
      });
    });
  }

  initPauseDownload() {
    ipcMain.on("downloadManager-pauseDownload", (event, id) => {
      this.downloadsController.downloads.forEach((downloadItem) => {
        if (downloadItem.id === id) {
          downloadItem.item.pause();
        }
      });
    });
  }

  initCancelDownload() {
    ipcMain.on("downloadManager-cancelDownload", (event, id) => {
      this.downloadsController.downloads.forEach((downloadItem) => {
        if (downloadItem.id === id) {
          downloadItem.item.cancel();
        }
      });
    });
  }

  initSettingCloseWindow() {
    ipcMain.on("settings-closeWindow", () => {
      settingsWindowController.settingsWindow.close();
    });
  }

  initAboutCloseWindow() {
    ipcMain.on("about-closeWindow", () => {
      aboutWindowController.aboutWindow.close();
    });
  }

  initOverlayShow() {
    ipcMain.on("overlay-show", () => {
      this.overlayController.overlay.show();
    });
  }

  initOverlayShowButtonMenu() {
    ipcMain.on("overlay-showButtonMenu", () => {
      this.overlayController.overlay.showButtonMenu();
    });
  }

  initOverlayGoToSearch() {
    ipcMain.on("overlay-goToSearch", (event, text, cursorPos) => {
      this.overlayController.overlay.goToSearch(text, cursorPos);
    });
  }

  initOverlayClearHistory() {
    ipcMain.on("overlay-clearHistory", () => {
      this.overlayController.overlay.clearHistory();
    });
  }

  initOverlayClearDownloads() {
    ipcMain.on("overlay-clearDownloads", () => {
      this.overlayController.overlay.clearDownloads();
    });
  }

  initOverlayRemoveFolder() {
    ipcMain.on("overlay-removeFolder", (event, id) => {
      this.overlayController.overlay.removeFolder(id);
    });
  }

  initOverlayBookmarkThisPage() {
    ipcMain.on("overlay-bookmarkThisPage", () => {
      const hasActive = tabManagerController.tabManager.hasActiveTab();

      if (!hasActive) {
        return;
      }

      const at = tabManagerController.tabManager.getActiveTab();

      this.overlayController.overlay.addBookmark(at.getTitle(), at.getURL());
      this.overlayController.overlay.scrollToId("bookmarks-title");
    });
  }

  initOverlaySetSearchEngine() {
    ipcMain.on("overlay-setSearchEngine", (event, engine) => {
      this.overlayController.overlay.setSearchEngine(engine);
    });
  }

  initOverlayCheckIfBookmarked() {
    ipcMain.on("overlay-checkIfBookmarked", (event, url) => {
      this.overlayController.overlay.checkIfBookmarked(url);
    });
  }

  initOverlayShowBookmarkOptions() {
    ipcMain.on("overlay-showBookmarkOptions", (event, id) => {
      this.overlayController.overlay.showBookmarkOptions(id);
    });
  }

  initOverlayShowMenu() {
    ipcMain.on("overlay-showMenu", () => {
      Menu.buildFromTemplate([
        new TabItem({
          label: EPageTabLabels.back,
          icon: (this as any).appPath + EPageTabImages.back,
          accelerator: EShortCutTypes.back,
          enabled: (this as any).view.webContents.canGoBack(),
          click: () => (this as any).goBack(),
        }),
      ]);
    });
  }

  initTabManagerNewTab() {
    ipcMain.on("tabManager-newTab", () => {
      tabManagerController.tabManager.newTab();
    });
  }

  initTabManagerNewBackgroundTab() {
    ipcMain.on("tabManager-newBackgroundTab", () => {
      tabManagerController.tabManager.newBackgroundTab();
    });
  }

  initTabManagerAddTab() {
    ipcMain.on("tabManager-addTab", (event, url, active) => {
      tabManagerController.tabManager.addTab(url, active);
    });
  }

  initTabManagerActiveTab() {
    ipcMain.on("tabManager-activateTab", (event, id) => {
      tabManagerController.tabManager.getTabById(id).activate();
    });
  }

  initTabManagerCloseTab() {
    ipcMain.on("tabManager-closeTab", (event, id) => {
      tabManagerController.tabManager.getTabById(id).close();
    });
  }

  initTabManagerGoBack() {
    ipcMain.on("tabManager-goBack", () => {
      if (tabManagerController.tabManager.hasActiveTab()) {
        tabManagerController.tabManager.getActiveTab().goBack();
      }
    });
  }

  initTabManagerGoForward() {
    ipcMain.on("tabManager-goForward", () => {
      if (tabManagerController.tabManager.hasActiveTab()) {
        tabManagerController.tabManager.getActiveTab().goForward();
      }
    });
  }

  initTabManagerReload() {
    ipcMain.on("tabManager-reload", () => {
      if (tabManagerController.tabManager.hasActiveTab()) {
        tabManagerController.tabManager.getActiveTab().reload();
      }
    });
  }

  initTabManagerReloadIgnoringCache() {
    ipcMain.on("tabManager-reloadIgnoringCache", () => {
      if (tabManagerController.tabManager.hasActiveTab()) {
        tabManagerController.tabManager.getActiveTab().reloadIgnoringCache();
      }
    });
  }

  initTabManagerStop() {
    ipcMain.on("tabManager-stop", () => {
      if (tabManagerController.tabManager.hasActiveTab()) {
        tabManagerController.tabManager.getActiveTab().stop();
      }
    });
  }

  initTabManagerNavigate() {
    ipcMain.on("tabManager-navigate", (event, url) => {
      if (tabManagerController.tabManager.hasActiveTab()) {
        tabManagerController.tabManager.getActiveTab().navigate(url);
      }
    });
  }

  initTabManagerShowTabList() {
    ipcMain.on("tabManager-showTabList", (event, arr) => {
      tabManagerController.tabManager.showTabList(arr);
    });
  }

  initTabManagerShowTabMenu() {
    ipcMain.on("tabManager-showTabMenu", (event, id) => {
      tabManagerController.tabManager.getTabById(id).showMenu();
    });
  }

  initTabManagerUpdateTabsPositions() {
    ipcMain.on("tabManager-updateTabsPositions", (event, arr) => {
      tabManagerController.tabManager.updateTabsPositions(arr);
    });
  }

  initTabManagerGoHome() {
    ipcMain.on("tabManager-goHome", () => {
      if (tabManagerController.tabManager.hasActiveTab()) {
        tabManagerController.tabManager.getActiveTab().goHome();
      }
    });
  }

  initTabManagerSetHomePage() {
    ipcMain.on("tabManager-setHomePage", (event, homePage) => {
      tabManagerController.tabManager.setHomePage(homePage);
    });
  }

  initTabManagerSetTabCloseAction() {
    ipcMain.on("tabManager-setTabClosedAction", (event, tabClosed) => {
      tabManagerController.tabManager.setTabClosedAction(tabClosed);
    });
  }

  initTabManagerZoomOut() {
    ipcMain.on("tabManager-zoomOut", () => {
      if (tabManagerController.tabManager.hasActiveTab()) {
        tabManagerController.tabManager.getActiveTab().zoomOut();
      }
    });
  }

  initTabManagerZoomIn() {
    ipcMain.on("tabManager-zoomIn", () => {
      if (tabManagerController.tabManager.hasActiveTab()) {
        tabManagerController.tabManager.getActiveTab().zoomIn();
      }
    });
  }

  initTabManagerZoomToActualSize() {
    ipcMain.on("tabManager-zoomToActualSize", () => {
      if (tabManagerController.tabManager.hasActiveTab()) {
        tabManagerController.tabManager.getActiveTab().zoomToActualSize();
      }
    });
  }

  initTabManagerPopupTabHistory() {
    ipcMain.on("tabManager-popupTabHistory", () => {
      if (tabManagerController.tabManager.hasActiveTab()) {
        tabManagerController.tabManager.getActiveTab().popupTabHistory();
      }
    });
  }

  initTabManagerSwitchTabGroups() {
    ipcMain.on("tabManager-switchTabGroup", (event, number) => {
      tabManagerController.tabManager.switchTabGroup(number);
    });
  }

  initTabManagerFindInPage() {
    ipcMain.on("tabManager-findInPage", (event, text, forward) => {
      if (tabManagerController.tabManager.hasActiveTab()) {
        tabManagerController.tabManager
          .getActiveTab()
          .findInPage(text, forward);
      }
    });
  }

  initTabManagerStopFindInPage() {
    ipcMain.on("tabManager-stopFindInPage", (event, keepSelection) => {
      if (tabManagerController.tabManager.hasActiveTab()) {
        tabManagerController.tabManager
          .getActiveTab()
          .stopFindInPage(keepSelection);
      }
    });
  }

  initTabManagerRequestTabPreview() {
    ipcMain.on("tabManager-requestTabPreview", (event, id) => {
      tabManagerController.tabManager.getTabById(id).requestTabPreview();
    });
  }
}

export { IpcMainController };
module.exports = { IpcMainController };
