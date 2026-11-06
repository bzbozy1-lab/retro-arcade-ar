(() => {
  const device = getDevice();
  if (!device) return;

  const link = document.querySelector('#deviceWorkshop');
  const params = new URLSearchParams({device: device.id});
  link.href = 'workshop.html?' + params + '#workshopGuides';
  link.hidden = false;

  if (device.id === 'ps1' || device.id === 'ps2') {
    const museum = document.querySelector('#deviceMuseum');
    museum.href = 'museum-' + device.id + '.html';
    museum.hidden = false;
  }
})();
