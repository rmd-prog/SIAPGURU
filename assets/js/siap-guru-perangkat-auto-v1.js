(()=>{
const boot=()=>{
 const room=document.querySelector('.sg-perangkat-room');
 if(!room)return;
 const q=id=>room.querySelector('#'+id);
 const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
 const text=v=>String(v??'').trim();
 const arr=p=>{if(!p)return[];const a=Array.isArray(p)?p:(p.items||p.rows||p.data||p.tp||p.lessons||[]);return Array.isArray(a)?a:[]};
 const collectTopics=()=>{
  const out=[];
  const add=v=>{const s=text(v);if(s&&!out.includes(s))out.push(s)};
  const walk=(x,depth=0)=>{
   if(!x||depth>4)return;
   if(Array.isArray(x)){x.forEach(v=>walk(v,depth+1));return}
   if(typeof x!=='object')return;
   ['topic','topik','bab','babTopik','bab_topik','materi','materiPokok','judulBab','judulTopik','chapter','unit'].forEach(k=>add(x[k]));
   ['topic','topik','bab','materi','babTopik','bab_topik'].forEach(k=>{if(x[k]&&typeof x[k]==='object')walk(x[k],depth+1)});
   ['items','rows','data','tp','lessons','chapters','topics'].forEach(k=>{if(x[k])walk(x[k],depth+1)});
  };
  ['siapguru_selected_topic','siapguru_tp_draft','siapguru_prota_draft','siapguru_prosem_draft','siapguru_atp_draft'].forEach(k=>{const v=read(k);walk(v)});
  try{walk(JSON.parse(sessionStorage.getItem('siapguru_selected_topic')||'null'))}catch(_){ }
  return out;
 };
 const setIfBlank=(id,val)=>{const e=q(id);if(e&&!text(e.value)&&text(val)){e.value=val;e.dispatchEvent(new Event('input',{bubbles:true}));return true}return false};
 const refreshTopic=()=>{
  const topic=q('sgPaTopic');if(!topic)return;
  const topics=collectTopics();
  let dl=room.querySelector('#sgPaTopicList');
  if(!dl){dl=document.createElement('datalist');dl.id='sgPaTopicList';topic.setAttribute('list',dl.id);topic.parentNode?.appendChild(dl)}
  dl.innerHTML=topics.map(x=>`<option value="${x.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}"></option>`).join('');
  let selected=null;try{selected=JSON.parse(sessionStorage.getItem('siapguru_selected_topic')||'null')}catch(_){ }
  const selectedTopic=text(selected?.bab||selected?.topic||selected?.topik||selected?.materi);
  if(selectedTopic&&!text(topic.value)){topic.value=selectedTopic;topic.dispatchEvent(new Event('change',{bubbles:true}))}
  if(!text(topic.value)&&topics.length){topic.value=topics[0];topic.dispatchEvent(new Event('change',{bubbles:true}))}
  return topics.length;
 };
 const makeSuggestions=()=>{
  const topicText=text(q('sgPaTopic')?.value)||collectTopics()[0]||'topik pembelajaran';
  const subject=text(q('sgPaSubject')?.value)||'mata pelajaran';
  const tpCount=room.querySelectorAll('#sgPaTpList .sg-pa-item').length;
  setIfBlank('sgPaMaterial',`Materi ${subject}: konsep inti ${topicText}, contoh kontekstual, latihan, dan rangkuman.`);
  setIfBlank('sgPaLkpd',`LKPD ${topicText}: kegiatan mengamati/mengeksplorasi, mengerjakan tugas sesuai TP, dan menuliskan hasil/refleksi.`);
  setIfBlank('sgPaAssessment',`Asesmen formatif ${topicText}: observasi proses, pertanyaan pemahaman, hasil tugas/LKPD, dan umpan balik terhadap TP${tpCount?` (${tpCount} TP)`:''}.`);
  setIfBlank('sgPaDifferentiation','Diferensiasi berdasarkan kesiapan belajar: dukungan bertahap bagi peserta didik yang memerlukan bantuan dan pengayaan bagi yang sudah mencapai tujuan.');
  setIfBlank('sgPaFollowup','Remedial untuk TP yang belum tercapai dan pengayaan melalui tugas/aktivitas lanjutan bagi peserta didik yang sudah mencapai tujuan.');
 };
 const badge=()=>{const host=q('sgPaSources');if(!host||host.querySelector('[data-auto-v1]'))return;const b=document.createElement('span');b.className='sg-pa-chip ok';b.dataset.autoV1='1';b.textContent='✓ Otomatisasi PERANGKAT aktif';host.appendChild(b)};
 const run=()=>{const n=refreshTopic();makeSuggestions();badge();if(!n&&window.__sgPerangkatTopicTimer==null){let tries=0;window.__sgPerangkatTopicTimer=setInterval(()=>{tries++;const got=refreshTopic();makeSuggestions();if(got||tries>=20){clearInterval(window.__sgPerangkatTopicTimer);window.__sgPerangkatTopicTimer=null}},500)}};
 run();
 q('sgPaTopic')?.addEventListener('change',makeSuggestions);
 q('sgPaTopic')?.addEventListener('input',()=>setTimeout(makeSuggestions,0));
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
})();
