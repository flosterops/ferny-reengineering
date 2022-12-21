"use strict";

const EventEmitter = require("events");
const { BrowserView, Menu, MenuItem, clipboard } = require("electron");
const fileExtension = require("file-extension");
const parsePath = require("parse-path");
const parseUrl = require("parse-url");

const extToImagePath = require("../extToImagePath");

class Tab extends EventEmitter {
    id = null;
    view = null;
    window = null;
    position = null;
    group = null;
    incognito = false;

    constructor(window: Window, id: number, appPath: string, group: string, theme: any) {
        super();

        this.id = id;
        this.window = window;
        this.appPath = appPath;
        this.group = group;

        if(group == "incognito") {
            this.incognito = true;
        }

        this.view = new BrowserView({
            webPreferences: {
                preload: appPath + "/pages/webview/webview.js"
            }
        });
        this.view.setAutoResize({
            width: true,
            height: true
        });

        this.view.webContents.on("page-title-updated", (event, title: string): void => {
            this.window.webContents.send("tabRenderer-setTabTitle", { id: this.id, title });
        });

        this.view.webContents.on("page-favicon-updated", (event, favicons: any[]): void => {
            this.window.webContents.send("tabRenderer-setTabIcon", { id: this.id, icon: favicons[0] });
        });
        
        this.view.webContents.on("new-window", (event, url: string, frameName, disposition: string): void => {
            event.preventDefault();
            this.emit("add-tab", url, disposition !== "background-tab");
        });

        this.view.webContents.on("did-navigate", (event, url: string): void => {
            this.window.webContents.send("tabRenderer-setTabIcon", { id: this.id, icon: __dirname + "/../../assets/imgs/gifs/page-loading.gif" });
            this.window.webContents.send("tabRenderer-updateNavigationButtons", {
                canGoBack: this.view.webContents.canGoBack(),
                canGoForward: this.view.webContents.canGoForward(),
                isLoading: this.view.webContents.isLoading()
            });
            this.window.webContents.send("tabRenderer-updateAddressBar", url);

            if(parsePath(url).protocol === "file") {
                const fileName = url.replace(/^.*[\\\/]/, "");
                this.window.webContents.send("tabRenderer-setTabTitle", { id: this.id, title: fileName });
                this.window.webContents.send("tabRenderer-setTabIcon", { id: this.id, icon: extToImagePath(fileExtension(url)) });
            }

            this.emit("add-history-item", url);
        });

        this.view.webContents.on("did-navigate-in-page", (event, url: string, isMainFrame: boolean): void => {
            if(isMainFrame) {
                this.window.webContents.send("tabRenderer-updateNavigationButtons", {
                    canGoBack: this.view.webContents.canGoBack(),
                    canGoForward: this.view.webContents.canGoForward(),
                    isLoading: this.view.webContents.isLoading()
                });
                this.window.webContents.send("tabRenderer-updateAddressBar", url);
            }
        });

        this.view.webContents.on("did-fail-load", (event, errorCode: number | string, errorDescription: string): void => {
            this.window.webContents.send("tabRenderer-updateNavigationButtons", {
                canGoBack: this.view.webContents.canGoBack(),
                canGoForward: this.view.webContents.canGoForward(),
                isLoading: this.view.webContents.isLoading()
            });

            this.emit("add-status-notif", "Connection failed: " + errorDescription + " (" + errorCode + ")", "error");
        });

        this.view.webContents.on("certificate-error", (event, url: string, error: string | number) => {
            this.emit("add-status-notif", "Certificate error: " + url + " (" + error + ")", "warning");
        });

        this.view.webContents.on("dom-ready", (): void => {
            this.view.webContents.insertCSS(`
                html, body { 
                    background-color: white; 
                }

                ::-webkit-scrollbar {
                    width: 12px;
                    height: 12px;
                    background-color: ${theme.colorBack};
                }
                
                ::-webkit-scrollbar-thumb {
                    border: 4px solid ${theme.colorBack};
                    background-color: ${theme.colorBorder};
                    border-radius: 6px;
                    min-width: 32px;
                    min-height: 32px;
                }

                ::-webkit-scrollbar-corner {
                    background-color: ${theme.colorBack};
                }
            `);
        });

        this.view.webContents.on("did-start-loading", (): void => {
            this.window.webContents.send("tabRenderer-updateNavigationButtons", {
                canGoBack: this.view.webContents.canGoBack(),
                canGoForward: this.view.webContents.canGoForward(),
                isLoading: this.view.webContents.isLoading()
            });
        });

        this.view.webContents.on("did-stop-loading", (): void => {
            this.window.webContents.send("tabRenderer-updateNavigationButtons", {
                canGoBack: this.view.webContents.canGoBack(),
                canGoForward: this.view.webContents.canGoForward(),
                isLoading: this.view.webContents.isLoading()
            });
        });

        this.view.webContents.on("enter-html-full-screen", (): void => {
            this.emit("add-status-notif", "Press F11 to exit full screen", "info");
            this.emit("fullscreen", true);
        });

        this.view.webContents.on("leave-html-full-screen", (): void => {
            this.emit("fullscreen", false);
        });

        this.view.webContents.on("update-target-url", (event, url: string): void => {
            this.window.webContents.send("tabRenderer-updateTargetURL", url);
        });

        this.view.webContents.on("context-menu", (event, params: Record<string, any>): void => {
            let rmbMenuItems = [];

            if(params.isEditable) {
                const editableItems = [{
                    label: "Cut", icon: this.appPath + "/assets/imgs/icons16/cut.png", accelerator: "CmdOrCtrl+X", enabled: params.editFlags.canCut, click: () => {
                        this.cut();
                    } }, { 
                    label: "Copy", icon: this.appPath + "/assets/imgs/icons16/copy.png", accelerator: "CmdOrCtrl+C", enabled: params.editFlags.canCopy, click: () => {
                        this.copy();
                    } }, {
                    label: "Paste", icon: this.appPath + "/assets/imgs/icons16/paste.png", accelerator: "CmdOrCtrl+V", enabled: params.editFlags.canPaste, click: () => {
                        this.paste();
                    } }, { type: "separator" }, { 
                    label: "Paste as plain text", icon: this.appPath + "/assets/imgs/icons16/paste-special.png", accelerator: "CmdOrCtrl+Shift+V", enabled: params.editFlags.canPaste, click: () => {
                        this.pasteAndMatchStyle();
                    } }, { type: "separator" }, { 
                    label: "Undo", icon: this.appPath + "/assets/imgs/icons16/undo.png", accelerator: "CmdOrCtrl+Z", enabled: params.editFlags.canUndo, click: () => {
                        this.undo();
                    } }, { 
                    label: "Redo", icon: this.appPath + "/assets/imgs/icons16/redo.png", accelerator: "CmdOrCtrl+Shift+Z", enabled: params.editFlags.canRedo, click: () => {
                        this.redo();
                    } }, { type: "separator" }, { 
                    label: "Select all", icon: this.appPath + "/assets/imgs/icons16/select-all.png", accelerator: "CmdOrCtrl+A", enabled: params.editFlags.canSelectAll, click: () => {
                        this.selectAll();
                    } }, { type: "separator" }, { 
                    label: "Delete", icon: this.appPath + "/assets/imgs/icons16/delete.png", accelerator: "Backspace", enabled: params.editFlags.canDelete, click: () => {
                        this.delete();
                    } }, { type: "separator" }
                ];
                rmbMenuItems = rmbMenuItems.concat(editableItems);
            } else {
                let pageBool = true;
                if(params.linkURL.length > 0) {
                    pageBool = false;
                    let text = params.linkText;
                    if(text.length > 30) {
                        text = text.substring(0, 30) + "...";
                    }
                    const linkItems = [{
                        label: "Open link in new tab", icon: this.appPath + "/assets/imgs/icons16/tab.png", click: (): void => {
                            this.emit("add-tab", params.linkURL, false);
                        } }, { type: "separator" }, { 
                        label: "Copy link text", icon: this.appPath + "/assets/imgs/icons16/text.png", enabled: (params.linkText > 0), click: (): void => {
                            clipboard.writeText(params.linkText); 
                        } }, { 
                        label: "Copy link address", icon: this.appPath + "/assets/imgs/icons16/link.png", click: (): void => {
                            clipboard.writeText(params.linkURL); 
                        } }, {
                        label: "Bookmark link", icon: this.appPath + "/assets/imgs/icons16/add-bookmark.png", click: (): void => {
                            this.emit("bookmark-tab", params.linkText, params.linkURL);
                        } }, {
                        label: `Search for "${text}"`, icon: this.appPath + "/assets/imgs/icons16/zoom.png", enabled: (text.length > 0), click: (): void => {
                            this.emit("search-for", params.linkText);
                        } }, { type: "separator" }
                    ];
                    rmbMenuItems = rmbMenuItems.concat(linkItems);
                }

                if(params.hasImageContents) {
                    pageBool = false;
                    const imageItems = [{
                        label: "Open image in new tab", icon: this.appPath + "/assets/imgs/icons16/image.png", click: (): void => {
                            this.emit("add-tab", params.srcURL, true);
                        } }, { type: "separator" }, { 
                        label: "Download image", icon: this.appPath + "/assets/imgs/icons16/download.png", click: (): void => {
                            this.view.webContents.downloadURL(params.srcURL);
                        } }, { 
                        label: "Copy image", icon: this.appPath + "/assets/imgs/icons16/copy.png", click: (): void => {
                            this.view.webContents.copyImageAt(params.x, params.y);
                        } }, { 
                        label: "Copy image address", icon: this.appPath + "/assets/imgs/icons16/link.png", click: (): void => {
                            clipboard.writeText(params.srcURL);
                        } }, { type: "separator" }
                    ];
                    rmbMenuItems = rmbMenuItems.concat(imageItems);
                }

                if(params.selectionText.length > 0) {
                    pageBool = false;
                    let text = params.selectionText;
                    if(text.length > 30) {
                        text = text.substring(0, 30) + "...";
                    }
                    const textItems = [{
                        label: "Copy", icon: this.appPath + "/assets/imgs/icons16/copy.png", accelerator: "CmdOrCtrl+C", enabled: params.editFlags.canCopy, click: (): void => {
                            this.copy();
                        } }, {
                        label: `Search for "${text}"`, icon: this.appPath + "/assets/imgs/icons16/zoom.png", enabled: params.editFlags.canCopy, click: (): void => {
                            this.emit("search-for", params.selectionText);
                        } }, { type: "separator" }
                    ];
                    rmbMenuItems = rmbMenuItems.concat(textItems);
                }

                if(pageBool) {
                    const pageItems = [{
                        label: "Back", icon: this.appPath + "/assets/imgs/icons16/back.png", accelerator: "Alt+Left", enabled: this.view.webContents.canGoBack(), click: (): void => {
                            this.goBack();
                        } }, { 
                        label: "Forward", icon: this.appPath + "/assets/imgs/icons16/forward.png", accelerator: "Alt+Right", enabled: this.view.webContents.canGoForward(), click: (): void => {
                            this.goForward();
                        } }, { 
                        label: "Reload", icon: this.appPath + "/assets/imgs/icons16/reload.png", accelerator: "F5", click: (): void => {
                            this.reload();
                        } }, { type: "separator" }, {
                        label: "Download page", icon: this.appPath + "/assets/imgs/icons16/download.png", accelerator: "CmdOrCtrl+Shift+S", click: (): void => {
                            this.downloadPage();
                        } }, {
                        label: "Bookmark page", icon: this.appPath + "/assets/imgs/icons16/add-bookmark.png", click: (): void => {
                            this.emit("bookmark-tab", this.getTitle(), this.getURL());
                        } }, { type: "separator" }, {
                        label: "Select all", icon: this.appPath + "/assets/imgs/icons16/select-all.png", accelerator: "CmdOrCtrl+A", click: (): void => {
                            this.selectAll();
                        } }, { type: "separator" }, {
                        label: "View page source", icon: this.appPath + "/assets/imgs/icons16/code.png", click: (): void => {
                            this.viewPageSource();
                        } }
                    ];
                    rmbMenuItems = rmbMenuItems.concat(pageItems);
                }
            }

            rmbMenuItems.push({
                label: "Inspect element", icon: this.appPath + "/assets/imgs/icons16/inspect.png", click: (): void => {
                    this.inspectElement(params.x, params.y);
                } }
            );

            const rmbMenu = Menu.buildFromTemplate(rmbMenuItems);
            rmbMenu.popup(this.window);
        });
    }

    getId(): number {
        return this.id;
    }

    setBounds(x: number | null, y: number | null, width: number, height: number): void {
        this.view.setBounds({ x, y, width, height });
    }

    inspectElement(x: number | null, y: number | null): void {
        this.view.webContents.inspectElement(x, y);
    }

    viewPageSource(): void {
        this.emit("add-tab", "view-source:" + this.getURL(), true);
    }

    navigate(url: string): void {
        if(this.incognito) {
            this.view.webContents.loadURL(url, {
                extraHeaders: 'pragma: no-cache\n'
            });
        } else {
            this.view.webContents.loadURL(url);
        }
    }

    close(): void {
        this.view.destroy();
        this.window.webContents.send("tabRenderer-closeTab", this.id);

        this.emit("close", this);
    }

    activate(): void {
        this.window.setBrowserView(this.view);
        this.window.webContents.send("tabRenderer-activateTab", this.id);
        this.window.webContents.send("tabRenderer-updateNavigationButtons", {
            canGoBack: this.view.webContents.canGoBack(),
            canGoForward: this.view.webContents.canGoForward(),
            isLoading: this.view.webContents.isLoading()
        });
        this.window.webContents.send("tabRenderer-updateAddressBar", this.getURL());
        this.view.webContents.focus();

        this.stopFindInPage(false);
        this.window.webContents.send("findInPage-updateFindInPage");

        this.emit("activate", this);
    }

    isActive(): boolean {
        let active = false;
        if(this.window.getBrowserView() === this.view) {
            active = true;
        }
        return active;
    }

    goBack(): void {
        this.view.webContents.goBack();
    }

    goForward(): void {
        this.view.webContents.goForward();
    }

    canGoBack(): boolean {
        return this.view.webContents.canGoBack();
    }

    reload(): void {
        this.view.webContents.reload();
    }

    stop(): void {
        this.view.webContents.stop();
    }

    getURL(): string {
        return this.view.webContents.getURL();
    }

    getTitle(): string {
        return this.view.webContents.getTitle();
    }

    closeOthers(): void {
        this.emit("close-others", this.id);
    }

    closeToTheRight(): void {
        this.emit("close-to-the-right", this.position);
    }

    reloadIgnoringCache(): void {
        this.view.webContents.reloadIgnoringCache();
    }

    goHome(): void {
        this.emit("go-home", this);
    }

    copyURL(): void {
        clipboard.writeText(this.getURL());
    }

    duplicate(): void {
        this.emit("add-tab", this.getURL(), true);
    }

    showMenu(): void {
        const tabMenu = Menu.buildFromTemplate([{ 
            label: "Back", icon: this.appPath + "/assets/imgs/icons16/back.png", accelerator: "Alt+Left", enabled: this.view.webContents.canGoBack(), click: (): void => {
                this.goBack(); 
            } }, { 
            label: "Forward", icon: this.appPath + "/assets/imgs/icons16/forward.png", accelerator: "Alt+Right", enabled: this.view.webContents.canGoForward(), click: (): void => {
                this.goForward(); 
            } }, { 
            label: "Reload", icon: this.appPath + "/assets/imgs/icons16/reload.png", accelerator: "F5", click: (): void => {
                this.reload(); 
            } }, {
            label: "Reload ignoring cache", icon: this.appPath + "/assets/imgs/icons16/db-reload.png", accelerator: "CmdOrCtrl+Shift+F5", click: (): void => {
                this.reloadIgnoringCache(); 
            } }, { type: "separator" }, { 
            label: "Duplicate", icon: this.appPath + "/assets/imgs/icons16/copy.png", accelerator: "CmdOrCtrl+Shift+D", click: (): void => {
                this.duplicate(); 
            } }, { 
            label: "Copy URL", icon: this.appPath + "/assets/imgs/icons16/link.png", accelerator: "CmdOrCtrl+Shift+C", click: (): void => {
                this.copyURL(); 
            } }, { 
            label: "Go home", icon: this.appPath + "/assets/imgs/icons16/home.png", accelerator: "CmdOrCtrl+Shift+H", click: (): void => {
                this.goHome(); 
            } }, { 
            label: "Bookmark tab", icon: this.appPath + "/assets/imgs/icons16/add-bookmark.png", accelerator: "CmdOrCtrl+Shift+B", click: (): void => {
                this.emit("bookmark-tab", this.getTitle(), this.getURL());
            } }, { type: "separator" }, { 
            label: "Move tab", icon: this.appPath + "/assets/imgs/icons16/move-horizontal.png", submenu: [{
                label: "Move left", accelerator: "CmdOrCtrl+Shift+PageUp", icon: this.appPath + "/assets/imgs/icons16/prev.png", click: (): void => {
                    this.moveLeft();
                } }, {
                label: "Move right", accelerator: "CmdOrCtrl+Shift+PageDown", icon: this.appPath + "/assets/imgs/icons16/next.png", click: (): void => {
                    this.moveRight();
                } }, { type: "separator" }, {
                label: "Move to start", accelerator: "CmdOrCtrl+Shift+Home", icon: this.appPath + "/assets/imgs/icons16/to-start.png", click: (): void => {
                    this.moveToStart();
                } }, {
                label: "Move to end", accelerator: "CmdOrCtrl+Shift+End", icon: this.appPath + "/assets/imgs/icons16/to-end.png", click: (): void => {
                    this.moveToEnd();
                } } 
            ] }, { type: "separator" }, { 
            label: "Close to the right", icon: this.appPath + "/assets/imgs/icons16/swipe-right.png", click: (): void => {
                this.closeToTheRight(); 
            } }, { 
            label: "Close others", icon: this.appPath + "/assets/imgs/icons16/swipe-both.png", accelerator: "CmdOrCtrl+Shift+W", click: (): void => {
                this.closeOthers(); 
            } }, { 
            label: "Close tab", icon: this.appPath + "/assets/imgs/icons16/close.png", accelerator: "CmdOrCtrl+W", click: (): void => {
                this.close(); 
            } }
        ]);

        const history = new MenuItem({
            label: "Tab history",
            icon: this.appPath + "/imgs/icons16/history.png",
            submenu: []
        });

        this.view.webContents.history.forEach((value): void => {
            let subtext = value;
            if(subtext.length > 30) {
                subtext = subtext.substring(0, 30) + "...";
            }

            const parsedUrl = parseUrl(value);
            let text = parsedUrl.resource + parsedUrl.pathname;
            if(text.length > 30) {
                text = text.substring(0, 30) + "...";
            }

            const historyItem = new MenuItem({
                label: text,
                sublabel: subtext,
                click: () => {
                    this.navigate(value);
                },
                icon: this.appPath + "/imgs/icons16/link.png"
            });
            history.submenu.append(historyItem);
        });

        tabMenu.insert(10, history);

        tabMenu.popup(this.window);
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

    getPosition(): string {
        return this.position;
    }

    setPosition(position: string) {
        this.position = position;
    }

    nextTab(): void {
        this.emit("next-tab", this.position);
    }

    prevTab(): void {
        this.emit("prev-tab", this.position);
    }

    openDevTools(): void {
        this.view.webContents.openDevTools();
    }

    zoomIn(): void {
        const zoomFactor = this.view.webContents.getZoomFactor();
        if(zoomFactor < 2.5) {
          this.view.webContents.setZoomFactor(zoomFactor + 0.1);
          this.emit("refresh-zoom-notif", Math.round((zoomFactor + 0.1) * 100));
        }
    }

    zoomOut(): void {
        const zoomFactor = this.view.webContents.getZoomFactor();
        if(zoomFactor > 0.3) {
          this.view.webContents.setZoomFactor(zoomFactor - 0.1);
          this.emit("refresh-zoom-notif", Math.round((zoomFactor - 0.1) * 100));
        }
    }

    zoomToActualSize(): void {
        const zoomFactor = this.view.webContents.getZoomFactor();
        if(zoomFactor !== 1) {
            this.view.webContents.setZoomFactor(1);
            this.emit("refresh-zoom-notif", 100);
        }
    }

    moveLeft(): void {
        this.emit("move-left", this.id, this.position);
    }

    moveRight(): void {
        this.emit("move-right", this.id, this.position);
    }

    moveToStart(): void {
        this.emit("move-to-start", this.id, this.position);
    }

    moveToEnd(): void {
        this.window.webContents.send("tabRenderer-moveTabToEnd", this.id);
    }

    popupTabHistory(): void {
        const tabHistory = Menu.buildFromTemplate([]);

        this.view.webContents.history.forEach((value) => {
            let subtext = value;
            if(subtext.length > 30) {
                subtext = subtext.substring(0, 30) + "...";
            }

            const parsedUrl = parseUrl(value);
            let text = parsedUrl.resource + parsedUrl.pathname;
            if(text.length > 30) {
                text = text.substring(0, 30) + "...";
            }

            const historyItem = new MenuItem({
                label: text,
                sublabel: subtext,
                click: () => {
                    this.navigate(value);
                },
                icon: this.appPath + "/imgs/icons16/link.png"
            });
            tabHistory.append(historyItem);
        });

        const sep = new MenuItem({ type: "separator" });
        tabHistory.append(sep);

        const showFullHistory = new MenuItem({
            label: "Show full history",
            accelerator: "CmdOrCtrl+H",
            click: () => {
                this.emit("open-history");
            },
            icon: this.appPath + "/imgs/icons16/history.png"
        });
        tabHistory.append(showFullHistory);

        tabHistory.popup(this.window);
    }

    downloadPage(): void {
        this.view.webContents.downloadURL(this.getURL());
    }

    setGroup(group: string): void {
        this.group = group;
        this.emit("group-changed");
    }

    getGroup(): string {
        return this.group;
    }

    setVisibility(bool: boolean): void {
        if(!bool) {
            this.position = "-1";
        }
        this.window.webContents.send("tabRenderer-setTabVisibility", this.id, bool);
    }

    findInPage(text: string, forward: any): void {
        this.view.webContents.findInPage(text, { forward });
    }

    stopFindInPage(keepSelection: boolean | string): void {
        if(keepSelection) {
            this.view.webContents.stopFindInPage("keepSelection");
        } else {
            this.view.webContents.stopFindInPage("clearSelection");
        }
    }

    requestTabPreview(): void {
        if(this.getTitle().length > 0 && this.getURL().length > 0) {
            this.window.webContents.send("tabRenderer-showTabPreview", this.id, this.getTitle(), this.getURL());
        }
    }
}

export {}
module.exports = Tab;
