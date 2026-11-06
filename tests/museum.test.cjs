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

test('PS2 museum switches scenes and restores focus when a part closes', () => {
  const exhibit = new Element();
  const info = new Element();
  const close = new Element();
  const title = new Element();
  const stage = new Element();
  const comparison = new Element();
  const parts = new Element();
  const angles = new Element();
  const controls = new Element();
  const sources = ['angle', 'slim'].map(name => Object.assign(new Element(), {
    dataset: {src: 'assets/museum/' + name + '.svg'}
  }));
  comparison.querySelectorAll = () => sources;
  info.querySelector = selector => selector === 'button' ? close : selector === 'h2' ? title : new Element();
  const elements = {'.museum-stage': stage, '.museum-angles': angles, '.museum-comparison': comparison,
    '.museum-info': info, '.museum-parts': parts, '.museum-controls': controls};
  const options = (key, names) => names.map(name => Object.assign(new Element(), {dataset: {[key]: name}}));
  const modes = options('museumMode', ['explore', 'components', 'compare']);
  const views = options('museumView', ['angle', 'front', 'rear', 'top']);
  exhibit.querySelector = selector => elements[selector];
  exhibit.querySelectorAll = selector => selector === '[data-museum-mode]' ? modes : views;
  vm.runInNewContext(fs.readFileSync('assets/museum.js', 'utf8'), {
    Image: Element,
    document: {querySelector: () => exhibit, createElement: () => new Element()}
  });
  for (const view of views) {
    view.click();
    const [art, pin] = stage.children;
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
  assert.equal(stage.children.filter(child => child.src && fs.existsSync(child.src)).length, 5);
  parts.children[2].click();
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
