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
  const rect = toggle.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const transition = document.startViewTransition(update);
  try {
    await transition.ready;
    root.animate(reducedMotion.matches ? [{opacity:0},{opacity:1}] : [
      {clipPath:`circle(0px at ${x}px ${y}px)`},
      {clipPath:`circle(${radius}px at ${x}px ${y}px)`}
    ], {duration:reducedMotion.matches ? 100 : 280,easing:'cubic-bezier(0.2, 0, 0, 1)',pseudoElement:'::view-transition-new(root)',fill:'both'});
    await transition.finished;
  } catch {} finally { root.classList.remove('theme-changing'); transitioning = false; }
});
system.addEventListener('change', () => {
  try { if (localStorage.getItem('portfolio-theme')) return; } catch {}
  applyTheme(system.matches ? 'dark' : 'light');
});
