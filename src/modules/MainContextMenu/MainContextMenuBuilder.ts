import { ISeparator, TabItem } from "../TabManager/TabItem";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { appController } from "../../widgets/App";
import { clipboard } from "electron";

class MainContextMenuBuilder {
  list: (TabItem | ISeparator)[];
  mainWindowController: MainWindowController;
  overlayController: OverlayController;
  params: any;

  constructor(
    mainWindowController: MainWindowController,
    overlayController: OverlayController,
    params: any
  ) {
    this.mainWindowController = mainWindowController;
    this.overlayController = overlayController;
    this.params = params;
  }

  protected addSeparator() {
    this.list.push({ type: "separator" });
  }

  protected addListItem(tabItem: TabItem) {
    this.list.push(tabItem);
  }

  protected getIconPath(subPath: string): string {
    return `${appController.getAppPath()}/${subPath}`;
  }

  public getList() {
    return this.list;
  }

  onCut() {
    this.mainWindowController.mainWindow.webContents.cut();
  }

  onCopy() {
    this.mainWindowController.mainWindow.webContents.copy();
  }

  onPaste() {
    this.mainWindowController.mainWindow.webContents.paste();
  }

  onPasteAndSearch() {
    this.overlayController.overlay.performSearch(clipboard.readText());
  }

  onUndo() {
    this.mainWindowController.mainWindow.webContents.undo();
  }

  onRedo() {
    this.mainWindowController.mainWindow.webContents.redo();
  }

  onSelectAll() {
    this.mainWindowController.mainWindow.webContents.selectAll();
  }

  onDelete() {
    this.mainWindowController.mainWindow.webContents.delete();
  }

  createList() {
    this.addListItem(
      new TabItem({
        label: "Cut",
        icon: this.getIconPath("/assets/imgs/icons16/cut.png"),
        accelerator: "CmdOrCtrl+X",
        enabled: this.params.editFlags.canCut,
        click: this.onCut,
      })
    );

    this.addListItem(
      new TabItem({
        label: "Copy",
        icon: this.getIconPath("/assets/imgs/icons16/copy.png"),
        accelerator: "CmdOrCtrl+C",
        enabled: this.params.editFlags.canCopy,
        click: this.onCopy,
      })
    );

    this.addListItem(
      new TabItem({
        label: "Paste",
        icon: this.getIconPath("/assets/imgs/icons16/paste.png"),
        accelerator: "CmdOrCtrl+V",
        enabled: this.params.editFlags.canPaste,
        click: this.onPaste,
      })
    );

    this.addSeparator();

    this.addListItem(
      new TabItem({
        label: "Paste and search",
        icon: this.getIconPath("/assets/imgs/icons16/zoom.png"),
        enabled: this.params.editFlags.canPaste,
        click: this.onPasteAndSearch,
      })
    );

    this.addSeparator();

    this.addListItem(
      new TabItem({
        label: "Undo",
        icon: this.getIconPath("/assets/imgs/icons16/undo.png"),
        accelerator: "CmdOrCtrl+Z",
        enabled: this.params.editFlags.canUndo,
        click: this.onUndo,
      })
    );

    this.addListItem(
      new TabItem({
        label: "Redo",
        icon: this.getIconPath("/assets/imgs/icons16/redo.png"),
        accelerator: "CmdOrCtrl+Shift+Z",
        enabled: this.params.editFlags.canRedo,
        click: this.onRedo,
      })
    );

    this.addSeparator();

    this.addListItem(
      new TabItem({
        label: "Select all",
        icon: this.getIconPath("/assets/imgs/icons16/select-all.png"),
        accelerator: "CmdOrCtrl+A",
        enabled: this.params.editFlags.canSelectAll,
        click: this.onSelectAll,
      })
    );

    this.addSeparator();

    this.addListItem(
      new TabItem({
        label: "Delete",
        icon: this.getIconPath("/assets/imgs/icons16/delete.png"),
        accelerator: "Backspace",
        enabled: this.params.editFlags.canDelete,
        click: this.onDelete,
      })
    );
  }
}

export { MainContextMenuBuilder };
module.exports = { MainContextMenuBuilder };
