import { TabItemList } from "./TabItemList";
import { TabItem } from "./TabItem";
import { clipboard } from "electron";
import { ELinkTabLabels } from "../../types/tabLabels";
import { ELinkTabImages } from "../../types/tabImages";
import { ETabEventTypes } from "../../types/tabEvents";

class LinkItemListBuilder extends TabItemList {
  constructor(tab, params) {
    super(tab, params);

    this.createList();
  }

  private getSearchText() {
    if (this.params.length > 30) {
      return this.params.linkText.substring(0, 30) + "...";
    }

    return this.params.linkText;
  }

  private createList() {
    this.addListItem(
      new TabItem({
        label: ELinkTabLabels.openLinkInNewTab,
        icon: this.getIconPath(ELinkTabImages.openLinkInNewTab),
        click: () =>
          this.tab.emit(ETabEventTypes.addTab, this.params.linkURL, false),
      })
    );

    this.addSeparator();

    this.addListItem(
      new TabItem({
        label: ELinkTabLabels.copyLinkText,
        icon: this.getIconPath(ELinkTabImages.copyLinkText),
        enabled: this.params.linkText > 0,
        click: (): void => clipboard.writeText(this.params.linkText),
      })
    );

    this.addListItem(
      new TabItem({
        label: ELinkTabLabels.copyLinkAddress,
        icon: this.getIconPath(ELinkTabImages.copyLinkAddress),
        click: (): void => clipboard.writeText(this.params.linkURL),
      })
    );

    this.addListItem(
      new TabItem({
        label: ELinkTabLabels.bookmarkLink,
        icon: this.getIconPath(ELinkTabImages.bookmarkLink),
        click: () =>
          this.tab.emit(
            ETabEventTypes.bookmarkTab,
            this.params.linkText,
            this.params.linkURL
          ),
      })
    );

    const text = this.getSearchText();

    this.addListItem(
      new TabItem({
        label: `${ELinkTabLabels.searchFor} "${text}"`,
        icon: this.getIconPath(ELinkTabImages.searchFor),
        enabled: text.length > 0,
        click: () =>
          this.tab.emit(ETabEventTypes.searchFor, this.params.linkText),
      })
    );

    this.addSeparator();
  }
}

export { LinkItemListBuilder };
module.exports = { LinkItemListBuilder };
