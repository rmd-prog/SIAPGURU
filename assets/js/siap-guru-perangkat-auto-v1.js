(()=>{
const boot=()=>{
 const room=document.querySelector('.sg-perangkat-room');
 if(!room||room.dataset.perangkatAutoV1)return;
 room.dataset.perangkatAutoV1='1';
 const q=id=>room.querySelector('#'+id);
 const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
 const text=v=>String(v??'').trim();
 const tp=read('siapguru_tp_draft');
 const prota=read('siapguru_prota_draft');
 const prosem=read('siapguru_prosem_draft');
 const raw=[...(Array.isArray(tp)?tp:(tp?.items||tp?.rows||tp?.data||[])),...(Array.isArray(prota)?prota:(prota?.items||prota?.rows||prota?.data||[])),...(Array.isArray(prosem)?prosem:(prosem?.items||prosem?.rows||prosem?.data||[]))];
 const topics=[...new Set(raw.map(x=>text(x?.topic||x?.bab||x?.topik||x?.materi)).filter(Boolean))];
 const topic=q('sgPaTopic');
 if(topic&&topics.length){
  let dl=room.querySelector('#sgPaTopicList');
  if(!dl){dl=document.createElement('datalist');dl.id='sgPaTopicList';topic.setAttribute('list',dl.id);topic.parentNode?.appendChild(dl)}
  dl.innerHTML=topics.map(x=>`<option value="${x.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}"></option>`).join('');
 }
 const value=id=>text(q(id)?.value);
 const setIfBlank=(id,val)=>{const e=q(id);if(e&&!value(id)){e.value=val;return true}return false};
 const makeSuggestions=()=>{
  const topicText=value('sgPaTopic')||topics[0]||'topik pembelajaran';
  const subject=value('sgPaSubject')||'mata pelajaran';
  const tpCount=room.querySelectorAll('#sgPaTpList .sg-pa-item').length;
  setIfBlank('sgPaMaterial',`Materi ${subject}: konsep inti ${topicText}, contoh kontekstual, latihan, dan rangkuman.`);
  setIfBlank('sgPaLkpd',`LKPD ${topicText}: kegiatan mengamati/mengeksplorasi, mengerjakan tugas sesuai TP, dan menuliskan hasil/refleksi.`);
  setIfBlank('sgPaAssessment',`Asesmen formatif ${topicText}: observasi proses, pertanyaan pemahaman, hasil tugas/LKPD, dan umpan balik terhadap TP${tpCount?` (${tpCount} TP)`:''}.`);
  setIfBlank('sgPaDifferentiation','Diferensiasi berdasarkan kesiapan belajar: dukungan bertahap bagi peserta didik yang memerlukan bantuan dan pengayaan bagi yang sudah mencapai tujuan.');
  setIfBlank('sgPaFollowup','Remedial untuk TP yang belum tercapai dan pengayaan melalui tugas/aktivitas lanjutan bagi peserta didik yang sudah mencapai tujuan.');
 };
 const badge=()=>{
  const host=q('sgPaSources');
  if(!host||host.querySelector('[data-auto-v1]'))return;
  const b=document.createElement('span');b.className='sg-pa-chip ok';b.dataset.autoV1='1';b.textContent='✓ Otomatisasi PERANGKAT aktif';host.appendChild(b);
 };
 const run=()=>{if(!value('sgPaTopic')&&topics.length){const e=q('sgPaTopic');e.value=topics[0];e.dispatchEvent(new Event('input',{bubbles:true}))}makeSuggestions();badge()};
 run();
 topic?.addEventListener('change',makeSuggestions);
 topic?.addEventListener('input',()=>setTimeout(makeSuggestions,0));
};
const tick=()=>boot();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
new MutationObserver(tick).observe(document.body,{childList:true,subtree:true});
})();
