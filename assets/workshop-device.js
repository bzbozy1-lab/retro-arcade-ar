(() => {
  const device = getDevice();
  if (!device) return;

  const link = document.querySelector('#deviceWorkshop');
  const params = new URLSearchParams({device: device.id});
  link.href = 'workshop.html?' + params + '#workshopGuides';
  link.hidden = false;

  if (['ps1', 'ps2', 'ps3', 'gamecube', 'snes', 'ds', 'gba'].includes(device.id)) {
    const museum = document.querySelector('#deviceMuseum');
    museum.href = 'museum-' + device.id + '.html';
    museum.hidden = false;
  }
})();
