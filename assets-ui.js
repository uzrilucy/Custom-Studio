import { MAX_ICON_BYTES, MAX_WALLPAPER_BYTES, validateImage, qrTarget, sameQrTarget } from './theme.js';
const make = (tag,text) => {const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
const btn = (text,fn) => {const b=make('button',text);b.type='button';b.className='cqs-button';b.addEventListener('click',fn);return b;};
const field = (name,input) => {const l=make('label');l.className='cqs-field';l.append(make('span',name),input);return l;};
const select = (items) => {const s=make('select');for(const [v,text] of items){const o=make('option',text);o.value=v;s.append(o);}return s;};
export async function readImageFile(file,maxBytes) {
    if(!file || file.size>maxBytes) throw new Error(`이미지는 ${Math.round(maxBytes/1024)} KB 이하로 선택하세요.`);
    const bytes=new Uint8Array(await file.arrayBuffer());
    const head=String.fromCharCode(...bytes.slice(0,16));
    const mime=head.startsWith('\x89PNG\r\n\x1a\n')?'image/png':head.startsWith('\xff\xd8\xff')?'image/jpeg':/^GIF8[79]a/.test(head)?'image/gif':head.startsWith('RIFF')&&head.slice(8,12)==='WEBP'?'image/webp':null;
    if(!mime) throw new Error('PNG, JPG, GIF, WebP 이미지 파일을 선택하세요.');
    const value=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(new Error('이미지를 읽지 못했습니다.'));r.readAsDataURL(new Blob([bytes],{type:mime}));});
    validateImage(value,maxBytes);
    const image=new Image();image.src=value;
    await image.decode().catch(()=>{throw new Error('손상되었거나 브라우저가 읽을 수 없는 이미지입니다.');});
    if(image.naturalWidth*image.naturalHeight>25000000) throw new Error('이미지는 2,500만 화소 이하로 선택하세요.');
    return value;
}
export function createAssetsEditor({read,write,raw,info,listSets,getSet}) {
    const node=make('div');node.className='cqs-assets';
    const report=error=>info(error.message);
    function edit(fn) {try{const t=read();fn(t);write(t);info('편집에 반영했어요. 테마 저장 후 캐릭터에 적용하세요.');}catch(error){report(error);}}
    function upload(text,limit,targetCallback) {
        const wrap=make('span');const input=make('input');input.type='file';input.accept='image/png,image/jpeg,image/gif,image/webp';input.hidden=true;
        let start,callback;
        const b=btn(text,()=>{try{start=raw();callback=targetCallback();input.click();}catch(error){report(error);}});
        input.addEventListener('change',async()=>{
            if(!input.files?.[0])return;b.disabled=true;
            try{const value=await readImageFile(input.files[0],limit);if(raw()!==start)throw new Error('업로드 중 테마가 바뀌었습니다. 이미지를 다시 선택해 주세요.');callback(value);}
            catch(error){report(error);}finally{input.value='';b.disabled=false;}
        });wrap.append(b,input);return wrap;
    }
    node.append(make('h3','접힌 QR 패널 손잡이'));
    const handleSource=select([['native','테마 장식 문자 사용'],['text','문자 / 이모지'],['fa','Font Awesome'],['image','업로드 이미지'],['none','아이콘 숨기기']]);
    const handleValue=make('input');handleValue.type='text';handleValue.maxLength=120;handleValue.placeholder='♡ 또는 fa-solid fa-heart';
    const handleLabel=make('input');handleLabel.type='text';handleLabel.maxLength=16;
    const handleShow=make('input');handleShow.type='checkbox';
    const handleSize=make('input');handleSize.type='number';handleSize.min='16';handleSize.max='48';handleSize.step='1';
    const handlePreview=make('div');handlePreview.className='cqs-handle-preview';handlePreview.setAttribute('aria-label','저장할 손잡이 미리보기');
    const handleFields=make('div');handleFields.className='cqs-asset-grid';
    handleFields.append(field('손잡이 아이콘 종류',handleSource),field('문자 또는 아이콘 클래스',handleValue),field('손잡이 문구',handleLabel),field('아이콘 크기 (16~48px)',handleSize),field('문구 표시',handleShow));
    function handleDraft(t,uploaded) {
        const type=uploaded?'image':handleSource.value;
        const icon=uploaded?{type,value:uploaded}:type==='image'?t.handle.icon:['native','none'].includes(type)?{type}:{type,value:handleValue.value};
        if(type==='image' && icon.type!=='image')throw new Error('손잡이 이미지 업로드 버튼으로 파일을 선택하세요.');
        return {icon,label:handleLabel.value,showLabel:handleShow.checked,size:Number(handleSize.value)};
    }
    const handleUpload=upload('손잡이 이미지 업로드',MAX_ICON_BYTES,()=>{
        const draft={label:handleLabel.value,showLabel:handleShow.checked,size:Number(handleSize.value)};
        return data=>edit(t=>{t.handle={...draft,icon:{type:'image',value:data}};});
    });
    function handleMode(){handleValue.hidden=!['text','fa'].includes(handleSource.value);handleUpload.hidden=handleSource.value!=='image';}
    handleSource.addEventListener('change',handleMode);
    const handleActions=make('div');handleActions.className='cqs-actions';
    handleActions.append(btn('손잡이 설정 반영',()=>edit(t=>{t.handle=handleDraft(t);})),handleUpload,btn('손잡이 기본값 복원',()=>edit(t=>{t.handle={icon:{type:'native'},label:'QR',showLabel:true,size:24};})));
    node.append(handleFields,handlePreview,handleActions,make('p','패널 안 QR 버튼과 별개로 지정합니다. 이미지 최대 256 KB. 반영 후 테마 저장 → 캐릭터에 적용을 눌러주세요.'));
    node.append(make('h3','채팅 배경 이미지'));
    const wpPreview=make('img');wpPreview.className='cqs-wallpaper-preview';wpPreview.alt='선택한 채팅 배경';wpPreview.hidden=true;
    const wpActions=make('div');wpActions.className='cqs-actions';
    wpActions.append(upload('배경 이미지 업로드',MAX_WALLPAPER_BYTES,()=>value=>edit(t=>{t.wallpaper.image=value;})),btn('배경 이미지 제거',()=>edit(t=>{t.wallpaper.image='';})));
    const size=select([['cover','채우기 (일부 잘림)'],['contain','맞추기 (전체 표시)'],['auto','원본 크기']]);
    const position=select([['center','가운데'],['top','위'],['bottom','아래'],['left','왼쪽'],['right','오른쪽']]);
    const repeat=select([['no-repeat','반복 안 함'],['repeat','반복']]);
    for(const [key,input]of Object.entries({size,position,repeat}))input.addEventListener('change',()=>edit(t=>{t.wallpaper[key]=input.value;}));
    const wpControls=make('div');wpControls.className='cqs-asset-grid';wpControls.append(field('배경 크기',size),field('배경 위치',position),field('반복',repeat));
    const sliders={};
    for(const [key,label]of [['overlay','배경색 덮개 농도'],['messageOpacity','메시지 카드 불투명도']]) {
        const input=make('input');input.type='range';input.min='0';input.max='100';input.step='1';
        const output=make('output');sliders[key]={input,output};
        input.addEventListener('input',()=>{output.textContent=`${input.value}%`;});
        input.addEventListener('change',()=>edit(t=>{t.wallpaper[key]=Number(input.value)/100;}));
        const f=field(label,input);f.append(output);wpControls.append(f);
    }
    node.append(wpActions,wpPreview,wpControls,make('p','배경은 이 테마를 지정한 캐릭터의 모든 대화방에 적용됩니다. PNG/JPG/GIF/WebP · 최대 2 MB.'));
    node.append(make('h3','테마별 QR 아이콘'));
    const setInput=select([['all','모든 세트 · 공통 아이콘']]);
    const qrInput=select([['all','세트 전체']]);
    const source=select([['inherit','상위 아이콘 따르기'],['native','원본 QR 아이콘'],['text','문자 / 이모지'],['fa','Font Awesome'],['image','업로드 이미지'],['none','아이콘 숨기기']]);
    const value=make('input');value.type='text';value.placeholder='♡ 또는 fa-solid fa-heart';value.maxLength=120;
    const iconPreview=make('div');iconPreview.className='cqs-icon-preview';
    const ruleList=make('div');ruleList.className='cqs-rule-list';
    let qrs=[];
    function target() {
        const set=setInput.value==='all'?null:JSON.parse(setInput.value);
        if(set===null || qrInput.value==='all')return {set};
        const qr=qrs[Number(qrInput.value)];
        if(!qr)throw new Error('QR 목록이 변경되었습니다. 다시 선택하세요.');
        return qrTarget(set, qr);
    }
    const isSame = sameQrTarget;
    function setIcon(t,where,icon){
        if(where.set===null && where.id===undefined && where.label===undefined)t.icons.default=icon||{type:'native'};
        else {t.icons.rules=t.icons.rules.filter(r=>!isSame(r,where));if(icon)t.icons.rules.push({...where,icon});}
    }
    function mode() {value.hidden=!['text','fa'].includes(source.value);imageUploader.hidden=source.value!=='image';}
    function showIcon(icon){iconPreview.replaceChildren();if(icon?.type==='image'){const img=make('img');img.src=icon.value;img.alt='QR 아이콘';iconPreview.append(img);}else iconPreview.textContent=icon?.type==='text'?icon.value:icon?.type==='fa'?icon.value:icon?.type==='none'?'숨김':icon?.type==='native'?'원본 아이콘':'상위 아이콘 사용';}
    function loadIcon(){
        try{const t=read(),where=target();const icon=where.set===null?t.icons.default:t.icons.rules.find(r=>isSame(r,where))?.icon;
        source.value=icon?.type||'inherit';value.value=['text','fa'].includes(icon?.type)?icon.value:'';showIcon(icon);mode();loadDesign(t, where);}catch(error){report(error);}
    }
    function fillQr(previous){
        qrs=[];qrInput.replaceChildren();const all=make('option','세트 전체');all.value='all';qrInput.append(all);
        if(setInput.value!=='all')try{qrs=getSet(JSON.parse(setInput.value))?.qrList||[];}catch{}
        qrs.forEach((qr,i)=>{const o=make('option',`${qr.label||qr.title||'이름 없는 QR'}${Number.isInteger(qr.id)?` · #${qr.id}`:''}`);o.value=String(i);qrInput.append(o);});
        const index = previous && qrs.findIndex(qr => isSame(previous, qrTarget(previous.set, qr)));
        if (Number.isInteger(index) && index >= 0) qrInput.value = String(index);
        qrInput.disabled=setInput.value==='all';loadIcon();
    }
    function refreshTargets(){
        let previous;
        try { previous = target(); } catch { /* First render has no selected target. */ }
        const old=setInput.value;setInput.replaceChildren();const all=make('option','모든 세트 · 공통 아이콘');all.value='all';setInput.append(all);
        try{for(const name of listSets()){const o=make('option',name);o.value=JSON.stringify(name);setInput.append(o);}}catch(error){report(error);}
        if([...setInput.options].some(o=>o.value===old))setInput.value=old;fillQr(previous?.set && setInput.value === old ? previous : null);
    }
    const imageUploader=upload('QR 아이콘 이미지 업로드',MAX_ICON_BYTES,()=>{const where=target();return data=>edit(t=>setIcon(t,where,{type:'image',value:data}));});
    source.addEventListener('change',mode);setInput.addEventListener('change',()=>fillQr());qrInput.addEventListener('change',loadIcon);
    const iconFields=make('div');iconFields.className='cqs-asset-grid';iconFields.append(field('QR 세트',setInput),field('적용 대상 QR',qrInput),field('아이콘 종류',source),field('문자 또는 아이콘 클래스',value));
    const iconActions=make('div');iconActions.className='cqs-actions';
    iconActions.append(btn('선택 아이콘 반영',()=>{
        if(source.value==='image'){info('이미지 업로드 버튼으로 파일을 선택하세요.');return;}
        edit(t=>setIcon(t,target(),source.value==='inherit'?null:['native','none'].includes(source.value)?{type:source.value}:{type:source.value,value:value.value}));
    }),imageUploader,btn('선택 대상 지정 해제',()=>edit(t=>setIcon(t,target(),null))),btn('QR 대상 새로고침',refreshTargets));
    node.append(iconFields,iconPreview,iconActions,make('p','개별 QR 지정이 세트·공통 아이콘보다 우선합니다. 원본 QR은 변경하지 않습니다. 이미지 최대 256 KB. 투명 PNG/GIF/WebP를 사용할 수 있어요.'),ruleList);
    const design = make('div');
    design.className = 'cqs-qr-editor';
    design.append(make('h3', '개별 QR 버튼 디자인'), make('p', '위에서 버튼 하나를 선택하세요. 배경과 모양은 바로 지정할 수 있고, HTML/CSS는 캐릭터에서 소스 적용을 켜면 표시됩니다.'));
    const designFields = make('div');
    designFields.className = 'cqs-asset-grid';
    const useBackground = make('input'); useBackground.type = 'checkbox';
    const background = make('input'); background.type = 'color';
    useBackground.addEventListener('change', () => { background.disabled = !useBackground.checked; });
    const shape = select([['default', '테마 기본값'], ['square', '각진 사각형'], ['round', '둥근 사각형'], ['pill', '캡슐'], ['circle', '원형']]);
    const qrHtml = make('textarea'); const qrCss = make('textarea');
    for (const input of [qrHtml, qrCss]) {
        input.className = 'cqs-json'; input.rows = 4; input.spellcheck = false; input.maxLength = 12000;
    }
    qrHtml.placeholder = '<span class="my-qr"><span data-cqs-slot="icon"></span><span data-cqs-slot="label"></span></span>';
    qrCss.placeholder = ':scope { border-radius: 10px 28px; }\n.cqs-qr-label { letter-spacing: .04em; }';
    const imagePreview = make('img'); imagePreview.className = 'cqs-wallpaper-preview'; imagePreview.alt = 'QR 버튼 배경';
    let designImage = '';
    function loadDesign(t, where) {
        design.hidden = where.id === undefined && where.label === undefined;
        const rule = t.qrStyles.find(rule => isSame(rule, where));
        useBackground.checked = Boolean(rule?.background);
        background.value = rule?.background || t.colors.button;
        background.disabled = !useBackground.checked;
        shape.value = rule?.shape || 'default';
        qrHtml.value = rule?.html || '';
        qrCss.value = rule?.css || '';
        designImage = rule?.image || '';
        imagePreview.hidden = !designImage;
        if (designImage) imagePreview.src = designImage;
        else imagePreview.removeAttribute('src');
    }
    function designDraft(image = designImage) {
        return { background: useBackground.checked ? background.value : '', image, shape: shape.value, html: qrHtml.value, css: qrCss.value };
    }
    function saveDesign(t, where, draft) {
        if (where.id === undefined && where.label === undefined) throw new Error('QR 버튼 하나를 선택하세요.');
        t.qrStyles = t.qrStyles.filter(rule => !isSame(rule, where));
        if (draft && (draft.background || draft.image || draft.shape !== 'default' || draft.html.trim() || draft.css.trim())) {
            t.qrStyles.push({ ...where, ...draft });
        }
    }
    const designActions = make('div'); designActions.className = 'cqs-actions';
    designActions.append(
        upload('QR 배경 이미지 업로드', MAX_ICON_BYTES, () => {
            const where = target(), draft = designDraft();
            return image => edit(t => saveDesign(t, where, { ...draft, image }));
        }),
        btn('QR 배경 이미지 제거', () => edit(t => saveDesign(t, target(), designDraft('')))),
        btn('QR 디자인 반영', () => edit(t => saveDesign(t, target(), designDraft()))),
        btn('QR 디자인 초기화', () => edit(t => saveDesign(t, target(), null)))
    );
    designFields.append(field('배경색 지정', useBackground), field('버튼 배경색', background), field('버튼 모양', shape));
    design.append(designFields, imagePreview, field('개별 QR HTML', qrHtml), field('개별 QR CSS', qrCss), designActions);
    node.append(design);
    function refresh(t){
        const h=t.handle;handleSource.value=h.icon.type;handleValue.value=['text','fa'].includes(h.icon.type)?h.icon.value:'';
        handleLabel.value=h.label;handleShow.checked=h.showLabel;handleSize.value=h.size;handleMode();
        handlePreview.replaceChildren();
        const glyph=make('span');glyph.className='cqs-handle-icon';glyph.style.setProperty('--cqs-handle-icon-size',`${h.size}px`);glyph.setAttribute('aria-hidden','true');
        if(h.icon.type==='image'){const image=make('img');image.src=h.icon.value;image.alt='';glyph.append(image);}
        else if(h.icon.type==='fa')glyph.classList.add('fa-solid',...h.icon.value.split(/\s+/).filter(Boolean));
        else if(h.icon.type==='text')glyph.textContent=h.icon.value;
        else if(h.icon.type==='native')glyph.textContent=t.decoration.symbol.trim()||'✦';
        if(h.icon.type!=='none')handlePreview.append(glyph);
        if(h.showLabel&&h.label.trim())handlePreview.append(make('span',h.label));
        const wp=t.wallpaper;wpPreview.hidden=!wp.image;if(wp.image)wpPreview.src=wp.image;else wpPreview.removeAttribute('src');
        size.value=wp.size;position.value=wp.position;repeat.value=wp.repeat;
        for(const [key,{input,output}]of Object.entries(sliders)){input.value=Math.round(wp[key]*100);output.textContent=input.value+'%';}
        ruleList.replaceChildren();for(const rule of t.icons.rules){const row=make('div');row.className='cqs-rule';row.append(make('span',`${rule.set??'모든 세트'} / ${rule.id!==undefined?'#'+rule.id:rule.label??'전체'} · ${rule.icon.type}`),btn('삭제',()=>edit(d=>{d.icons.rules=d.icons.rules.filter(r=>!isSame(r,rule));})));ruleList.append(row);}
        loadIcon();
    }
    // Initial population is deferred until all controls exist.
    refreshTargets();
    return {node,refresh,refreshTargets};
}
