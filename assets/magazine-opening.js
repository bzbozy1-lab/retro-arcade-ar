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

  const paper = scene.querySelector('.magazine-press-paper');
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  const timer = setTimeout(finish, 1650);

  function finish() {
    clearTimeout(timer);
    scene.remove();
    listeners.abort();
  }

  paper.addEventListener('animationend', event => {
    if (event.target === paper && event.animationName === 'magazine-press-exit') finish();
  }, options);
  window.addEventListener('pagehide', finish, options);
  document.addEventListener('focusin', finish, options);
  window.addEventListener('keydown', event => { if (event.key === 'Escape') finish(); }, options);
  motion.addEventListener('change', event => { if (event.matches) finish(); }, options);
  scene.classList.add('is-opening');
})();
