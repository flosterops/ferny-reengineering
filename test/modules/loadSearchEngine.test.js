const {
  LoadSearchEngineUtility,
} = require("../../src/modules/loadSearchEngine");

describe("LoadSearchEngineUtility", () => {
  it("Instance check LoadSearchEngineUtility", () => {
    const instance = new LoadSearchEngineUtility();
    expect(instance).toBeInstanceOf(LoadSearchEngineUtility);
  });

  it("Test checkDirExists empty", () => {
    expect(LoadSearchEngineUtility.loadSearchEngine()).toBeCalledTimes(1);
  });
});
