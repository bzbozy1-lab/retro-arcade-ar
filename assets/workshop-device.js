(() => {
  const device = getDevice();
  if (!device) return;

  const link = document.querySelector('#deviceWorkshop');
  const params = new URLSearchParams({device: device.id});
  link.href = 'workshop.html?' + params + '#workshopGuides';
  link.hidden = false;
})();
