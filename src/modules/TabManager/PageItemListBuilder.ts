import { TabItemList } from "./TabItemList";
import { TabItem } from "./TabItem";
import { EPageTabLabels } from "../../types/tabLabels";
import { EPageTabImages } from "../../types/tabImages";
import { EShortCutTypes } from "../../types/shortCuts";
import { ETabEventTypes } from "../../types/tabEvents";

class PageItemListBuilder extends TabItemList {
  constructor(tab, params) {
    super(tab, params);

    this.createList();
  }

  private createList() {
    this.addListItem(
      new TabItem({
        label: EPageTabLabels.back,
        icon: this.getIconPath(EPageTabImages.back),
        accelerator: EShortCutTypes.back,
        enabled: this.tab.view.webContents.canGoBack(),
        click: (): void => this.tab.goBack(),
      })
    );

    this.addListItem(
      new TabItem({
        label: EPageTabLabels.forward,
        icon: this.getIconPath(EPageTabImages.forward),
        accelerator: EShortCutTypes.forward,
        enabled: this.tab.view.webContents.canGoForward(),
        click: (): void => this.tab.goForward(),
      })
    );

    this.addListItem(
      new TabItem({
        label: EPageTabLabels.reload,
        icon: this.getIconPath(EPageTabImages.reload),
        accelerator: EShortCutTypes.reload,
        click: (): void => this.tab.reload(),
      })
    );

    this.addSeparator();

    this.addListItem(
      new TabItem({
        label: EPageTabLabels.downloadPage,
        icon: this.getIconPath(EPageTabImages.downloadPage),
        accelerator: EShortCutTypes.downloadPage,
        click: (): void => this.tab.downloadPage(),
      })
    );

    this.addListItem(
      new TabItem({
        label: EPageTabLabels.bookmarkPage,
        icon: this.getIconPath(EPageTabImages.bookmarkPage),
        click: () =>
          this.tab.emit(
            ETabEventTypes.bookmarkTab,
            this.tab.getTitle(),
            this.tab.getURL()
          ),
      })
    );

    this.addSeparator();

    this.addListItem(
      new TabItem({
        label: EPageTabLabels.selectAll,
        icon: this.getIconPath(EPageTabImages.selectAll),
        accelerator: EShortCutTypes.selectAll,
        click: () => this.tab.selectAll(),
      })
    );

    this.addSeparator();

    this.addListItem(
      new TabItem({
        label: EPageTabLabels.viewPageSource,
        icon: this.getIconPath(EPageTabImages.viewPageSource),
        click: () => this.tab.viewPageSource(),
      })
    );
  }
}

export { PageItemListBuilder };
module.exports = { PageItemListBuilder };
