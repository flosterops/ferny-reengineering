"use strict";

const rgbToRgbaString = require("/../../rgbToRgbaString");

const TextNotification = require("./TextNotification");

class StatusNotification extends TextNotification {
  constructor(id: number, autoClose: boolean, text: string, type: string) {
    super(id, autoClose, text);

    const img = document.createElement("img");
    img.classList.add("notif-icon", "theme-icon");

    switch (type) {
      case "success":
        super.getNode().title = "Success notification";
        img.name = "check-16";
        super
          .getNode()
          .getElementsByClassName("notif-container")[0].style.backgroundColor =
          rgbToRgbaString("rgb(11, 232, 129)");
        break;
      case "info":
        super.getNode().title = "Info notification";
        img.name = "info-16";
        super
          .getNode()
          .getElementsByClassName("notif-container")[0].style.backgroundColor =
          rgbToRgbaString("rgb(15, 188, 249)");
        break;
      case "warning":
        super.getNode().title = "Warning notification";
        img.name = "warning-16";
        super
          .getNode()
          .getElementsByClassName("notif-container")[0].style.backgroundColor =
          rgbToRgbaString("rgb(255, 168, 1)");
        break;
      case "error":
        super.getNode().title = "Error notification";
        img.name = "fire-16";
        super
          .getNode()
          .getElementsByClassName("notif-container")[0].style.backgroundColor =
          rgbToRgbaString("rgb(255, 63, 52)");
    }

    super.getNode().appendChild(img);
  }
}

export {};
module.exports = StatusNotification;
