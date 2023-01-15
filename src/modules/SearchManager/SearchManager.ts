import EventEmitter from "events";
import { ipcRenderer } from "electron";
import isUrl from "validate.io-uri";
import autoSuggest from "suggestion";

import { LoadSearchEngineUtility } from "../loadSearchEngine";

class SearchManager extends EventEmitter {
  searchInput;
  searchSuggest;
  searchSuggestContainer;
  searchEngines;
  clearSearchButton;

  constructor(
    searchInput: HTMLInputElement,
    searchSuggest: HTMLElement,
    searchSuggestContainer: HTMLElement,
    searchEngines: HTMLElement,
    clearSearchButton: HTMLButtonElement
  ) {
    super();

    this.clearSearchButton = clearSearchButton;

    this.searchSuggest = searchSuggest;

    this.searchEngines = searchEngines;
    const engines =
      searchEngines.querySelectorAll<HTMLElement>(".search-engine");

    Array.from(engines).forEach((item: any): void => {
      (item as any).onclick = () => {
        this.searchWith("", (item as any).name);
      };
    });

    this.searchSuggestContainer = searchSuggestContainer;

    this.searchInput = searchInput;
    this.searchInput.oninput = (): void => {
      this.getSuggestions();
    };
    this.searchInput.onkeydown = (event: KeyboardEvent): void => {
      let suggestions;
      if (event.keyCode === 40) {
        suggestions = this.searchSuggestContainer.childNodes;
        let i = 0;
        while (
          i < suggestions.length &&
          !suggestions[i].classList.contains("active")
        ) {
          i++;
        }
        if (i < suggestions.length - 1) {
          this.searchInput.value = suggestions[i].nextSibling.value;
          suggestions[i].classList.remove("active");
          suggestions[i].nextSibling.classList.add("active");
        }
      } else if (event.keyCode === 38) {
        suggestions = this.searchSuggestContainer.childNodes;
        let i = 0;
        while (
          i < suggestions.length &&
          !suggestions[i].classList.contains("active")
        ) {
          i++;
        }
        if (i > 0) {
          this.searchInput.value = suggestions[i].previousSibling.value;
          suggestions[i].classList.remove("active");
          suggestions[i].previousSibling.classList.add("active");
        }
      }
    };
    this.searchInput.onkeyup = (event: KeyboardEvent): void => {
      event.preventDefault();

      if (this.searchInput.value.length > 0) {
        this.updateClearSearchButton();

        if (event.keyCode === 13) {
          const suggestions = this.searchSuggestContainer.childNodes;
          if (suggestions.length > 0) {
            let i = 0;
            while (
              i < suggestions.length &&
              !suggestions[i].classList.contains("active")
            ) {
              i++;
            }
            this.navigateSuggest(suggestions[i].value);
          } else {
            this.navigateSuggest(this.searchInput.value);
          }
        }
      } else {
        this.clearSearch();
      }
    };

    LoadSearchEngineUtility.loadSearchEngine().then(
      (searchEngine: string): void => {
        this.setSearchEngine(searchEngine);
      }
    );
  }

  updateClearSearchButton(): void {
    if (this.searchInput.value.length > 0) {
      this.clearSearchButton.classList.add("show");
    } else {
      this.clearSearchButton.classList.remove("show");
    }
  }

  getSuggestions(): void {
    if (this.searchInput.value.length > 0) {
      this.searchSuggest.style.display = "";
      this.searchSuggest.classList.remove("hide");

      this.searchSuggestContainer.innerHTML = "";

      const firstInput = document.createElement("input");
      firstInput.tabIndex = -1;
      firstInput.classList.add("active");
      firstInput.type = "button";
      firstInput.value = this.searchInput.value;
      firstInput.onclick = () => {
        this.navigateSuggest(firstInput.value);
      };
      firstInput.onauxclick = (event: MouseEvent): void => {
        event.preventDefault();
        if (event.which === 2) {
          this.navigateSuggest(firstInput.value, true);
        }
      };
      this.searchSuggestContainer.appendChild(firstInput);

      autoSuggest(this.searchInput.value, (err, suggestions: any[]): void => {
        if (suggestions != null && suggestions.length > 0) {
          if (this.searchSuggestContainer.childNodes.length < 5) {
            for (let i = 0; i < 5; i++) {
              if (suggestions[i] != null) {
                const s = document.createElement("input");
                s.tabIndex = -1;
                s.type = "button";
                s.value = suggestions[i];
                s.onclick = () => {
                  this.navigateSuggest(s.value);
                };
                s.onauxclick = (event: MouseEvent): void => {
                  event.preventDefault();
                  if (event.which === 2) {
                    this.navigateSuggest(s.value, true);
                  }
                };
                this.searchSuggestContainer.appendChild(s);
              }
            }
          }
        }
      });
    }
  }

  searchWith(text: string, engine: string, background = false): void {
    if (text == null) {
      const suggestions = this.searchSuggestContainer.childNodes;
      let i = 0;
      while (
        i < suggestions.length &&
        !suggestions[i].classList.contains("active")
      ) {
        i++;
      }
      text = suggestions[i].value;
    }

    if (!background) {
      this.clearSearch();
    }

    switch (engine) {
      case "google":
        return this.newTab("https://google.com/search?q=" + text, background);
      case "bing":
        return this.newTab("https://bing.com/search?q=" + text, background);
      case "duckduckgo":
        return this.newTab("https://duckduckgo.com/?q=" + text, background);
      case "yahoo":
        return this.newTab(
          "https://search.yahoo.com/search?p=" + text,
          background
        );
      case "wikipedia":
        return this.newTab(
          "https://wikipedia.org/wiki/Special:Search?search=" + text,
          background
        );
      case "baidu":
        return this.newTab("https://www.baidu.com/s?wd=" + text, background);
      case "naver":
        return this.newTab(
          "https://search.naver.com/search.naver?query=" + text,
          background
        );
      case "qwant":
        return this.newTab("https://www.qwant.com/?q=" + text, background);
      case "youtube":
        return this.newTab(
          "https://www.youtube.com/results?search_query=" + text,
          background
        );
      case "ecosia":
        return this.newTab(
          "https://www.ecosia.org/search?q=" + text,
          background
        );
      case "twitter":
        return this.newTab("https://twitter.com/search?q=" + text, background);
      case "amazon":
        return this.newTab("https://www.amazon.com/s?k=" + text, background);
      case "twitch":
        return this.newTab(
          "https://www.twitch.tv/search?term=" + text,
          background
        );
      case "github":
        return this.newTab("https://github.com/search?q=" + text, background);
      case "wolfram":
        return this.newTab(
          "https://www.wolframalpha.com/input/?i=" + text,
          background
        );
      case "ebay":
        return this.newTab(
          "https://www.ebay.com/sch/i.html?_nkw=" + text,
          background
        );
      case "startpage":
        return this.newTab(
          "https://www.startpage.com/do/dsearch?query=" + text,
          background
        );
    }
  }

  navigateSuggest(text: string, background = false): void {
    if (text !== "" && text !== null) {
      if (isUrl(text)) {
        this.newTab(text);
      } else {
        const engines =
          this.searchEngines.getElementsByClassName("search-engine");
        for (let i = 0; i < engines.length; i++) {
          if (engines[i].classList.contains("active")) {
            this.searchWith(text, engines[i].name, background);
            break;
          }
        }
      }
    }
  }

  newTab(url: string, background = false): void {
    ipcRenderer.send("tabManager-addTab", url, !background);
  }

  setSearchEngine(engineName: string): void {
    const engines = this.searchEngines.getElementsByClassName("search-engine");
    for (let i = 0; i < engines.length; i++) {
      if (engines[i].name == engineName) {
        engines[i].classList.add("active");
        (document.getElementById("search-icon") as any).src =
          engines[i].getElementsByTagName("img")[0].src;
      } else {
        engines[i].classList.remove("active");
      }
    }
  }

  goToSearch(text: string, cursorPos: any): void {
    if (text == null) {
      this.searchInput.value = "";
    } else {
      this.searchInput.value = text;
    }

    if (cursorPos != null) {
      this.searchInput.setSelectionRange(cursorPos, cursorPos);
    }

    this.searchInput.focus();

    this.getSuggestions();
  }

  clearSearch(): void {
    this.searchInput.value = "";

    this.searchSuggestContainer.innerHTML = "";
    this.searchSuggest.style.display = "none";
    this.searchSuggest.classList.add("hide");

    this.updateClearSearchButton();
  }

  performSearch(text: string): void {
    this.navigateSuggest(text);
  }
}

export { SearchManager };
module.exports = { SearchManager };
