import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_THEME, validateTheme, characterKey, themeVariables} from '../theme.js';

test('default theme roundtrip and safe fallback',()=>{
 assert.deepEqual(validateTheme(JSON.parse(JSON.stringify(DEFAULT_THEME))),DEFAULT_THEME);
 const minimal=validateTheme({format:'cute-qr-theme',version:1,id:'new-theme',name:'새 테마'});
 assert.deepEqual(minimal.colors,DEFAULT_THEME.colors);
 assert.equal(themeVariables(minimal)['--cqs-panelWidth'],'326px');
 assert.equal(themeVariables(minimal)['--cqs-columns'],'2');
});
test('reject invalid or executable styling values',()=>{
 for(const patch of [{id:'../oops'},{id:'__proto__'},{colors:{canvas:'url(https://invalid)'}},{colors:{text:'#000'}},{layout:{columns:4}},{layout:{columns:1.5}},{decoration:{background:'oops'}},{css:'body{display:none}'},{version:2}]) {
  assert.throws(()=>validateTheme({...DEFAULT_THEME,...patch}));
 }
});
test('character identity follows character, not chat or list index',()=>{
 const a={characterId:0,characters:[{avatar:'yuri.png'}],chatId:'one'};
 assert.equal(characterKey(a),characterKey({...a,chatId:'two'}));
 assert.equal(characterKey(a),characterKey({characterId:1,characters:[{avatar:'luna.png'},{avatar:'yuri.png'}]}));
 assert.notEqual(characterKey(a),characterKey({...a,characters:[{avatar:'luna.png'}]}));
 assert.equal(characterKey({...a,groupId:'group'}),null);
 assert.equal(characterKey({characters:[]}),null);
});

test('legacy v1 themes preserve their native QR icons',()=>{
 const t=structuredClone(DEFAULT_THEME);delete t.icons;delete t.wallpaper;
 const upgraded=validateTheme(t);
 assert.deepEqual(upgraded.icons.default,{type:'native'});
 assert.equal(upgraded.wallpaper.image,'');
});
