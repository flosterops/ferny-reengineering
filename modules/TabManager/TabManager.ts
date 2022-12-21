"use strict";

const EventEmitter = require("events");
const { Menu, MenuItem } = require("electron");

const loadTabClosedModule = require("../loadTabClosed");

const Tab = require("./Tab");

class TabManager extends EventEmitter {
    left = 0; 
    right = 0; 
    top = 0; 
    bottom = 0;

    tabs = [];
    tabCounter = 0;
    window = null;
    appPath = null;

    homePage = "https://google.com";
    tabClosedAction = "overlay";

    tabGroup: number | string = 0;

    constructor(window: Window, appPath: string, theme: any) {
        super();

        this.window = window;
        this.appPath = appPath;
        this.theme = theme;

        this.left = 0; 
        this.right = 0; 
        this.top = 75; 
        this.bottom = 0;

        loadTabClosedModule().then((tabClosed) => {
            this.setTabClosedAction(tabClosed);
        });
    }

    newTab(): void {
        this.addTab(this.homePage, true);
    }

    newBackgroundTab(): void {
        this.addTab(this.homePage, false);
    }

    addTab(url: string, active: boolean): void {
        const id = this.tabCounter++;

        const tab = new Tab(this.window, id, this.appPath, this.tabGroup, this.theme);

        tab.on("close", (closedTab): void => {
            const pos = closedTab.getPosition();
            this.destroyTabById(id);

            if(closedTab.isActive()) {
                this.emit("active-tab-closed", this.tabClosedAction, pos);
            }

            if(this.tabs.length === 0) {
                this.emit("last-tab-closed");
            }
        });

        tab.on("activate", (activatedTab): void => {
            setTimeout(() => {
                if(this.window.isMaximized() && process.platform == "win32") {
                    activatedTab.setBounds(this.left - 16, this.top, this.getWidth(), this.getHeight() - 16);
                } else {
                    activatedTab.setBounds(this.left, this.top, this.getWidth(), this.getHeight());
                }
            }, 150);
            this.emit("tab-activated");
        });

        tab.on("add-tab", (url: string, active: boolean): void => {
            this.addTab(url, active);
        });

        tab.on("add-status-notif", (text: string, type: string): void => {
            this.emit("add-status-notif", text, type);
        });

        tab.on("refresh-zoom-notif", (zoomFactor: any): void => {
            this.emit("refresh-zoom-notif", zoomFactor);
        });

        tab.on("fullscreen", (bool: boolean): void => {
            this.setFullscreen(bool);
        });

        tab.on("go-home", (tab): void => {
            tab.navigate(this.homePage);
        });

        tab.on("close-to-the-right", (position: number): void => {
            const closableTabs = [];
            for(let i = this.tabs.length - 1; i >= 0; i--) {
                if(this.tabs[i].getGroup() == this.tabGroup && this.tabs[i].getPosition() > position) {
                    closableTabs.push(this.tabs[i]);
                }
            }
            this.closeMultipleTabs(closableTabs);
        });

        tab.on("close-others", (id: number): void => {
            const closableTabs = [];
            for(let i = this.tabs.length - 1; i >= 0; i--) {
                if(this.tabs[i].getGroup() == this.tabGroup && this.tabs[i].getId() != id) {
                    closableTabs.push(this.tabs[i]);
                }
            }
            this.closeMultipleTabs(closableTabs);
        });

        tab.on("next-tab", (position: number): void => {
            this.tabs.forEach((item) => {
                if(item.getPosition() == position + 1) {
                    item.activate();
                }
            });
        });

        tab.on("prev-tab", (position: number): void => {
            this.tabs.forEach((item) => {
                if(item.getPosition() == position - 1) {
                    item.activate();
                }
            });
        });

        tab.on("move-left", (id: number, position: number): void => {
            this.tabs.forEach((item) => {
                if(item.getPosition() == position - 1) {
                    this.window.webContents.send("tabRenderer-moveTabBefore", id, item.getId());
                }
            });
        });

        tab.on("move-right", (id: number, position: number): void => {
            let rightTab = null;

            this.tabs.forEach((item) => {
                if(item.getPosition() == position + 2) {
                    rightTab = item;
                }
            });

            if(rightTab) {
                this.window.webContents.send("tabRenderer-moveTabBefore", id, (rightTab)?.getId());
            } else {
                this.window.webContents.send("tabRenderer-moveTabToEnd", id);
            }
        });

        tab.on("move-to-start", (id: number, position: number): void => {
            this.tabs.forEach((item) => {
                if(item.getPosition() == 0 && position != 0) {
                    this.window.webContents.send("tabRenderer-moveTabBefore", id, item.getId());
                }
            });
        });

        tab.on("add-history-item", (url: string): void => {
            this.emit("add-history-item", url);
        });

        tab.on("bookmark-tab", (title: string, url: string): void => {
            this.emit("bookmark-tab", title, url);
        });

        tab.on("search-for", (text: string): void => {
            this.emit("search-for", text);
        });

        tab.on("open-history", (): void => {
            this.emit("open-history");
        });

        tab.on("group-changed", (): void => {
            this.updateTabGroups();
        });

        this.tabs.push(tab);

        tab.navigate(url);

        this.window.webContents.send("tabRenderer-addTab", { id, url, active });

        if(active) {
            tab.activate();
            tab.setBounds(this.left, this.top, this.getWidth(), this.getHeight());
        }
    }

    setFullscreen(bool: boolean): void {
        if(bool) {
            this.top = 0;
        } else {
            this.top = 75;
        }
        if(this.hasActiveTab()) {
            this.getActiveTab().activate();
        }
    }

    getWidth(): number {
        return this.window.getSize()[0] - this.left - this.right;
    }

    getHeight(): number {
        return this.window.getSize()[1] - this.top - this.bottom;
    }

    setLeft(left: number): void {
        this.left = left;
    }

    setRight(right: number): void {
        this.right = right;
    }

    setTop(top: number): void {
        this.top = top;
    }

    setBottom(bottom: number): void {
        this.bottom = bottom;
    }

    hasTabs(): boolean {
        if(this.tabs.length > 0) {
            let groupHasTabs = false;
            for(let i = 0; i < this.tabs.length; i++) {
                if(this.tabs[i].getGroup() == this.tabGroup) {
                    groupHasTabs = true;
                    break;
                }
            }
            return groupHasTabs;
        } else {
            return false;
        }
    }

    hasActiveTab(): boolean {
        let bool = false;
        for(let i = 0; i < this.tabs.length; i++) {
            if(this.tabs[i].isActive()) {
                bool = true;
                break;
            }
        }
        return bool;
    }

    getActiveTab(): any {
        for(let i = 0; i < this.tabs.length; i++) {
            if(this.tabs[i].isActive()) {
                return this.tabs[i];
            }
        }
    }

    getTabById(id: number): any {
        for(let i = 0; i < this.tabs.length; i++) {
            if(this.tabs[i].getId() == id) {
                return this.tabs[i];
            }
        }
    }

    getTabByPosition(pos: number): any {
        for(let i = 0; i < this.tabs.length; i++) {
            if(this.tabs[i].getPosition() === pos) {
                return this.tabs[i];
            }
        }
    }

    destroyTabById(id: number): void {
        for(let i = 0; i < this.tabs.length; i++) {
            if(this.tabs[i].getId() == id) {
                this.tabs.splice(i, 1);
            }
        }
    }

    getTabs(): any[] {
        return this.tabs;
    }

    setHomePage(homePage: any) {
        this.homePage = homePage.url;
        this.window.webContents.send("tabRenderer-setHomePage", homePage);
    }

    getHomePage(): any {
        return this.homePage;
    }

    setTabClosedAction(tabClosed: string): void {
        this.tabClosedAction = tabClosed;
    }

    unactivateAllTabs(): void {
        this.window.webContents.send("tabRenderer-unactivateAllTabs");
    }

    showTabList(arr: any[]): void {
        const m = new Menu();

        if(arr.length > 0) {
            arr.forEach((item, index): void => {
                const num = index + 1;
                let text = item.title;
                if(text.length > 30) {
                    text = text.substring(0, 30) + "...";
                }
                if (index < 9) {
                    const mi = new MenuItem({
                        type: "checkbox",
                        label: text,
                        checked: item.active,
                        accelerator: "CmdOrCtrl+" + num,
                        click: () => { this.getTabById(item.id).activate(); }
                    });
                    m.append(mi);
                } else {
                    const mi = new MenuItem({
                        type: "checkbox",
                        label: text + " [" + num + "]",
                        checked: item.active,
                        click: () => { this.getTabById(item.id).activate(); }
                    });
                    m.append(mi);
                }
            });
        } else {
            m.append(new MenuItem({ 
                label: "New Tab", 
                icon: this.appPath + "/assets/imgs/icons16/create.png",
                accelerator: "CmdOrCtrl+T", 
                click: (): void => { this.newTab(); }
            }));
        }  
        
        m.append(new MenuItem({ type: "separator" }));
        m.append(new MenuItem({ 
            label: "Next tab", 
            icon: this.appPath + "/assets/imgs/icons16/next.png",
            accelerator: "CmdOrCtrl+Tab", 
            enabled: this.hasTabs(),
            click: (): void => {
                if(this.hasActiveTab()) {
                    if(this.getActiveTab().getPosition() == this.getMaxPosition()) {
                        this.emit("show-overlay");
                    } else {
                        this.getActiveTab().nextTab(); 
                    }
                } else {
                    this.getTabByPosition(0).activate();
                }
            } 
        }));
        m.append(new MenuItem({ 
            label: "Previous tab", 
            icon: this.appPath + "/assets/imgs/icons16/prev.png",
            accelerator: "CmdOrCtrl+Shift+Tab", 
            enabled: this.hasTabs(),
            click: (): void => {
                if(this.hasActiveTab()) {
                    if(this.getActiveTab().getPosition() == 0) {
                        this.emit("show-overlay");
                    } else {
                        this.getActiveTab().prevTab(); 
                    }
                } else {
                    this.getTabByPosition(this.getMaxPosition()).activate();
                }
            } 
        }));
        m.append(new MenuItem({ type: "separator" }));
        m.append(new MenuItem({ 
            label: "Close all tabs", 
            accelerator: "CmdOrCtrl+Q",
            icon: this.appPath + "/assets/imgs/icons16/close.png",
            enabled: this.hasTabs(),
            click: (): void => {
                this.closeAllTabs();
            } 
        }));

        m.popup(this.window);
    }

    updateTabsPositions(arr: any[]): void {
        for(let i = 0; i < arr.length; i++) {
            const tab = this.getTabById(arr[i]);
            if (tab) {
                this.getTabById(arr[i]).setPosition(i);
            }
        }
    }

    switchTab(number: number): void {
        this.tabs.forEach((item) => {
            if(item.getPosition() == number - 1) {
                item.activate();
            }
        });
    }

    closeAllTabs(): void {
        const closableTabs = [];

        for(let i = this.tabs.length - 1; i >= 0; i--) {
            if(this.tabs[i].getGroup() == this.tabGroup) {
                closableTabs.push(this.tabs[i]);
            }
        }

        this.closeMultipleTabs(closableTabs);
    }

    closeMultipleTabs(closableTabs: any[]): void {
        for(let i = closableTabs.length - 1; i >= 0; i--) {
            closableTabs[i].close();
        }
    }

    updateTabGroups(): void {
        this.tabs.forEach((tab) => {
            tab.setVisibility(tab.getGroup() == this.tabGroup);
        });
        this.window.webContents.send("tabRenderer-updateTabsPositions");
    }

    switchTabGroup(tabGroupId: string): void {
        this.tabGroup = tabGroupId;
        this.updateTabGroups();

        this.emit("tab-group-switched", this.tabGroup);
    }

    getMaxPosition(): number {
        let maxPosition = -1;
        for(let i = 0; i < this.tabs.length; i++) {
            if(this.tabs[i].getPosition() > maxPosition) {
                maxPosition = this.tabs[i].getPosition();
            }
        }
        return maxPosition;
    }
}

export {}
module.exports = TabManager;
