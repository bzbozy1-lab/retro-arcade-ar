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
  vm.runInNewContext(fs.readFileSync('assets/workshop.js', 'utf8'), {
    document: {querySelector: selector => elements[selector.slice(1)], querySelectorAll: () => cards}
  });

  const visible = () => cards.filter(card => !card.hidden).map(card => card.id);
  const search = value => {
    form.elements.query.value = value;
    form.elements.query.handlers.input();
  };
  assert.equal(visible().length, 11);
  search('أَقْرَاص');
  assert.deepEqual(visible(), ['guide-ps2-discs']);
  search('blank   screen');
  assert.deepEqual(visible(), ['guide-wii-picture']);
  search('');
  categories.find(button => button.dataset.workshopCategory === 'diagnosis').handlers.click();
  form.elements.device.value = 'wii';
  form.elements.device.handlers.change();
  assert.deepEqual(visible(), ['guide-wii-picture']);
  search('unknown');
  assert.equal(empty.hidden, false);
  assert.equal(count.textContent, 'لا توجد نتائج.');
  reset.handlers.click();
  assert.equal(form.elements.query.value, '');
  assert.equal(form.elements.device.value, '');
  assert.equal(visible().length, 11);
  assert.equal(empty.hidden, true);
  assert.ok(categories.every(button => button.attrs['aria-pressed'] === 'false'));
  assert.equal((html.match(/<details>/g) || []).length, 3);
});
