const { SaveBoundsUtility } = require("../../src/modules/saveBounds");

describe("SaveBoundsUtility", () => {
  it("Instance check SaveBoundsUtility", () => {
    const instance = new SaveBoundsUtility();
    expect(instance).toBeInstanceOf(SaveBoundsUtility);
  });

  it("Test checkDirExists", () => {
    expect(SaveBoundsUtility.saveBounds()).toBeCalledTimes(1);
  });
});
