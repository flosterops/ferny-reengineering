export interface ITabItem {
  label: string;
  icon?: string;
  accelerator?: string;
  enabled?: boolean;
  click?: () => void;
}
