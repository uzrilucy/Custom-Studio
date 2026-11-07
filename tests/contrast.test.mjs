import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DEFAULT_THEME, validateTheme, themeVariables, displayLabel, readableOn, isDarkColor, resolveIcon} from '../theme.js';

const chic = JSON.parse(fs.readFileSync(new URL('../themes/chic-modern.json', import.meta.url), 'utf8'));
const dark = { ...chic, icons: { default: { type: 'text', value: '◆' }, rules: [
  { set: null, label: '⚔ 오늘의 퀘스트', icon: { type: 'fa', value: 'fa-solid fa-scroll' } },
  { set: null, label: '📡 소식', icon: { type: 'fa', value: 'fa-solid fa-satellite-dish' } } ] } };

test('bundled dark example theme validates and round-trips', () => {
 const t = validateTheme(dark);
 assert.deepEqual(validateTheme(JSON.parse(JSON.stringify(t))), t);
 assert.equal(t.icons.rules.length, 2);
});
test('derived tokens: dark canvas gets dark scheme and dark ink on a light accent', () => {
 const v = themeVariables(validateTheme(dark));
 assert.equal(v['--cqs-scheme'], 'dark');
 assert.equal(v['--cqs-onAccent'], '#141021');
 assert.equal(v['--cqs-shadow'], 'rgba(0,0,0,0.45)');
 const d = themeVariables(DEFAULT_THEME);
 assert.equal(d['--cqs-scheme'], 'light');
 assert.equal(d['--cqs-onAccent'], '#ffffff');
});
test('readableOn / isDarkColor', () => {
 assert.equal(readableOn('#ffffff'), '#141021');
 assert.equal(readableOn('#1b2344'), '#ffffff');
 assert.equal(isDarkColor('#0b1020'), true);
 assert.equal(isDarkColor('#fff5f9'), false);
});
test('displayLabel strips only leading emoji/symbols and never empties a label', () => {
 assert.equal(displayLabel('⚔ 오늘의 퀘스트', true), '오늘의 퀘스트');
 assert.equal(displayLabel('📡 소식', true), '소식');
 assert.equal(displayLabel('✦ 별자리 보기', true), '별자리 보기');
 assert.equal(displayLabel('「공지」 보기', true), '「공지」 보기');
 assert.equal(displayLabel('상태창 보기', true), '상태창 보기');
 assert.equal(displayLabel('✦', true), '✦');
 assert.equal(displayLabel('⚔ 오늘의 퀘스트', false), '⚔ 오늘의 퀘스트');
});
test('label rules still match the original (unstripped) QR label', () => {
 const t = validateTheme(dark);
 assert.deepEqual(resolveIcon(t, '아무 세트', {id: 1, label: '⚔ 오늘의 퀘스트'}), {type: 'fa', value: 'fa-solid fa-scroll'});
 assert.deepEqual(resolveIcon(t, '아무 세트', {id: 9, label: '다른 버튼'}), {type: 'text', value: '◆'});
});
