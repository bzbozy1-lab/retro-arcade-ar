(() => {
  const entry = document.querySelector('.sakhr-entry');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const navigation = performance.getEntriesByType('navigation')[0];
  if (!entry) return;
  if (motion.matches || document.hidden || location.hash ||
      (navigation && navigation.type !== 'navigate')) {
    entry.remove();
    return;
  }
  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  function finish() {
    entry.remove();
    listeners.abort();
  }
  entry.addEventListener('animationend', event => {
    if (event.target === entry) finish();
  }, options);
  document.addEventListener('focusin', finish, options);
  window.addEventListener('pagehide', finish, options);
  window.addEventListener('keydown', event => { if (event.key === 'Escape') finish(); }, options);
  motion.addEventListener('change', event => { if (event.matches) finish(); }, options);
  entry.classList.add('sakhr-entry-playing');
})();
