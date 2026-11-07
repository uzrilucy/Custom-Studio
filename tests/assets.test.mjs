import test from 'node:test';
import assert from 'node:assert/strict';
import {validateTheme,DEFAULT_THEME,resolveIcon,validateImage,MAX_ICON_BYTES,themeVariables} from '../theme.js';
const png='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII=';
const text=value=>({type:'text',value});

test('icon precedence: QR id > set label > global label > set > default',()=>{
 const t=validateTheme({...DEFAULT_THEME,icons:{default:text('default'),rules:[
  {set:'A',icon:text('set')},
  {set:null,label:'Same',icon:text('global label')},
  {set:'A',label:'Same',icon:text('set label')},
  {set:'A',id:0,icon:text('id')}
 ]}});
 assert.equal(resolveIcon(t,'A',{id:0,label:'Same'}).value,'id');
 assert.equal(resolveIcon(t,'A',{id:1,label:'Same'}).value,'set label');
 assert.equal(resolveIcon(t,'B',{id:0,label:'Same'}).value,'global label');
 assert.equal(resolveIcon(t,'A',{id:2,label:'Other'}).value,'set');
 assert.equal(resolveIcon(t,'B',{id:2,label:'Other'}).value,'default');
 assert.equal(resolveIcon(t,'A',{id:0,label:'Renamed'}).value,'id');
});
test('native, hidden and image icons roundtrip without editing original QR',()=>{
 const qr={id:0,label:'hello',icon:'fa-heart'};
 const t=validateTheme({...DEFAULT_THEME,icons:{default:{type:'native'}}});
 assert.deepEqual(resolveIcon(t,'X',qr),{type:'fa',value:'fa-heart'});
 assert.equal(qr.icon,'fa-heart');
 t.icons.default={type:'none'};assert.equal(resolveIcon(t,'X',qr).type,'none');
 t.icons.default={type:'image',value:png};
 assert.equal(validateTheme(JSON.parse(JSON.stringify(t))).icons.default.value,png);
});
test('wallpaper export keeps image and layout; CSS remains scoped data',()=>{
 const t=validateTheme({...DEFAULT_THEME,wallpaper:{image:png,size:'contain',position:'top',repeat:'repeat',overlay:0.3,messageOpacity:0.7}});
 assert.equal(validateTheme(JSON.parse(JSON.stringify(t))).wallpaper.image,png);
 const vars=themeVariables(t);
 assert.equal(vars['--cqs-wallpaper'],`url("${png}")`);
 assert.equal(vars['--cqs-wallpaper-size'],'contain');
 assert.equal(vars['--cqs-message-surface'],'rgba(255,255,255,0.7)');
 t.wallpaper.image='';assert.equal(themeVariables(t)['--cqs-message-surface'],'rgba(255,255,255,1)');
});
test('reject unsafe, mismatched, oversized images and invalid rules',()=>{
 assert.equal(validateImage(png,MAX_ICON_BYTES),png);
 for(const v of ['https://example.test/a.png','data:image/svg+xml;base64,PHN2Zz4=','data:image/png;base64,SGVsbG8=',png.replace('png','jpeg')])assert.throws(()=>validateImage(v,MAX_ICON_BYTES));
 assert.throws(()=>validateImage(png,10));
 for(const wallpaper of [{overlay:1.1},{messageOpacity:-0.1},{size:'cover;display:none'},{position:'url(x)'}])assert.throws(()=>validateTheme({...DEFAULT_THEME,wallpaper}));
 const icon=text('x');
 for(const rules of [[{set:null,id:0,icon}],[{set:'A',id:0,label:'x',icon}],[{set:'A',id:0,icon},{set:'A',id:0,icon}],[{set:null,icon}]])assert.throws(()=>validateTheme({...DEFAULT_THEME,icons:{rules}}));
});
