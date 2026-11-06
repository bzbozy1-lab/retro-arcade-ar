(() => {
  const exhibit = document.querySelector('[data-museum]');
  const stage = exhibit.querySelector('.museum-stage');
  const angles = exhibit.querySelector('.museum-angles');
  const comparison = exhibit.querySelector('.museum-comparison');
  const info = exhibit.querySelector('.museum-info');
  const title = info.querySelector('h2');
  const description = info.querySelector('p');
  const modes = [...exhibit.querySelectorAll('[data-museum-mode]')];
  const views = [...exhibit.querySelectorAll('[data-museum-view]')];
  let view = 'angle';
  let active = null;
  const model = window.CartoMuseumModel;
  const directory = model?.directory ?? 'assets/museum/';
  const parts = model?.parts ?? {
    tray: ['درج الأقراص', 'درج أمامي يحمل قرص اللعبة أو الفيلم إلى وحدة القراءة.'],
    memory: ['فتحتا بطاقة الذاكرة', 'تُستخدمان لحفظ تقدّم الألعاب على بطاقة متوافقة.'],
    controller: ['منافذ التحكم', 'منفذان أماميان لتوصيل ذراعي التحكم السلكيتين.'],
    usb: ['منافذ USB', 'منفذان أماميان للملحقات التي تدعمها اللعبة أو المنظومة.'],
    ilink: ['منفذ S400 i.LINK', 'منفذ IEEE 1394 في هذا الطراز، استخدمته بعض الألعاب للربط بين الأجهزة.'],
    power: ['التشغيل وإخراج القرص', 'أزرار التشغيل وإعادة الضبط وفتح درج الأقراص، بجوار مؤشرات الحالة.'],
    av: ['مخرج AV MULTI OUT', 'ينقل الصورة والصوت عبر كابل صوت وفيديو متوافق.'],
    optical: ['المخرج الصوتي البصري', 'يرسل الصوت رقميًا إلى جهاز صوت يدعم الوصلة البصرية.'],
    bay: ['حجرة التوسعة', 'حيّز خلفي للملحقات المتوافقة مثل محوّل الشبكة ووحدة القرص الصلب.'],
    fan: ['مروحة التهوية', 'تطرد الهواء الساخن من الهيكل أثناء التشغيل.'],
    ac: ['مدخل الكهرباء ومفتاح الطاقة', 'يتصل السلك بمزوّد الطاقة الداخلي، ويتحكم المفتاح الخلفي في تغذية الجهاز.'],
    lid: ['الغطاء الخارجي', 'غلاف علوي يحمي المكونات ويحدد شكل الجهاز ذي الخطوط المتوازية.'],
    drive: ['وحدة قراءة الأقراص', 'تجمع آلية تحريك الدرج وتدوير القرص ووحدة القراءة البصرية.'],
    board: ['اللوحة الرئيسية', 'تضم دوائر المعالجة والذاكرة وتربط الوحدات والمنافذ ببعضها.'],
    base: ['القاعدة والواجهة الأمامية', 'تسند الهيكل وتجمع مواضع فتحات الذاكرة وأذرع التحكم.'],
    ports: ['مجموعة المنافذ', 'تفصيل بصري لمخارج الاتصال الخلفية يبرز وظيفتها داخل الهيكل.']
  };
  // Coordinates use the artwork viewBox, with the origin at its upper-left corner.
  const scenes = model?.scenes ?? {
    angle: {art: ['angle'], points: [['lid',230,143],['tray',278,184],['memory',107,177],['usb',192,222]]},
    front: {art: ['front'], points: [['memory',96,106],['controller',121,145],['usb',184,184],['ilink',224,162],['tray',332,125],['power',419,158]]},
    rear: {art: ['rear'], points: [['fan',104,132],['bay',210,181],['av',306,150],['optical',345,181],['ac',396,142]]},
    top: {art: ['top'], points: [['lid',230,130]]},
    components: {art: ['base','board','drive','lid','ports'], points: [['lid',112,56],['drive',221,114],['board',135,165],['base',187,239],['ports',380,139]]}
  };
  function clearInfo(restore = false) {
    if (active) {
      active.setAttribute('aria-pressed', 'false');
      if (restore) active.focus();
    }
    active = null;
    info.hidden = true;
    delete stage.dataset.part;
  }

  function selectPart(button, id) {
    if (active === button) {
      clearInfo();
      return;
    }
    clearInfo();
    active = button;
    button.setAttribute('aria-pressed', 'true');
    stage.dataset.part = id;
    [title.textContent, description.textContent] = parts[id];
    info.hidden = false;
    info.scrollIntoView({block: 'nearest'});
  }

  function buttonFor(id, text, className) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = text;
    button.setAttribute('aria-label', parts[id][0]);
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => selectPart(button, id));
    return button;
  }

  function render(mode) {
    clearInfo();
    exhibit.dataset.museum = mode;
    modes.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.museumMode === mode)));
    views.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.museumView === view)));
    angles.hidden = mode !== 'explore';
    stage.hidden = mode === 'compare';
    comparison.hidden = !stage.hidden;
    if (stage.hidden) {
      comparison.querySelectorAll('[data-src]').forEach(img => {
        img.src = img.dataset.src;
        delete img.dataset.src;
      });
      return;
    }
    const scene = scenes[mode === 'explore' ? view : 'components'];
    const art = scene.art.map(name => {
      const image = new Image();
      image.alt = '';
      image.src = directory + name + '.svg';
      image.className = 'museum-art';
      image.dataset.layer = name;
      return image;
    });
    const pins = scene.points.map(([id, x, y], index) => {
      const number = String(index + 1).padStart(2, '0');
      const pin = buttonFor(id, number, 'museum-pin');
      pin.style.left = x / 480 * 100 + '%';
      pin.style.top = y / 300 * 100 + '%';
      return pin;
    });
    if (mode === 'components') {
      const assembled = new Image();
      assembled.alt = '';
      assembled.src = directory + 'angle.svg';
      assembled.className = 'museum-assembled';
      const layers = art.map(image => {
        const layer = document.createElement('div');
        layer.className = 'museum-layer';
        const name = image.dataset.layer;
        layer.dataset.component = name;
        const float = document.createElement('div');
        float.className = 'museum-float';
        float.replaceChildren(image, pins[scene.points.findIndex(([id]) => id === name)]);
        layer.replaceChildren(float);
        return layer;
      });
      stage.replaceChildren(assembled, ...layers);
    } else {
      stage.replaceChildren(...art, ...pins);
    }
  }

  modes.forEach(button => button.addEventListener('click', () => {
    if (exhibit.dataset.museum !== button.dataset.museumMode) render(button.dataset.museumMode);
  }));
  views.forEach(button => button.addEventListener('click', () => {
    if (view === button.dataset.museumView) return;
    view = button.dataset.museumView;
    render('explore');
  }));
  info.querySelector('button').addEventListener('click', () => clearInfo(true));
  exhibit.addEventListener('keydown', event => {
    if (event.key === 'Escape' && active) clearInfo(true);
  });
  exhibit.querySelector('.museum-controls').hidden = false;
  render('explore');
})();
