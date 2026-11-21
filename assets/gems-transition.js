(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const nav = performance.getEntriesByType('navigation')[0];
  if (reduced.matches || document.hidden || location.hash ||
      (nav && nav.type !== 'navigate') || !Element.prototype.animate) return;

  document.addEventListener('DOMContentLoaded', () => {
    const chest = document.querySelector('.gems-chest');
    const grid = document.querySelector('#gemGrid');
    if (!chest || !grid || reduced.matches || document.hidden) return;
    if (chest.getBoundingClientRect().bottom < 0) return;

    const effects = [];
    const glints = [];
    const controller = new AbortController();
    const { signal } = controller;
    const ease = 'cubic-bezier(.22,1,.36,1)';
    const rail = document.createElement('div');
    rail.className = 'gems-reveal-rail';
    rail.setAttribute('aria-hidden', 'true');
    grid.before(rail);
    const motion = (node, frames, delay, duration, easing = ease) =>
      effects.push(node.animate(frames, { delay, duration, easing, fill: 'both' }));
    const move = (selector, frames, delay, duration) =>
      motion(chest.querySelector(selector), frames, delay, duration);

    function finish() {
      clearTimeout(timer);
      controller.abort();
      effects.forEach(effect => effect.cancel());
      for (const [image, light] of glints) {
        light.remove();
        image.classList.remove('gems-lit');
      }
      rail.remove();
    }
    const timer = setTimeout(finish, 2000);
    window.addEventListener('pagehide', finish, { signal });
    window.addEventListener('keydown', event => { if (event.key === 'Escape') finish(); }, { signal });
    document.addEventListener('focusin', finish, { signal, once: true });
    reduced.addEventListener('change', event => { if (event.matches) finish(); }, { signal });

    move('.gems-lid', [
      { transform:'translateY(20px)' },
      { transform:'translateY(-4px) rotate(-2deg)', offset:.76 }, { transform:'none' }
    ], 0, 510);
    move('.gems-seam', [{opacity:0},{opacity:1,offset:.38},{opacity:0}], 100, 540);
    move('.gems-gem', [
      {opacity:0,transform:'translateY(44px) scale(.55)'},
      {opacity:1,transform:'translateY(-5px) scale(1.04)',offset:.77},
      {opacity:1,transform:'none'}
    ], 320, 690);
    move('.gems-brackets', [
      {opacity:0,transform:'scale(1.42)'},{opacity:.95,transform:'scale(1)',offset:.62},
      {opacity:0,transform:'scale(1)'}
    ], 510, 560);
    move('.gems-halo', [{opacity:0,transform:'scale(.72)'},{opacity:.6,offset:.3},
      {opacity:0,transform:'scale(1.32)'}], 670, 470);
    move('.gems-prism', [
      {opacity:0,transform:'translateX(-30px)'},{opacity:.92,offset:.35},
      {opacity:0,transform:'translateX(58px)'}
    ], 735, 444);
    chest.querySelectorAll('.gems-spark').forEach((spark,index) => motion(spark, [
      {opacity:0,transform:'scale(.3)'},{opacity:1,offset:.2},
      {opacity:0,transform:'translate('+spark.dataset.x+'px,'+spark.dataset.y+'px) scale(.4)'}
    ], 800+index*19, 410));
    for (let i = 0; i < 12; i++) {
      const pixel = document.createElement('i');
      rail.append(pixel);
      motion(pixel,[{opacity:0},{opacity:1,offset:.32},{opacity:0}],1060+i*55,260);
    }

    const cards = [...grid.querySelectorAll('.gem-game')];
    const firstTop = cards[0]?.offsetTop;
    const row = cards.filter(card => Math.abs(card.offsetTop - firstTop) < 2);
    row.forEach((card,index) => {
      const image = card.querySelector('.gameimage');
      if (!image) return;
      const light = document.createElement('span');
      light.className = 'gems-light';
      light.setAttribute('aria-hidden', 'true');
      image.classList.add('gems-lit');
      image.append(light);
      glints.push([image, light]);
      const start = 1110+index*410/Math.max(2,row.length-1);
      motion(light, [
        {opacity:0,transform:'translateX(65%)'},
        {opacity:.85,offset:.32},
        {opacity:0,transform:'translateX(-65%)'}
      ], start, 430);
    });
  }, { once: true });
})();
