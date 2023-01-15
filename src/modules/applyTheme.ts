import {
  EApplyThemeCssKeys,
  EApplyThemePropertyNames,
  IThemeProperty,
} from "../types/applyTheme";

class ApplyThemeUtility {
  static themeProperties: IThemeProperty[] = [
    {
      key: EApplyThemeCssKeys.colorBack,
      property: EApplyThemePropertyNames.colorBack,
    },
    {
      key: EApplyThemeCssKeys.colorElement,
      property: EApplyThemePropertyNames.colorElement,
    },
    {
      key: EApplyThemeCssKeys.colorBorder,
      property: EApplyThemePropertyNames.colorBorder,
    },
    {
      key: EApplyThemeCssKeys.colorSecond,
      property: EApplyThemePropertyNames.colorSecond,
    },
    {
      key: EApplyThemeCssKeys.colorTop,
      property: EApplyThemePropertyNames.colorTop,
    },
    {
      key: EApplyThemeCssKeys.colorTitlebar,
      property: EApplyThemePropertyNames.colorTitlebar,
    },
    {
      key: EApplyThemeCssKeys.colorAccent,
      property: EApplyThemePropertyNames.colorAccent,
    },
    {
      key: EApplyThemeCssKeys.shadowFocus,
      property: EApplyThemePropertyNames.shadowFocus,
    },
    {
      key: EApplyThemeCssKeys.opacityOver,
      property: EApplyThemePropertyNames.opacityOver,
    },
  ];

  static setIconsStyle(str: string): void {
    const icons = document.getElementsByClassName("theme-icon");

    Array.from(icons).forEach((icon: any) => {
      icon.src = `../assets/imgs/theme-icons/${str}/${icon.name}.png`;
      icon.classList.add("loaded");
    });
  }

  static applyTheme(theme: any, dark = false) {
    document.documentElement.style.setProperty("--px-radius", theme.pxRadius);
    const themeName = dark ? "dark" : "light";

    ApplyThemeUtility.themeProperties.forEach(
      ({ key, property }: IThemeProperty) => {
        document.documentElement.style.setProperty(
          key,
          theme[themeName][property]
        );
      }
    );

    ApplyThemeUtility.setIconsStyle(theme[themeName].icons);
  }
}

export { ApplyThemeUtility };
module.exports = ApplyThemeUtility;
