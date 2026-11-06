const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Element {
  dataset = {};
  attrs = {};
  style = {};
  handlers = {};
  children = [];
  addEventListener(name, handler) { this.handlers[name] = handler; }
  setAttribute(name, value) { this.attrs[name] = value; }
  replaceChildren(...children) { this.children = children; }
  focus() { this.focused = true; }
  scrollIntoView() {}
  click() { this.handlers.click(); }
}

for (const model of ['ps2', 'ps1', 'ps3', 'gamecube', 'snes', 'ds']) test(model + ' museum switches scenes and restores focus when a part closes', () => {
  const window = {};
  if (model !== 'ps2') vm.runInNewContext(fs.readFileSync('assets/museum-' + model + '.js', 'utf8'), {window});
  const directory = window.CartoMuseumModel?.directory ?? 'assets/museum/';
  const exhibit = new Element();
  const info = new Element();
  const close = new Element();
  const title = new Element();
  const stage = new Element();
  const comparison = new Element();
  const angles = new Element();
  const controls = new Element();
  const sources = (model === 'gamecube' ? ['rear', 'revision'] : ['snes', 'ds'].includes(model) ? ['angle', 'revision'] : ['angle', 'slim']).map(name => Object.assign(new Element(), {
    dataset: {src: directory + name + '.svg'}
  }));
  comparison.querySelectorAll = () => sources;
  info.querySelector = selector => selector === 'button' ? close : selector === 'h2' ? title : new Element();
  const elements = {'.museum-stage': stage, '.museum-angles': angles, '.museum-comparison': comparison,
    '.museum-info': info, '.museum-controls': controls};
  const options = (key, names) => names.map(name => Object.assign(new Element(), {dataset: {[key]: name}}));
  const modes = options('museumMode', ['explore', 'components', 'compare']);
  const views = options('museumView', ['angle', 'front', 'rear', 'top']);
  exhibit.querySelector = selector => elements[selector];
  exhibit.querySelectorAll = selector => selector === '[data-museum-mode]' ? modes : views;
  vm.runInNewContext(fs.readFileSync('assets/museum.js', 'utf8'), {
    window, Image: Element,
    document: {querySelector: () => exhibit, createElement: () => new Element()}
  });
  for (const view of views) {
    view.click();
    const [art, pin] = stage.children;
    assert.equal(art.src, directory + view.dataset.museumView + '.svg');
    assert.ok(fs.existsSync(art.src));
    pin.click();
    assert.equal(info.hidden, false);
    assert.ok(title.textContent);
    close.click();
    assert.equal(info.hidden, true);
    assert.equal(pin.focused, true);
  }
  modes[1].click();
  assert.equal(angles.hidden, true);
  const [assembled, ...layers] = stage.children;
  assert.ok(fs.existsSync(assembled.src));
  assert.equal(layers.length, 5);
  assert.ok(layers.every(layer => {
    const [art, pin] = layer.children[0].children;
    return fs.existsSync(art.src) && Boolean(pin.handlers.click);
  }));
  layers.find(layer => layer.dataset.component === 'board').children[0].children[1].click();
  assert.equal(stage.dataset.part, 'board');
  exhibit.handlers.keydown({key: 'Escape'});
  assert.equal(info.hidden, true);
  modes[2].click();
  assert.equal(stage.hidden, true);
  assert.equal(comparison.hidden, false);
  assert.ok(sources.every(image => fs.existsSync(image.src)));
  modes[0].click();
  assert.equal(stage.children[0].dataset.layer, 'top');
  assert.equal(modes[0].attrs['aria-pressed'], 'true');
});
