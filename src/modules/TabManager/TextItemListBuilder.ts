import { TabItemList } from "./TabItemList";
import { TabItem } from "./TabItem";
import { EEditableTabLabels, ELinkTabLabels } from "../../types/tabLabels";
import { EEditableTabImages, ELinkTabImages } from "../../types/tabImages";
import { EShortCutTypes } from "../../types/shortCuts";
import { ETabEventTypes } from "../../types/tabEvents";

class TextItemListBuilder extends TabItemList {
  constructor(tab, params) {
    super(tab, params);

    this.createList();
  }

  private getSearchText() {
    if (this.params.length > 30) {
      return this.params.selectionText.substring(0, 30) + "...";
    }

    return this.params.selectionText;
  }

  private createList() {
    this.addListItem(
      new TabItem({
        label: EEditableTabLabels.copy,
        icon: this.getIconPath(EEditableTabImages.copy),
        accelerator: EShortCutTypes.copy,
        enabled: this.params.editFlags.canCopy,
        click: (): void => this.tab.copy(),
      })
    );

    const text = this.getSearchText();

    this.addListItem(
      new TabItem({
        label: `${ELinkTabLabels.searchFor} "${text}"`,
        icon: this.getIconPath(ELinkTabImages.searchFor),
        enabled: this.params.editFlags.canCopy,
        click: () =>
          this.tab.emit(ETabEventTypes.searchFor, this.params.selectionText),
      })
    );

    this.addSeparator();
  }
}

export { TextItemListBuilder };
module.exports = { TextItemListBuilder };
