import EventEmitter from "events";
import { ipcRenderer } from "electron";
import GetAvColor from "color.js";
import parseUrl from "parse-url";

import { ColorsUtility } from "../rgbToRgbaString";

class TabRenderer extends EventEmitter {
  tabContainer;
  backButton;
  forwardButton;
  reloadButton;
  stopButton;
  addressBar;
  targetURL;
  tabDrag;
  bookmarkButton;
  bookmarkedButton;

  constructor() {
    super();

    this.tabContainer = document.querySelector<HTMLElement>("#tabman-tabs");
    this.backButton = document.querySelector<HTMLElement>("#back-btn");
    this.forwardButton = document.querySelector<HTMLElement>("#forward-btn");
    this.reloadButton = document.querySelector<HTMLElement>("#reload-btn");
    this.stopButton = document.querySelector<HTMLElement>("#stop-btn");
    this.addressBar = document.querySelector<HTMLElement>("#search-input");
    this.targetURL = document.querySelector<HTMLElement>("#target-url");
    this.bookmarkButton = document.querySelector<HTMLElement>("#bookmark-btn");
    this.bookmarkedButton =
      document.querySelector<HTMLElement>("#bookmarked-btn");

    ipcRenderer.send("tabManager-init");
  }

  addTab(id: string, url: string, active: boolean): void {
    const title = active ? "New tab" : "New background tab";

    const tab = document.createElement("button");
    tab.classList.add("tabman-tab");
    tab.id = "tab-" + id;
    tab.name = id;
    tab.innerHTML =
      `
            <img class='tabman-tab-icon' src='../../../assets/imgs/icon16.png'>
            <label class='tabman-tab-title'>` +
      title +
      `</label>
            <div class='tabman-tab-buttons'></div>
        `;
    tab.onclick = () => {
      tab.focus();
      ipcRenderer.send("tabManager-activateTab", id);
    };
    tab.onauxclick = (event) => {
      event.preventDefault();
      if (event.which === 2) {
        ipcRenderer.send("tabManager-closeTab", id);
      }
    };
    tab.ondragenter = (event) => {
      event.preventDefault();
      ipcRenderer.send("tabManager-activateTab", id);
    };
    tab.ondragover = (event) => {
      event.preventDefault();
    };
    tab.ondrop = (event: any) => {
      event.preventDefault();
      const textData = event.dataTransfer.getData("Text");
      if (textData) {
        ipcRenderer.send("tabManager-navigate", "file://" + textData);
      } else if (event.dataTransfer.files.length > 0) {
        ipcRenderer.send(
          "tabManager-navigate",
          "file://" + (event.dataTransfer.files[0] as any).path
        );
      }
    };
    tab.onmouseenter = () => {
      ipcRenderer.send("tabManager-requestTabPreview", id);
    };
    tab.onmouseleave = () => {
      //@ts-ignore
      document.querySelector("#tab-preview").classList.remove("show");
    };
    tab.oncontextmenu = () => {
      ipcRenderer.send("tabManager-showTabMenu", id);
    };

    const closeButton = document.createElement("button");
    closeButton.title = "Close tab";
    closeButton.onclick = (event) => {
      event.stopPropagation();
      ipcRenderer.send("tabManager-closeTab", id);
    };
    tab
      .getElementsByClassName("tabman-tab-buttons")[0]
      .appendChild(closeButton);

    this.tabContainer.appendChild(tab);

    if (active) {
      this.activateTab(id);
    }

    this.updateTabsPositions();
  }

  unactivateAllTabs(): void {
    const tabs = this.tabContainer.childNodes;
    for (let i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove("active");
      this.updateTabColor(tabs[i]);
    }
  }

  activateTab(id: string): void {
    const tabs = this.tabContainer.childNodes;
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].id == "tab-" + id) {
        tabs[i].classList.add("active");
      } else {
        tabs[i].classList.remove("active");
      }
      this.updateTabColor(tabs[i]);
    }
  }

  closeTab(id: string): void {
    this.tabContainer.removeChild(this.getTabById(id));
    this.hideTabPreview();

    this.updateTabsPositions();
  }

  getTabById(id: string): HTMLElement {
    const tabs = this.tabContainer.childNodes;
    return tabs.find((tab: HTMLElement) => tab.id === "tab-" + id);
  }

  setTabTitle(id: string, title: string) {
    const tab = this.getTabById(id);
    tab.getElementsByClassName("tabman-tab-title")[0].innerHTML = title;

    return null;
  }

  setTabIcon(id: string, icon: string): void {
    const tab = this.getTabById(id);
    const img: any = tab.querySelector<HTMLImageElement>(".tabman-tab-icon");
    img.src = icon;

    this.updateTabColor(tab);
  }

  updateTabColor(tab: HTMLElement): void {
    if (tab.classList.contains("active")) {
      tab.style.backgroundColor = "";
    } else {
      const img = tab.getElementsByClassName("tabman-tab-icon")[0];

      const color = new GetAvColor(img);
      color.mostUsed((result) => {
        if (Array.isArray(result)) {
          tab.style.backgroundColor = ColorsUtility.rgbToRgbaString(result[0]);
        } else {
          tab.style.backgroundColor = ColorsUtility.rgbToRgbaString(result);
        }
      });
    }
  }

  updateNavigationButtons(
    canGoBack: boolean,
    canGoForward: boolean,
    isLoading: boolean
  ): void {
    this.backButton.disabled = !canGoBack;
    this.forwardButton.disabled = !canGoForward;

    if (isLoading) {
      this.reloadButton.style.display = "none";
      this.stopButton.style.display = "";
    } else {
      this.reloadButton.style.display = "";
      this.stopButton.style.display = "none";
    }
  }

  updateAddressBar(url?: string): void {
    if (url) {
      this.addressBar.value = url;
      if (parseUrl(url).protocol == "https") {
        //@ts-ignore
        document.querySelector<HTMLElement>("#secure-icon").style.display = "";
        //@ts-ignore
        document.querySelector<HTMLElement>("#not-secure-icon").style.display =
          "none";
      } else {
        //@ts-ignore
        document.querySelector<HTMLElement>("#secure-icon").style.display =
          "none";
        //@ts-ignore
        document.querySelector<HTMLElement>("#not-secure-icon").style.display =
          "";
      }
    }
  }

  updateBookmarkedButton(exists: boolean, id: string): void {
    if (exists) {
      this.bookmarkedButton.onclick = () => {
        ipcRenderer.send("overlay-showBookmarkOptions", id);
      };
      this.bookmarkedButton.style.display = "";
      this.bookmarkButton.style.display = "none";
    } else {
      this.bookmarkedButton.style.display = "none";
      this.bookmarkButton.style.display = "";
    }
  }

  getTabContainer(): HTMLElement | null {
    return this.tabContainer;
  }

  hideTabPreview(): void {
    //@ts-ignore
    document
      .querySelector<HTMLElement>("#tab-preview")
      .classList.remove("show");
  }

  scrollLeft(): void {
    this.tabContainer.scrollLeft -= 16;
  }

  scrollRight(): void {
    this.tabContainer.scrollLeft += 16;
  }

  updateTabsPositions(): void {
    const tabs: any = this.tabContainer.getElementsByClassName("tabman-tab");
    const arr: any[] = [];
    for (let i = 0; i < tabs.length; i++) {
      if (!tabs[i].classList.contains("invisible")) {
        arr.push(tabs[i].name);
      }
    }
    if (arr.length > 0) {
      ipcRenderer.send("tabManager-updateTabsPositions", arr);
    }
  }

  showTabList(): void {
    const tabs = this.tabContainer.childNodes;
    const arr: any[] = [];
    tabs.forEach((item) => {
      if (!item.classList.contains("invisible")) {
        arr.push({
          id: item.name,
          title: item.getElementsByClassName("tabman-tab-title")[0].innerHTML,
          active: item.classList.contains("active"),
        });
      }
    });
    ipcRenderer.send("tabManager-showTabList", arr);
  }

  updateTargetURL(url: string): void {
    if (url) {
      this.targetURL.innerHTML = url;
      this.targetURL.classList.add("show");
      this.addressBar.classList.add("show-target");
    } else {
      this.targetURL.classList.remove("show");
      this.addressBar.classList.remove("show-target");
    }
  }

  moveTabBefore(id: string, beforeId: string): void {
    const tab = document.querySelector<HTMLElement>(`#tab-${id}`);
    const beforeTab = document.querySelector<HTMLElement>(`#tab-${beforeId}`);

    this.tabContainer.insertBefore(tab, beforeTab);
    this.updateTabsPositions();
  }

  moveTabToEnd(id: string): void {
    this.tabContainer.appendChild(document.querySelector(`#tab-${id}`));
    this.updateTabsPositions();
  }

  setTabVisibility(id: string, bool: boolean): void {
    const tab = this.getTabById(id);

    if (bool) {
      tab.classList.remove("invisible");
    } else {
      tab.classList.add("invisible");
    }
  }

  showTabPreview(id: string, title: string, url: string): void {
    const tab = this.getTabById(id);

    const tabPreviewElement: any =
      document.querySelector<HTMLElement>("#tab-preview");

    tabPreviewElement.classList.add("show");
    tabPreviewElement.style.left =
      tab.offsetLeft - this.tabContainer.scrollLeft + 4 + "px";

    //@ts-ignore
    document.querySelector<HTMLElement>("#tab-preview-title").innerHTML = title;
    //@ts-ignore
    document.querySelector<HTMLElement>("#tab-preview-url").innerHTML = url;
  }
}

export { TabRenderer };
module.exports = { TabRenderer };
