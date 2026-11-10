// Wrapped so it is safe to load once, in <head> (with defer) or at the end of <body>.
(function(){
if(window.__sampleSelectorLoaded) return; window.__sampleSelectorLoaded=true;
function init(){
/* ---------- Product data (transcribed from the original form) ---------- */
const DATA=[];
function add(sys,attach,part,contour,type,lines){
  lines.trim().split('\n').forEach(l=>{
    l=l.trim(); if(!l) return;
    const [code,...n]=l.split(' ');
    DATA.push({code,name:n.join(' '),sys,attach,part,contour,type});
  });
}
const O='1-piece';
add(O,0,0,'Flat','Closed',``);
add(O,0,0,'Flat','Drainable',``);
add(O,0,0,'Flat','High flow',``);
add(O,0,0,'Flat','Uro',``);
add(O,0,0,'Soft flat','Drainable',``);
add(O,0,0,'Soft flat','Closed',``);
add(O,0,0,'Convex','Closed',``);
add(O,0,0,'Convex','Drainable',``);
add(O,0,0,'Convex','Uro',``);
add(O,0,0,'Soft convex','Drainable',``);
add(O,0,0,'Soft convex','High flow',``);
add(O,0,0,'Soft convex','Uro',``);
add(O,0,0,'Soft convex','Closed',``);

const T='2-piece';
add(T,'Mechanical','Baseplate','Flat',0,``);
add(T,'Mechanical','Baseplate','Convex',0,``);
add(T,'Mechanical','Pouch',0,'Closed',``);
add(T,'Mechanical','Pouch',0,'Drainable',``);
add(T,'Mechanical','Pouch',0,'High flow',``);
add(T,'Mechanical','Pouch',0,'Uro',``);
add(T,'Adhesive','Baseplate','Flat',0,``);
add(T,'Adhesive','Baseplate','Convex',0,``);
add(T,'Adhesive','Baseplate','Soft convex',0,``);
add(T,'Adhesive','Pouch',0,'Closed',``);
add(T,'Adhesive','Pouch',0,'Drainable',``);
add('Accessories',0,0,0,'Drainage & collection',``);
add('Accessories',0,0,0,'Support',``);
add('Accessories',0,0,0,'Seals & fillers',``);
add('Accessories',0,0,0,'Skin care',``);

/* ---------- Derived attributes ---------- */
DATA.forEach(p=>{
  ['attach','part','contour','type'].forEach(k=>{ if(!p[k]) p[k]=undefined; });
  const n=p.name;
  p.colour = /\b(trans\w*|trsp|trp|tsp)\b/i.test(n) ? 'Transparent'
           : /\b(sc|split cover)\b/i.test(n) ? 'Split cover'
           : /(beige|bge)/i.test(n) ? 'Beige' : undefined;
  const sz = (n.match(/\b(mini|midi|maxi)\b/i)||[])[1];
  p.length = sz ? sz[0].toUpperCase()+sz.slice(1).toLowerCase() : undefined;
  p.size = sizeLabel(p);
});
function sizeLabel(p){
  if(p.sys==='Accessories') return '';
  const n=p.name;
  let m=n.match(/(\d{2})\s*\/\s*(\d{2}(?:\s?-\s?\d{2,3})?)/);
  if(m){
    const cut=m[2].replace(/\s/g,'').replace('-','–');
    return 'Flange '+m[1]+' · '+(cut.includes('–')?'cut-to-fit '+cut:'pre-cut '+cut)+' mm';
  }
  m=n.match(/(\d{2})\s?-\s?(\d{2,3})/);
  if(m) return 'Cut-to-fit '+m[1]+'–'+m[2]+' mm';
  if(/cuttofit|cut-to-fit|ctf/i.test(n)) return 'Cut-to-fit';
  m=n.match(/(\d{2,3})\s?mm/i)||n.match(/\b(\d{2})(?:\s?B\d+)?$/i)||n.match(/\bBeige(\d{2})mm/i)||n.match(/(\d{2,3})\s*$/);
  if(m){
    return (p.sys==='2-piece'&&p.part==='Pouch') ? 'Flange '+m[1]+' mm' : 'Pre-cut '+m[1]+' mm';
  }
  return '';
}


/* ---------- Families: group variants into products ---------- */
DATA.forEach(p=>{
  p.flange=((p.size||'').match(/Flange (\d+)/)||[])[1];
  p.tg=p.type==='Closed'?'Closed':(p.type&&p.sys!=='Accessories'?'Drainable':undefined);
});
const TOK=/\b(?:\d{2,3}\s?(?:-\s?\d{2,3})?\s?(?:mm|gms)?|b\d+|ctf\s?\d*|cuttofit|cut-to-fit|pre-cut|beige\d*(?:mm)?|bge|transparent|transp|trans|trsp|trp|tsp|sc|split cover)\b|[\/\-]/gi;
function dispName(n){return n.replace(TOK,' ').replace(/\s+/g,' ').replace(/\s+\)/,')').trim();}
function stemKey(n){return n.replace(/[’'.]/g,'').replace(/\b1p\b/ig,'').replace(/\broll\s?up/ig,'rollup').replace(/\bo\s?cvx/ig,'ocvx').replace(TOK,' ').replace(/\s+/g,' ').trim().toLowerCase();}
const COL_HEX={Beige:'#e6cdae',Transparent:'#dcebf0','Split cover':'#e6cdae',Standard:'#dbe6e8',White:'#f4f4f4',Black:'#2b2f31'};
function buildOstomy(){
  const map=new Map();
  DATA.forEach(p=>{
    const key=p.sys==='Accessories'?'acc|'+p.code:[p.sys,p.attach,p.part,p.contour,p.type,stemKey(p.name)].join('|');
    let f=map.get(key);
    if(!f){
      f={id:'o'+map.size,cat:'ostomy',sys:p.sys,attach:p.attach,part:p.part,contour:p.contour,type:p.type,tg:p.tg,length:p.length,
         name:dispName(p.name)||p.name,variants:[]};
      map.set(key,f);
    }
    f.variants.push({code:p.code,colour:p.colour||'Standard',size:p.size||p.name,flange:p.flange,full:p.name});
  });
  const fams=[...map.values()];
  fams.forEach(f=>{
    // keep size labels unique within a colour
    const seen=new Map();
    f.variants.forEach(v=>{const k=v.colour+'|'+v.size;seen.set(k,(seen.get(k)||0)+1);});
    f.variants.forEach(v=>{if(seen.get(v.colour+'|'+v.size)>1) v.size+=' ('+v.code+')';});
    f.desc=describe(f);
  });
  return fams;
}
function describe(f){
  const c=(f.contour||'').toLowerCase().replace('soft convex','soft convex').trim();
  if(f.sys==='Accessories') return `Ostomy accessory (${f.type.toLowerCase()}).`;
  if(f.sys==='1-piece') return `One-piece ${f.type.toLowerCase()} pouch with ${/^[aeiou]/.test(c)?'an':'a'} ${c} baseplate.${f.length?' '+f.length+' length.':''}`;
  if(f.part==='Baseplate') return `Two-piece ${f.attach.toLowerCase()}-coupling ${c} baseplate. Choose the flange size that matches your pouch.`;
  return `Two-piece ${f.attach.toLowerCase()}-coupling ${f.type.toLowerCase()} pouch.${f.length?' '+f.length+' length.':''}`;
}
const OF=buildOstomy();

/* Placeholder continence range */
const CF=[
 {id:'c1',cat:'continence',group:'Catheters',style:'Straight',name:'Male intermittent catheter',desc:'Placeholder: single-use straight catheter for male users.',kind:'catheter',variants:['Ch 10','Ch 12','Ch 14','Ch 16'].map((s,i)=>({code:'SAMPLE-C1'+i,colour:'Standard',size:s}))},
 {id:'c2',cat:'continence',group:'Catheters',style:'Straight',name:'Female intermittent catheter',desc:'Placeholder: compact single-use straight catheter for female users.',kind:'catheter',variants:['Ch 8','Ch 10','Ch 12','Ch 14'].map((s,i)=>({code:'SAMPLE-C2'+i,colour:'Standard',size:s}))},
 {id:'c3',cat:'continence',group:'Catheters',style:'Pre-lubricated',name:'Pre-lubricated male catheter',desc:'Placeholder: ready-to-use catheter with pre-applied lubrication.',kind:'catheter',variants:['Ch 10','Ch 12','Ch 14'].map((s,i)=>({code:'SAMPLE-C3'+i,colour:'Standard',size:s}))},
 {id:'c4',cat:'continence',group:'Catheters',style:'Pre-lubricated',name:'Pre-lubricated female catheter',desc:'Placeholder: ready-to-use compact catheter with pre-applied lubrication.',kind:'catheter',variants:['Ch 8','Ch 10','Ch 12'].map((s,i)=>({code:'SAMPLE-C4'+i,colour:'Standard',size:s}))},
 {id:'c5',cat:'continence',group:'Drainage bags',style:'Closed',name:'Closed urine bag',desc:'Placeholder: closed sterile urine collection bag.',kind:'bag',variants:[['Standard','1 L'],['Standard','2 L']].map((a,i)=>({code:'SAMPLE-C5'+i,colour:a[0],size:a[1]}))},
 {id:'c6',cat:'continence',group:'Drainage bags',style:'Drainable',name:'Drainable leg bag',desc:'Placeholder: drainable bag worn on the leg.',kind:'bag',variants:[['Standard','500 mL'],['Standard','750 mL']].map((a,i)=>({code:'SAMPLE-C6'+i,colour:a[0],size:a[1]}))},
 {id:'c7',cat:'continence',group:'Drainage bags',style:'Drainable',name:'Drainable bedside bag',desc:'Placeholder: drainable bag for overnight use.',kind:'bag',variants:[['Standard','2 L']].map((a,i)=>({code:'SAMPLE-C7'+i,colour:a[0],size:a[1]}))},
 {id:'c8',cat:'continence',group:'Accessories',style:'',name:'Leg bag straps',desc:'Placeholder: adjustable straps for leg bags.',kind:'accessory',variants:[['White','Regular'],['White','Long'],['Black','Regular'],['Black','Long']].map((a,i)=>({code:'SAMPLE-C8'+i,colour:a[0],size:a[1]}))},
 {id:'c9',cat:'continence',group:'Accessories',style:'',name:'Catheter valve',desc:'Placeholder: valve for controlled drainage.',kind:'accessory',variants:[{code:'SAMPLE-C90',colour:'Standard',size:'One size'}]}
];

/* ---------- Product illustrations (generic, drawn in SVG) ---------- */
let uid=0;
function art(f,colour){
  const id='g'+(uid++), c=colour||'Standard';
  const fill=c==='Transparent'?'#e4f1f5':c==='Split cover'?`url(#${id})`:(COL_HEX[c]||'#e6cdae');
  const stroke=c==='Transparent'?'#6a9aa9':'#7a5a3c';
  const dash=c==='Transparent'?' stroke-dasharray="5 4"':'';
  const defs=`<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset=".5" stop-color="#e6cdae"/><stop offset=".5" stop-color="#f6efe2"/></linearGradient></defs>`;
  let body='';
  const kind=f.kind||(f.sys==='Accessories'?'accessory':(f.part==='Baseplate'?'baseplate':'pouch'));
  const convex=/convex/i.test(f.contour||'');
  if(kind==='pouch'){
    const drain=f.type&&f.type!=='Closed';
    body=`<path d="M62 30Q100 12 138 30Q158 100 140 150Q100 168 60 150Q42 100 62 30Z" fill="${fill}" stroke="${stroke}" stroke-width="3"${dash}/>
      <circle cx="100" cy="54" r="15" fill="#fff" stroke="${stroke}" stroke-width="3"/>
      ${convex?`<circle cx="100" cy="54" r="24" fill="none" stroke="${stroke}" stroke-width="2" opacity=".6"/>`:''}
      ${drain?`<path d="M72 160h56v16q-28 8-56 0Z" fill="${fill}" stroke="${stroke}" stroke-width="3"${dash}/><path d="M78 170h44" stroke="${stroke}" stroke-width="3"/>`:''}`;
  }else if(kind==='baseplate'){
    body=`<circle cx="100" cy="100" r="70" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
      <circle cx="100" cy="100" r="22" fill="#fff" stroke="${stroke}" stroke-width="3"/>
      <circle cx="100" cy="100" r="38" fill="none" stroke="${stroke}" stroke-width="3" stroke-dasharray="3 6"/>
      ${convex?`<circle cx="100" cy="100" r="52" fill="none" stroke="${stroke}" stroke-width="2" opacity=".6"/>`:''}`;
  }else if(kind==='catheter'){
    body=`<path d="M40 160L150 50" stroke="#6fb6c9" stroke-width="14" stroke-linecap="round"/><path d="M146 38l30 30-18 18-30-30Z" fill="#cfe7ee" stroke="#4a8fa3" stroke-width="3"/><circle cx="46" cy="154" r="4" fill="#fff"/>`;
  }else if(kind==='bag'){
    body=`<path d="M100 12v34" stroke="#6fb6c9" stroke-width="7" stroke-linecap="round"/><path d="M58 52h84v90Q100 176 58 142Z" fill="#e9f4f7" stroke="#4a8fa3" stroke-width="3"/><path d="M70 84h60M70 104h60M70 124h60" stroke="#4a8fa3" stroke-width="2" opacity=".5"/>`;
  }else{
    body=`<rect x="64" y="46" width="72" height="120" rx="14" fill="${c==='Black'?'#2b2f31':'#e8eef0'}" stroke="#587073" stroke-width="3"/><rect x="76" y="26" width="48" height="26" rx="6" fill="#0b7a6b"/><rect x="78" y="82" width="44" height="40" rx="6" fill="#fff" opacity=".85"/>`;
  }
  return `<svg viewBox="0 0 200 200" aria-hidden="true">${defs}${body}</svg>`;
}

/* ---------- State & helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const S={persona:null,cat:null,a:'',b:'',c:'',basket:[],cur:null,sel:{}};
function reveal(id){
  const el=$(id); const was=el.hidden; el.hidden=false;
  requestAnimationFrame(()=>setTimeout(()=>el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'}),60));
  return was;
}
function toast(msg){
  const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200);
}

/* ---------- Step 1: persona ---------- */
document.querySelectorAll('[data-persona]').forEach(b=>b.addEventListener('click',()=>{
  S.persona=b.dataset.persona;
  $('#bar').hidden=false;
  $('#personaTxt').textContent=S.persona==='nurse'?'Nurse (hospital)':'Individual';
  $('#catSub').textContent=S.persona==='nurse'
    ?'Choose the product area you are requesting samples for on behalf of your hospital or patients.'
    :'Choose the product area you are shopping for yourself.';
  reveal('#pCat');
}));
$('#persona').onclick=()=>{ document.body.classList.remove('checkout'); $('#hero').scrollIntoView({behavior:reduce?'auto':'smooth'}); };

/* ---------- Step 2: category ---------- */
document.querySelectorAll('[data-cat]').forEach(b=>b.addEventListener('click',()=>{
  S.cat=b.dataset.cat; S.a=S.b=S.c='';
  document.querySelectorAll('[data-cat]').forEach(x=>x.setAttribute('aria-pressed',x===b));
  $('#pGrid').hidden=true; $('#hFilter').textContent=S.cat==='ostomy'?'What kind of ostomy product?':'What kind of continence product?';
  renderDropdowns(); reveal('#pFilter');
}));

/* ---------- Step 3: dropdowns ---------- */
const OPT={
  ostomy:{a:{label:'System',ph:'Choose a system',opts:[['1-piece','1-piece'],['2-piece','2-piece'],['Accessories','Accessories']]},
          b:{label:'Pouch type',ph:'Closed or drainable?',opts:[['Closed','Closed'],['Drainable','Drainable']]}},
  continence:{a:{label:'Product type',ph:'Choose a type',opts:[['Catheters','Catheters'],['Drainage bags','Drainage bags'],['Accessories','Accessories']]}}
};
function flangesFor(){
  const set=new Set();
  OF.forEach(f=>{ if(f.sys==='2-piece'&&(f.part==='Baseplate'||f.tg===S.b)) f.variants.forEach(v=>v.flange&&set.add(+v.flange)); });
  return [...set].sort((x,y)=>x-y);
}
function select(id,label,ph,opts,val,hint){
  return `<div class="dd"><label for="${id}">${label}</label><select id="${id}" class="${val?'set':''}"><option value="" ${val?'':'selected'} disabled>${ph}</option>${opts.map(o=>`<option value="${esc(o[0])}" ${o[0]===val?'selected':''}>${esc(o[1])}</option>`).join('')}</select>${hint?`<div class="h">${hint}</div>`:''}</div>`;
}
function renderDropdowns(){
  let h='';
  if(S.cat==='ostomy'){
    h+=select('dA',OPT.ostomy.a.label,OPT.ostomy.a.ph,OPT.ostomy.a.opts,S.a);
    if(S.a&&S.a!=='Accessories') h+=select('dB',OPT.ostomy.b.label,OPT.ostomy.b.ph,OPT.ostomy.b.opts,S.b);
    if(S.a==='2-piece'&&S.b) h+=select('dC','Size (flange)','Choose a size',flangesFor().map(n=>[String(n),n+' mm']),S.c,'Matching pouches and baseplates are shown together.');
  }else{
    h+=select('dA',OPT.continence.a.label,OPT.continence.a.ph,OPT.continence.a.opts,S.a);
    if(S.a==='Catheters') h+=select('dB','Style','Choose a style',[['Straight','Straight'],['Pre-lubricated','Pre-lubricated']],S.b);
    if(S.a==='Drainage bags') h+=select('dB','Bag type','Closed or drainable?',[['Closed','Closed'],['Drainable','Drainable']],S.b);
  }
  $('#dds').innerHTML=h;
}
$('#dds').addEventListener('change',e=>{
  const id=e.target.id, v=e.target.value;
  if(id==='dA'){S.a=v;S.b='';S.c='';}
  if(id==='dB'){S.b=v;S.c='';}
  if(id==='dC'){S.c=v;}
  renderDropdowns();
  const f=$('#'+id); if(f) f.focus({preventScroll:true});
  const ready=S.cat==='ostomy'
    ? (S.a==='Accessories'||(S.a==='1-piece'&&S.b)||(S.a==='2-piece'&&S.b&&S.c))
    : (S.a==='Accessories'||(S.a&&S.b));
  if(ready) showGrid(); else $('#pGrid').hidden=true;
});

/* ---------- Step 4: grid ---------- */
function matches(){
  if(S.cat==='continence') return CF.filter(f=>f.group===S.a&&(S.a==='Accessories'||f.style===S.b)).map(f=>({f,variants:f.variants}));
  let out=[];
  OF.forEach(f=>{
    if(S.a==='Accessories'){ if(f.sys==='Accessories') out.push({f,variants:f.variants}); return; }
    if(f.sys!==S.a) return;
    if(S.a==='1-piece'){ if(f.tg===S.b) out.push({f,variants:f.variants}); return; }
    if(f.part==='Pouch'&&f.tg!==S.b) return;
    const vs=f.variants.filter(v=>v.flange===S.c);
    if(vs.length) out.push({f,variants:vs});
  });
  return out;
}
function tile(m){
  const f=m.f, v0=m.variants[0], cols=[...new Set(m.variants.map(v=>v.colour))];
  const mt=[m.variants.length+(m.variants.length===1?' option':' options'),cols.length>1?cols.length+' colours':''].filter(Boolean).join(' · ');
  return `<button class="tile" type="button" data-fid="${f.id}"><div class="img">${art(f,v0.colour)}</div><div class="in"><div class="nm">${esc(f.name)}</div><div class="mt">${esc(mt)}</div></div></button>`;
}
function showGrid(){
  const ms=matches(), firstTime=$('#pGrid').hidden;
  $('#gridView').hidden=false; $('#detailView').hidden=true;
  const crumbs=[S.persona==='nurse'?'Nurse':'Individual',S.cat==='ostomy'?'Ostomy':'Continence',S.a,S.b,S.c&&S.c+' mm'].filter(Boolean);
  $('#crumbs').innerHTML=crumbs.map(c=>`<span class="pill">${esc(c)}</span>`).join('');
  $('#gSub').textContent=ms.length?`${ms.length} ${ms.length===1?'product':'products'} match. Tap one to choose colour and size.`:'';
  $('#notice').innerHTML=S.cat==='continence'?'<p class="note">Placeholder products: replace with the real continence range.</p>':'';
  let html='';
  if(S.cat==='ostomy'&&S.a==='2-piece'){
    const pouches=ms.filter(m=>m.f.part==='Pouch'), plates=ms.filter(m=>m.f.part==='Baseplate');
    html+=`<h3 class="grp">${S.b} pouches</h3>`+(pouches.length?`<div class="tiles">${pouches.map(tile).join('')}</div>`:'<div class="empty">No pouches at this size.</div>');
    html+=`<h3 class="grp">Matching baseplates</h3>`+(plates.length?`<div class="tiles">${plates.map(tile).join('')}</div>`:'<div class="empty">No baseplates at this size.</div>');
  }else html=ms.length?`<div class="tiles">${ms.map(tile).join('')}</div>`:'<div class="empty">No products match these choices.</div>';
  $('#tiles').innerHTML=html;
  $('#tiles').dataset.ms=''; S.ms=ms;
  if(firstTime) reveal('#pGrid'); else $('#pGrid').hidden=false;
}
$('#tiles').addEventListener('click',e=>{
  const t=e.target.closest('[data-fid]'); if(!t) return;
  const m=S.ms.find(x=>x.f.id===t.dataset.fid); openDetail(m);
});

/* ---------- Product detail ---------- */
function openDetail(m){
  S.cur=m; S.sel={colour:[...new Set(m.variants.map(v=>v.colour))][0],code:''};
  const sizes=m.variants.filter(v=>v.colour===S.sel.colour); if(sizes.length===1) S.sel.code=sizes[0].code;
  $('#gridView').hidden=true; $('#detailView').hidden=false; renderDetail();
  $('#pGrid').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
}
function swStyle(c){
  return c==='Split cover'?'linear-gradient(90deg,#e6cdae 50%,#f6efe2 50%)':c==='Transparent'?'linear-gradient(135deg,#fff 45%,#cfe3e8 46%)':(COL_HEX[c]||'#ddd');
}
function renderDetail(){
  const y=window.scrollY;
  const {f,variants}=S.cur, cols=[...new Set(variants.map(v=>v.colour))];
  const sizes=variants.filter(v=>v.colour===S.sel.colour);
  const cur=variants.find(v=>v.code===S.sel.code);
  const inReq=cur&&S.basket.some(b=>b.code===cur.code);
  const isVol=f.group==='Drainage bags';
  const rows=variants.map(v=>{
    const added=S.basket.some(b=>b.code===v.code);
    const label=v.full||(f.name+' – '+v.size);
    const showCol=cols.length>1||v.colour!=='Standard';
    return `<tr class="${v.code===S.sel.code?'sel':''}">
      <td class="c" data-label="Code">${esc(v.code)}</td>
      <td class="p" data-label="Product"><button type="button" class="pn" data-pick="${esc(v.code)}">${esc(label)}</button>${showCol?`<span class="pc"><i style="background:${swStyle(v.colour)}"></i>${esc(v.colour)}</span>`:''}</td>
      <td class="s" data-label="${isVol?'Volume':'Size'}">${esc(v.size)}</td>
      <td class="o"><button type="button" class="ord" data-order="${esc(v.code)}" aria-pressed="${added}" aria-label="Order free sample: ${esc(label)}">${added?'✓ Added':'Order'}</button></td></tr>`;
  }).join('');
  $('#detailView').innerHTML=`
    <div class="detailTop">
      <button class="back" id="backBtn" type="button">← Back to products</button>
      <div class="detail">
        <div class="pic" id="pic">${art(f,S.sel.colour)}</div>
        <div>
          <div class="crumbs" style="margin-bottom:10px">${[S.cat==='ostomy'?'Ostomy':'Continence',f.group||f.sys,f.part||f.type||f.style].filter(Boolean).map(c=>`<span class="pill">${esc(c)}</span>`).join('')}</div>
          <span class="free">FREE sample</span>
          <h2>${esc(f.name)}</h2>
          <p>${esc(f.desc)}</p>
          ${cols.length>1?`<div class="fld"><b>Colour: <span style="font-weight:400">${esc(S.sel.colour)}</span></b><div class="sw" role="group" aria-label="Colour">${cols.map(c=>`<button type="button" class="swb" data-col="${esc(c)}" aria-pressed="${c===S.sel.colour}"><i style="background:${swStyle(c)}"></i>${esc(c)}</button>`).join('')}</div></div>`:''}
          <div class="fld"><b><label for="sizeSel">Size</label></b>
            <select id="sizeSel"><option value="" ${S.sel.code?'':'selected'} disabled>Select a size</option>${sizes.map(v=>`<option value="${esc(v.code)}" ${v.code===S.sel.code?'selected':''}>${esc(v.size)}</option>`).join('')}</select>
            <div class="code">${cur?'Product code: '+esc(cur.code):''}</div></div>
          <button class="cta" id="addBtn" type="button" ${cur?'':'disabled'}>${inReq?'✓ In your request':'Add to request'}</button>
          <button class="down" id="toTable" type="button">↓ All sizes &amp; codes (${variants.length})</button>
        </div>
      </div>
    </div>
    <section class="vt" id="variantTable" aria-labelledby="vtH">
      <h3 id="vtH">All sizes &amp; codes</h3>
      <p class="vtsub">Order a free sample of any option below.</p>
      <table class="vt-t">
        <thead><tr><th scope="col">Code</th><th scope="col">Product</th><th scope="col">${isVol?'Volume':'Size'}</th><th scope="col">FREE Sample</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`;
  window.scrollTo(0,y);
}
function addToRequest(v){
  if(S.basket.some(b=>b.code===v.code)){ toast('Already in your request'); return; }
  S.basket.push({code:v.code,name:S.cur.f.name,colour:v.colour,size:v.size,f:S.cur.f}); updBasket(); toast('Added to your request');
}
$('#detailView').addEventListener('click',e=>{
  if(e.target.closest('#backBtn')){ $('#detailView').hidden=true; $('#gridView').hidden=false; $('#pGrid').scrollIntoView({behavior:reduce?'auto':'smooth'}); return; }
  if(e.target.closest('#toTable')){ $('#variantTable').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'}); return; }
  const c=e.target.closest('[data-col]');
  if(c){ S.sel.colour=c.dataset.col; const sizes=S.cur.variants.filter(v=>v.colour===S.sel.colour); S.sel.code=sizes.length===1?sizes[0].code:''; renderDetail(); return; }
  if(e.target.closest('#addBtn')){
    const v=S.cur.variants.find(x=>x.code===S.sel.code); if(!v) return;
    addToRequest(v); renderDetail(); return;
  }
  const pk=e.target.closest('[data-pick]');
  if(pk){
    const v=S.cur.variants.find(x=>x.code===pk.dataset.pick);
    S.sel={colour:v.colour,code:v.code}; renderDetail();
    $('#pGrid').scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'}); return;
  }
  const od=e.target.closest('[data-order]');
  if(od){
    const v=S.cur.variants.find(x=>x.code===od.dataset.order);
    S.sel={colour:v.colour,code:v.code}; addToRequest(v); renderDetail();
    const again=$('[data-order="'+v.code+'"]'); if(again) again.focus({preventScroll:true});
  }
});
$('#detailView').addEventListener('change',e=>{
  if(e.target.id==='sizeSel'){ S.sel.code=e.target.value; renderDetail(); const s=$('#sizeSel'); s&&s.focus({preventScroll:true}); }
});

/* ---------- Basket drawer ---------- */
function updBasket(){ $('#bcount').textContent=S.basket.length; if(document.body.classList.contains('checkout')) renderSummary(); }
$('#basketBtn').onclick=openDrawer;
function openDrawer(){
  const who=S.persona==='nurse'?'for your hospital or patients':'for yourself';
  $('#drawerHost').innerHTML=`<div class="scrim" id="scrim"></div>
  <aside class="drawer" role="dialog" aria-modal="true" aria-label="Your request">
    <div style="display:flex;justify-content:space-between;align-items:start"><div><h3>Your request</h3><div class="hint" style="color:var(--muted);font-size:.9rem">Samples ${who}</div></div><button class="x" id="closeD" type="button" aria-label="Close">✕</button></div>
    ${S.basket.length?`<ul>${S.basket.map(b=>`<li>${art(b.f,b.colour)}<div><b>${esc(b.name)}</b><br><small>${esc(b.colour)} · ${esc(b.size)} · ${esc(b.code)}</small></div><button class="x" data-rm="${esc(b.code)}" type="button" aria-label="Remove ${esc(b.name)}">✕</button></li>`).join('')}</ul>`:'<p style="color:var(--muted);flex:1">Nothing added yet.</p>'}
    <button class="cta" id="contD" type="button" ${S.basket.length?'':'disabled'}>Checkout</button>
  </aside>`;
  $('#closeD').focus();
}
$('#drawerHost').addEventListener('click',e=>{
  if(e.target.id==='scrim'||e.target.id==='closeD'){ $('#drawerHost').innerHTML=''; return; }
  const r=e.target.closest('[data-rm]');
  if(r){ S.basket=S.basket.filter(b=>b.code!==r.dataset.rm); updBasket(); openDrawer(); if(!$('#detailView').hidden) renderDetail(); return; }
  if(e.target.id==='contD'){ $('#drawerHost').innerHTML=''; openCheckout(); }
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape') $('#drawerHost').innerHTML=''; });

/* ---------- Checkout ---------- */
S.form={}; S.reqFor=''; S.consent={mkt:false,priv:false};
const STATES=['New South Wales','Victoria','Queensland','Western Australia','South Australia','Tasmania','ACT','NT'];
const POSTR=[[800,999,'NT'],[200,299,'ACT'],[2600,2618,'ACT'],[2900,2920,'ACT'],[2000,2599,'New South Wales'],[2619,2899,'New South Wales'],[2921,2999,'New South Wales'],[3000,3999,'Victoria'],[8000,8999,'Victoria'],[4000,4999,'Queensland'],[9000,9999,'Queensland'],[5000,5799,'South Australia'],[6000,6797,'Western Australia'],[7000,7999,'Tasmania']];
function stateFromPostcode(pc){ const n=+pc; for(const [a,b,s] of POSTR) if(n>=a&&n<=b) return s; return ''; }
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function inp(id,label,o={}){
  const v=S.form[id]||'';
  return `<div class="fg${o.wide?' wide':''}"><label for="${id}">${label}${o.req?' <span class="rq" aria-hidden="true">*</span>':''}</label>
    <input id="${id}" name="${id}" type="${o.type||'text'}" value="${esc(v)}" placeholder="${esc(o.ph||'')}" autocomplete="${o.ac||'off'}"${o.mode?` inputmode="${o.mode}"`:''}${o.max?` maxlength="${o.max}"`:''}${o.req?' aria-required="true"':''} aria-describedby="er_${id}">
    <div class="er" id="er_${id}" role="alert"></div></div>`;
}
function stateField(){
  return `<div class="fg"><label for="state">State <span class="rq" aria-hidden="true">*</span></label>
    <select id="state" aria-required="true" aria-describedby="er_state"><option value="" ${S.form.state?'':'selected'} disabled>Select a state</option>${STATES.map(s=>`<option ${S.form.state===s?'selected':''}>${s}</option>`).join('')}</select><div class="er" id="er_state" role="alert"></div></div>`;
}
function countryField(){
  return `<div class="fg"><label for="country">Country</label><select id="country" disabled><option>Australia</option></select></div>`;
}
function salutField(){
  return `<fieldset class="fs"><legend>Salutation</legend><div class="rads">${['Mr.','Mrs.','Neutral'].map((s,i)=>`<label class="rad"><input type="radio" name="salut" value="${s}" ${S.form.salut===s?'checked':''}><span>${s}</span></label>`).join('')}</div></fieldset>`;
}
function renderCheckout(){
  const nurse=S.persona==='nurse', host=$('#pCheckout');
  if(!S.basket.length){
    host.innerHTML=`<div class="coWrap"><div class="empty"><p>Your request is empty.</p><button class="cta" type="button" id="coBack">Choose products</button></div></div>`; return;
  }
  const clinician=`<h3 class="coH">Clinician details</h3><div class="fgrid">
      ${inp('first',"Clinician’s First Name",{req:1,ph:'Jane',ac:'given-name'})}
      ${inp('last',"Clinician’s Last Name",{req:1,ph:'Smith',ac:'family-name'})}
      ${inp('org','Organization / Hospital / Institution',{req:1,ph:'Hospital or clinic name',ac:'organization'})}
      ${inp('func','Function',{req:1,ph:'Function',ac:'organization-title'})}
      ${inp('email','Business Email',{req:1,type:'email',wide:1,ph:'name@hospital.com.au',ac:'email'})}
    </div>
    <h3 class="coH">Delivery details</h3><div class="fgrid">
      ${inp('rname',"Receiver’s name",{req:1,ph:'Jane Smith',ac:'name'})}
      ${inp('street','Street',{req:1,ph:'Street',ac:'street-address'})}
      ${inp('postcode','Postal Code',{req:1,ph:'Postal Code',mode:'numeric',max:4,ac:'postal-code'})}
      ${inp('city','City',{req:1,ph:'City',ac:'address-level2'})}
      ${inp('phone','Phone',{req:1,type:'tel',ph:'Phone',ac:'tel'})}
      ${inp('mobile','Mobile Phone',{req:1,type:'tel',ph:'Mobile phone',ac:'tel'})}
      ${stateField()}${countryField()}
    </div>
    <fieldset class="fs" aria-describedby="er_reqFor"><legend>This request is for <span class="rq" aria-hidden="true">*</span></legend>
      <div class="rads col">${['Discharge Pack','Ward Stock'].map((s,i)=>`<label class="rad"><input type="radio" name="reqFor" id="rf${i}" value="${s}" ${S.reqFor===s?'checked':''}><span>${s}</span></label>`).join('')}</div>
      <div class="er" id="er_reqFor" role="alert"></div></fieldset>`;
  const patient=`<h3 class="coH">Your details</h3><div class="fgrid">
      ${inp('first','First name',{req:1,ph:'Jane',ac:'given-name'})}
      ${inp('last','Last name',{req:1,ph:'Smith',ac:'family-name'})}
      ${inp('email','Email',{req:1,type:'email',wide:1,ph:'you@example.com',ac:'email'})}
      ${inp('phone','Phone',{type:'tel',ph:'Phone',ac:'tel'})}
      ${inp('mobile','Mobile phone',{type:'tel',ph:'Mobile phone',ac:'tel'})}
      <div class="fg wide hintTxt">Please give at least one contact number.</div>
    </div>
    <h3 class="coH">Delivery address</h3><div class="fgrid">
      ${inp('street','Street',{req:1,wide:1,ph:'Street',ac:'street-address'})}
      ${inp('postcode','Postal Code',{req:1,ph:'Postal Code',mode:'numeric',max:4,ac:'postal-code'})}
      ${inp('city','City',{req:1,ph:'City',ac:'address-level2'})}
      ${stateField()}${countryField()}
    </div>
    <h3 class="coH">Your clinician <span class="opt">(optional)</span></h3>
    <p class="hintTxt" style="margin:-4px 0 12px">If a nurse or doctor looks after your care, you can tell us who. You can leave this blank.</p>
    <div class="fgrid">
      ${inp('cl_first','Clinician’s first name',{ph:'First name'})}
      ${inp('cl_last','Clinician’s last name',{ph:'Last name'})}
      ${inp('cl_org','Organization / Hospital / Institution',{ph:'Hospital or clinic name'})}
      ${inp('cl_func','Function',{ph:'Function'})}
      ${inp('cl_email','Clinician’s email',{type:'email',wide:1,ph:'name@hospital.com.au'})}
    </div>`;
  host.innerHTML=`<div class="coWrap">
    <form id="coForm" novalidate>
      <button class="back" id="coBack" type="button">← Back to products</button>
      <h2>Checkout</h2>
      <p class="coSub">${nurse?'Request free samples for your hospital or ward.':'Request your free samples.'} Fields marked with an asterisk are required.</p>
      <div id="errSum" class="errsum" role="alert" tabindex="-1" hidden></div>
      ${salutField()}
      ${nurse?clinician:patient}
      <h3 class="coH">Permissions</h3>
      <label class="chk"><input type="checkbox" id="mkt" ${S.consent.mkt?'checked':''}><span>I would like to receive information about relevant therapies, products, solutions or events from B. Braun and its contracted distribution partners. <em>(optional)</em></span></label>
      <p class="hintTxt">B. Braun Australia is the responsible organisation. Your personal data is handled under Australian privacy law and the privacy policy.</p>
      <label class="chk"><input type="checkbox" id="priv" ${S.consent.priv?'checked':''} aria-describedby="er_priv"><span>I have read the data protection policy and agree to the processing of my personal data. I can cancel this approval at any time. <span class="rq" aria-hidden="true">*</span></span></label>
      <div class="er" id="er_priv" role="alert"></div>
      <div class="coActs"><button class="cta alt" type="button" id="coBack2">Back</button><button class="cta" type="submit">Submit request</button></div>
    </form>
    <aside class="sum" id="coSum" aria-label="Your samples"></aside>
  </div>`;
  renderSummary();
}
function renderSummary(){
  const el=$('#coSum'); if(!el) return;
  const items=S.basket;
  el.innerHTML=`<h3>Your samples <span class="cnt">${items.length}</span></h3><p class="freeLine">All samples are free of charge.</p>
    ${items.length?`<ul>${items.map(b=>`<li>${art(b.f,b.colour)}<div><b>${esc(b.name)}</b><br><small>${esc(b.colour)} · ${esc(b.size)}<br>${esc(b.code)}</small></div><button type="button" class="x" data-sumrm="${esc(b.code)}" aria-label="Remove ${esc(b.name)}">✕</button></li>`).join('')}</ul>`:'<p class="hintTxt">Nothing selected.</p>'}
    <button class="link" type="button" id="coMore">+ Add more products</button>`;
}
function openCheckout(){
  document.body.classList.add('checkout'); $('#pCheckout').hidden=false; renderCheckout(); window.scrollTo(0,0);
}
function exitCheckout(){
  document.body.classList.remove('checkout');
  const g=$('#pGrid'); if(g&&!g.hidden) g.scrollIntoView({behavior:reduce?'auto':'smooth'}); else window.scrollTo(0,0);
}
function validate(){
  const nurse=S.persona==='nurse', F=S.form, E=[], v=id=>(F[id]||'').trim();
  const bad=(id,m)=>{ if(!E.some(e=>e.id===id)) E.push({id,msg:m}); };
  const need=(id,m)=>{ if(!v(id)) bad(id,m); };
  if(!S.basket.length) bad('basket','Add at least one product.');
  need('first',nurse?'Enter the clinician’s first name.':'Enter your first name.');
  need('last',nurse?'Enter the clinician’s last name.':'Enter your last name.');
  if(nurse){ need('org','Enter your organization, hospital or institution.'); need('func','Enter your function.'); need('rname','Enter the receiver’s name.'); }
  need('email',nurse?'Enter your business email.':'Enter your email address.');
  if(v('email')&&!EMAIL.test(v('email'))) bad('email','Enter a valid email address.');
  need('street','Enter a street address.'); need('postcode','Enter a 4-digit postal code.'); need('city','Enter a city or suburb.'); need('state','Select a state.');
  if(v('postcode')&&!/^\d{4}$/.test(v('postcode'))) bad('postcode','Postal codes have 4 digits.');
  if(nurse){ need('phone','Enter a phone number.'); need('mobile','Enter a mobile phone number.'); }
  else if(!v('phone')&&!v('mobile')) bad('phone','Give a phone or mobile number.');
  ['phone','mobile'].forEach(id=>{ if(v(id)&&!/^[0-9+()\s-]{8,}$/.test(v(id))) bad(id,'Enter a valid phone number.'); });
  if(nurse&&!S.reqFor) bad('reqFor','Choose Discharge Pack or Ward Stock.');
  if(!nurse&&v('cl_email')&&!EMAIL.test(v('cl_email'))) bad('cl_email','Enter a valid email address for your clinician, or leave it blank.');
  if(!S.consent.priv) bad('priv','Please agree to the data protection policy to submit.');
  return E;
}
function showErrors(E){
  document.querySelectorAll('#coForm .er').forEach(x=>x.textContent='');
  document.querySelectorAll('#coForm [aria-invalid]').forEach(x=>x.removeAttribute('aria-invalid'));
  E.forEach(e=>{ const m=$('#er_'+e.id); if(m) m.textContent=e.msg; const i=$('#'+e.id); if(i) i.setAttribute('aria-invalid','true'); });
  const sum=$('#errSum');
  if(E.length){ sum.hidden=false; sum.textContent='Please check '+E.length+(E.length===1?' field':' fields')+' below.'; const first=E[0]; const t=first.id==='reqFor'?$('#rf0'):first.id==='basket'?sum:$('#'+first.id); (t||sum).focus(); }
  else sum.hidden=true;
}
function submitCheckout(){
  const E=validate(); showErrors(E); if(E.length) return;
  const nurse=S.persona==='nurse', F=S.form, ref='DEMO-'+Math.random().toString(36).slice(2,8).toUpperCase();
  const who=nurse?F.rname:[F.first,F.last].filter(Boolean).join(' ');
  $('#pCheckout').innerHTML=`<div class="coWrap done"><div class="tick" aria-hidden="true">✓</div>
    <h2>Request submitted (demo)</h2>
    <p class="coSub">Reference <b>${ref}</b>. In a live version a confirmation would be emailed to ${esc(F.email)}.</p>
    <dl class="dlist"><dt>Samples</dt><dd>${S.basket.length} ${S.basket.length===1?'item':'items'}${nurse&&S.reqFor?' · '+esc(S.reqFor):''}</dd>
      <dt>Deliver to</dt><dd>${esc(who)}<br>${esc(F.street)}, ${esc(F.city)} ${esc(F.state)} ${esc(F.postcode)}, Australia</dd></dl>
    <button class="cta" type="button" id="coNew">Start a new request</button></div>`;
  window.scrollTo(0,0);
}
function resetAll(){
  S.basket=[]; S.form={}; S.reqFor=''; S.consent={mkt:false,priv:false}; S.cat=null; S.a=S.b=S.c=''; updBasket();
  document.body.classList.remove('checkout'); ['#pCheckout','#pCat','#pFilter','#pGrid','#bar'].forEach(s=>$(s).hidden=true);
  document.querySelectorAll('[data-cat]').forEach(x=>x.setAttribute('aria-pressed','false'));
  window.scrollTo(0,0);
}
const co=$('#pCheckout');
co.addEventListener('input',e=>{
  const t=e.target; if(!t.id||t.type==='radio'||t.type==='checkbox') return;
  S.form[t.id]=t.value;
  const m=$('#er_'+t.id); if(m) m.textContent=''; t.removeAttribute('aria-invalid');
  if(t.id==='postcode'&&/^\d{4}$/.test(t.value)&&!S.form.stateManual){ const s=stateFromPostcode(t.value); if(s){ S.form.state=s; const sel=$('#state'); if(sel) sel.value=s; } }
});
co.addEventListener('change',e=>{
  const t=e.target;
  if(t.name==='salut') S.form.salut=t.value;
  else if(t.name==='reqFor'){ S.reqFor=t.value; $('#er_reqFor').textContent=''; }
  else if(t.id==='mkt') S.consent.mkt=t.checked;
  else if(t.id==='priv'){ S.consent.priv=t.checked; if(t.checked) $('#er_priv').textContent=''; }
  else if(t.id==='state'){ S.form.state=t.value; S.form.stateManual=true; $('#er_state').textContent=''; }
});
co.addEventListener('submit',e=>{ e.preventDefault(); submitCheckout(); });
co.addEventListener('click',e=>{
  if(e.target.closest('#coBack,#coBack2,#coMore')){ exitCheckout(); return; }
  const rm=e.target.closest('[data-sumrm]'); if(rm){ S.basket=S.basket.filter(b=>b.code!==rm.dataset.sumrm); updBasket(); if(!S.basket.length) renderCheckout(); return; }
  if(e.target.closest('#coNew')) resetAll();
});

window.__t={OF,CF,DATA,S,matches,flangesFor,dispName,stemKey,validate,renderCheckout,stateFromPostcode};
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();