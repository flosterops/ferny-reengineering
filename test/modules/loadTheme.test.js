const { LoadTabClosedUtility } = require("../../src/modules/loadTabClosed");

describe("LoadTabClosedUtility", () => {
  it("Instance check LoadTabClosedUtility", () => {
    const instance = new LoadTabClosedUtility();
    expect(instance).toBeInstanceOf(LoadTabClosedUtility);
  });

  it("Test checkDirExists empty", () => {
    expect(LoadTabClosedUtility.loadTabClosed()).toBeCalledTimes(1);
  });
});
