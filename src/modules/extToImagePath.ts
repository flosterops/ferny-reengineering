import { EExtensionTypes } from "../types/images";

class ImagePathUtility {
  static extensionImages = {
    [EExtensionTypes.zip]: "../assets/imgs/old-icons16/archive.png",
    [EExtensionTypes.tar]: "../assets/imgs/old-icons16/archive.png",
    [EExtensionTypes.wim]: "../assets/imgs/old-icons16/archive.png",
    [EExtensionTypes.z]: "../assets/imgs/old-icons16/archive.png",
    [EExtensionTypes.xls]: "../assets/imgs/old-icons16/xls.png",
    [EExtensionTypes.xlsx]: "../assets/imgs/old-icons16/xls.png",
    [EExtensionTypes.xlr]: "../assets/imgs/old-icons16/xls.png",
    [EExtensionTypes.ppt]: "../assets/imgs/old-icons16/ppt.png",
    [EExtensionTypes.pptx]: "../assets/imgs/old-icons16/ppt.png",
    [EExtensionTypes.pps]: "../assets/imgs/old-icons16/ppt.png",
    [EExtensionTypes.bmp]: "../assets/imgs/old-icons16/image.png",
    [EExtensionTypes.ico]: "../assets/imgs/old-icons16/image.png",
    [EExtensionTypes.tga]: "../assets/imgs/old-icons16/image.png",
    [EExtensionTypes.pdn]: "../assets/imgs/old-icons16/image.png",
    [EExtensionTypes.iso]: "../assets/imgs/old-icons16/cd.png",
    [EExtensionTypes.vcd]: "../assets/imgs/old-icons16/cd.png",
    [EExtensionTypes.db]: "../assets/imgs/old-icons16/database.png",
    [EExtensionTypes.dat]: "../assets/imgs/old-icons16/database.png",
    [EExtensionTypes.sql]: "../assets/imgs/old-icons16/database.png",
    [EExtensionTypes.dmg]: "../assets/imgs/old-icons16/dmg.png",
    [EExtensionTypes.csv]: "../assets/imgs/old-icons16/csv.png",
    [EExtensionTypes.asp]: "../assets/imgs/old-icons16/asp.png",
    [EExtensionTypes.apk]: "../assets/imgs/old-icons16/apk.png",
    [EExtensionTypes.cpp]: "../assets/imgs/old-icons16/cpp.png",
    [EExtensionTypes.cs]: "../assets/imgs/old-icons16/cs.png",
    [EExtensionTypes.py]: "../assets/imgs/old-icons16/py.png",
    [EExtensionTypes.otf]: "../assets/imgs/old-icons16/otf.png",
    [EExtensionTypes.tif]: "../assets/imgs/old-icons16/tif.png",
    [EExtensionTypes.tiff]: "../assets/imgs/old-icons16/tif.png",
    [EExtensionTypes.psd]: "../assets/imgs/old-icons16/psd.png",
    [EExtensionTypes.svg]: "../assets/imgs/old-icons16/vector.png",
    [EExtensionTypes.jsp]: "../assets/imgs/old-icons16/jsp.png",
    [EExtensionTypes.rss]: "../assets/imgs/old-icons16/rss.png",
    [EExtensionTypes.swift]: "../assets/imgs/old-icons16/swift.png",
    [EExtensionTypes.nes]: "../assets/imgs/old-icons16/game.png",
    [EExtensionTypes.torrent]: "../assets/imgs/old-icons16/torrent.png",
    [EExtensionTypes.vb]: "../assets/imgs/old-icons16/vb.png",
    [EExtensionTypes.avi]: "../assets/imgs/old-icons16/avi.png",
    [EExtensionTypes.dll]: "../assets/imgs/old-icons16/dll.png",
    [EExtensionTypes.pdf]: "../assets/imgs/old-icons16/pdf.png",
    [EExtensionTypes.flv]: "../assets/imgs/old-icons16/flv.png",
    [EExtensionTypes.swf]: "../assets/imgs/old-icons16/flv.png",
    [EExtensionTypes.c]: "../assets/imgs/old-icons16/c.png",
    [EExtensionTypes.gitignore]: "../assets/imgs/old-icons16/git-fork.png",
    [EExtensionTypes.shtml]: "../assets/imgs/old-icons16/server.png",
    [EExtensionTypes.stm]: "../assets/imgs/old-icons16/server.png",
    [EExtensionTypes.shtm]: "../assets/imgs/old-icons16/server.png",
    [EExtensionTypes.mov]: "../assets/imgs/old-icons16/mov.png",
  };

  static extToImagePath(ext: EExtensionTypes | string): string {
    if (ImagePathUtility.extensionImages[ext]) {
      return ImagePathUtility.extensionImages[ext];
    }

    return "../assets/imgs/old-icons16/page.png";
  }
}

export { ImagePathUtility };
module.exports = ImagePathUtility;
