class ApplyWinControlsUtility {
  static applyWinControls(show: boolean, type?: string): void {
    if (show) {
      ApplyWinControlsUtility.setNone();
      return;
    }

    const platform = process.platform;

    if (platform === "win32") {
      ApplyWinControlsUtility.setWindows(type);
    }

    if (platform === "linux") {
      ApplyWinControlsUtility.setLinux(type);
    }

    document.body.classList.remove("system-titlebar");
  }

  static setNone(): void {
    const windowControls = document.getElementById("window-controls");
    // @ts-ignore
    windowControls.innerHTML = "";
    document.body.classList.add("system-titlebar");
  }

  static setWindows(type?: string): void {
    const windowControls = document.getElementById("window-controls");
    // @ts-ignore
    windowControls.classList.add("windows");

    if (!type) {
      // @ts-ignore
      windowControls.innerHTML = `
            <div class="button" id="min-btn" title="Minimize" onclick="minimizeWindow()">
                <span>&#xE921;</span>
            </div>
            <div class="button" id="max-btn" title="Maximize" onclick="maximizeWindow()">
                <span>&#xE922;</span>
            </div>
            <div class="button" id="restore-btn" title="Restore Down" onclick="restoreWindow()" style="display: none;">
                <span>&#xE923;</span>
            </div>
            <div class="button" id="close-btn" title="Close" onclick="closeWindow()">
                <span>&#xE8BB;</span>
            </div>`;
    }

    if (type == "only-close") {
      // @ts-ignore
      windowControls.innerHTML = `
            <div class="button" id="close-btn" title="Close" onclick="closeWindow()">
                <span>&#xE8BB;</span>
            </div>`;
    }
  }

  static setLinux(type?: string) {
    const windowControls = document.getElementById("window-controls");
    // @ts-ignore
    windowControls.classList.add("linux");
    if (!type) {
      // @ts-ignore
      windowControls.innerHTML = `
            <button class="nav-btn" title="Minimize" id="min-btn" onclick="minimizeWindow()"><img name="minimize-12" class="theme-icon"></button>
            <button class="nav-btn" title="Maximize" id="max-btn" onclick="maximizeWindow()"><img name="square-12" class="theme-icon"></button>
            <button style="display: none;" class="nav-btn" title="Restore Down" id="restore-btn" onclick="restoreWindow()"><img name="restore-12" class="theme-icon"></button>
            <button class="nav-btn" title="Close" id="close-btn" onclick="closeWindow()"><img name="cancel-12" class="theme-icon"></button>
        `;
    }

    if (type == "only-close") {
      // @ts-ignore
      windowControls.innerHTML = `
            <button class="nav-btn" title="Close" id="close-btn" onclick="closeWindow()"><img name="cancel-12" class="theme-icon"></button>
        `;
    }
  }
}

export { ApplyWinControlsUtility };
module.exports = { ApplyWinControlsUtility };
