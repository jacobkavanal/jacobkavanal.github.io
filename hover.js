const reduced = matchMedia('(prefers-reduced-motion: reduce)');
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.links a, .section-nav a, .project-row h3 a, .experience-row h3 a, .project-links a, .theme-toggle').forEach((element) => {
    let frame = 0, x = 0, y = 0, targetX = 0, targetY = 0;
    let origin;
    const tick = () => {
      x += (targetX - x) * 0.13;
      y += (targetY - y) * 0.13;
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.03) frame = requestAnimationFrame(tick);
      else { frame = 0; if (!targetX && !targetY) element.style.removeProperty('transform'); }
    };
    const move = (event) => {
      if (!origin || reduced.matches) return;
      const dx = event.clientX - (origin.left + origin.width / 2);
      const dy = event.clientY - (origin.top + origin.height / 2);
      const distanceX = Math.max(0, Math.abs(dx) - origin.width / 2);
      const distanceY = Math.max(0, Math.abs(dy) - origin.height / 2);
      if (Math.hypot(distanceX, distanceY) > 30) { release(); return; }
      targetX = Math.max(-7, Math.min(7, dx * 0.12));
      targetY = -3 + Math.max(-4, Math.min(4, dy * 0.12));
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const release = () => {
      origin = null;
      targetX = targetY = 0;
      element.classList.remove('magnetic-hover');
      window.removeEventListener('pointermove', move);
      if (!frame) frame = requestAnimationFrame(tick);
    };
    element.addEventListener('pointerenter', (event) => {
      if (reduced.matches) return;
      origin = element.getBoundingClientRect();
      element.classList.add('magnetic-hover');
      window.addEventListener('pointermove', move);
      move(event);
    });
    window.addEventListener('blur', release);
    window.addEventListener('scroll', () => { if (origin) release(); }, { passive: true });
    reduced.addEventListener('change', release);
  });
}
