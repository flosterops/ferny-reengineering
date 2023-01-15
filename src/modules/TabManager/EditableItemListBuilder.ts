import { ISeparator, TabItem } from "./TabItem";
import { Tab } from "./Tab";
import { EEditableTabLabels } from "../../types/tabLabels";
import { EEditableTabImages } from "../../types/tabImages";
import { EShortCutTypes } from "../../types/shortCuts";
import { TabItemList } from "./TabItemList";

class EditableItemListBuilder extends TabItemList {
  list: TabItem[] & ISeparator[] = [];
  tab: Tab;
  params: any;

  constructor(tab: Tab, params: any) {
    super(tab, params);

    this.createList();
  }

  private createList() {
    this.addListItem(
      new TabItem({
        label: EEditableTabLabels.cut,
        icon: this.getIconPath(EEditableTabImages.cut),
        accelerator: EShortCutTypes.cut,
        enabled: this.params.editFlags.canCut,
        click: () => this.tab.cut(),
      })
    );

    this.addListItem(
      new TabItem({
        label: EEditableTabLabels.paste,
        icon: this.getIconPath(EEditableTabImages.paste),
        accelerator: EShortCutTypes.paste,
        enabled: this.params.editFlags.canPaste,
        click: () => this.tab.paste(),
      })
    );

    this.addListItem(
      new TabItem({
        label: EEditableTabLabels.pasteAndMatchStyle,
        icon: this.getIconPath(EEditableTabImages.pasteAndMatchStyle),
        accelerator: EShortCutTypes.pasteAndMatchStyle,
        enabled: this.params.editFlags.canPaste,
        click: () => this.tab.pasteAndMatchStyle(),
      })
    );

    this.addSeparator();

    this.addListItem(
      new TabItem({
        label: EEditableTabLabels.undo,
        icon: this.getIconPath(EEditableTabImages.undo),
        accelerator: EShortCutTypes.undo,
        enabled: this.params.editFlags.canUndo,
        click: () => this.tab.undo(),
      })
    );

    this.addListItem(
      new TabItem({
        label: EEditableTabLabels.redo,
        icon: this.getIconPath(EEditableTabImages.redo),
        accelerator: EShortCutTypes.redo,
        enabled: this.params.editFlags.canRedo,
        click: () => this.tab.redo(),
      })
    );

    this.addSeparator();

    this.addListItem(
      new TabItem({
        label: EEditableTabLabels.selectAll,
        icon: this.getIconPath(EEditableTabImages.selectAll),
        accelerator: EShortCutTypes.selectAll,
        enabled: this.params.editFlags.canSelectAll,
        click: () => this.tab.selectAll(),
      })
    );

    this.addSeparator();

    this.addListItem(
      new TabItem({
        label: EEditableTabLabels.delete,
        icon: this.getIconPath(EEditableTabImages.delete),
        accelerator: EShortCutTypes.delete,
        enabled: this.params.editFlags.canDelete,
        click: () => this.tab.delete(),
      })
    );

    this.addSeparator();
  }
}

export { EditableItemListBuilder };
module.exports = { EditableItemListBuilder };
