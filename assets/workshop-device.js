(() => {
  const device = getDevice();
  if (!device) return;

  const link = document.querySelector('#deviceWorkshop');
  const params = new URLSearchParams({device: device.id});
  link.href = 'workshop.html?' + params + '#workshopGuides';
  link.hidden = false;

  if (['ps1', 'ps2', 'ps3', 'gamecube', 'snes', 'ds', 'gba', 'xbox360', 'wii', '3ds', 'vita'].includes(device.id)) {
    const museum = document.querySelector('#deviceMuseum');
    museum.href = 'museum-' + device.id + '.html';
    document.querySelector('#deviceMuseumName').textContent = device.name;
    document.querySelector('#deviceMuseumSymbol').innerHTML = window.CartoIcons.markup(device.id);
    document.querySelector('#deviceMuseumCard').hidden = false;
  }
})();
