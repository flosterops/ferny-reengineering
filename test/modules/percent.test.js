const { PercentUtility } = require("../../src/modules/percent");

describe("PercentUtility", () => {
  it("Instance check PercentUtility", () => {
    const instance = new PercentUtility();
    expect(instance).toBeInstanceOf(PercentUtility);
  });

  it("Test checkDirExists", () => {
    expect(PercentUtility.percent(60 / 100)).toEqual(60);
  });
});
