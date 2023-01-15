import { TabItemList } from "./TabItemList";
import { ISeparator, TabItem } from "./TabItem";
import { Tab } from "./Tab";
import { clipboard } from "electron";
import { EImageTabLabels } from "../../types/tabLabels";
import { EImageTabImages } from "../../types/tabImages";
import { ETabEventTypes } from "../../types/tabEvents";

class ImageItemListBuilder extends TabItemList {
  list: TabItem[] & ISeparator[] = [];
  tab: Tab;
  params: any;

  constructor(tab, params) {
    super(tab, params);
  }

  createList() {
    this.addListItem(
      new TabItem({
        label: EImageTabLabels.openImageInNewTab,
        icon: this.getIconPath(EImageTabImages.openImageInNewTab),
        click: () =>
          this.tab.emit(ETabEventTypes.addTab, this.params.srcURL, true),
      })
    );

    this.addSeparator();

    this.addListItem(
      new TabItem({
        label: EImageTabLabels.downloadImage,
        icon: this.getIconPath(EImageTabImages.downloadImage),
        click: (): void =>
          //@ts-ignore
          this.tab.view.webContents.downloadURL(this.params.srcURL),
      })
    );

    this.addListItem(
      new TabItem({
        label: EImageTabLabels.copyImage,
        icon: this.getIconPath(EImageTabImages.copyImage),
        click: (): void =>
          //@ts-ignore
          this.tab.view.webContents.copyImageAt(this.params.x, this.params.y),
      })
    );

    this.addListItem(
      new TabItem({
        label: EImageTabLabels.copyImageAddress,
        icon: this.getIconPath(EImageTabImages.copyImageAddress),
        click: (): void => clipboard.writeText(this.params.srcURL),
      })
    );

    this.addSeparator();
  }
}

export { ImageItemListBuilder };
module.exports = { ImageItemListBuilder };
