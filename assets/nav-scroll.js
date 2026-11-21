function initNavScroll() {
  const header = document.querySelector('header.nav');
  if (!header || document.body.dataset.page === 'reader') return;

  // The mobile disclosure already owns the header when its trigger is visible.
  const trigger = document.querySelector('.mobile-nav-trigger');
  const narrow = window.matchMedia('(max-width:700px)');
  const usesDisclosure = () => trigger ? !trigger.hidden : narrow.matches;
  let lastY = Math.max(0, window.scrollY);
  let travel = 0;
  let frame = 0;

  function update() {
    frame = 0;
    const y = Math.max(0, window.scrollY);
    const delta = y - lastY;
    lastY = y;
    if (usesDisclosure() || y <= 12 || header.querySelector(':focus-visible')) {
      travel = 0;
      header.classList.remove('nav-scroll-hidden');
      return;
    }
    if (!delta) return;
    travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
    if (travel >= 18 && y > header.offsetHeight) {
      header.classList.add('nav-scroll-hidden');
      travel = 0;
    } else if (travel <= -10) {
      header.classList.remove('nav-scroll-hidden');
      travel = 0;
    }
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  header.addEventListener('focusin', () => header.classList.remove('nav-scroll-hidden'));
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
}
document.addEventListener('DOMContentLoaded', initNavScroll, { once: true });
