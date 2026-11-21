(() => {
  const scene = document.querySelector('.magazine-opening');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!scene) return;
  if (motion.matches || document.hidden || location.hash ||
      (navigation && navigation.type !== 'navigate')) {
    scene.remove();
    return;
  }

  const clip = scene.querySelector('#magazine-opening-clip path');
  const fold = scene.querySelector('.magazine-opening-fold');
  const crease = fold.querySelector('path');
  const signal = new AbortController();
  const options = { signal: signal.signal };
  let frame;
  let safetyTimer;
  const start = performance.now();

  function finish() {
    clearTimeout(safetyTimer);
    cancelAnimationFrame(frame);
    scene.remove();
    signal.abort();
  }

  function lightCovers() {
    for (const group of ['.cover-stack img', '#magazineShelf .magazine-cover']) {
      const covers = [...document.querySelectorAll(group)];
      const top = covers[0]?.getBoundingClientRect().top;
      covers.filter(cover => {
        const bounds = cover.getBoundingClientRect();
        return Math.abs(bounds.top - top) < 5 && bounds.top < innerHeight && bounds.bottom > 0;
      }).forEach((cover, index) => {
        cover.classList.add('magazine-entry-glint');
        cover.style.animationDelay = index * 55 + 'ms';
        cover.addEventListener('animationend', () => {
          cover.classList.remove('magazine-entry-glint');
          cover.style.removeProperty('animation-delay');
        }, { once: true });
      });
    }
  }

  function draw(now) {
    const time = Math.min(1, Math.max(0, (now - start - 240) / 1150));
    const travel = time * time * (3 - 2 * time);
    const bend = Math.sin(Math.PI * travel);
    const x = travel * 1.12;
    clip.setAttribute('d', `M${x} 0H1V1H${x - bend * .05}C${x - bend * .16} .71 ${x - bend * .09} .26 ${x} 0Z`);
    const edge = x * 1000;
    const width = 105 * bend;
    crease.setAttribute('d', `M${edge-width} 0H${edge+width}C${edge-90*bend+width} 260 ${edge-160*bend+width} 710 ${edge-50*bend+width} 1000H${edge-50*bend-width}C${edge-160*bend-width} 710 ${edge-90*bend-width} 260 ${edge-width} 0Z`);
    fold.style.opacity = bend;
    scene.style.setProperty('--magazine-print-shift', travel * 46 + '%');
    if (time === 1) {
      finish();
      lightCovers();
    } else {
      frame = requestAnimationFrame(draw);
    }
  }

  window.addEventListener('pagehide', finish, options);
  document.addEventListener('focusin', finish, options);
  window.addEventListener('keydown', event => { if (event.key === 'Escape') finish(); }, options);
  motion.addEventListener('change', event => { if (event.matches) finish(); }, options);
  scene.classList.add('is-opening');
  safetyTimer = setTimeout(finish, 1750);
  frame = requestAnimationFrame(draw);
})();
