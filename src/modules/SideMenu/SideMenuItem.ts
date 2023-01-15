import { ISeparator, TabItem } from "../TabManager/TabItem";
import { ISideMenuItem } from "../../types/sidemenu";

class SideMenuItem extends TabItem {
  label?: string;
  icon?: string;
  accelerator?: string;
  enabled?: boolean;
  click?: () => void;
  submenu?: (SideMenuItem | ISeparator)[];

  constructor({
    label,
    icon = "",
    accelerator,
    enabled = false,
    click,
    submenu,
  }: ISideMenuItem) {
    super({ label, icon, accelerator, enabled, click });
    this.submenu = submenu;
  }
}

export { SideMenuItem };
module.exports = { SideMenuItem };
