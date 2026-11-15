const root = document.documentElement;
const toggle = document.querySelector('.theme-toggle');
const system = matchMedia('(prefers-color-scheme: dark)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let transitioning = false;
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
toggle.addEventListener('click', async () => {
  if (transitioning) return;
  const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  const update = () => {
    applyTheme(theme);
    try { localStorage.setItem('portfolio-theme', theme); } catch {}
  };
  if (!document.startViewTransition) { update(); return; }
  transitioning = true;
  root.classList.add('theme-changing');
  const transition = document.startViewTransition(update);
  try {
    await transition.ready;
    root.animate([{opacity:0},{opacity:1}], {
      duration: reducedMotion.matches ? 100 : 280,
      easing: 'ease-out',
      pseudoElement: '::view-transition-new(root)',
      fill: 'both'
    });
    await transition.finished;
  } catch {} finally { root.classList.remove('theme-changing'); transitioning = false; }
});
system.addEventListener('change', () => {
  try { if (localStorage.getItem('portfolio-theme')) return; } catch {}
  applyTheme(system.matches ? 'dark' : 'light');
});
