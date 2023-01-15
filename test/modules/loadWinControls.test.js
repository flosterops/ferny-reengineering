const { LoadWinControlsUtility } = require("../../src/modules/loadWinControls");

describe("LoadThemeUtility", () => {
  it("Instance check LoadThemeUtility", () => {
    const instance = new LoadWinControlsUtility();
    expect(instance).toBeInstanceOf(LoadWinControlsUtility);
  });

  it("Test checkDirExists empty", () => {
    expect(LoadWinControlsUtility.loadWinControls()).toBeCalledTimes(1);
  });
});
