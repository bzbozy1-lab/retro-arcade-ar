import { safeUrl, validateData, releaseState, dateInZone, monthDays, shiftMonth } from './works-core.mjs?v=release-precision-1';

const $ = selector => document.querySelector(selector);
if ($('#yearNow')) $('#yearNow').textContent = new Date().getFullYear();
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const icon = name => '<svg class="work-icon" viewBox="0 0 96 96" aria-hidden="true"><use href="assets/works-icons.svg#' + name + '"></use></svg>';
const dateLabel = date => new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
}).format(new Date(date + 'T12:00:00Z'));
const monthLabel = month => new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
  month: 'long', year: 'numeric', timeZone: 'UTC'
}).format(new Date(month + '-01T12:00:00Z'));
function link(url, label, className = '') {
  const href = safeUrl(url);
  return href ? '<a class="' + className + '" href="' + escapeHTML(href) +
    '" target="_blank" rel="noopener">' + escapeHTML(label) + ' ↗</a>' : '';
}
function cover(item) {
  const src = safeUrl(item.cover);
  return '<div class="work-cover">' + (src ? '<img src="' + escapeHTML(src) +
    '" alt="غلاف ' + escapeHTML(item.title) + '" loading="lazy" decoding="async" width="400" height="500">' :
    icon('translations') + '<span>الغلاف يُضاف لاحقًا</span>') + '</div>';
}
function watchCovers() {
  document.querySelectorAll('.work-cover img').forEach(image => {
    const fallback = () => {
      const box = image.parentElement;
      box.innerHTML = icon('translations') + '<span>تعذّر تحميل الغلاف</span>';
    };
    image.addEventListener('error', fallback, { once: true });
    if (image.complete && !image.naturalWidth) fallback();
  });
}
function empty(title, text, symbol = 'translations') {
  return '<div class="work-empty">' + icon(symbol) + '<h2>' + title + '</h2><p>' + text + '</p></div>';
}
function listSection(title, items, ordered = false) {
  if (!items?.length) return '';
  const tag = ordered ? 'ol' : 'ul';
  return '<section class="work-instructions"><h2>' + title + '</h2><' + tag + '>' +
    items.map(text => '<li>' + escapeHTML(text) + '</li>').join('') + '</' + tag + '></section>';
}
function translationCard(game) {
  const url = 'translation.html?id=' + encodeURIComponent(game.id);
  return '<article class="work-game">' + cover(game) +
    '<div class="work-game-copy"><span class="work-status">' + escapeHTML(game.status) +
    '</span><h2 lang="en" dir="ltr">' + escapeHTML(game.title) + '</h2><p class="work-meta">' +
    escapeHTML(game.platform) + '</p><p>' + escapeHTML(game.description) +
    '</p><div class="work-actions">' + (game.downloads || []).map(file => link(file.url, file.label, 'work-button work-download')).join('') +
    '</div>' + (game.launchSteps?.length ? '<details class="work-guide"><summary>طريقة التركيب والتشغيل على PCSX2</summary>' +
      listSection('خطوات التشغيل', game.launchSteps, true) + '<a href="' + url + '">تفاصيل التعريب ←</a></details>' : '') +
    '</div></article>';
}
function translations(data) {
  const grid = $('#translationGrid');
  const filters = $('#translationFilters');
  if (!data.length) {
    grid.innerHTML = empty('أول تعريب يبدأ من هنا', 'ستجد هنا تعريباتنا وملفاتها وتعليمات تشغيل كل لعبة عند إضافتها.');
    return;
  }
  const platforms = [...new Set(data.map(game => game.platform))];
  const statuses = [...new Set(data.map(game => game.status))];
  if (data.length >= 4) {
    filters.hidden = false;
    $('#translationPlatform').innerHTML = '<option value="">كل الأجهزة</option>' + platforms.map(value =>
      '<option>' + escapeHTML(value) + '</option>').join('');
    $('#translationStatus').innerHTML = '<option value="">كل الحالات</option>' + statuses.map(value =>
      '<option>' + escapeHTML(value) + '</option>').join('');
    $('#translationPlatform').parentElement.hidden = platforms.length < 2;
    $('#translationStatus').parentElement.hidden = statuses.length < 2;
  }
  const render = () => {
    const query = $('#translationSearch').value.trim().toLocaleLowerCase();
    const matching = data.filter(game => (!query ||
      (game.title + ' ' + game.description).toLocaleLowerCase().includes(query)) &&
      (!$('#translationPlatform').value || game.platform === $('#translationPlatform').value) &&
      (!$('#translationStatus').value || game.status === $('#translationStatus').value));
    $('#translationCount').textContent = matching.length + ' مشروع';
    grid.innerHTML = matching.length ? matching.map(translationCard).join('') :
      empty('لم نعثر على نتيجة', 'جرّب اسمًا آخر أو غيّر التصفية.');
    watchCovers();
  };
  filters.addEventListener('input', render);
  render();
}
function translationDetail(data) {
  const id = new URLSearchParams(location.search).get('id');
  const game = data.find(item => item.id === id);
  const body = $('#translationDetail');
  if (!game) {
    body.innerHTML = empty('اختر مشروع التعريب', 'تظهر هنا تفاصيل اللعبة وطريقة تطبيق ملفاتها عندما يُضاف المشروع.') +
      '<a class="work-button" href="translations.html">العودة إلى تعريباتنا ←</a>';
    return;
  }
  document.title = game.title + ' | تعريباتنا — شوق آور';
  const facts = [['الجهاز', game.platform], ['الحالة', game.status], ['المحاكي', game.emulator],
    ['النسخة', game.version], ['إصدار التعريب', game.releaseDate ? dateLabel(game.releaseDate) : ''],
    ['الإنجاز', game.progress !== undefined ? game.progress + '٪' : '']];
  body.innerHTML = '<div class="work-detail-intro">' + cover(game) + '<div><span class="work-eyebrow">تعريباتنا</span>' +
    '<h1 lang="en" dir="ltr">' + escapeHTML(game.title) + '</h1><p>' + escapeHTML(game.overview || game.description) +
    '</p><dl class="work-facts">' + facts.filter(([, value]) => value).map(([label, value]) =>
      '<div><dt>' + label + '</dt><dd>' + escapeHTML(value) + '</dd></div>').join('') +
    '</dl><div class="work-actions">' + (game.downloads || []).map(file =>
      link(file.url, file.label, 'work-button')).join('') + '</div></div></div>' +
    listSection('ما يتضمنه التعريب', game.includes) + listSection('متطلبات التشغيل', game.requirements) +
    listSection('تطبيق ملفات التعريب', game.patchSteps, true) + listSection('التشغيل على المحاكي', game.launchSteps, true) +
    (!(game.patchSteps?.length || game.launchSteps?.length) ?
      '<p class="work-notice">تعليمات تشغيل هذا التعريب ستُضاف مع معلومات المشروع.</p>' : '') +
    (game.troubleshooting?.length ? '<section class="work-instructions"><h2>المشكلات الشائعة</h2>' +
      game.troubleshooting.map(row => '<details><summary>' + escapeHTML(row.label) +
      '</summary><p>' + escapeHTML(row.text) + '</p></details>').join('') + '</section>' : '') +
    (game.extra?.length ? '<section class="work-instructions"><h2>معلومات إضافية</h2>' +
      game.extra.map(row => '<h3>' + escapeHTML(row.label) + '</h3><p>' + escapeHTML(row.text) + '</p>').join('') + '</section>' : '') +
    (game.sources?.length ? '<section class="work-instructions"><h2>المصادر</h2><ul>' +
      game.sources.map(source => '<li>' + link(source.url, source.label) + '</li>').join('') + '</ul></section>' : '');
  watchCovers();
}
function countdownMarkup(release, now) {
  const state = releaseState(release, now);
  if (state.phase === 'today') return '<strong>صدر اليوم</strong>';
  if (state.phase === 'released') return '<strong>صدرت</strong>';
  if (state.precision === 'day') return '<strong>' + state.days + '</strong><span>يوم متبقٍ</span>';
  return [['days', 'يوم'], ['hours', 'ساعة'], ['minutes', 'دقيقة'], ['seconds', 'ثانية']].map(([key, label]) =>
    '<span><b>' + String(state[key]).padStart(2, '0') + '</b><small>' + label + '</small></span>').join('');
}
function releaseCard(release, now) {
  const opening = '<article class="work-release">' + cover(release) + '<div class="work-game-copy">' +
    '<p class="work-meta">' + escapeHTML(release.platforms.join(' · ')) + '</p><h3 lang="en" dir="ltr">' +
    escapeHTML(release.title) + '</h3>';
  const closing = (release.note ? '<p>' + escapeHTML(release.note) + '</p>' : '') +
    link(release.source, 'المصدر', 'work-file') + '</div></article>';
  if (!release.date) {
    return opening + '<p>' + (release.year ? '<time datetime="' + release.year + '">' +
      release.year + '</time>' : 'يُعلن ويُحدّد لاحقًا') + '</p>' + closing;
  }
  const time = release.instant ? new Intl.DateTimeFormat('ar-SA', {
    timeZone: release.timeZone, hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
  }).format(new Date(release.instant)) : 'وقت الإطلاق لم يُعلن';
  return opening + '<p><time datetime="' + escapeHTML(release.instant || release.date) + '">' +
    dateLabel(release.date) + '</time></p><p class="work-meta">' + escapeHTML(release.region) + ' · ' +
    escapeHTML(time) + '</p><p class="work-zone">' + escapeHTML(release.timeZone) + '</p>' +
    '<div class="work-countdown" data-countdown="' + escapeHTML(release.id) +
    '" role="timer" aria-label="الوقت المتبقي للإصدار">' + countdownMarkup(release, now) + '</div>' + closing;
}
function releases(data) {
  const baseZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const today = dateInZone(new Date(), baseZone);
  const dated = data.filter(item => item.date);
  const listView = $('#releaseListView');
  const calendarView = $('#releaseCalendarView');
  let showCalendar = !listView;
  const nextDate = dated.map(item => item.date).filter(date => date >= today).sort()[0];
  let month = nextDate?.slice(0, 7) || today.slice(0, 7);
  let day = '';
  let platform = '';
  const select = $('#releasePlatform');
  const monthInput = $('#releaseMonth');
  const calendar = $('#releaseCalendar');
  const heading = $('#calendarMonth');
  const cards = $('#releaseGrid');
  if (!$('#releasePending')) {
    cards.closest('section').insertAdjacentHTML('afterend',
      '<section id="releasePending" aria-labelledby="releasePendingTitle" hidden>' +
      '<h2 id="releasePendingTitle">إصدارات بلا يوم محدّد</h2>' +
      '<div id="releasePendingGrid" class="work-release-list"></div></section>');
  }
  const platforms = [...new Set(data.flatMap(release => release.platforms))].sort();
  select.innerHTML = '<option value="">كل المنصات</option>' + platforms.map(value =>
    '<option>' + escapeHTML(value) + '</option>').join('');
  select.parentElement.hidden = platforms.length < 2;
  const matchesPlatform = item => !platform || item.platforms.includes(platform);
  const pending = data.filter(item => !item.date).sort((a, b) =>
    (a.year ?? Infinity) - (b.year ?? Infinity) || a.title.localeCompare(b.title));
  function render() {
    const now = new Date();
    const rows = dated.filter(item => item.date.startsWith(month) && matchesPlatform(item));
    const visible = rows.filter(item => !day || item.date === day)
      .sort((a, b) => a.date.localeCompare(b.date) || (a.instant || '').localeCompare(b.instant || ''));
    monthInput.value = month;
    heading.textContent = monthLabel(month);
    const { offset, count } = monthDays(month);
    const weekdays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    let html = '<thead><tr>' + weekdays.map(label =>
      '<th scope="col"><abbr title="' + label + '">' + label.slice(0, 3) + '</abbr></th>').join('') + '</tr></thead><tbody>';
    const today = dateInZone(now, baseZone);
    for (let cell = 0; cell < Math.ceil((offset + count) / 7) * 7; cell++) {
      if (cell % 7 === 0) html += '<tr>';
      const number = cell - offset + 1;
      if (number < 1 || number > count) html += '<td></td>';
      else {
        const date = month + '-' + String(number).padStart(2, '0');
        const events = rows.filter(item => item.date === date);
        const selected = date === day;
        html += '<td' + (date === today ? ' class="work-today"' : '') + '>' +
          (events.length ? '<button type="button" data-date="' + date + '" aria-pressed="' + selected +
            '" aria-label="' + escapeHTML(dateLabel(date) + '، ' + events.map(item => item.title).join('، ')) +
            '"><span>' + number + '</span><span class="work-date-dot" aria-hidden="true"></span>' +
            '<small>' + events.length + ' إصدار</small></button>' :
            '<span class="work-day"' + (date === today ? ' aria-current="date"' : '') + '>' + number + '</span>') + '</td>';
      }
      if (cell % 7 === 6) html += '</tr>';
    }
    calendar.innerHTML = html + '</tbody>';
    $('#selectedDay').hidden = !day;
    $('#selectedDate').textContent = day ? dateLabel(day) : '';
    $('#releaseCount').textContent = rows.length + ' إصدار في ' + monthLabel(month);
    const spotlight = $('#releaseSpotlight');
    const featured = dated.filter(item => item.date >= today && matchesPlatform(item))
      .sort((a, b) => a.date.localeCompare(b.date))[0];
    if (spotlight) spotlight.innerHTML = featured ? '<section class="work-spotlight" aria-label="أقرب إصدار"><h2>أقرب إصدار</h2>' +
      releaseCard(featured, now) + '</section>' : '';
    const upcoming = dated.filter(item => item.date >= today && matchesPlatform(item))
      .sort((a, b) => a.date.localeCompare(b.date));
    const monthKeys = [...new Set(upcoming.map(item => item.date.slice(0, 7)))];
    const listMarkup = monthKeys.map(key => '<section class="work-release-month"><h2 class="work-month-bar">' +
      monthLabel(key) + '</h2><div class="work-release-list">' +
      upcoming.filter(item => item.date.startsWith(key)).map(item => releaseCard(item, now)).join('') +
      '</div></section>').join('');
    $('#releaseCount').hidden = !showCalendar;
    cards.classList.toggle('work-chronology', !showCalendar);
    cards.innerHTML = !showCalendar ? (listMarkup || empty('لا توجد إصدارات مؤرخة', 'جرّب اختيار منصة أخرى.', 'releases')) : visible.length ? visible.map(release => releaseCard(release, now)).join('') :
      empty(day ? 'لا توجد إصدارات لهذا اليوم' : 'التقويم ينتظر مواعيده',
        day ? 'اختر يومًا آخر أو اعرض الشهر كاملًا.' :
          'ستظهر الألعاب هنا مع مواعيدها ومصادرها عند إضافتها إلى هذا الشهر.', 'releases');
    const pendingRows = pending.filter(matchesPlatform);
    $('#releasePending').hidden = !pendingRows.length;
    const groups = [...new Set(pendingRows.map(item => item.year || 0))];
    $('#releasePendingGrid').innerHTML = groups.map(year => '<section class="work-release-month"><h3 class="work-month-bar">' +
      (year ? 'خلال ' + year : 'يُعلن ويُحدّد لاحقًا') + '</h3><div class="work-release-list">' +
      pendingRows.filter(item => (item.year || 0) === year).map(item => releaseCard(item, now)).join('') +
      '</div></section>').join('');
    watchCovers();
  }
  function setView(calendarMode) {
    showCalendar = calendarMode;
    day = '';
    calendar.closest('section').hidden = !calendarMode;
    monthInput.closest('label').hidden = !calendarMode;
    listView.setAttribute('aria-pressed', String(!calendarMode));
    calendarView.setAttribute('aria-pressed', String(calendarMode));
    render();
  }
  listView?.addEventListener('click', () => setView(false));
  calendarView?.addEventListener('click', () => setView(true));
  if (listView) monthInput.closest('label').hidden = true;
  $('#previousMonth').addEventListener('click', () => changeMonth(shiftMonth(month, -1)));
  $('#nextMonth').addEventListener('click', () => changeMonth(shiftMonth(month, 1)));
  $('#currentMonth').addEventListener('click', () => changeMonth(dateInZone(new Date(), baseZone).slice(0, 7)));
  function changeMonth(value) {
    if (!/^\d{4}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value + '-01T00:00:00Z')) ||
      Number(value.slice(0, 4)) < 1900 || Number(value.slice(0, 4)) > 2200) return;
    month = value;
    day = '';
    render();
  }
  monthInput.addEventListener('change', () => changeMonth(monthInput.value));
  select.addEventListener('change', () => { platform = select.value; day = ''; render(); });
  calendar.addEventListener('click', event => {
    const button = event.target.closest('[data-date]');
    if (!button) return;
    day = day === button.dataset.date ? '' : button.dataset.date;
    render();
    if (day) calendar.querySelector('[data-date="' + day + '"]')?.focus({ preventScroll: true });
  });
  $('#clearDay').addEventListener('click', () => { day = ''; render(); });
  const lookup = new Map(dated.map(release => [release.id, release]));
  function tick() {
    if (document.hidden) return;
    const now = new Date();
    document.querySelectorAll('[data-countdown]').forEach(node => {
      const markup = countdownMarkup(lookup.get(node.dataset.countdown), now);
      if (node.innerHTML !== markup) node.innerHTML = markup;
    });
  }
  render();
  let timer;
  function schedule() {
    clearInterval(timer);
    if (!document.hidden && dated.length) { tick(); timer = setInterval(tick, 1000); }
  }
  document.addEventListener('visibilitychange', schedule);
  schedule();
  window.addEventListener('pagehide', () => clearInterval(timer));
  window.addEventListener('pageshow', schedule);
}
async function start() {
  const page = document.body.dataset.works;
  if (!page) return;
  const status = $('#workLoadStatus');
  try {
    const response = await fetch('assets/works-data.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('تعذّر تحميل البيانات.');
    const data = validateData(await response.json());
    if (page === 'hub') {
      const today = dateInZone(new Date(), 'Asia/Riyadh');
      const upcoming = data.releases.filter(item => item.date && item.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))[0];
      if (upcoming) $('#workUpcomingPreview').innerHTML = '<bdi lang="en">' +
        escapeHTML(upcoming.title) + '</bdi><br><time datetime="' + upcoming.date + '">' + dateLabel(upcoming.date) + '</time>';
      return;
    }
    if (page === 'translations') translations(data.translations);
    if (page === 'translation') translationDetail(data.translations);
    if (page === 'releases') releases(data.releases);
    status.hidden = true;
  } catch (error) {
    if (!status) return;
    status.hidden = false;
    status.textContent = 'تعذّر عرض المحتوى الآن. أعد تحميل الصفحة للمحاولة مجددًا.';
    console.error('Works data:', error);
    const content = $('#translationGrid') || $('#translationDetail') || $('#releaseGrid');
    if (content) content.innerHTML = '';
  }
}
start();
