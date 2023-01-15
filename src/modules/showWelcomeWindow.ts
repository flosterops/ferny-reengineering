import { LoadThemeUtility } from "./loadTheme";
import { mainWindowController } from "../widgets/MainWindow";
import { welcomeWindowController } from "../widgets/WelcomeWindow";

class ShowWelcomeWindowUtility {
  static showWelcomeWindow() {
    mainWindowController.mainWindow.webContents.send("action-esc");

    LoadThemeUtility.loadTheme().then(function (theme) {
      welcomeWindowController.init(
        mainWindowController.mainWindow,
        theme.colorBack
      );

      welcomeWindowController.initMenu();
      welcomeWindowController.initOnFocusListener();
      welcomeWindowController.initOnBlurListener();
      welcomeWindowController.loadWelcomePage();
      welcomeWindowController.initOnReadyToShowListener();
    });
  }
}

export { ShowWelcomeWindowUtility };
module.exports = { ShowWelcomeWindowUtility };
