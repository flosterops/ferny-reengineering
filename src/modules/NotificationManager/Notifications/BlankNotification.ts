import { EventEmitter } from "events";

class BlankNotification extends EventEmitter {
  id: number;
  node: HTMLDivElement;
  timeout: NodeJS.Timeout;
  autoClose = false;

  constructor(id: number, autoClose: boolean) {
    super();

    this.id = id;
    this.autoClose = autoClose;

    this.node = document.createElement("div");
    this.node.classList.add("notif");
    this.node.innerHTML = `
            <div class="notif-container">
                <div class='notif-body'></div>
            </div>
        `;
    this.node.onauxclick = (event: MouseEvent): void => {
      event.preventDefault();
      if (event.which === 2) {
        this.close();
      }
    };

    const closeButton = document.createElement("button");
    closeButton.onclick = (): void => {
      this.close.call(this);
    };
    closeButton.title = "Close";
    closeButton.classList.add("notif-close");
    closeButton.innerHTML = `<img class='theme-icon' name='cancel-12'>`;

    this.node.appendChild(closeButton);

    this.refreshTimeout();
  }

  getId(): number {
    return this.id;
  }

  getNode(): HTMLDivElement {
    return this.node;
  }

  refreshTimeout(): void {
    clearTimeout(this.timeout);
    if (this.autoClose) {
      this.timeout = setTimeout(() => {
        this.close.call(this);
      }, 2500);
    }
  }

  close(): void {
    this.node.classList.add("closed");
    setTimeout(() => {
      this.emit("close", this);
    }, 250);
  }
}

export { BlankNotification };
module.exports = { BlankNotification };
