"use strict";

const EventEmitter = require("events");
const Dragula = require("dragula");
const fs = require("fs");
const ppath = require("persist-path")("Ferny");
const readlPromise = require("readline-promise").default;
const parseUrl = require("parse-url");

const saveFileToJsonFolder = require("../saveFileToJsonFolder");
const loadFileFromJsonFolder = require("../loadFileFromJsonFolder");
const checkFileExists = require("../checkFileExists");

interface IBookmarkReadline {
  id: number;
  name: string;
  url: string;
  position: string;
  folder: number;
}

const Folder = require("./Folder.js");
const Bookmark = require("./Bookmark.js");

class BookmarkManager extends EventEmitter {
  folderContainer = null;
  folderCounter = 0;
  folders = [];
  bookmarkCounter = 0;
  editMode = false;
  folderDrag = null;
  defaultFolder = null;
  bookmarkDrag = null;

  constructor(folderContainer: HTMLElement) {
    super();

    this.folderContainer = folderContainer;

    this.bookmarkDrag = Dragula([], {
      direction: "vertical",
      moves: (
        el: HTMLElement,
        container: HTMLElement,
        handle: HTMLElement
      ): boolean => {
        return handle.classList.contains("bookmark-move");
      },
    });
    this.bookmarkDrag.on("drop", (el: any, target: any, source: any): void => {
      this.moveBookmark(
        source.parentNode.name,
        target.parentNode.name,
        el.name
      ).then(() => {
        this.updateBookmarksPositions().then(() => {
          this.saveBookmarks();
        });
      });
    });

    this.toggleArrange();

    this.defaultFolder = new Folder(-1, "All bookmarks", false);
    this.appendFolder(this.defaultFolder);

    this.loadFromStorage();
  }

  newFolder(): void {
    this.addFolder("New folder " + this.folderCounter);
  }

  addFolder(name: string): void {
    const folder = new Folder(this.folderCounter++, name, true);
    this.appendFolder(folder);
    folder.toggleEditor();

    this.updateFoldersPositions().then((): void => {
      this.saveFolders();
    });

    this.emit("folder-added");
  }

  addFolderWithBookmarks(folderName: string, folderBookmarks: any[]): void {
    const folder = new Folder(this.folderCounter++, folderName, true);
    this.appendFolder(folder);

    folderBookmarks.forEach((item: any): void => {
      folder.appendBookmark(
        new Bookmark(this.bookmarkCounter++, item.name, item.url)
      );
    });

    this.updateFoldersPositions().then((): void => {
      this.saveFolders();
      folder.updateBookmarksPositions().then((): void => {
        this.saveBookmarks();
      });
    });

    this.emit("folder-added");
  }

  appendFolder(folder: any): void {
    folder.on(
      "add-bookmark",
      (folder: any, bookmarkName: string, bookmarkURL: string): void => {
        this.addBookmarkToFolder(folder, bookmarkName, bookmarkURL);
        folder.updateBookmarksPositions().then((): void => {
          this.saveBookmarks();
        });
        this.emit("bookmark-added");
      }
    );
    folder.on("append-bookmark", (): void => {
      this.emit("bookmark-appended");
    });
    folder.on("bookmark-editor-toggled", (): void => {
      this.emit("bookmark-editor-toggled");
    });
    folder.on("ask-for-delete", (id: number, name: string): void => {
      this.emit("ask-for-delete-folder", id, name);
    });
    folder.on("delete", (id: number): void => {
      this.removeFolder(id);
      this.saveFolders();
      this.emit("folder-deleted");
    });
    folder.on("edit", (): void => {
      this.saveFolders();
      this.emit("folder-edited");
    });
    folder.on("bookmark-deleted", (): void => {
      folder.updateBookmarksPositions().then((): void => {
        this.saveBookmarks();
      });
      this.emit("bookmark-deleted");
    });
    folder.on("bookmark-edited", (): void => {
      this.saveBookmarks();
      this.emit("bookmark-edited");
    });
    folder.on("toggle-editor", (): void => {
      this.emit("folder-editor-toggled");
    });

    this.folders.push(folder);

    const nodes = this.folderContainer.childNodes;

    if (folder.getPosition()) {
      for (let i = 0; i < nodes.length; i++) {
        if (folder.getPosition() < nodes[i].position) {
          this.folderContainer.insertBefore(folder.getNode(), nodes[i]);
          break;
        } else {
          if (nodes[i] == this.folderContainer.lastChild) {
            this.folderContainer.appendChild(folder.getNode());
          }
        }
      }
    } else {
      this.folderContainer.appendChild(folder.getNode());
    }

    this.bookmarkDrag.containers.push(
      folder.getNode().querySelector(".folder-container")
    );

    this.emit("folder-appended");
  }

  removeFolder(id: number): void {
    for (let i = 0; i < this.folders.length; i++) {
      if (this.folders[i].getId() == id) {
        this.folderContainer.removeChild(this.folders[i].getNode());
        this.folders.splice(i, 1);
        break;
      }
    }
  }

  getDefaultFolder(): any {
    return this.defaultFolder;
  }

  getFolderById(id: number): any {
    for (let i = 0; i < this.folders.length; i++) {
      if (id == this.folders[i].getId()) {
        return this.folders[i];
      }
    }
  }

  addBookmarkToFolder(
    folder: any,
    bookmarkName: string,
    bookmarkURL: string
  ): void {
    const bookmark = new Bookmark(
      this.bookmarkCounter++,
      bookmarkName,
      bookmarkURL
    );
    folder.appendBookmark(bookmark);
    bookmark.toggleEditor();
  }

  moveBookmark(
    fromFolderId: number,
    toFolderId: number,
    bookmarkId: number
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (fromFolderId !== toFolderId) {
        const fromFolder = this.getFolderById(fromFolderId);
        const toFolder = this.getFolderById(toFolderId);

        toFolder.pushBookmark(fromFolder.getBookmarkById(bookmarkId));
        fromFolder.spliceBookmark(bookmarkId);
      }
      resolve(true);
    });
  }

  updateFoldersPositions(): Promise<boolean> {
    return new Promise((resolve): void => {
      const divs = this.folderContainer.getElementsByClassName("folder");
      for (let i = 0; i < divs.length; i++) {
        this.getFolderById(divs[i].name).setPosition(i);
      }
      resolve(true);
    });
  }

  updateBookmarksPositions(): Promise<boolean> {
    return new Promise((resolve): void => {
      for (let i = 0; i < this.folders.length; i++) {
        this.folders[i].updateBookmarksPositions();
      }
      resolve(true);
    });
  }

  toggleArrange(): void {
    if (!this.editMode) {
      if (this.folderDrag) {
        this.folderDrag.destroy();
        this.folderDrag = null;
      }

      this.folderContainer.classList.remove("movable");

      document.querySelector<HTMLButtonElement>(
        "#bookmarks-arrange-btn"
      ).style.display = "none";
      document.querySelector<HTMLButtonElement>(
        "#bookmarks-move-btn"
      ).style.display = "";

      this.editMode = true;
    } else {
      this.folderDrag = Dragula([this.folderContainer], {
        direction: "vertical",
        moves: (
          el: HTMLElement,
          container: HTMLElement,
          handle: HTMLElement
        ): boolean => {
          return handle.classList.contains("folder-move");
        },
      });
      this.folderDrag.on("drop", (): void => {
        this.updateFoldersPositions().then((): void => {
          this.saveFolders();
        });
      });

      this.folderContainer.classList.add("movable");

      document.querySelector<HTMLButtonElement>(
        "#bookmarks-arrange-btn"
      ).style.display = "";
      document.querySelector<HTMLButtonElement>(
        "#bookmarks-move-btn"
      ).style.display = "none";

      this.editMode = false;
    }
  }

  loadFromStorage(): void {
    loadFileFromJsonFolder("bookmarks", "folder-counter").then(
      (folderCounter: any): void => {
        this.folderCounter = folderCounter;
      }
    );
    loadFileFromJsonFolder("bookmarks", "bookmark-counter").then(
      (bookmarkCounter: any): void => {
        this.bookmarkCounter = bookmarkCounter;
      }
    );

    const foldersPromise = new Promise((resolve): void => {
      checkFileExists(ppath + "/json/bookmarks/folders.json").then(() => {
        loadFileFromJsonFolder("bookmarks", "folders").then((data) => {
          const lines = data.toString().split("\n");
          for (let i = 0; i < lines.length - 1; i++) {
            const obj = JSON.parse(lines[i]);
            if (obj.id != -1) {
              this.appendFolder(
                new Folder(obj.id, obj.name, true, obj.position)
              );
            } else {
              this.defaultFolder.setPosition(obj.position);
            }
          }
          resolve(true);
        });
      });
    });

    foldersPromise.then((): void => {
      checkFileExists(ppath + "/json/bookmarks/bookmarks.json").then(
        (): void => {
          const bookmarksReadline = readlPromise.createInterface({
            terminal: false,
            input: fs.createReadStream(
              ppath + "/json/bookmarks/bookmarks.json"
            ),
          });
          bookmarksReadline.forEach((line: string): void => {
            const obj: IBookmarkReadline = JSON.parse(line);
            this.getFolderById(obj.folder).appendBookmark(
              new Bookmark(obj.id, obj.name, obj.url, obj.position)
            );
          });
        }
      );
    });
  }

  saveFolders(): void {
    saveFileToJsonFolder("bookmarks", "folder-counter", this.folderCounter);
    saveFileToJsonFolder("bookmarks", "folders", "").then((): void => {
      for (let i = 0; i < this.folders.length; i++) {
        fs.appendFile(
          ppath + "/json/bookmarks/folders.json",
          this.folders[i].toString() + "\n",
          (err): void => {
            if (err) {
              throw err;
            }
          }
        );
      }
    });
  }

  saveBookmarks(): void {
    saveFileToJsonFolder("bookmarks", "bookmark-counter", this.bookmarkCounter);
    saveFileToJsonFolder("bookmarks", "bookmarks", "").then((): void => {
      for (let i = 0; i < this.folders.length; i++) {
        for (let j = 0; j < this.folders[i].getBookmarks().length; j++) {
          const bookmark = this.folders[i].getBookmarks()[j].getData();
          bookmark.folder = this.folders[i].getId();
          fs.appendFile(
            ppath + "/json/bookmarks/bookmarks.json",
            JSON.stringify(bookmark) + "\n",
            (err) => {
              if (err) {
                throw err;
              }
            }
          );
        }
      }
    });
  }

  checkIfBookmarked(url: string): void {
    let exists = false;
    let id = null;

    if (url.length > 0) {
      const domain = parseUrl(url).resource;

      for (let i = 0; i < this.folders.length; i++) {
        for (let j = 0; j < this.folders[i].getBookmarks().length; j++) {
          const bookmark = parseUrl(
            this.folders[i].getBookmarks()[j].getURL()
          ).resource;
          if (bookmark == domain) {
            exists = true;
            id = this.folders[i].getBookmarks()[j].getId();
            break;
          }
        }
      }
    }

    this.emit("update-bookmarked", exists, id);
  }

  showBookmarkOptions(id: number): void {
    for (let i = 0; i < this.folders.length; i++) {
      for (let j = 0; j < this.folders[i].getBookmarks().length; j++) {
        if (this.folders[i].getBookmarks()[j].getId() == id) {
          this.folders[i].getBookmarks()[j].focus();
          if (
            !this.folders[i]
              .getBookmarks()
              [j].getNode()
              .classList.contains("show-menu")
          ) {
            this.folders[i].getBookmarks()[j].toggleOptions();
          }
          break;
        }
      }
    }
  }
}

export {BookmarkManager};
module.exports = { BookmarkManager };
