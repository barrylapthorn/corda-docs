// Control toggling of dark mode.

function setThemeDark() {
  localStorage.theme = 'dark'
  document.querySelector('html').classList.add('dark')
  document.getElementById('dark').style.display = 'none';
  document.getElementById('light').style.display = 'block';
}

function setThemeLight() {
  localStorage.theme = 'light'
  document.querySelector('html').classList.remove('dark')
  document.getElementById('dark').style.display = 'block';
  document.getElementById('light').style.display = 'none';
}

function toggleTheme(toggle) {
  const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (toggle) {
    if (isDark) {
      setThemeLight();
    } else {
      setThemeDark();
    }
  } else {
    if (isDark) {
      setThemeDark();
    } else {
      setThemeLight();
    }
  }
}

export function setTheme() {
  toggleTheme(true);
}

export function setThemeOnLoad() {
  toggleTheme(false);
}

