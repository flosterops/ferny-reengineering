import { EventEmitter } from "events";

class Folder extends EventEmitter {
  bookmarks: any[] = [];
  name: string;
  id: number;
  node;
  position;

  constructor(id: number, name: string, editable: boolean, position = "") {
    super();

    this.id = id;
    this.name = name;
    this.position = position;

    this.node = document.createElement("div");
    this.node.classList.add("folder");
    this.node.id = "folder-" + id;
    this.node.name = id;
    this.node.position = position;
    this.node.innerHTML =
      `
            <div class='folder-header' title='` +
      name +
      `'>
                <img title="Drag here" class="theme-icon folder-move" name="move-16">
                <label class='folder-name'>` +
      name +
      `</label>
            </div>
            <div class='folder-container'></div>
        `;

    if (editable) {
      this.node.classList.add("editable");

      const editFolderBtn = document.createElement("button");
      editFolderBtn.classList.add("nav-btn", "edit-folder-btn");
      editFolderBtn.title = "Edit folder";
      editFolderBtn.innerHTML = `<img class='theme-icon' name='edit-folder-16'>`;
      editFolderBtn.onclick = () => {
        this.toggleEditor();
      };
      this.node.querySelector(".folder-header").appendChild(editFolderBtn);
    }

    const addBookmarkBtn = document.createElement("button");
    addBookmarkBtn.classList.add("nav-btn", "add-bookmark-btn");
    addBookmarkBtn.title = "Create bookmark here";
    addBookmarkBtn.innerHTML =
      "<img class='theme-icon' name='add-bookmark-16'>";
    addBookmarkBtn.onclick = (): void => {
      this.newBookmark();
    };
    this.node.querySelector(".folder-header").appendChild(addBookmarkBtn);

    const openAllBtn = document.createElement("button");
    openAllBtn.classList.add("nav-btn", "open-all-btn");
    openAllBtn.title = "Open all bookmarks";
    openAllBtn.innerHTML = `<img class='theme-icon' name='link-16'>`;
    openAllBtn.onclick = () => {
      this.openAllBookmarks();
    };
    this.node.querySelector(".folder-header").appendChild(openAllBtn);
  }

  toString(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      position: this.position,
    });
  }

  getId(): number {
    return this.id;
  }

  newBookmark(): void {
    this.emit("add-bookmark", this, "New bookmark", "https://");
  }

  addBookmark(name: string, url: string): void {
    this.emit("add-bookmark", this, name, url);
  }

  appendBookmark(bookmark: any): void {
    bookmark.on("toggle-editor", () => {
      this.emit("bookmark-editor-toggled");
    });
    bookmark.on("delete", (id) => {
      this.removeBookmark(id);
      this.emit("bookmark-deleted");
    });
    bookmark.on("edit", () => {
      this.emit("bookmark-edited");
    });

    this.bookmarks.push(bookmark);

    const cont = this.node.querySelector(".folder-container");
    const nodes = cont.childNodes;

    if (nodes.length > 0) {
      if (bookmark.getPosition() != null) {
        for (let i = 0; i < nodes.length; i++) {
          if (bookmark.getPosition() < nodes[i].position) {
            cont.insertBefore(bookmark.getNode(), nodes[i]);
            break;
          } else {
            if (nodes[i] === cont.lastChild) {
              cont.appendChild(bookmark.getNode());
            }
          }
        }
      } else {
        cont.appendChild(bookmark.getNode());
      }
    } else {
      cont.appendChild(bookmark.getNode());
    }

    this.emit("append-bookmark");
  }

  removeBookmark(id: number): void {
    for (let i = 0; i < this.bookmarks.length; i++) {
      if (this.bookmarks[i].getId() == id) {
        this.node
          .getElementsByClassName("folder-container")[0]
          .removeChild(this.bookmarks[i].getNode());
        this.bookmarks.splice(i, 1);
        break;
      }
    }
  }

  spliceBookmark(id: number): void {
    for (let i = 0; i < this.bookmarks.length; i++) {
      if (this.bookmarks[i].getId() == id) {
        this.bookmarks.splice(i, 1);
        break;
      }
    }
  }

  pushBookmark(bookmark: any): void {
    this.bookmarks.push(bookmark);
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  getBookmarkById(id: number): any {
    for (let i = 0; i < this.bookmarks.length; i++) {
      if (id == this.bookmarks[i].getId()) {
        return this.bookmarks[i];
      }
    }
  }

  getNode(): HTMLElement {
    return this.node;
  }

  setPosition(position: string) {
    this.position = position;
    this.node.position = position;
  }

  getPosition(): string {
    return this.position;
  }

  updateBookmarksPositions(): Promise<boolean> {
    return new Promise((resolve) => {
      const divs = this.node.getElementsByClassName("bookmark");
      for (let i = 0; i < divs.length; i++) {
        this.getBookmarkById(divs[i].name).setPosition(i);
      }
      resolve(true);
    });
  }

  openAllBookmarks(): void {
    for (let i = 0; i < this.bookmarks.length; i++) {
      this.bookmarks[i].open();
    }
  }

  edit(name: string): void {
    this.name = name;

    this.node.getElementsByClassName("folder-name")[0].innerHTML = name;
    this.node.getElementsByClassName("folder-header")[0].title = name;

    this.emit("edit");
  }

  toggleEditor(): void {
    let folderEditor = this.node.querySelector(".folder-editor");
    if (!folderEditor) {
      this.node.querySelector(".folder-header").style.display = "none";

      folderEditor = document.createElement("div");
      folderEditor.classList.add("folder-editor");
      this.node.insertBefore(folderEditor, this.node.firstChild);

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.placeholder = "Folder name";
      nameInput.value = this.name;
      folderEditor.appendChild(nameInput);
      nameInput.focus();

      const saveBtn = document.createElement("button");
      saveBtn.classList.add("nav-btn", "with-border");
      saveBtn.innerHTML =
        "<img class='theme-icon' name='save-16'><label>Save</label>";
      saveBtn.onclick = (): void => {
        this.edit(nameInput.value);
        this.toggleEditor();
      };
      folderEditor.appendChild(saveBtn);

      const cancelBtn = document.createElement("button");
      cancelBtn.classList.add("nav-btn", "with-border");
      cancelBtn.innerHTML = `<img class="theme-icon" name="cancel-16"><label>Cancel</label>`;
      cancelBtn.onclick = (): void => {
        this.toggleEditor();
      };
      folderEditor.appendChild(cancelBtn);

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("nav-btn", "with-border");
      deleteBtn.innerHTML = `<img class="theme-icon" name="delete-16"><label>Delete</label>`;
      deleteBtn.onclick = (): void => {
        this.askForDelete();
      };
      folderEditor.appendChild(deleteBtn);
    } else {
      this.node.getElementsByClassName("folder-header")[0].style.display = "";

      this.node.removeChild(folderEditor);
    }

    this.emit("toggle-editor");
  }

  askForDelete(): void {
    this.emit("ask-for-delete", this.id, this.name);
  }

  delete(): void {
    this.emit("delete", this.id);
  }

  getBookmarks(): any {
    return this.bookmarks;
  }
}

export { Folder };
module.exports = { Folder };
