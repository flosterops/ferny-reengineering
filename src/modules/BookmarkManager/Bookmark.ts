import { EventEmitter } from "events";
import { ipcRenderer, clipboard } from "electron";
import GetAvColor from "color.js";

import { ColorsUtility } from "../rgbToRgbaString";

class Bookmark extends EventEmitter {
  id: number;
  name: string;
  url: string;
  node;
  position;

  constructor(id: number, name: string, url: string, position = "") {
    super();

    this.id = id;
    this.name = name;
    this.url = url;
    this.position = position;

    this.node = document.createElement("button");
    this.node.classList.add("bookmark");
    this.node.title = name + "\n" + url;
    this.node.name = id;
    this.node.position = position;
    this.node.innerHTML =
      `
            <img title="Drag here" class="theme-icon bookmark-move" name="move-16">
            <label class='bookmark-name'>` +
      name +
      `</label>
        `;

    const bookmarkIcon = document.createElement("img");
    bookmarkIcon.classList.add("bookmark-icon");
    bookmarkIcon.src = "http://www.google.com/s2/favicons?domain=" + url;
    bookmarkIcon.onerror = () => {
      bookmarkIcon.src = __dirname + "/../../assets/imgs/old-icons16/star.png";
      this.updateBookmarkColor();
    };
    this.node.appendChild(bookmarkIcon);
    this.updateBookmarkColor();

    this.node.onclick = (): void => {
      this.open();
    };
    this.node.onauxclick = (event: MouseEvent): void => {
      event.preventDefault();
      if (event.which === 2) {
        ipcRenderer.send("tabManager-addTab", url, false);
      }
    };
    this.node.oncontextmenu = (): void => {
      this.toggleOptions();
    };
    this.node.onkeyup = (event: KeyboardEvent): void => {
      event.preventDefault();
    };

    const optionsBtn = document.createElement("button");
    optionsBtn.classList.add("bookmark-options");
    optionsBtn.title = "Toggle options";
    optionsBtn.innerHTML = `<img name="options-12" class="theme-icon">`;
    optionsBtn.onclick = (event: MouseEvent): void => {
      event.stopPropagation();
      this.toggleOptions();
    };
    this.node.appendChild(optionsBtn);

    const bookmarkMenu = document.createElement("div");
    bookmarkMenu.classList.add("bookmark-menu");
    bookmarkMenu.oncontextmenu = (event) => {
      event.stopPropagation();
    };
    this.node.appendChild(bookmarkMenu);

    const copyBtn = document.createElement("button");
    copyBtn.classList.add("nav-btn", "with-border");
    copyBtn.title = "Copy URL";
    copyBtn.innerHTML = `<img name="copy-16" class="theme-icon"><label>Copy</label>`;
    copyBtn.onclick = (event) => {
      event.stopPropagation();
      this.copyURL();
      this.toggleOptions();
    };
    bookmarkMenu.appendChild(copyBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("nav-btn", "with-border");
    editBtn.title = "Edit bookmark";
    editBtn.innerHTML = `<img name="edit-16" class="theme-icon"><label>Edit</label>`;
    editBtn.onclick = (event: MouseEvent): void => {
      event.stopPropagation();
      this.toggleEditor();
    };
    bookmarkMenu.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("nav-btn", "with-border");
    deleteBtn.title = "Delete bookmark";
    deleteBtn.innerHTML = `<img name="delete-16" class="theme-icon"><label>Delete</label>`;
    deleteBtn.onclick = (event: MouseEvent): void => {
      event.stopPropagation();
      this.delete();
    };
    bookmarkMenu.appendChild(deleteBtn);
  }

  updateBookmarkColor(): void {
    const icon = this.node.getElementsByClassName("bookmark-icon")[0];
    const color = new GetAvColor(icon);
    color.mostUsed((result) => {
      if (Array.isArray(result)) {
        icon.parentNode.style.backgroundColor = ColorsUtility.rgbToRgbaString(
          result[0]
        );
      } else {
        icon.parentNode.style.backgroundColor =
          ColorsUtility.rgbToRgbaString(result);
      }
    });
  }

  getData() {
    return {
      id: this.id,
      name: this.name,
      url: this.url,
      position: this.position,
    };
  }

  setPosition(position: string): void {
    this.position = position;
    this.node.position = position;
  }

  getPosition(): string {
    return this.position;
  }

  open(): void {
    ipcRenderer.send("tabManager-addTab", this.url, true);
  }

  getId(): number {
    return this.id;
  }

  edit(name: string, url: string): void {
    this.name = name;
    this.url = url;

    this.node.getElementsByClassName("bookmark-name")[0].innerHTML = name;
    // this.node.getElementsByClassName("bookmark-preview")[0].innerHTML = url;
    this.node.title = name + "\n" + url;

    const icon = this.node.getElementsByClassName("bookmark-icon")[0];
    icon.src = "http://www.google.com/s2/favicons?domain=" + url;
    this.updateBookmarkColor();

    this.emit("edit");
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  setURL(url: string): void {
    this.url = url;
  }

  getURL(): string {
    return this.url;
  }

  getNode(): any {
    return this.node;
  }

  toggleOptions(): void {
    this.node.classList.toggle("show-menu");
    this.node.classList.remove("show-editor");

    const bookmarkEditor = this.node.querySelector(".bookmark-editor");

    if (bookmarkEditor != null) {
      this.node.removeChild(bookmarkEditor);
    }
  }

  toggleEditor(): void {
    this.node.classList.remove("show-menu");
    this.node.classList.toggle("show-editor");

    let bookmarkEditor = this.node.querySelector(".bookmark-editor");
    if (!bookmarkEditor) {
      bookmarkEditor = document.createElement("div");
      bookmarkEditor.classList.add("bookmark-editor");
      bookmarkEditor.onclick = (event: MouseEvent): void => {
        event.stopPropagation();
      };
      bookmarkEditor.oncontextmenu = (event: Event): void => {
        event.stopPropagation();
      };
      this.node.appendChild(bookmarkEditor);

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.placeholder = "Bookmark name";
      nameInput.value = this.name;
      bookmarkEditor.appendChild(nameInput);
      nameInput.focus();

      const urlInput = document.createElement("input");
      urlInput.type = "text";
      urlInput.placeholder = "Bookmark URL";
      urlInput.value = this.url;
      bookmarkEditor.appendChild(urlInput);

      const saveBtn = document.createElement("button");
      saveBtn.classList.add("nav-btn", "with-border");
      saveBtn.innerHTML = `<img class="theme-icon" name="save-16"><label>Save</label>`;
      saveBtn.onclick = (): void => {
        this.edit(nameInput.value, urlInput.value);
        this.toggleEditor();
      };
      bookmarkEditor.appendChild(saveBtn);

      const cancelBtn = document.createElement("button");
      cancelBtn.classList.add("nav-btn", "with-border");
      cancelBtn.innerHTML = `<img class="theme-icon" name="cancel-16"><label>Cancel</label>`;
      cancelBtn.onclick = (): void => {
        this.toggleEditor();
      };
      bookmarkEditor.appendChild(cancelBtn);
    } else {
      this.node.removeChild(bookmarkEditor);
    }

    this.emit("toggle-editor");
  }

  copyURL(): void {
    clipboard.writeText(this.url);
  }

  delete(): void {
    this.emit("delete", this.id);
  }

  focus(): void {
    this.node.focus();
  }
}

export { Bookmark };
module.exports = { Bookmark };
