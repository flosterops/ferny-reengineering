import { BoundsUtility } from "./loadBounds";
import { LoadThemeUtility } from "./loadTheme";
import { LoadWinControlsUtility } from "./loadWinControls";
import { mainWindowController } from "../widgets/MainWindow";
import { DownloadsController } from "./downloads";

class ShowMainWindowUtility {
  static showMainWindow(downloadsController: DownloadsController) {
    BoundsUtility.loadBounds().then((Data) => {
      if (Data.maximize) {
        Data.x = null;
        Data.y = null;
        Data.width = 1150;
        Data.height = 680;
      }

      LoadThemeUtility.loadTheme().then(({ theme, dark }) => {
        const backgroundColor = dark
          ? theme.dark.colorBack
          : theme.light.colorBack;
        const borderColor = dark
          ? theme.dark.colorBorder
          : theme.light.colorBorder;

        LoadWinControlsUtility.loadWinControls().then((winControls) => {
          mainWindowController.init(Data, winControls, backgroundColor);

          mainWindowController.onLoadFile();
          mainWindowController.initOnFocusListener();
          mainWindowController.initOnBlurListener();
          mainWindowController.initOnMaximize();
          mainWindowController.initOnUnMaximize();

          mainWindowController.initOnDomReady(
            {
              colorBack: backgroundColor,
              colorBorder: borderColor,
            },
            downloadsController
          );

          mainWindowController.initAppCommands();
          mainWindowController.initOnClose(downloadsController);
        });
      });
    });
  }
}

export { ShowMainWindowUtility };
module.exports = { ShowMainWindowUtility };
