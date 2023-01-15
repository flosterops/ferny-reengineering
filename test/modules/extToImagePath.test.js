import { ImagePathUtility } from "../../src/modules/extToImagePath";
import { EExtensionTypes } from "../../src/types/images";

describe("Test ImagePathUtility", () => {
  it("Check instance", () => {
    const utility = new ImagePathUtility();
    expect(utility).toBeInstanceOf(ImagePathUtility);
  });

  it("Test caller ImagePathUtility ext to image checks", () => {
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.zip)).toEqual(
      "../assets/imgs/old-icons16/archive.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.tar)).toEqual(
      "../assets/imgs/old-icons16/archive.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.wim)).toEqual(
      "../assets/imgs/old-icons16/archive.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.z)).toEqual(
      "../assets/imgs/old-icons16/archive.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.xls)).toEqual(
      "../assets/imgs/old-icons16/xls.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.xlsx)).toEqual(
      "../assets/imgs/old-icons16/xls.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.xlr)).toEqual(
      "../assets/imgs/old-icons16/xls.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.ppt)).toEqual(
      "../assets/imgs/old-icons16/ppt.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.pptx)).toEqual(
      "../assets/imgs/old-icons16/ppt.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.pps)).toEqual(
      "../assets/imgs/old-icons16/ppt.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.bmp)).toEqual(
      "../assets/imgs/old-icons16/image.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.ico)).toEqual(
      "../assets/imgs/old-icons16/image.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.tga)).toEqual(
      "../assets/imgs/old-icons16/image.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.pdn)).toEqual(
      "../assets/imgs/old-icons16/image.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.iso)).toEqual(
      "../assets/imgs/old-icons16/cd.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.vcd)).toEqual(
      "../assets/imgs/old-icons16/cd.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.db)).toEqual(
      "../assets/imgs/old-icons16/database.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.dat)).toEqual(
      "../assets/imgs/old-icons16/database.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.sql)).toEqual(
      "../assets/imgs/old-icons16/database.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.dmg)).toEqual(
      "../assets/imgs/old-icons16/dmg.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.csv)).toEqual(
      "../assets/imgs/old-icons16/csv.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.asp)).toEqual(
      "../assets/imgs/old-icons16/asp.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.apk)).toEqual(
      "../assets/imgs/old-icons16/apk.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.cpp)).toEqual(
      "../assets/imgs/old-icons16/cpp.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.cs)).toEqual(
      "../assets/imgs/old-icons16/cs.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.py)).toEqual(
      "../assets/imgs/old-icons16/py.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.otf)).toEqual(
      "../assets/imgs/old-icons16/otf.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.tif)).toEqual(
      "../assets/imgs/old-icons16/tif.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.tiff)).toEqual(
      "../assets/imgs/old-icons16/tif.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.psd)).toEqual(
      "../assets/imgs/old-icons16/psd.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.svg)).toEqual(
      "../assets/imgs/old-icons16/vector.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.jsp)).toEqual(
      "../assets/imgs/old-icons16/jsp.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.rss)).toEqual(
      "../assets/imgs/old-icons16/rss.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.swift)).toEqual(
      "../assets/imgs/old-icons16/swift.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.nes)).toEqual(
      "../assets/imgs/old-icons16/game.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.torrent)).toEqual(
      "../assets/imgs/old-icons16/torrent.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.vb)).toEqual(
      "../assets/imgs/old-icons16/vb.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.avi)).toEqual(
      "../assets/imgs/old-icons16/avi.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.dll)).toEqual(
      "../assets/imgs/old-icons16/dll.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.pdf)).toEqual(
      "../assets/imgs/old-icons16/pdf.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.flv)).toEqual(
      "../assets/imgs/old-icons16/flv.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.swf)).toEqual(
      "../assets/imgs/old-icons16/flv.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.c)).toEqual(
      "../assets/imgs/old-icons16/c.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.gitignore)).toEqual(
      "../assets/imgs/old-icons16/git-fork.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.shtml)).toEqual(
      "../assets/imgs/old-icons16/server.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.stm)).toEqual(
      "../assets/imgs/old-icons16/server.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.shtm)).toEqual(
      "../assets/imgs/old-icons16/server.png"
    );
    expect(ImagePathUtility.extToImagePath(EExtensionTypes.mov)).toEqual(
      "../assets/imgs/old-icons16/mov.png"
    );
  });
});
