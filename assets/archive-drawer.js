(() => {
  const modal = document.querySelector('#modal:has(#modalTitle), #gameDialog');
  if (!modal) return;
  const native = modal instanceof HTMLDialogElement;
  const title = modal.querySelector(native ? '#gameTitle' : '#modalTitle');
  const panel = modal.querySelector(native ? '.archive-drawer-content' : '#modalContent');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let trigger, movement, closing = false;

  function stop() {
    if (!movement) return;
    const {tab, animations} = movement;
    movement = null;
    animations.forEach(animation => animation.cancel());
    tab.remove();
    title.classList.remove('archive-drawer-travelling');
  }

  function animate(opening) {
    stop();
    if (reduced.matches || !panel?.animate || !trigger?.getClientRects().length) return;
    const button = trigger.getBoundingClientRect();
    const heading = title.getBoundingClientRect();
    if (!heading.width || !heading.height || !button.width || !button.height) return;
    const duration = opening ? 165 : 120;
    const tab = document.createElement('span');
    tab.className = 'archive-drawer-tab archive-drawer-flight';
    tab.textContent = opening ? title.textContent : 'تفاصيل اللعبة';
    tab.dir = opening ? 'auto' : 'rtl';
    tab.setAttribute('aria-hidden', 'true');
    Object.assign(tab.style, {
      top: heading.top + 'px', left: heading.left + 'px',
      width: heading.width + 'px', height: heading.height + 'px'
    });
    modal.append(tab);
    title.classList.add('archive-drawer-travelling');
    const landing = {transform: 'none'};
    const origin = {transform: `translate(${button.right - heading.right}px, ${button.top - heading.top}px) scale(${button.width / heading.width}, ${button.height / heading.height})`};
    const hidden = {opacity: 0, transform: 'translateY(-8px)'};
    const visible = {opacity: 1, transform: 'none'};
    const options = {duration, easing: opening ? 'cubic-bezier(.2,.8,.25,1)' : 'ease-in', fill: 'both'};
    const animations = [
      tab.animate(opening ? [origin, landing] : [landing, origin], options),
      panel.animate(opening ? [hidden, visible] : [visible, hidden], options)
    ];
    const active = movement = {tab, animations};
    return Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
      if (opening && movement === active) stop();
    });
  }

  function reset() {
    stop();
    trigger = null;
    closing = false;
  }

  async function close() {
    if (closing) return;
    closing = true;
    const finished = animate(false);
    if (finished) await finished;
    if (!closing) return;
    if (native) modal.close();
    else window.CartoDialog.close(modal);
    reset();
  }

  title.classList.add('archive-drawer-tab');
  window.addEventListener('click', event => {
    const button = event.target.closest?.('button[data-details]');
    if (button && !modal.open && !modal.classList.contains('open')) trigger = button;
    if (!trigger || native || !modal.classList.contains('open')) return;
    if (event.target !== modal && !modal.contains(event.target.closest?.('#modalClose'))) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    close();
  }, true);

  if (native) {
    modal.addEventListener('carto:game-details-open', () => animate(true));
    modal.addEventListener('cancel', event => { event.preventDefault(); close(); });
    modal.addEventListener('submit', event => {
      if (event.target.method !== 'dialog') return;
      event.preventDefault();
      close();
    });
    modal.addEventListener('close', reset);
  } else {
    document.addEventListener('carto:dialog-open', event => {
      if (event.detail.dialog === modal && trigger) animate(true);
    });
    document.addEventListener('carto:dialog-close', event => {
      if (event.detail.dialog === modal) reset();
    });
    window.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !trigger || !modal.classList.contains('open')) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      close();
    }, true);
  }
})();
