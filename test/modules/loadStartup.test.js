const { LoadStartupUtility } = require("../../src/modules/loadStartup");

describe("LoadStartupUtility", () => {
  it("Instance check LoadStartupUtility", () => {
    const instance = new LoadStartupUtility();
    expect(instance).toBeInstanceOf(LoadStartupUtility);
  });

  it("Test checkDirExists empty", () => {
    expect(LoadStartupUtility.loadStartup()).toBeCalledTimes(1);
  });
});
