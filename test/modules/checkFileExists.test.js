import { FSUtility } from "../../src/modules/checkFileExists";

describe("Test BytesUtility", () => {
  it("Check instance", () => {
    const utility = new FSUtility();
    expect(utility).toBeInstanceOf(FSUtility);
  });

  it("Test caller FSUtility with no files", () => {
    expect(FSUtility.checkFileExists("none")).toBeCalledTimes(1);
  });

  it("Test caller FSUtility with null", () => {
    expect(FSUtility.checkFileExists(null)).toBeCalledTimes(1);
  });
});
