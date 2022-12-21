"use strict";

const EventEmitter = require("events");
const ppath = require("persist-path")("Ferny");
const readlPromise = require("readline-promise").default;
const prependFile = require("prepend-file");
const fs = require("fs");

const saveFileToJsonFolder = require("../saveFileToJsonFolder.js");
const checkFileExists = require("../checkFileExists.js");

interface IDownloadReadline {
    id: number;
    url: string;
    time: number;
    name: string;
}

const Download = require(__dirname + "/Download.js");

class DownloadManager extends EventEmitter {
    downloads = [];
    downloadContainer = null;
    downloadsLimiter = true;

    constructor(downloadContainer: HTMLElement) {
        super();

        this.downloadContainer = downloadContainer;

        this.setLimiter(true);
    }

    appendDownload(begin: boolean, id: number, name: string, url: string, time: number): void {
        const download = new Download(id, name, url, time);

        download.on("status-changed", (): void => {
            this.emit("download-status-changed");
        });

        this.downloads.push(download);

        if(begin) {
            this.downloadContainer.insertBefore(download.getNode(), this.downloadContainer.firstChild);

            const Data = {
                id: id,
                url: url, 
                time: time,
                name: name
            };
    
            try {
                prependFile(ppath + "/json/downloads/downloads.json", JSON.stringify(Data) + "\n", (err): void => {
                    if(err) {
                        saveFileToJsonFolder("downloads", "downloads", JSON.stringify(Data)).then();
                    }
                });
            } catch (error) {
                saveFileToJsonFolder("downloads", "downloads", JSON.stringify(Data)).then();
            }
        } else {
            this.downloadContainer.appendChild(download.getNode());
            download.setStatusStopped();
        }
    }

    getDownloadById(id: number): void {
        for(let i = 0; i < this.downloads.length; i++) {
            if(this.downloads[i].getId() == id) {
                return this.downloads[i];
            }
        }
    }

    loadDownloads(count: number | null = null): void {
        checkFileExists(ppath + "/json/downloads/downloads.json").then((): void => {
            this.downloadContainer.innerHTML = "";

            const downloadsReadline = readlPromise.createInterface({
                terminal: false, 
                input: fs.createReadStream(ppath + "/json/downloads/downloads.json")
            });
            downloadsReadline.forEach((line: string, index: number): void => {
                const obj: IDownloadReadline = JSON.parse(line);
                if(count == null) {
                    this.appendDownload(false, obj.id, obj.name, obj.url, obj.time);
                } else {
                    if(index < count) {
                        this.appendDownload(false, obj.id, obj.name, obj.url, obj.time);
                    }
                }
            });
        });
    }

    askClearDownloads(): void {
        if(this.downloads.length > 0) {
            this.emit("clear-downloads");
        } else {
            this.emit("downloads-already-cleared");
        }
    }

    clearDownloads(): void {
        saveFileToJsonFolder("downloads", "downloads", "").then((): void => {
            this.downloads = [];
            this.downloadContainer.innerHTML = "";
            this.emit("downloads-cleared");
        });
    }

    setLimiter(bool: boolean): void {
        this.downloadsLimiter = bool;
        if(bool) {
            document.getElementById("more-downloads-btn").style.display = "";
            document.getElementById("collapse-downloads-btn").style.display = "none";
            this.loadDownloads(12);
        } else {
            document.getElementById("more-downloads-btn").style.display = "none";
            document.getElementById("collapse-downloads-btn").style.display = "";
            this.loadDownloads();
        }
    }
}

export {}
module.exports = DownloadManager;
