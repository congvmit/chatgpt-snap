const { globalShortcut, Menu, MenuItem } = require("electron");

let isMenuOnAltBackslash = false;

function toggleMenuBar(win) {
  const isMenuBarVisible = win.autoHideMenuBar;
  win.setAutoHideMenuBar(!isMenuBarVisible);
  win.setMenuBarVisibility(isMenuBarVisible);
}

function registerMenuHandling(win) {
  // Menu bar toggling shortcut register
  const menuShortcut = globalShortcut.register("Alt+\\", () => {
    toggleMenuBar(win);
  });

  if (!menuShortcut) {
    console.error("Failed to register global shortcut!");
  }

  // Preventing menu bar toggling on Alt
  win.webContents.on("before-input-event", (event, input) => {
    if (isMenuOnAltBackslash && input.alt) {
      event.preventDefault();
    }
  });

  // Adding menu item to the "Window" menu
  const menu = Menu.getApplicationMenu();
  const windowMenu = menu.items?.find((el) => el.role === "windowmenu");
  if (windowMenu) {
    windowMenu.submenu.insert(0, new MenuItem({
      label: "Open menu bar on ALT+\\",
      type: 'checkbox',
      checked: isMenuOnAltBackslash,
      click: () => {
        isMenuOnAltBackslash = !isMenuOnAltBackslash;
        win.setAutoHideMenuBar(true);
        win.setMenuBarVisibility(false);
      }
    }));
  }
}

module.exports = { registerMenuHandling };
