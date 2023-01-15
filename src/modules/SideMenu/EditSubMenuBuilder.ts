import { SideMenuBuilder } from "./SideMenuBuilder";
import { SideMenuItem } from "./SideMenuItem";
import { ISeparator } from "../TabManager/TabItem";
import { AppController } from "../../widgets/App";
import { MainWindowController } from "../../widgets/MainWindow";
import { OverlayController } from "../../widgets/Overlay";
import { TabManagerController } from "../../widgets/TabManager";
import { AutoUpdaterController } from "../../widgets/AutoUpdater";
import { DownloadsController } from "../downloads";

class EditSubMenuBuilder extends SideMenuBuilder {
  list: SideMenuItem[] & ISeparator[] = [];
  appController: AppController;
  mainWindowController: MainWindowController;
  overlayController: OverlayController;
  tabManagerController: TabManagerController;
  autoUpdaterController: AutoUpdaterController;
  downloadsController: DownloadsController;

  constructor(
    appController: AppController,
    mainWindowController: MainWindowController,
    overlayController: OverlayController,
    tabManagerController: TabManagerController,
    downloadsController: DownloadsController
  ) {
    super(
      appController,
      mainWindowController,
      overlayController,
      tabManagerController,
      downloadsController
    );
  }

  onCut() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().cut();
    } else {
      this.overlayController.overlay.cut();
    }
  }

  onCopy() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().copy();
    } else {
      this.overlayController.overlay.copy();
    }
  }

  onPaste() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().paste();
    } else {
      this.overlayController.overlay.paste();
    }
  }

  onPasteAsPlainText() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().pasteAndMatchStyle();
    } else {
      this.overlayController.overlay.pasteAndMatchStyle();
    }
  }

  onUndo() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().undo();
    } else {
      this.overlayController.overlay.undo();
    }
  }

  onRedo() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().redo();
    } else {
      this.overlayController.overlay.redo();
    }
  }

  onSelectAll() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().selectAll();
    } else {
      this.overlayController.overlay.selectAll();
    }
  }

  onDelete() {
    if (this.tabManagerController.tabManager.hasActiveTab()) {
      this.tabManagerController.tabManager.getActiveTab().delete();
    } else {
      this.overlayController.overlay.delete();
    }
  }

  createList() {
    this.addListItem(
      new SideMenuItem({
        label: "Cut",
        icon: this.getIconPath("/assets/imgs/icons16/cut.png"),
        accelerator: "CmdOrCtrl+X",
        click: this.onCut,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Copy",
        icon: this.getIconPath("/assets/imgs/icons16/copy.png"),
        accelerator: "CmdOrCtrl+C",
        click: this.onCopy,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Paste",
        icon: this.getIconPath("/assets/imgs/icons16/paste.png"),
        accelerator: "CmdOrCtrl+V",
        click: this.onPaste,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Paste as plain text",
        icon: this.getIconPath("/assets/imgs/icons16/paste-special.png"),
        accelerator: "CmdOrCtrl+Shift+V",
        click: this.onPasteAsPlainText,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Undo",
        icon: this.getIconPath("/assets/imgs/icons16/undo.png"),
        accelerator: "CmdOrCtrl+Z",
        click: this.onUndo,
      })
    );

    this.addListItem(
      new SideMenuItem({
        label: "Redo",
        icon: this.getIconPath("/assets/imgs/icons16/redo.png"),
        accelerator: "CmdOrCtrl+Shift+Z",
        click: this.onRedo,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Select all",
        icon: this.getIconPath("/assets/imgs/icons16/select-all.png"),
        accelerator: "CmdOrCtrl+A",
        click: this.onSelectAll,
      })
    );

    this.addSeparator();

    this.addListItem(
      new SideMenuItem({
        label: "Delete",
        icon: this.getIconPath("/assets/imgs/icons16/delete.png"),
        accelerator: "Backspace",
        click: this.onDelete,
      })
    );
  }
}

export { EditSubMenuBuilder };
module.exports = { EditSubMenuBuilder };
