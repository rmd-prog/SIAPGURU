(()=>{
const boot=()=>{
 const room=document.querySelector('.sg-perangkat-room');
 if(!room||room.dataset.topicSelectV2)return;
 room.dataset.topicSelectV2='1';
 const q=id=>room.querySelector('#'+id),text=v=>String(v??'').trim(),read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
 const collectTopics=()=>{
  const out=[];
  const add=v=>{const s=text(v);if(s&&!out.includes(s))out.push(s)};
  const walk=(x,d=0)=>{if(!x||d>5)return;if(Array.isArray(x)){x.forEach(v=>walk(v,d+1));return}if(typeof x!=='object')return;
   ['topic','topik','bab','babTopik','bab_topik','materi','materiPokok','judulBab','judulTopik','chapter','unit'].forEach(k=>add(x[k]));
   ['items','rows','data','tp','lessons','chapters','topics'].forEach(k=>x[k]&&walk(x[k],d+1));
   ['topic','topik','bab','materi','babTopik','bab_topik'].forEach(k=>x[k]&&typeof x[k]==='object'&&walk(x[k],d+1));
  };
  ['siapguru_selected_topic','siapguru_tp_draft','siapguru_prota_draft','siapguru_prosem_draft','siapguru_atp_draft'].forEach(k=>walk(read(k)));
  try{walk(JSON.parse(sessionStorage.getItem('siapguru_selected_topic')||'null'))}catch(_){ }
  return out;
 };
 const fill=()=>{
  const old=q('sgPaTopic');if(!old)return;
  let select=old;
  if(old.tagName!=='SELECT'){
   select=document.createElement('select');select.id='sgPaTopic';select.className=old.className;select.style.cssText=old.style.cssText;old.replaceWith(select);
  }
  select.innerHTML='';
  const topics=collectTopics();
  const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent=topics.length?'Pilih BAB / Topik':'BAB / Topik belum tersedia';select.appendChild(placeholder);
  topics.forEach(v=>{const o=document.createElement('option');o.value=v;o.textContent=v;select.appendChild(o)});
  const selected=sessionStorage.getItem('siapguru_selected_topic');
  let preferred='';try{const x=JSON.parse(selected||'null');preferred=text(x?.bab||x?.topic||x?.topik||x?.materi)}catch(_){ }
  if(!preferred)preferred=text(select.dataset.value)||topics[0]||'';
  if(preferred&&topics.includes(preferred))select.value=preferred;
  const update=()=>{
   const topic=text(select.value),subject=text(q('sgPaSubject')?.value)||'mata pelajaran',n=room.querySelectorAll('#sgPaTpList .sg-pa-item').length;
   const set=(id,v)=>{const e=q(id);if(e&&!text(e.value)){e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}))}};
   if(topic){set('sgPaMaterial',`Materi ${subject}: konsep inti ${topic}, contoh kontekstual, latihan, dan rangkuman.`);set('sgPaLkpd',`LKPD ${topic}: kegiatan mengamati/mengeksplorasi, mengerjakan tugas sesuai TP, dan menuliskan hasil/refleksi.`);set('sgPaAssessment',`Asesmen formatif ${topic}: observasi proses, pertanyaan pemahaman, hasil tugas/LKPD, dan umpan balik terhadap TP${n?` (${n} TP)`:''}.`)}}
  ;select.addEventListener('change',update);update();
 };
 fill();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
})();