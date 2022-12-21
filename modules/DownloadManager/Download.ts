"use strict";

const EventEmitter = require("events");
const fileExtension = require("file-extension");
const GetAvColor = require("color.js");

const extToImagePath = require("../extToImagePath");
const bytesToSize = require("../bytesToSize");
const percent = require("../percent");
const epochToDate = require("../epochToDate");
const epochToTime = require("../epochToTime");
const rgbToRgbaString = require("../rgbToRgbaString");

class Download extends EventEmitter {
    id: number | null = null;
    name: string | null = null;
    url: string | null = null;
    time: number | null = null;
    path: string | null = null;
    status = "started";
    node = null;
    constructor(id: number, name: string, url: string, time: number) {
        super();

        this.id = id;
        this.name = name;
        this.url = url;
        this.time = time;

        this.node = document.createElement("div");
        this.node.classList.add("download-item");
        this.node.name = id;
        this.node.id = `download-${id}`;
        this.node.innerHTML = `
            <div class="download-body">
                <img class="download-icon" src="${extToImagePath(fileExtension(name))}">
                </label><label class="download-name">${name}</label><br>
                <label class="download-url">${url}</label><br>
                <hr>
                <label class="download-status">Started</label>
                <label class="download-time">${epochToDate(time)} / ${epochToTime(time)}</label>
            </div>
            <div class="download-buttons"></div>
        `;

        const color = new GetAvColor(this.node.getElementsByClassName("download-icon")[0]);
        color.mostUsed((result): void => {
            if(Array.isArray(result)) {
                this.node.style.backgroundColor = rgbToRgbaString(result[0]);
            } else {
                this.node.style.backgroundColor = rgbToRgbaString(result);
            }
        });
    }

    getNode(): HTMLElement {
        return this.node;
    }

    getId(): number {
        return this.id;
    }

    setStatusInterrupted(): void {
        this.status = "interrupted";
        this.node.getElementsByClassName("download-status")[0].innerHTML = "Interrupted";

        this.node.getElementsByClassName("download-buttons")[0].innerHTML = `
            <div class="nav-btn" onclick="resumeDownload('${this.id}')" title="Resume download">
                <img class="theme-icon" name="download-16">
                <label>Resume</label>
            </div>
            <div class="nav-btn" onclick="cancelDownload('${this.id}')" title="Cancel download">
                <img class="theme-icon" name="cancel-16">
            </div>
        `;

        this.emit("status-changed");
    }

    setStatusDone(path: string): void {
        this.status = "done";
        this.path = path;
        this.node.getElementsByClassName("download-status")[0].innerHTML = "Completed";

        this.node.getElementsByClassName("download-buttons")[0].innerHTML = `
            <div class="nav-btn" onclick="showItemInFolder('${path.replace(/\\/g, "/")}')" title="Show file in folder">
                <img class="theme-icon" name="folder-16">
                <label>Folder</label>
            </div>
            <div class="nav-btn" onclick="openItem('${path.replace(/\\/g, "/")}')" title="Open file">
                <img class="theme-icon" name="file-16">
                <label>Open</label>
            </div>
        `;

        this.emit("status-changed");
    }

    setStatusFailed(): void {
        this.status = "failed";
        this.node.getElementsByClassName("download-status")[0].innerHTML = "Failed";

        this.node.getElementsByClassName("download-buttons")[0].innerHTML = `
            <div class="nav-btn" onclick="retryDownload('${this.url}')" title="Retry download">
                <img class="theme-icon" name="reload-16">
                <label>Retry</label>
            </div>
        `;

        this.emit("status-changed");
    }

    setStatusStopped(): void {
        this.status = "stopped";
        this.node.getElementsByClassName("download-status")[0].innerHTML = "Done";

        this.node.getElementsByClassName("download-buttons")[0].innerHTML = "";

        this.emit("status-changed");
    }

    setStatusPause(bytes: number, total: number): void {
        this.status = "pause";
        this.node.getElementsByClassName("download-status")[0].innerHTML = `
            Paused - ${percent(bytes, total)}%<br>(${bytesToSize(bytes)} / ${bytesToSize(total)})
        `;

        this.node.getElementsByClassName("download-buttons")[0].innerHTML = `
            <div class="nav-btn" onclick="resumeDownload('${this.id}')" title="Resume download">
                <img class="theme-icon" name="download-16">
                <label>Resume</label>
            </div>
            <div class="nav-btn" onclick="cancelDownload('${this.id}')" title="Cancel download">
                <img class="theme-icon" name="cancel-16">
            </div>
        `;

        this.emit("status-changed");
    }

    setProcess(bytes: number, total: number): void {
        this.node.getElementsByClassName("download-status")[0].innerHTML = `
            Downloading - ${percent(bytes, total)}%<br>(${bytesToSize(bytes)} / ${bytesToSize(total)})
        `;

        if(this.status !== "processing") {
            this.status = "processing";

            this.node.getElementsByClassName("download-buttons")[0].innerHTML = `
                <div class="nav-btn" onclick="pauseDownload('${this.id}')" title="Pause download">
                    <img class="theme-icon" name="pause-16">
                    <label>Pause</label>
                </div>
                <div class="nav-btn" onclick="cancelDownload('${this.id}')" title="Cancel download">
                    <img class="theme-icon" name="cancel-16">
                </div>
            `;
        }

        this.emit("status-changed");
    }
}

export {}
module.exports = Download;
