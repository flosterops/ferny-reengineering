import { ApplyWinControlsUtility } from "../../src/modules/applyWinControls";

describe("Test WinControllsUtility", () => {
  it("Check instance", () => {
    const utility = new ApplyWinControlsUtility();
    expect(utility).toBeInstanceOf(ApplyWinControlsUtility);
  });

  it("Test apply win controls with show", () => {
    expect(ApplyWinControlsUtility.applyWinControls(true)).toBeCalledTimes(1);
  });

  it("Test apply win controls without show", () => {
    expect(ApplyWinControlsUtility.applyWinControls(false)).toBeCalledTimes(1);
  });

  it("Test apply win controls for windows", () => {
    expect(
      ApplyWinControlsUtility.applyWinControls(false, "win32")
    ).toBeCalledTimes(1);
  });

  it("Test apply win controls for linux", () => {
    expect(
      ApplyWinControlsUtility.applyWinControls(false, "linux")
    ).toBeCalledTimes(1);
  });

  it("Test set note win controls", () => {
    expect(ApplyWinControlsUtility.setNone()).toBeCalledTimes(1);
  });

  it("Test set windows win controls", () => {
    expect(ApplyWinControlsUtility.setWindows()).toBeCalledTimes(1);
  });

  it("Test set linus win controls", () => {
    expect(ApplyWinControlsUtility.setLinux()).toBeCalledTimes(1);
  });
});
