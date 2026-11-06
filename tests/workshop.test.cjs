const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function control() {
  return {
    value: '',
    handlers: {},
    attrs: {},
    addEventListener(name, handler) { this.handlers[name] = handler; },
    setAttribute(name, value) { this.attrs[name] = value; }
  };
}

test('workshop combines normalized search, category and device filters and resets them', () => {
  const html = fs.readFileSync('workshop.html', 'utf8');
  const cards = [...html.matchAll(/class="workshop-card" id="([^"]+)" data-category="([^"]+)" data-device="([^"]*)" data-keywords="([^"]+)">([\s\S]*?)<\/article>/g)]
    .map(([, id, category, device, keywords, body]) => ({
      id, dataset: {category, device, keywords},
      querySelector: () => ({textContent: body.replace(/<[^>]+>/g, ' ')})
    }));
  const categories = [...html.matchAll(/data-workshop-category="([^"]+)"/g)]
    .map(([, category]) => Object.assign(control(), {dataset: {workshopCategory: category}}));
  const reset = control();
  const form = Object.assign(control(), {elements: {query: control(), device: control()}, querySelector: () => reset});
  const count = {};
  const empty = {};
  const filters = {querySelector: () => form, querySelectorAll: () => categories};
  const elements = {workshopFilters: filters, workshopCount: count, workshopEmpty: empty};
  function initialize(search = "") {
    vm.runInNewContext(fs.readFileSync('assets/workshop.js', 'utf8'), {
      document: {querySelector: selector => elements[selector.slice(1)], querySelectorAll: () => cards},
      URLSearchParams, location: {search}
    });
  }
  initialize("?device=ps2");

  const visible = () => cards.filter(card => !card.hidden).map(card => card.id);
  const search = value => {
    form.elements.query.value = value;
    form.elements.query.handlers.input();
  };
  assert.equal(form.elements.device.value, 'ps2');
  assert.deepEqual(visible(), ['guide-ps2-discs', 'guide-ps2-display', 'guide-ps2-saves']);
  reset.handlers.click();
  assert.equal(visible().length, 28);
  search('أَقْرَاص');
  assert.ok(visible().includes('guide-ps2-discs'));
  search('blank   screen');
  assert.deepEqual(visible(), ['guide-wii-picture']);
  search('');
  categories.find(button => button.dataset.workshopCategory === 'diagnosis').handlers.click();
  form.elements.device.value = 'wii';
  form.elements.device.handlers.change();
  assert.deepEqual(visible(), ['guide-wii-picture', 'guide-wii-remote', 'guide-wii-sensor']);
  search('unknown');
  assert.equal(empty.hidden, false);
  assert.equal(count.textContent, 'لا توجد نتائج.');
  reset.handlers.click();
  assert.equal(form.elements.query.value, '');
  assert.equal(form.elements.device.value, '');
  assert.equal(visible().length, 28);
  assert.equal(empty.hidden, true);
  assert.ok(categories.every(button => button.attrs['aria-pressed'] === 'false'));
  assert.equal((html.match(/<details>/g) || []).length, 28);
  assert.equal(new Set(cards.map(card => card.id)).size, 28);
  const options = [...html.matchAll(/<option value="([^"]+)">/g)].map(match => match[1]);
  assert.equal(options.length, 11);
  assert.ok(options.every(device => cards.some(card => card.dataset.device.split(' ').includes(device))));
});
