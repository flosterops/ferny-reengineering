const { ColorsUtility } = require("../../src/modules/rgbToRgbaString");

describe("ColorsUtility", () => {
  it("Instance check ColorsUtility", () => {
    const instance = new ColorsUtility();
    expect(instance).toBeInstanceOf(ColorsUtility);
  });

  it("Test checkDirExists", () => {
    expect(ColorsUtility.rgbToRgbaString("rgb(255, 168, 1)")).toBeCalledTimes(
      1
    );
  });
});
