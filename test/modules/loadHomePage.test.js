const { LoadHomePageUtility } = require("../../src/modules/loadHomePage");

describe("LoadHomePageUtility", () => {
  it("Instance check LoadHomePageUtility", () => {
    const instance = new LoadHomePageUtility();
    expect(instance).toBeInstanceOf(LoadHomePageUtility);
  });

  it("Test checkDirExists empty", () => {
    expect(LoadHomePageUtility.loadHomePage()).toBeCalledTimes(1);
  });
});
