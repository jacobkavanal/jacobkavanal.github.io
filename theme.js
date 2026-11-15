const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const system = matchMedia('(prefers-color-scheme: dark)');
function applyTheme(theme) {
  root.dataset.theme = theme;
  const dark = theme === 'dark';
  toggle.setAttribute('aria-pressed', String(dark));
  toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
  toggle.querySelector('.theme-label').textContent = dark ? 'Light mode' : 'Dark mode';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#191919' : '#f4f1eb';
}
applyTheme(root.dataset.theme || (system.matches ? 'dark' : 'light'));
toggle.hidden = false;
let angle = root.dataset.theme === 'dark' ? 180 : 0;
toggle.style.setProperty('--theme-angle', `${angle}deg`);
toggle.addEventListener('click', () => {
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  angle += 180;
  toggle.style.setProperty('--theme-angle', `${angle}deg`);
  applyTheme(theme);
  try { localStorage.setItem('portfolio-theme', theme); } catch {}
});
system.addEventListener('change', () => {
  try { if (localStorage.getItem('portfolio-theme')) return; } catch {}
  applyTheme(system.matches ? 'dark' : 'light');
});
