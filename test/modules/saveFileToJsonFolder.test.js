const { SaveFileUtility } = require("../../src/modules/saveFileToJsonFolder");

describe("SaveFileUtility", () => {
  it("Instance check SaveFileUtility", () => {
    const instance = new SaveFileUtility();
    expect(instance).toBeInstanceOf(SaveFileUtility);
  });

  it("Test saveFileToJsonFolder", () => {
    expect(
      SaveFileUtility.saveFileToJsonFolder(null, "theme", {})
    ).toBeCalledTimes(1);
  });
});
