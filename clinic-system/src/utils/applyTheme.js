export function applyTheme() {
  const raw = sessionStorage.getItem("__THEME_CONFIG__");
  if (!raw) return;

  const settings = JSON.parse(raw);

  // 1. Theme mode (light/dark)
  document.documentElement.setAttribute("data-theme", settings.theme);

  // 2. Navigation
  document.body.setAttribute("data-nav", settings.nav);

  // 3. Color scheme
  if (settings.color?.color) {
    document.body.setAttribute("data-color", settings.color.color);
  }

  // 4. Layout mode
  if (settings.layout?.mode) {
    document.body.setAttribute("data-layout-mode", settings.layout.mode);
  }

  // 5. Topbar color
  if (settings.topbar?.color) {
    document.body.setAttribute("data-topbar-color", settings.topbar.color);
  }

  // 6. Sidebar color
  if (settings.menu?.color) {
    document.body.setAttribute("data-menu-color", settings.menu.color);
  }

  // 7. Sidenav size
  if (settings.sidenav?.size) {
    document.body.setAttribute("data-sidenav-size", settings.sidenav.size);
  }

  // 8. Show user avatar or not
  document.body.setAttribute(
    "data-sidenav-user",
    settings.sidenav?.user ? "true" : "false"
  );
}
