(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches || document.visibilityState === 'hidden') return;

  const main = document.querySelector('main');
  if (!main) return;
  const root = new URL('../', document.currentScript.src);
  const current = new URL(location.href);
  const route = current.pathname.slice(root.pathname.length);
  const navigation = performance.getEntriesByType('navigation')[0];
  if (navigation && navigation.type !== 'navigate') return;
  const home = route === '' || route === 'index.html';

  function firstHomeVisit() {
    try {
      if (sessionStorage.getItem('shawq-boot-v1')) return false;
      sessionStorage.setItem('shawq-boot-v1', '1');
      return true;
    } catch {
      return !document.referrer;
    }
  }

  function play(target, mode, duration, effect) {
    target.dataset.shawqMotion = mode;
    if (effect) target.append(effect);
    function finish() {
      clearTimeout(timer);
      delete target.dataset.shawqMotion;
      effect?.remove();
      reduce.removeEventListener('change', onPreference);
      window.removeEventListener('pagehide', finish);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', finish);
    }
    function onPreference(event) { if (event.matches) finish(); }
    function onKey(event) { if (event.key === 'Escape') finish(); }
    const timer = setTimeout(finish, duration);
    reduce.addEventListener('change', onPreference);
    window.addEventListener('pagehide', finish, { once: true });
    window.addEventListener('keydown', onKey);
    document.addEventListener('focusin', finish, { once: true });
  }

  function decoration(className) {
    const effect = document.createElement('div');
    effect.className = className;
    effect.setAttribute('aria-hidden', 'true');
    return effect;
  }

  if (home && firstHomeVisit()) {
    const boot = decoration('shawq-boot');
    boot.innerHTML = '<div class="shawq-shutter"></div><div class="shawq-shutter"></div>' +
      '<div class="shawq-pixels"></div><div class="shawq-terminal"></div><div class="shawq-signal"></div>';
    const pixels = boot.querySelector('.shawq-pixels');
    const colors = ['#d7f653', '#304ff5', '#ff7848'];
    for (let i = 0; i < 18; i++) {
      const bit = document.createElement('i');
      const angle = i * Math.PI * 2 / 18;
      const x = Math.cos(angle), y = Math.sin(angle);
      bit.style.left = 50 + x * 12 + '%';
      bit.style.top = 50 + y * 23 + '%';
      bit.style.setProperty('--x', Math.round(x * 85) + 'px');
      bit.style.setProperty('--y', Math.round(y * 63) + 'px');
      bit.style.setProperty('--delay', i % 6 * 38 + 'ms');
      bit.style.backgroundColor = colors[i % colors.length];
      pixels.append(bit);
    }
    const mascot = new Image(76, 80);
    mascot.alt = '';
    mascot.src = new URL('assets/carto-wave-still.webp', root).href;
    boot.querySelector('.shawq-terminal').append(mascot);
    play(document.body, 'boot', 1850, boot);
    return;
  }

  if (route === 'works.html' && main.querySelector('.work-stamp-approved')) {
    play(main, 'works', 1280);
    return;
  }

  if (route === 'sakhr.html' && main.querySelector('.sakhr-screen')) {
    play(main, 'sakhr', 1240);
    return;
  }

  if (!document.referrer || current.hash) return;
  const previous = new URL(document.referrer);
  if (previous.origin !== root.origin || !previous.pathname.startsWith(root.pathname) ||
      previous.pathname === current.pathname || previous.pathname.endsWith('/reader.html')) return;

  const tiles = decoration('shawq-route-tiles');
  for (let i = 0; i < 50; i++) {
    const tile = document.createElement('i');
    tile.style.setProperty('--delay', ((9 - i % 10) * 23 + Math.floor(i / 10) * 17) + 'ms');
    tiles.append(tile);
  }
  play(main, 'route', 920, tiles);
})();
