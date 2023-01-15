import { ipcRenderer } from "electron";
import sslCertificate from "get-ssl-certificate";

import { LoadThemeUtility } from "../../src/modules/loadTheme";
import { ApplyThemeUtility } from "../../src/modules/applyTheme";

function getActiveURL() {
  ipcRenderer.send("request-load-certificate");
}

function getCertificateAtURL() {
  const url = (document.getElementById("link-input") as any).value;
  ipcRenderer.send("request-load-certificate", url);
}

ipcRenderer.on("action-load-certificate", (event, arg) => {
  (document.getElementById("link-input") as any).value = arg;
  console.log(arg);

  const hostname = arg.split("/")[2];
  sslCertificate.get(hostname).then(function (certificate) {
    console.log(certificate);

    //@ts-ignore
    document.getElementById("subject-cn").innerHTML = certificate.subject.CN;
    //@ts-ignore
    document.getElementById("subject-o").innerHTML = certificate.subject.O;
    //@ts-ignore
    document.getElementById("subject-c").innerHTML = certificate.subject.C;
    //@ts-ignore
    document.getElementById("subject-l").innerHTML = certificate.subject.L;
    //@ts-ignore
    document.getElementById("subject-st").innerHTML = certificate.subject.ST;

    //@ts-ignore
    document.getElementById("issuer-cn").innerHTML = certificate.issuer.CN;
    //@ts-ignore
    document.getElementById("issuer-o").innerHTML = certificate.issuer.O;
    //@ts-ignore
    document.getElementById("issuer-c").innerHTML = certificate.issuer.C;

    //@ts-ignore
    document.getElementById("valid-from").innerHTML = certificate.valid_from;
    //@ts-ignore
    document.getElementById("valid-to").innerHTML = certificate.valid_to;

    //@ts-ignore
    document.getElementById("serial-number").innerHTML =
      certificate.serialNumber;
    //@ts-ignore
    document.getElementById("fingerprint").innerHTML = certificate.fingerprint;
    //@ts-ignore
    document.getElementById("fingerprint256").innerHTML =
      certificate.fingerprint256;
    //@ts-ignore
    document.getElementById("alt-name").innerHTML = certificate.subjectaltname;
    //@ts-ignore
    document.getElementById("bits").innerHTML = certificate.bits;
    //@ts-ignore
    document.getElementById("exponent").innerHTML = certificate.exponent;
    //@ts-ignore
    document.getElementById("pem-encoded").innerHTML = certificate.pemEncoded;
    //@ts-ignore
    document.getElementById("modulus").innerHTML = certificate.modulus;
  });
});

function init() {
  LoadThemeUtility.loadTheme().then(function (theme) {
    ApplyThemeUtility.applyTheme(theme);
  });

  getActiveURL();
}

document.onreadystatechange = () => {
  if (document.readyState == "complete") {
    init();
  }
};

export {};
