(() => {
  const device = getDevice();
  if (!device) return;

  const link = document.querySelector('#deviceWorkshop');
  const params = new URLSearchParams({device: device.id});
  link.href = 'workshop.html?' + params + '#workshopGuides';
  link.hidden = false;

  const museumUrl = deviceMuseumUrl(device.id);
  if (museumUrl) {
    const museum = document.querySelector('#deviceMuseum');
    museum.href = museumUrl;
    document.querySelector('#deviceMuseumName').textContent = device.name;
    document.querySelector('#deviceMuseumSymbol').innerHTML = window.CartoIcons.markup(device.id);
    document.querySelector('#deviceMuseumCard').hidden = false;
  }
})();
