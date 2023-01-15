import { TabManagerController } from "../../widgets/TabManager";
import { OverlayController } from "../../widgets/Overlay";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { SideMenuItem } from "./SideMenuItem";
import { TabsSideMenuBuilder } from "./TabsSideMenuBuilder";
import { ActiveTabSideMenuBuilder } from "./ActiveTabSideMenuBuilder";
import { BookmarksSideMenuBuilder } from "./BookmarksSideMenuBuilder";
import { HistorySideMenuBuilder } from "./HistorySideMenuBuilder";
import { DownloadsController } from "../downloads";
import { DownloadsSideMenuBuilder } from "./DownloadsSideMenuBuilder";
import { ZoomSideMenuBuilder } from "./ZoomSideMenuBuilder";
import { EditSideMenuBuilder } from "./EditSideMenuBuilder";
import { PageSideMenuBuilder } from "./PageSideMenuBuilder";
import { SettingsSideMenuBuilder } from "./SettingsSideMenuBuilder";
import { HelpSideMenuBuilder } from "./HelpSideMenuBuilder";
import { MoreSideMenuBuilder } from "./MoreSideMenuBuilder";
import { QuitSideMenuBuilder } from "./QuitSideMenuBuilder";
import { SwitchTabsSubmenuBuilder } from "./SwitchTabsSubmenuBuilder";

class SideMenuBuilder {
  list: SideMenuItem[] & ISeparator[] = [];
  appController: AppController;
  mainWindowController: MainWindowController;
  overlayController: OverlayController;
  tabManagerController: TabManagerController;
  autoUpdaterController: AutoUpdaterController;
  downloadsController: DownloadsController;

  constructor(
    appController: AppController,
    mainWindowController: MainWindowController,
    overlayController: OverlayController,
    tabManagerController: TabManagerController,
    downloadsController: DownloadsController
  ) {
    this.list = [];
    this.appController = appController;
    this.mainWindowController = mainWindowController;
    this.overlayController = overlayController;
    this.tabManagerController = tabManagerController;
    this.downloadsController = downloadsController;
  }

  protected addSeparator() {
    this.list.push({ type: "separator" });
  }

  protected addListItem(tabItem: SideMenuItem) {
    this.list.push(tabItem);
  }

  protected getIconPath(subPath: string): string {
    return `${this.appController.getAppPath()}/${subPath}`;
  }

  public getList() {
    return this.list;
  }

  private getTabsSideMenuItem(hasTabs: boolean) {
    const tabsSideMenuBuilder = new TabsSideMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    return tabsSideMenuBuilder.getSideMenuItem(hasTabs);
  }

  private getActiveTabSideMenuItem(hasActiveTab: boolean) {
    const activeTabSideMenuBuilder = new ActiveTabSideMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    return activeTabSideMenuBuilder.getSideMenuItem(hasActiveTab);
  }

  private getBookmarksSideMenuItem(hasActiveTab: boolean, hasTabs: boolean) {
    const bookmarksSideMenuBuilder = new BookmarksSideMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    return bookmarksSideMenuBuilder.getSideMenuItem(hasActiveTab, hasTabs);
  }

  private getHistorySideMenuItem() {
    const historySideMenuBuilder = new HistorySideMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    return historySideMenuBuilder.getSideMenuItem();
  }

  private getDownloadsSideMenuItem() {
    const downloadsSideMenuBuilder = new DownloadsSideMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    return downloadsSideMenuBuilder.getSideMenuItem();
  }

  private getZoomSideMenuItem(hasActiveTab: boolean) {
    const zoomSideMenuBuilder = new ZoomSideMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    return zoomSideMenuBuilder.getSideMenuItem(hasActiveTab);
  }

  private getEditSideMenuItem() {
    const editSideMenuBuilder = new EditSideMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    return editSideMenuBuilder.getSideMenuItem();
  }

  private getPageSideMenuItem(hasActiveTab: boolean) {
    const pageSideMenuBuilder = new PageSideMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    return pageSideMenuBuilder.getSideMenuItem(hasActiveTab);
  }

  private getSettingsSideMenuItem() {
    const settingsSideMenuBuilder = new SettingsSideMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    return settingsSideMenuBuilder.getSideMenuItem();
  }

  private getHelpSideMenuItem() {
    const helpSideMenuBuilder = new HelpSideMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    return helpSideMenuBuilder.getSideMenuItem();
  }

  private getMoreSideMenuItem(hasActiveTab: boolean) {
    const moreSideMenuBuilder = new MoreSideMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    return moreSideMenuBuilder.getSideMenuItem(hasActiveTab);
  }

  private getQuitSideMenuItem() {
    const quitSideMenuBuilder = new QuitSideMenuBuilder(
      this.appController,
      this.mainWindowController,
      this.overlayController,
      this.tabManagerController,
      this.downloadsController
    );

    return quitSideMenuBuilder.getSideMenuItem();
  }

  public createSideMenuList(hasActiveTab: boolean, hasTabs: boolean) {
    this.addListItem(this.getTabsSideMenuItem(hasTabs));
    this.addListItem(this.getActiveTabSideMenuItem(hasActiveTab));

    this.addSeparator();

    this.addListItem(this.getBookmarksSideMenuItem(hasActiveTab, hasTabs));
    this.addListItem(this.getHistorySideMenuItem());
    this.addListItem(this.getDownloadsSideMenuItem());

    this.addSeparator();

    this.addListItem(this.getZoomSideMenuItem(hasActiveTab));
    this.addListItem(this.getEditSideMenuItem());
    this.addListItem(this.getPageSideMenuItem(hasActiveTab));

    this.addSeparator();

    this.addListItem(this.getSettingsSideMenuItem());
    this.addListItem(this.getHelpSideMenuItem());
    this.addListItem(this.getMoreSideMenuItem(hasActiveTab));

    this.addSeparator();

    this.addListItem(this.getQuitSideMenuItem());
  }
}

export { SideMenuBuilder };
module.exports = { SideMenuBuilder };
