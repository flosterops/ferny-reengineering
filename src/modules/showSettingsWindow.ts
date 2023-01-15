import { settingsWindowController } from "../widgets/SettingsWindow";
import { LoadThemeUtility } from "./loadTheme";
import { LoadWinControlsUtility } from "./loadWinControls";
import { mainWindowController } from "../widgets/MainWindow";

class ShowSettingsWindowUtility {
  static showSettingsWindow(categoryId = "") {
    if (
      settingsWindowController.settingsWindow ||
      !settingsWindowController.settingsWindow?.isDestroyed()
    ) {
      return;
    }

    LoadThemeUtility.loadTheme().then(({ theme, dark }) => {
      const backgroundColor = dark
        ? theme.dark.colorBack
        : theme.light.colorBack;

      LoadWinControlsUtility.loadWinControls().then((winControls) => {
        settingsWindowController.init(
          mainWindowController.mainWindow,
          winControls,
          backgroundColor
        );

        settingsWindowController.loadSettingsPage(categoryId);
        settingsWindowController.initOnFocusListener();
        settingsWindowController.initOnBlurListener();
        settingsWindowController.initReadyToShowListener();
      });
    });
  }
}

export { ShowSettingsWindowUtility };
module.exports = { ShowSettingsWindowUtility };
