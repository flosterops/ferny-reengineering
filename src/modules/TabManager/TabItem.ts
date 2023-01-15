import { ITabItem } from "../../types/tab";

export interface ISeparator {
  type: string;
}

class TabItem {
  label?: string;
  icon?: string;
  accelerator?: string;
  enabled?: boolean;
  click?: () => void;

  constructor({ label, icon, accelerator, enabled = false, click }: ITabItem) {
    this.label = label;
    this.icon = icon;
    this.accelerator = accelerator;
    this.enabled = enabled;
    this.click = click;
  }
}

export { TabItem };
module.exports = { TabItem };
