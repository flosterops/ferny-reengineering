import { Tab } from "./Tab";
import { ISeparator, TabItem } from "./TabItem";
import {
  EEditableTabImages,
  EImageTabImages,
  ELinkTabImages,
  EPageTabImages,
} from "../../types/tabImages";

class TabItemList {
  list: TabItem[] & ISeparator[] = [];
  tab: Tab;
  params: any;

  constructor(tab: Tab, params: any) {
    this.list = [];
    this.tab = tab;
    this.params = params;
  }

  protected addSeparator() {
    this.list.push({ type: "separator" });
  }

  protected addListItem(tabItem: TabItem) {
    this.list.push(tabItem);
  }

  protected getIconPath(
    subPath:
      | EEditableTabImages
      | ELinkTabImages
      | EImageTabImages
      | EPageTabImages
  ): string {
    return `${this.tab.appPath}/${subPath}`;
  }

  public getList() {
    return this.list;
  }
}

export { TabItemList };
module.exports = { TabItemList };
