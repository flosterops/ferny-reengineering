import { SideMenuBuilder } from "./SideMenu/SideMenuBuilder";
import { appController } from "../widgets/App";
import { tabManagerController } from "../widgets/TabManager";
import { Menu } from "electron";
import { mainWindowController } from "../widgets/MainWindow";
import { overlayController } from "../widgets/Overlay";
import { DownloadsController } from "./downloads";

class InitMenuUtility {
  static initMenu(downloadsController: DownloadsController) {
    const sideMenuBuilder = new SideMenuBuilder(
      appController,
      mainWindowController,
      overlayController,
      tabManagerController,
      downloadsController
    );

    sideMenuBuilder.createSideMenuList(true, true);

    const sideMenu = Menu.buildFromTemplate(sideMenuBuilder.getList() as any);
    Menu.setApplicationMenu(null);

    mainWindowController.mainWindow.setMenu(sideMenu);
    mainWindowController.mainWindow.setMenuBarVisibility(false);
  }
}

export { InitMenuUtility };
module.exports = { InitMenuUtility };
