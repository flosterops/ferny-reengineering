import { ITabItem } from "./tab";
import { ISeparator } from "../modules/TabManager/TabItem";
import { SideMenuItem } from "../modules/SideMenu/SideMenuItem";

export interface ISideMenuItem extends ITabItem {
  submenu?: (SideMenuItem | ISeparator)[];
}
