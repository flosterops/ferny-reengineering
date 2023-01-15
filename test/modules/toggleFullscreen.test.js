const { ToggleFullscreen } = require("../../src/modules/toggleFullscreen");

describe("ToggleFullscreen", () => {
  it("Instance check ToggleFullscreen", () => {
    const instance = new ToggleFullscreen();
    expect(instance).toBeInstanceOf(ToggleFullscreen);
  });

  it("Test saveFileToJsonFolder", () => {
    expect(ToggleFullscreen.toggleFullscreen()).toBeCalledTimes(1);
  });
});
