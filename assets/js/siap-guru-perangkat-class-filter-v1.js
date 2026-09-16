(()=>{
const ROOM='.sg-perangkat-room';
const clean=v=>String(v??'').trim();
const readSession=k=>{try{return JSON.parse(sessionStorage.getItem(k)||'null')}catch(_){return null}};
const user=()=>readSession('siapguru_user')||{};
const selected=()=>readSession('siapguru_selected_topic')||{};
const rows=()=>window.SiapGuruMasterBab?.getAll?.()||[];
const classValue=()=>{const u=user(),r=document.querySelector(ROOM);return clean(u.kelas||u.class||r?.querySelector('#sgPaClass')?.value||r?.querySelector('#sgPaKelas')?.value)};
const normClass=v=>{const s=clean(v).toLowerCase().replace(/kelas/g,'').trim();const m=s.match(/\d+/);return m?String(Number(m[0])):s};
const mapelValue=()=>{const s=selected(),r=document.querySelector(ROOM);return clean(s.mapel||s.mapelName||r?.querySelector('#sgPaSubject')?.value)};
const applyClassFilter=()=>{
 const r=document.querySelector(ROOM),sel=r?.querySelector('#sgPaTopic');if(!r||!sel)return;
 const kelas=normClass(classValue()),mapel=clean(mapelValue()).toLowerCase();const all=rows();
 if(!kelas||!all.length)return;
 const current=clean(sel.value)||clean(selected().bab||selected().topic);
 const pool=all.filter(x=>normClass(x?.kelas)===kelas&&(!mapel||clean(x?.mapel).toLowerCase()===mapel)&&x?.bab);
 if(!pool.length)return;
 const topics=[];pool.forEach(x=>{const b=clean(x.bab);if(b&&!topics.includes(b))topics.push(b)});
 sel.innerHTML='<option value="">Pilih BAB / Topik...</option>'+topics.map(x=>{const o=document.createElement('option');o.value=x;o.textContent=x;return o.outerHTML}).join('');
 if(current&&topics.includes(current))sel.value=current;else if(topics.length&&!sel.value)sel.value=topics[0];
 sel.dataset.sgClassFiltered='1';
};
const syncSelection=e=>{
 const s=e?.target;if(!s||s.id!=='sgPaTopic')return;const value=clean(s.value);if(!value)return;
 const row=rows().find(x=>normClass(x?.kelas)===normClass(classValue())&&clean(x?.bab)===value&&(!mapelValue()||clean(x?.mapel).toLowerCase()===mapelValue().toLowerCase()));
 if(row)sessionStorage.setItem('siapguru_selected_topic',JSON.stringify(row));
};
const boot=()=>{if(window.__sgPerangkatClassFilterV1)return;window.__sgPerangkatClassFilterV1=1;applyClassFilter();document.addEventListener('change',syncSelection,true);const mo=new MutationObserver(()=>{const r=document.querySelector(ROOM),s=r?.querySelector('#sgPaTopic');if(s&&!s.dataset.sgClassFiltered)applyClassFilter()});mo.observe(document.body,{childList:true,subtree:true});setInterval(applyClassFilter,800)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();