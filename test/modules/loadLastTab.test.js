const { LoadLastTabUtility } = require("../../src/modules/loadLastTab");

describe("LoadLastTabUtility", () => {
  it("Instance check LoadLastTabUtility", () => {
    const instance = new LoadLastTabUtility();
    expect(instance).toBeInstanceOf(LoadLastTabUtility);
  });

  it("Test checkDirExists empty", () => {
    expect(LoadLastTabUtility.loadLastTab()).toBeCalledTimes(1);
  });
});
