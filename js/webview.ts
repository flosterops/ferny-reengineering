"use strict";

const { ipcRenderer } = require("electron");

document.addEventListener("wheel", webviewMouseWheel);

function webviewMouseWheel(e) {
    if (e.ctrlKey) {
        if (e.deltaY > 0) {
            ipcRenderer.send("tabManager-zoomOut");
        } else if ((event as any).deltaY < 0) {
            ipcRenderer.send("tabManager-zoomIn");
        }
    }
}

export {}
