const { BoundsUtility } = require("../../src/modules/loadBounds");

describe("BoundsUtility", () => {
  it("Instance check BoundsUtility", () => {
    const instance = new BoundsUtility();
    expect(instance).toBeInstanceOf(BoundsUtility);
  });

  it("Test loadBounds", () => {
    expect(BoundsUtility.loadBounds()).toBeCalledTimes(1);
  });
});
