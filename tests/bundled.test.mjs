import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { validateTheme, themeVariables } from '../theme.js';

const read = name => JSON.parse(readFileSync(new URL(`../themes/${name}`, import.meta.url), 'utf8'));
const lum = hex => { const [r, g, b] = [1, 3, 5].map(i => { const c = parseInt(hex.slice(i, i + 2), 16) / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

test('bundled themes exist, validate, round-trip and stay readable', () => {
    const { themes } = read('index.json');
    assert.deepEqual(themes, ['sky-blue.json', 'mint-green.json', 'chic-modern.json']);
    for (const file of themes) {
        assert(existsSync(new URL(`../themes/${file}`, import.meta.url)), file);
        const t = validateTheme(read(file));
        assert.notEqual(t.id, 'modern-cutie');
        assert.deepEqual(validateTheme(JSON.parse(JSON.stringify(t))), t);
        const c = t.colors;
        assert(ratio(c.text, c.canvas) >= 7, `${t.id} text`);
        assert(ratio(c.text, c.button) >= 7, `${t.id} button text`);
        assert(ratio(c.muted, c.canvas) >= 4.5, `${t.id} muted`);
        assert(ratio(c.accent, c.canvas) >= 4.5, `${t.id} accent`);
        assert.equal(t.qrStyles.length, 0, `${t.id} must not target a particular QR set`);
    }
    assert.equal(themeVariables(validateTheme(read('chic-modern.json')))['--cqs-scheme'], 'dark');
    assert.equal(themeVariables(validateTheme(read('sky-blue.json')))['--cqs-scheme'], 'light');
});

test('legacy cute-qr-theme files are still accepted', () => {
    const old = read('modern-cutie.json');
    assert.equal(validateTheme({ ...old, format: 'cute-qr-theme' }).format, 'custom-studio-theme');
});
