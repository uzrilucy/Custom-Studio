import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_THEME,validateTheme,resolveHandleIcon} from '../theme.js';
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII=';
test('old themes retain symbol + QR handle independently of QR icons',()=>{
 const input=structuredClone(DEFAULT_THEME);delete input.handle;
 input.decoration.symbol='✿';input.icons.default={type:'text',value:'♡'};
 const t=validateTheme(input);
 assert.equal(t.handle.label,'QR');assert.equal(t.handle.showLabel,true);
 assert.deepEqual(resolveHandleIcon(t),{type:'text',value:'✿'});
 t.decoration.symbol='';assert.equal(resolveHandleIcon(t).value,'✦');
});
test('image-only handle survives export with size and label preferences',()=>{
 const t=validateTheme({...DEFAULT_THEME,handle:{icon:{type:'image',value:png},label:'도구',showLabel:false,size:40}});
 const copy=validateTheme(JSON.parse(JSON.stringify(t)));
 assert.deepEqual(copy.handle,t.handle);assert.equal(resolveHandleIcon(copy).value,png);
 assert.equal(copy.icons.default.value,'♡');
});
test('prevent invisible handle and invalid sizes or label settings',()=>{
 for(const handle of [{icon:{type:'none'},showLabel:false},{icon:{type:'none'},label:'  '},{size:49},{size:15},{size:20.5},{showLabel:'false'},{label:'x'.repeat(17)},{icon:{type:'image',value:'https://invalid/x.png'}}])assert.throws(()=>validateTheme({...DEFAULT_THEME,handle}));
 const t=validateTheme({...DEFAULT_THEME,handle:{icon:{type:'none'},label:'열기'}});
 assert.equal(resolveHandleIcon(t).type,'none');assert.equal(t.handle.showLabel,true);
});
