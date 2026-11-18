const test = require('node:test');
const assert = require('node:assert/strict');
const core = import('../assets/works-core.mjs');

const release = {
  id: 'test-release', title: 'Timing fixture', platforms: ['PS5', 'PC'],
  date: '2026-11-20', timeZone: 'Asia/Riyadh', region: 'السعودية',
  source: 'https://example.org/official'
};
test('date-only releases use calendar days in the release region without guessing an hour', async () => {
  const { releaseState } = await core;
  assert.deepEqual(releaseState(release, new Date('2026-11-19T20:59:59Z')),
    { phase: 'upcoming', days: 1, precision: 'day' });
  assert.equal(releaseState(release, new Date('2026-11-19T21:00:00Z')).phase, 'today');
  assert.equal(releaseState(release, new Date('2026-11-20T21:00:00Z')).phase, 'released');
});
test('exact launches count real seconds and transition only when the launch is reached', async () => {
  const { releaseState } = await core;
  const exact = { ...release, instant: '2026-11-20T18:00:00+03:00' };
  const before = releaseState(exact, new Date('2026-11-20T14:59:59Z'));
  assert.equal(before.phase, 'upcoming');
  assert.equal(before.seconds, 1);
  assert.equal(before.days, 0);
  assert.equal(releaseState(exact, new Date('2026-11-20T15:00:00Z')).phase, 'today');
  assert.equal(releaseState(exact, new Date('2026-11-20T21:00:00Z')).phase, 'released');
});
test('zone handling follows DST and western regions without converting a date-only release to UTC', async () => {
  const { releaseState, dateInZone } = await core;
  assert.equal(dateInZone(new Date('2026-11-01T05:30:00Z'), 'America/New_York'), '2026-11-01');
  const west = { ...release, date: '2026-11-20', timeZone: 'America/Los_Angeles' };
  assert.equal(releaseState(west, new Date('2026-11-20T02:00:00Z')).days, 1);
  assert.equal(releaseState(west, new Date('2026-11-20T08:00:00Z')).phase, 'today');
});
test('calendar month boundaries and leap years remain stable', async () => {
  const { monthDays, shiftMonth, validDate } = await core;
  assert.equal(monthDays('2028-02').count, 29);
  assert.equal(monthDays('2027-02').count, 28);
  assert.equal(shiftMonth('2026-12', 1), '2027-01');
  assert.equal(shiftMonth('2026-01', -1), '2025-12');
  assert.equal(validDate('2026-02-30'), false);
  assert.equal(validDate('2028-02-29'), true);
});
test('data rejects ambiguous times, mismatched dates, duplicate IDs and unsafe file links', async () => {
  const { validateData, safeUrl } = await core;
  const data = item => ({ translations: [], releases: [item] });
  assert.doesNotThrow(() => validateData(data(release)));
  assert.throws(() => validateData(data({ ...release, instant: '2026-11-20T15:00:00' })));
  assert.throws(() => validateData(data({ ...release, instant: '2026-11-21T15:00:00Z' })));
  assert.throws(() => validateData({ translations: [], releases: [release, release] }));
  assert.throws(() => validateData(data({ ...release, date: '2026-02-30' })));
  assert.throws(() => validateData(data({ ...release, timeZone: 'Bad/Zone' })));
  assert.equal(safeUrl('javascript:alert(1)'), '');
  const project = { id: 'p', title: 'Owner fixture', platform: 'PS2', status: 'حالة يختارها المالك',
    description: 'وصف', downloads: [{ label: 'ملف', url: 'javascript:alert(1)' }] };
  assert.throws(() => validateData({ translations: [project], releases: [] }));
  assert.doesNotThrow(() => validateData({ translations: [], releases: [] }));
});
