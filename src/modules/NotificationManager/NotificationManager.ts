"use strict";

const EventEmitter = require("events");

const StatusNotification = require("./Notifications/StatusNotification");
const QuestNotification = require("./Notifications/QuestNotification");
const ZoomNotification = require("./Notifications/ZoomNotification");

class NotificationManager extends EventEmitter {
  maxNotifCount = 1;

  notifPanel = null;
  notifArray = [];
  notifCounter = 0;

  constructor(notifPanel: HTMLElement) {
    super();

    this.notifPanel = notifPanel;
    this.notifPanel.classList.add("notif-panel");
  }

  appendNotif(notif): void {
    this.notifArray.push(notif);
    this.notifPanel.appendChild(notif.getNode());
    notif.on("close", (notification) => {
      this.destroyNotifById(notification.getId());
    });

    if (this.notifArray.length > this.maxNotifCount) {
      for (let i = 0; i < this.notifArray.length - this.maxNotifCount; i++) {
        this.notifArray[i].close();
      }
    }

    this.emit("notif-added", notif, this);
  }

  addStatusNotif(text: string, type: string): void {
    this.appendNotif(
      new StatusNotification(this.notifCounter++, true, text, type)
    );
  }

  addQuestNotif(text: string, buttons: any[]): void {
    this.appendNotif(
      new QuestNotification(this.notifCounter++, false, text, buttons)
    );
  }

  addZoomNotif(zoom: string | number): void {
    this.appendNotif(
      new ZoomNotification(
        this.notifCounter++,
        true,
        "Zoom factor changed to " + zoom + "%"
      )
    );
  }

  refreshZoomNotif(zoom: string | number): void {
    let bool = true;
    for (let i = 0; i < this.notifArray.length; i++) {
      if (this.notifArray[i].constructor.name == "ZoomNotification") {
        bool = false;
        this.notifArray[i].setText("Zoom factor changed to " + zoom + "%");
        break;
      }
    }
    if (bool) {
      this.addZoomNotif(zoom);
    }
  }

  destroyNotifById(id: number): void {
    for (let i = 0; i < this.notifArray.length; i++) {
      if (this.notifArray[i].getId() == id) {
        this.notifPanel.removeChild(this.notifArray[i].getNode());
        this.notifArray.splice(i, 1);
        break;
      }
    }
  }
}

export { NotificationManager };
module.exports = { NotificationManager };
