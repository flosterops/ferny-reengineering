const {
  OpenDownloadsFolderUtility,
} = require("../../src/modules/openDownloadsFolder");
const { DownloadsController } = require("../../src/modules/downloads");

describe("OpenDownloadsFolderUtility", () => {
  const downloadsController = new DownloadsController();
  it("Instance check OpenDownloadsFolderUtility", () => {
    const instance = new OpenDownloadsFolderUtility();
    expect(instance).toBeInstanceOf(OpenDownloadsFolderUtility);
  });

  it("Test checkDirExists", () => {
    expect(
      OpenDownloadsFolderUtility.openDownloadsFolder(downloadsController)
    ).toBeCalledTimes(1);
  });
});
