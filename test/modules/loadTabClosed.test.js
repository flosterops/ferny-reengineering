const { LoadThemeUtility } = require("../../src/modules/loadTheme");

describe("LoadThemeUtility", () => {
  it("Instance check LoadThemeUtility", () => {
    const instance = new LoadThemeUtility();
    expect(instance).toBeInstanceOf(LoadThemeUtility);
  });

  it("Test checkDirExists empty", () => {
    expect(LoadThemeUtility.loadTheme("ferny")).toBeCalledTimes(1);
  });
});
