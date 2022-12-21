"use strict";

const EventEmitter = require("events");
const { BrowserView, Menu, MenuItem, clipboard } = require("electron");

interface IDownload {
    id: number,
    url: string,
    name: string,
    time: number
}

class Overlay extends EventEmitter {
    window = null;
    view = null;
    top = 75;
    appPath = null;

    constructor(window: Window, appPath: string) {
        super();

        this.window = window;
        this.appPath = appPath;
        
        this.view = new BrowserView({
            webPreferences: {
                nodeIntegration: true
            }
        });
        this.view.setAutoResize({
            width: true,
            height: true
        });
        this.view.webContents.loadFile(this.appPath + "/pages/html/overlay.html");

        this.view.webContents.on("context-menu", (event, params) => {
            if(params.isEditable) {
                const editMenu = Menu.buildFromTemplate([{ 
                    label: "Cut", icon: this.appPath + "/assets/imgs/icons16/cut.png", accelerator: "CmdOrCtrl+X", enabled: params.editFlags.canCut, click: (): void => {
                        this.view.webContents.cut();
                    } }, { 
                    label: "Copy", icon: this.appPath + "/assets/imgs/icons16/copy.png", accelerator: "CmdOrCtrl+C", enabled: params.editFlags.canCopy, click: (): void => {
                        this.view.webContents.copy();
                    } }, { 
                    label: "Paste", icon: this.appPath + "/assets/imgs/icons16/paste.png", accelerator: "CmdOrCtrl+V", enabled: params.editFlags.canPaste, click: (): void => {
                        this.view.webContents.paste();
                    } }, { type: "separator" }, { 
                    label: "Undo", icon: this.appPath + "/assets/imgs/icons16/undo.png", accelerator: "CmdOrCtrl+Z", enabled: params.editFlags.canUndo, click: (): void => {
                        this.view.webContents.undo();
                    } }, { 
                    label: "Redo", icon: this.appPath + "/assets/imgs/icons16/redo.png", accelerator: "CmdOrCtrl+Shift+Z", enabled: params.editFlags.canRedo, click: (): void => {
                        this.view.webContents.redo();
                    } }, { type: "separator" }, { 
                    label: "Select all", icon: this.appPath + "/assets/imgs/icons16/select-all.png", accelerator: "CmdOrCtrl+A", enabled: params.editFlags.canSelectAll, click: (): void => {
                        this.view.webContents.selectAll();
                    } }, { type: "separator" }, { 
                    label: "Delete", icon: this.appPath + "/assets/imgs/icons16/delete.png", accelerator: "Backspace", enabled: params.editFlags.canDelete, click: (): void => {
                        this.view.webContents.delete();
                    } }
                ]);

                if(params.y < 320) {
                    const mi = new MenuItem({
                        label: "Paste and search", 
                        icon: appPath + "/assets/imgs/icons16/zoom.png",
                        enabled: params.editFlags.canPaste, 
                        click: (): void => {
                            this.performSearch(clipboard.readText()); }
                    });
                    const sep = new MenuItem({
                        type: "separator"
                    });
                    editMenu.insert(4, mi);
                    editMenu.insert(5, sep);
                }

                editMenu.popup(this.window);
            }
        });
    }

    refreshBounds(): void {
        const size = this.window.getSize();
        if(this.window.isMaximized() && process.platform == "win32") {
            this.view.setBounds({ 
                x: 0,
                y: this.top, 
                width: size[0] - 16,
                height: size[1] - this.top - 16
            });
        } else {
            this.view.setBounds({ 
                x: 0,
                y: this.top, 
                width: size[0],
                height: size[1] - this.top 
            });
        }
    }

    show(): void {
        this.window.setBrowserView(this.view);
        this.refreshBounds();
        this.window.webContents.send("overlay-toggleButton", true);
        this.view.webContents.focus();

        this.emit("show");
    }

    scrollToId(id: string): void {
        this.show();
        this.view.webContents.send("overlay-scrollToId", id);
    }

    showButtonMenu(): void {
        const buttonMenu = Menu.buildFromTemplate([{ 
            label: "Show overlay", icon: this.appPath + "/assets/imgs/icons16/overlay.png", accelerator: "F1", click: (): void => {
                this.show(); 
            } }, { type: "separator" }, { 
            label: "Bookmarks", icon: this.appPath + "/assets/imgs/icons16/bookmarks.png", accelerator: "CmdOrCtrl+B", click: (): void => {
                this.scrollToId("bookmarks-title"); 
            } }, { 
            label: "History", icon: this.appPath + "/assets/imgs/icons16/history.png", accelerator: "CmdOrCtrl+H", click: (): void => {
                this.scrollToId("history-title"); 
            } }, { 
            label: "Downloads", icon: this.appPath + "/assets/imgs/icons16/download.png", accelerator: "CmdOrCtrl+D", click: (): void => {
                this.scrollToId("downloads-title"); 
            } }
          ]);
        buttonMenu.popup(this.window);
    }

    openDevTools(): void {
        this.view.webContents.openDevTools();
    }

    goToSearch(text: string, cursorPos: any): void {
        this.scrollToId("search-title"); 
        this.view.webContents.send("searchManager-goToSearch", text, cursorPos);
    }

    performSearch(text: string): void {
        this.view.webContents.send("searchManager-performSearch", text);
    }

    addBookmark(name: string, url: string): void {
        this.view.webContents.send("bookmarkManager-addBookmark", name, url);
    }

    addFolderWithBookmarks(folderName: string, bookmarks: { name: string, url: string, [key: string]: any }): void {
        this.view.webContents.send("bookmarkManager-addFolderWithBookmarks", folderName, bookmarks);
    }

    addHistoryItem(url: string): void {
        this.view.webContents.send("historyManager-insertBeforeHistoryItem", url);
    }

    clearHistory(): void {
        this.view.webContents.send("historyManager-clearHistory");
    }

    clearDownloads(): void {
        this.view.webContents.send("downloadManager-clearDownloads");
    }

    updateTheme(): void {
        this.view.webContents.send("overlay-updateTheme");
    }

    removeFolder(id: string): void {
        this.view.webContents.send("bookmarkManager-removeFolder", id);
    }

    createDownload(download: IDownload): void {
        this.view.webContents.send("downloadManager-createDownload", download);
    }

    setDownloadStatusInterrupted(download: IDownload): void {
        this.view.webContents.send("downloadManager-setDownloadStatusInterrupted", download);
    }

    setDownloadStatusPause(download: IDownload): void {
        this.view.webContents.send("downloadManager-setDownloadStatusPause", download);
    }

    setDownloadProcess(download: IDownload): void {
        this.view.webContents.send("downloadManager-setDownloadProcess", download);
    }

    setDownloadStatusDone(download: IDownload): void {
        this.view.webContents.send("downloadManager-setDownloadStatusDone", download);
    }

    setDownloadStatusFailed(download: IDownload): void {
        this.view.webContents.send("downloadManager-setDownloadStatusFailed", download);
    }

    setSearchEngine(engineName: string): void {
        this.view.webContents.send("searchManager-setSearchEngine", engineName);
    }

    setFullscreen(bool: boolean): void {
        this.top = bool ? 0 : 75;
        this.refreshBounds();
    }

    checkIfBookmarked(url: string): void {
        this.view.webContents.send("bookmarkManager-checkIfBookmarked", url);
    }

    showBookmarkOptions(id: number): void {
        this.scrollToId("bookmarks-title");
        this.view.webContents.send("bookmarkManager-showBookmarkOptions", id);
    }

    switchTabGroup(tabGroupId: number): void {
        this.view.webContents.send("overlay-switchTabGroup", tabGroupId);
    }

    cut(): void {
        this.view.webContents.cut();
    }

    copy(): void {
        this.view.webContents.copy();
    }

    paste(): void {
        this.view.webContents.paste();
    }

    pasteAndMatchStyle(): void {
        this.view.webContents.pasteAndMatchStyle();
    }

    undo(): void {
        this.view.webContents.undo();
    }

    redo(): void {
        this.view.webContents.redo();
    }

    selectAll(): void {
        this.view.webContents.selectAll();
    }

    delete(): void {
        this.view.webContents.delete();
    }
}

export {}
module.exports = Overlay;
