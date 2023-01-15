const { ApplyThemeUtility } = require("../../dist/src/modules/applyTheme");

describe("TestApplyTheme", () => {
  it("Check Apply Theme init", () => {
    const applyTheme = new ApplyThemeUtility();
    expect(applyTheme).toBeInstanceOf(ApplyThemeUtility);
  });

  it("setIconPath", () => {
    expect(ApplyThemeUtility.setIconsStyle("/app")).toBeCalledTimes(1);
  });

  it("function applyThem test for Light theme", () => {
    const theme = {
      colorBack: "colorBack",
      colorElement: "colorElement",
      colorBorder: "colorBorder",
      colorSecond: "colorSecond",
      colorTop: "colorTop",
      colorTitlebar: "colorTitlebar",
      colorAccent: "colorAccent",
      shadowFocus: "shadowFocus",
      opacityOver: "opacityOver",
    };
    expect(ApplyThemeUtility.applyTheme(theme, false)).toBeCalledTimes(1);
  });

  it("function applyThem test for Dark theme", () => {
    const theme = {
      colorBack: "colorBack",
      colorElement: "colorElement",
      colorBorder: "colorBorder",
      colorSecond: "colorSecond",
      colorTop: "colorTop",
      colorTitlebar: "colorTitlebar",
      colorAccent: "colorAccent",
      shadowFocus: "shadowFocus",
      opacityOver: "opacityOver",
    };
    expect(ApplyThemeUtility.applyTheme(theme, true)).toBeCalledWith(
      theme,
      true
    );
  });
});
