export enum EApplyThemeCssKeys {
  colorBack = "--color-back",
  colorElement = "--color-element",
  colorBorder = "--color-border",
  colorSecond = "--color-second",
  colorTop = "--color-top",
  colorTitlebar = "--color-titlebar",
  colorAccent = "--color-accent",
  shadowFocus = "--shadow-focus",
  opacityOver = "--opacity-over",
}

export enum EApplyThemePropertyNames {
  colorBack = "colorBack",
  colorElement = "colorElement",
  colorBorder = "colorBorder",
  colorSecond = "colorSecond",
  colorTop = "colorTop",
  colorTitlebar = "colorTitlebar",
  colorAccent = "colorAccent",
  shadowFocus = "shadowFocus",
  opacityOver = "opacityOver",
}

export interface IThemeProperty {
  key: EApplyThemeCssKeys;
  property: EApplyThemePropertyNames;
}
