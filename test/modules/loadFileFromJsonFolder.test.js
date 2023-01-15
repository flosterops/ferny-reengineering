const { LoadFileUtility } = require("../../src/modules/loadFileFromJsonFolder");

describe("LoadFileUtility", () => {
  it("Instance check LoadFileUtility", () => {
    const instance = new LoadFileUtility();
    expect(instance).toBeInstanceOf(LoadFileUtility);
  });

  it("Test checkDirExists empty", () => {
    expect(LoadFileUtility.checkDirExists("/none")).toBeCalledTimes(1);
  });

  it("Test checkDirExists non-empty", () => {
    expect(LoadFileUtility.checkDirExists("/downloads")).toBeCalledTimes(1);
  });

  it("Test loadFileFromJsonFolder non-empty", () => {
    expect(
      LoadFileUtility.loadFileFromJsonFolder(null, "theme")
    ).toBeCalledTimes(1);
  });
});
