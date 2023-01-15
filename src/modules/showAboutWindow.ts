import { LoadThemeUtility } from "./loadTheme";
import { IWindowControls, LoadWinControlsUtility } from "./loadWinControls";
import { aboutWindowController } from "../widgets/AboutWindow";
import { mainWindowController } from "../widgets/MainWindow";

class ShowAboutWindowUtility {
  static showAboutWindow() {
    if (
      !aboutWindowController.aboutWindow ||
      aboutWindowController.aboutWindow.isDestroyed()
    ) {
      LoadThemeUtility.loadTheme().then(({ theme, dark }) => {
        const backgroundColor = dark
          ? theme.dark.colorBack
          : theme.light.colorBack;

        LoadWinControlsUtility.loadWinControls().then(
          (winControls: IWindowControls) => {
            aboutWindowController.init(
              mainWindowController.mainWindow,
              winControls,
              backgroundColor
            );

            aboutWindowController.initLoadPage();
            aboutWindowController.initOnFocusListener();
            aboutWindowController.initOnBlurListener();
            aboutWindowController.initOnReadyToShowListener();
          }
        );
      });
    }
  }
}

export { ShowAboutWindowUtility };
module.exports = { ShowAboutWindowUtility };
