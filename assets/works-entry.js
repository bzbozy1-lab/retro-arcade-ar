(() => {
  const entry = document.querySelector('.works-entry');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!entry || motion.matches || document.hidden || location.hash ||
      (navigation && navigation.type !== 'navigate')) return;

  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  const timer = setTimeout(finish, 1400);
  function finish() {
    clearTimeout(timer);
    entry.remove();
    listeners.abort();
  }

  entry.addEventListener('animationend', event => {
    if (event.target === entry && event.animationName === 'works-entry-end') finish();
  }, options);
  document.addEventListener('focusin', finish, options);
  window.addEventListener('pagehide', finish, options);
  window.addEventListener('keydown', event => { if (event.key === 'Escape') finish(); }, options);
  motion.addEventListener('change', event => { if (event.matches) finish(); }, options);
  entry.classList.add('is-playing');
})();
