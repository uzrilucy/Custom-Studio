import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DEFAULT_THEME, qrTarget, sameQrTarget, validateTheme } from '../theme.js';

test('0.2 theme stays valid with source and individual QR defaults', () => {
    const old = JSON.parse(readFileSync(new URL('../themes/modern-cutie.json', import.meta.url)));
    const current = validateTheme(old);
    assert.deepEqual(current.source, DEFAULT_THEME.source);
    assert.deepEqual(current.qrStyles, []);
});

test('source and individual button options survive export and re-import', () => {
    const example = { ...JSON.parse(readFileSync(new URL('../themes/chic-modern.json', import.meta.url))),
        qrStyles: [{ set: '이야기 도구', id: 0, background: '#302846', shape: 'pill', html: '<span class="my-qr"><span data-cqs-slot="icon"></span> <span data-cqs-slot="label"></span></span>', css: ':scope.cqs-qr { border-color: #c5a772; }' }] };
    const theme = validateTheme(example);
    assert.match(theme.source.panelHtml, /data-cqs-slot="qr"/);
    assert.match(theme.source.menuCss, /top-bar/);
    assert.equal(theme.qrStyles[0].shape, 'pill');
    assert.deepEqual(validateTheme(JSON.parse(JSON.stringify(theme))), theme);
    assert(sameQrTarget(theme.qrStyles[0], qrTarget('이야기 도구', { id: 0, label: '새 이름' })));
    assert(!sameQrTarget(theme.qrStyles[0], qrTarget('다른 세트', { id: 0, label: '새 이름' })));
    assert.deepEqual(qrTarget('이야기 도구', { label: 'ID 없는 버튼' }), { set: '이야기 도구', label: 'ID 없는 버튼' });
});

test('invalid QR targets, duplicates and unsupported fields are rejected', () => {
    const rule = { set: 'Set', id: 3, background: '#445566', shape: 'round' };
    for (const invalid of [
        [rule, rule],
        [{ ...rule, id: -1 }],
        [{ ...rule, label: 'conflicting target' }],
        [{ ...rule, shape: 'unknown' }],
        [{ ...rule, background: 'url(example)' }],
        [{ ...rule, background: false }],
        [{ ...rule, css: 'a'.repeat(12001) }]
    ]) {
        assert.throws(() => validateTheme({ ...DEFAULT_THEME, qrStyles: invalid }));
    }
    assert.throws(() => validateTheme({ ...DEFAULT_THEME, source: { script: 'alert(1)' } }));
});
