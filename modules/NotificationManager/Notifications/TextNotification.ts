"use strict";

const BlankNotification = require("./BlankNotification");

class TextNotification extends BlankNotification {
    text = "";

    constructor(id: number, autoClose: boolean, text: string) {
        super(id, autoClose);

        this.text = text;

        super.getNode().getElementsByClassName("notif-body")[0].innerHTML = `<label class='notif-text'>${this.text}</label>`;
    }

    setText(text) {
        this.getNode().getElementsByClassName("notif-text")[0].innerHTML = text;
        super.refreshTimeout();
    }
}

export {}
module.exports = TextNotification;
