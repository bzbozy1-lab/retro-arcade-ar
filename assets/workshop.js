(() => {
  const filters = document.querySelector('#workshopFilters');
  const form = filters.querySelector('form');
  const query = form.elements.query;
  const device = form.elements.device;
  const count = document.querySelector('#workshopCount');
  const empty = document.querySelector('#workshopEmpty');
  const categories = [...filters.querySelectorAll('[data-workshop-category]')];
  let category = '';

  function normalize(value) {
    return value.normalize('NFKC').toLowerCase()
      .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
      .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي')
      .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  }

  const cards = [...document.querySelectorAll('.workshop-card')].map(card => ({
    card,
    devices: card.dataset.device.split(' '),
    search: normalize(card.querySelector('.workshop-card-body').textContent + ' ' + card.dataset.keywords)
  }));

  function update() {
    const terms = normalize(query.value).split(' ');
    let matches = 0;
    for (const {card, devices, search} of cards) {
      const visible = (!category || category === card.dataset.category)
        && (!device.value || devices.includes(device.value))
        && terms.every(term => search.includes(term));
      card.hidden = !visible;
      if (visible) matches++;
    }
    count.textContent = matches ? 'عدد النتائج: ' + matches.toLocaleString('ar') : 'لا توجد نتائج.';
    empty.hidden = matches > 0;
  }

  function setCategory(value) {
    category = value;
    categories.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.workshopCategory === category));
    });
  }

  categories.forEach(button => button.addEventListener('click', () => {
    const value = button.dataset.workshopCategory;
    setCategory(category === value ? '' : value);
    update();
  }));
  query.addEventListener('input', update);
  device.addEventListener('change', update);
  form.addEventListener('submit', event => event.preventDefault());
  form.querySelector('[data-workshop-reset]').addEventListener('click', () => {
    query.value = '';
    device.value = '';
    setCategory('');
    update();
  });
  const requestedDevice = new URLSearchParams(location.search).get('device');
  if (cards.some(entry => entry.devices.includes(requestedDevice))) {
    device.value = requestedDevice;
  }
  filters.hidden = false;
  update();
})();
