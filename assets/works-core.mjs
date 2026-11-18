const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const instantPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;
export function safeUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value, 'https://bzbozy1-lab.github.io/retro-arcade-ar/');
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}
export function validDate(value) {
  return typeof value === 'string' && datePattern.test(value) &&
    !Number.isNaN(Date.parse(value + 'T00:00:00Z')) &&
    new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
}
export function dateInZone(now, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone, calendar: 'gregory', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now);
  const get = type => parts.find(part => part.type === type).value;
  return get('year') + '-' + get('month') + '-' + get('day');
}
export function releaseState(release, now = new Date()) {
  const today = dateInZone(now, release.timeZone);
  const dayDelta = Math.round((Date.parse(release.date + 'T00:00:00Z') -
    Date.parse(today + 'T00:00:00Z')) / 86400000);
  if (!release.instant) {
    return { phase: dayDelta > 0 ? 'upcoming' : dayDelta === 0 ? 'today' : 'released',
      days: Math.max(0, dayDelta), precision: 'day' };
  }
  const remaining = Math.max(0, Math.ceil((Date.parse(release.instant) - now.getTime()) / 1000));
  return {
    phase: remaining > 0 ? 'upcoming' : today === release.date ? 'today' : 'released',
    precision: 'second', days: Math.floor(remaining / 86400),
    hours: Math.floor(remaining / 3600) % 24, minutes: Math.floor(remaining / 60) % 60,
    seconds: remaining % 60
  };
}
export function monthDays(month) {
  const [year, number] = month.split('-').map(Number);
  const first = new Date(Date.UTC(year, number - 1, 1));
  return { offset: first.getUTCDay(), count: new Date(Date.UTC(year, number, 0)).getUTCDate() };
}
export function shiftMonth(month, delta) {
  const [year, number] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year, number - 1 + delta, 1));
  return date.toISOString().slice(0, 7);
}
export function validateData(data) {
  if (!data || !Array.isArray(data.translations) || !Array.isArray(data.releases)) {
    throw new Error('يجب أن يحتوي ملف البيانات على قائمتي التعريبات والإصدارات.');
  }
  const requireText = (value, name) => {
    if (typeof value !== 'string' || !value.trim()) throw new Error('حقل مطلوب أو غير صحيح — ' + name);
  };
  const ids = new Set();
  const checkBase = (item, kind) => {
    if (!item || typeof item !== 'object') throw new Error('بيانات بطاقة غير صالحة.');
    requireText(item.id, 'id');
    if (!/^[a-z0-9][a-z0-9-]*$/.test(item.id) || ids.has(kind + item.id)) {
      throw new Error('معرّف البطاقة غير صالح أو مكرر — ' + item.id);
    }
    ids.add(kind + item.id);
    requireText(item.title, 'title');
    if (item.cover && !safeUrl(item.cover)) throw new Error('رابط الغلاف غير صالح.');
    if (item.source && !safeUrl(item.source)) throw new Error('رابط المصدر غير صالح.');
  };
  const textList = (value, name) => {
    if (value !== undefined && (!Array.isArray(value) || value.some(x => typeof x !== 'string'))) {
      throw new Error('قائمة نصية غير صالحة — ' + name);
    }
  };
  data.translations.forEach(item => {
    checkBase(item, 'translation');
    ['platform', 'status', 'description'].forEach(key => requireText(item[key], key));
    ['includes', 'requirements', 'patchSteps', 'launchSteps'].forEach(key => textList(item[key], key));
    ['overview', 'emulator', 'version'].forEach(key => {
      if (item[key] !== undefined && typeof item[key] !== 'string') throw new Error('حقل نصي غير صالح — ' + key);
    });
    if (item.releaseDate && !validDate(item.releaseDate)) throw new Error('تاريخ التعريب غير صالح.');
    if (item.progress !== undefined && (!Number.isFinite(item.progress) || item.progress < 0 || item.progress > 100)) {
      throw new Error('نسبة الإنجاز غير صالحة.');
    }
    for (const key of ['downloads', 'sources']) {
      if (item[key] !== undefined && (!Array.isArray(item[key]) || item[key].some(link =>
        !link || typeof link.label !== 'string' || !link.label.trim() || !safeUrl(link.url)))) {
        throw new Error('قائمة روابط غير صالحة — ' + key);
      }
    }
    for (const key of ['troubleshooting', 'extra']) {
      if (item[key] !== undefined && (!Array.isArray(item[key]) || item[key].some(row =>
        !row || typeof row.label !== 'string' || typeof row.text !== 'string'))) {
        throw new Error('معلومات إضافية غير صالحة — ' + key);
      }
    }
  });
  data.releases.forEach(item => {
    checkBase(item, 'release');
    if (!Array.isArray(item.platforms) || !item.platforms.length ||
      item.platforms.some(p => typeof p !== 'string' || !p.trim())) throw new Error('منصات الإصدار مطلوبة.');
    if (!validDate(item.date)) throw new Error('تاريخ الإصدار غير صالح.');
    requireText(item.timeZone, 'timeZone');
    requireText(item.region, 'region');
    requireText(item.source, 'source');
    new Intl.DateTimeFormat('ar', { timeZone: item.timeZone }).format();
    if (item.instant && (!instantPattern.test(item.instant) || !Number.isFinite(Date.parse(item.instant)) ||
      dateInZone(new Date(item.instant), item.timeZone) !== item.date)) {
      throw new Error('وقت الإصدار لا يطابق تاريخه في المنطقة الزمنية المحددة.');
    }
    if (item.note !== undefined && typeof item.note !== 'string') throw new Error('ملاحظة الإصدار غير صالحة.');
  });
  return data;
}
