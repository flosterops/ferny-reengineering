export enum ETabManagerEventTypes {
  activeTabClosed = "active-tab-closed",
  tabActivated = "tab-activated",
  lastTabClosed = "last-tab-closed",
  addStatusNotif = "add-status-notif",
  refreshZoomNotif = "refresh-zoom-notif",
  addHistoryItem = "add-history-item",
  bookmarkTab = "bookmark-tab",
  showOverlay = "show-overlay",
  searchFor = "search-for",
  openHistory = "open-history",
  tabGroupSwitched = "tab-group-switched",
}

export type TVoidHandler = () => void;

export type TActiveTabClosedHandler = (tabClosed: string, pos: number) => void;
export type TTabActivatedHandler = TVoidHandler;
export type TLastTabClosedHandler = TVoidHandler;
export type TAddStatusNotifHandler = (text: string, type: string) => void;
export type TRefreshZoomNotifHandler = (zoomFactor: any) => void;
export type TAddHistoryItemHandler = (url: string) => void;
export type TBookmarkTabHandler = (title: string, url: string) => void;
export type TShowOverlayHandler = TVoidHandler;
export type TSearchForHandler = (text: string) => void;
export type TOpenHistoryHandler = TVoidHandler;
export type TTabGroupSwitchedHandler = (tabGroup: any) => void;

export interface ITabManagerEventModel<E, H> {
  eventType: E;
  eventHandler: H;
}

export type TActiveTabClosedModel = ITabManagerEventModel<
  ETabManagerEventTypes.activeTabClosed,
  TActiveTabClosedHandler
>;

export type TTabActivatedModel = ITabManagerEventModel<
  ETabManagerEventTypes.tabActivated,
  TTabActivatedHandler
>;

export type TLastTabClosedModel = ITabManagerEventModel<
  ETabManagerEventTypes.lastTabClosed,
  TLastTabClosedHandler
>;

export type TAddStatusNotifModel = ITabManagerEventModel<
  ETabManagerEventTypes.addStatusNotif,
  TAddStatusNotifHandler
>;

export type TRefreshZoomNotifModel = ITabManagerEventModel<
  ETabManagerEventTypes.refreshZoomNotif,
  TRefreshZoomNotifHandler
>;

export type TAddHistoryItemModel = ITabManagerEventModel<
  ETabManagerEventTypes.addHistoryItem,
  TAddHistoryItemHandler
>;

export type TBookmarkTabModel = ITabManagerEventModel<
  ETabManagerEventTypes.bookmarkTab,
  TBookmarkTabHandler
>;

export type TShowOverlayModel = ITabManagerEventModel<
  ETabManagerEventTypes.showOverlay,
  TShowOverlayHandler
>;

export type TSearchForModel = ITabManagerEventModel<
  ETabManagerEventTypes.searchFor,
  TSearchForHandler
>;

export type TOpenHistoryModel = ITabManagerEventModel<
  ETabManagerEventTypes.openHistory,
  TOpenHistoryHandler
>;

export type TTabGroupSwitchedModel = ITabManagerEventModel<
  ETabManagerEventTypes.tabGroupSwitched,
  TTabGroupSwitchedHandler
>;

export type TTabManagerEventModel =
  | TActiveTabClosedModel
  | TTabActivatedModel
  | TLastTabClosedModel
  | TAddStatusNotifModel
  | TRefreshZoomNotifModel
  | TAddHistoryItemModel
  | TBookmarkTabModel
  | TShowOverlayModel
  | TSearchForModel
  | TOpenHistoryModel
  | TTabGroupSwitchedModel;
