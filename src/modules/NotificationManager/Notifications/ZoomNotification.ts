import { ColorsUtility } from "../../rgbToRgbaString";
import { TextNotification } from "./TextNotification";

class ZoomNotification extends TextNotification {
  constructor(id: number, autoClose: boolean, text: string) {
    super(id, autoClose, text);

    const img = document.createElement("img");
    img.classList.add("notif-icon", "theme-icon");
    img.name = "search-16";
    super.getNode().appendChild(img);

    super
      .getNode()
      //@ts-ignore
      .getElementsByClassName("notif-container")[0].style.backgroundColor =
      ColorsUtility.rgbToRgbaString("rgb(15, 188, 249)");

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("notif-buttons");
    buttonsContainer.innerHTML = `
            <button class="nav-btn with-border" onclick="zoomIn()">
                <img class="nav-btn-icon theme-icon" name="zoom-in-16">
                <label class="nav-btn-label">Zoom in</label>
            </button>
            <button class="nav-btn with-border" onclick="zoomOut()">
                <img class="nav-btn-icon theme-icon" name="zoom-out-16">
                <label class="nav-btn-label">Zoom out</label>
            </button>
            <button class="nav-btn with-border" onclick="zoomToActualSize()">
                <img class="nav-btn-icon theme-icon" name="actual-zoom-16">
                <label class="nav-btn-label">Reset</label>
            </button>
        `;
    super.getNode().appendChild(buttonsContainer);
  }
}

export {ZoomNotification};
module.exports = { ZoomNotification };
