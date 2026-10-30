/* Shared keyboard and focus lifecycle for CARTO dialogs. */
(function () {
  'use strict';
  let current = null;
  let opener = null;
  let openerName = null;
  let background = [];
  let overflow = '';
  function focusable(dialog) {
    return [...dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex]')]
      .filter(el => !el.disabled && el.tabIndex >= 0 && !el.closest('[hidden]') && el.getClientRects().length);
  }
  function close(dialog = current) {
    if (!dialog || dialog !== current) return;
    dialog.classList.remove('open');
    dialog.hidden = true;
    background.forEach(({el, inert}) => { el.inert = inert; });
    background = [];
    document.body.style.overflow = overflow;
    const previous = opener;
    const name = openerName;
    current = opener = openerName = null;
    queueMicrotask(() => {
      let target = previous?.isConnected ? previous : null;
      if (!target && name) target = [...document.querySelectorAll('[data-wish-name]')].find(el => el.dataset.wishName === name);
      if (!target) target = document.querySelector('main h1, main');
      if (target) { if (!target.matches('button,a,input,select,textarea')) target.tabIndex = -1; target.focus({preventScroll: true}); }
    });
    document.dispatchEvent(new CustomEvent('carto:dialog-close', {detail: {dialog}}));
  }
  function open(dialog) {
    if (!dialog) return;
    if (current === dialog) return;
    if (current) close(current);
    opener = document.activeElement;
    openerName = opener?.dataset.wishName || null;
    overflow = document.body.style.overflow;
    current = dialog;
    dialog.hidden = false;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.classList.add('open');
    background = [...document.body.children].filter(el => el !== dialog && !el.matches('script,style,link'))
      .map(el => ({el, inert: el.inert}));
    background.forEach(({el}) => { el.inert = true; });
    document.body.style.overflow = 'hidden';
    const first = dialog.querySelector('[aria-label="إغلاق"]') || focusable(dialog)[0];
    if (first) first.focus({preventScroll: true});
    else { dialog.tabIndex = -1; dialog.focus(); }
    document.dispatchEvent(new CustomEvent('carto:dialog-open', {detail: {dialog}}));
  }
  document.addEventListener('keydown', event => {
    if (!current) return;
    if (event.key === 'Escape') { event.preventDefault(); event.stopImmediatePropagation(); close(); return; }
    if (event.key !== 'Tab') return;
    const items = focusable(current);
    if (!items.length) { event.preventDefault(); current.focus(); return; }
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || !current.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !current.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  }, true);
  document.addEventListener('click', event => {
    if (current && (event.target === current || event.target.closest('[data-dialog-close], #modalClose, .wishlist-close'))) close();
  });
  window.CartoDialog = {open, close};
})();
