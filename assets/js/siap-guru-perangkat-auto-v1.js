(()=>{
const boot=()=>{
 const room=document.querySelector('.sg-perangkat-room');
 if(!room)return;
 const q=id=>room.querySelector('#'+id);
 const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
 const text=v=>String(v??'').trim();
 const collectTopics=()=>{
  const out=[];
  const add=v=>{const s=text(v);if(s&&!out.includes(s))out.push(s)};
  const walk=(x,depth=0)=>{
   if(!x||depth>5)return;
   if(Array.isArray(x)){x.forEach(v=>walk(v,depth+1));return}
   if(typeof x!=='object')return;
   ['topic','topik','bab','babTopik','bab_topik','materi','materiPokok','judulBab','judulTopik','chapter','unit'].forEach(k=>add(x[k]));
   ['items','rows','data','tp','lessons','chapters','topics'].forEach(k=>{if(x[k])walk(x[k],depth+1)});
   ['topic','topik','bab','materi','babTopik','bab_topik'].forEach(k=>{if(x[k]&&typeof x[k]==='object')walk(x[k],depth+1)});
  };
  ['siapguru_selected_topic','siapguru_tp_draft','siapguru_prota_draft','siapguru_prosem_draft','siapguru_atp_draft'].forEach(k=>walk(read(k)));
  try{walk(JSON.parse(sessionStorage.getItem('siapguru_selected_topic')||'null'))}catch(_){ }
  return out;
 };
 const fillSuggestions=()=>{
  const topic=text(q('sgPaTopic')?.value)||collectTopics()[0]||'topik pembelajaran';
  const subject=text(q('sgPaSubject')?.value)||'mata pelajaran';
  const set=(id,val)=>{const e=q(id);if(e&&!text(e.value)){e.value=val;e.dispatchEvent(new Event('input',{bubbles:true}))}};
  const n=room.querySelectorAll('#sgPaTpList .sg-pa-item').length;
  set('sgPaMaterial',`Materi ${subject}: konsep inti ${topic}, contoh kontekstual, latihan, dan rangkuman.`);
  set('sgPaLkpd',`LKPD ${topic}: kegiatan mengamati/mengeksplorasi, mengerjakan tugas sesuai TP, dan menuliskan hasil/refleksi.`);
  set('sgPaAssessment',`Asesmen formatif ${topic}: observasi proses, pertanyaan pemahaman, hasil tugas/LKPD, dan umpan balik terhadap TP${n?` (${n} TP)`:''}.`);
  set('sgPaDifferentiation','Diferensiasi berdasarkan kesiapan belajar: dukungan bertahap bagi peserta didik yang memerlukan bantuan dan pengayaan bagi yang sudah mencapai tujuan.');
  set('sgPaFollowup','Remedial untuk TP yang belum tercapai dan pengayaan melalui tugas/aktivitas lanjutan bagi peserta didik yang sudah mencapai tujuan.');
 };
 const attachDropdown=()=>{
  const topic=q('sgPaTopic');if(!topic)return;
  topic.setAttribute('autocomplete','off');
  const topics=collectTopics();
  let wrap=topic.parentElement?.querySelector('.sg-pa-topic-picker');
  if(!wrap){
   wrap=document.createElement('div');wrap.className='sg-pa-topic-picker';wrap.style='position:relative;width:100%';
   topic.parentNode.insertBefore(wrap,topic);wrap.appendChild(topic);
  }
  let list=wrap.querySelector('.sg-pa-topic-options');
  if(!list){
   list=document.createElement('div');list.className='sg-pa-topic-options';list.style='display:none;position:absolute;left:0;right:0;top:100%;z-index:9999;background:#fff;border:1px solid #dbe2ea;border-radius:10px;box-shadow:0 8px 24px rgba(15,23,42,.12);max-height:240px;overflow:auto';wrap.appendChild(list);
  }
  const render=()=>{
   const all=collectTopics();const term=text(topic.value).toLowerCase();
   const filtered=all.filter(x=>!term||x.toLowerCase().includes(term));
   list.innerHTML=filtered.map(x=>`<button type="button" class="sg-pa-topic-option" data-value="${x.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}">${x.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</button>`).join('');
   list.querySelectorAll('button').forEach(b=>{b.style='display:block;width:100%;border:0;background:#fff;text-align:left;padding:10px 12px;cursor:pointer;font:inherit;color:#172033';b.addEventListener('mouseenter',()=>b.style.background='#f1f5f9');b.addEventListener('mouseleave',()=>b.style.background='#fff');b.addEventListener('click',()=>{topic.value=b.dataset.value||'';list.style.display='none';topic.dispatchEvent(new Event('change',{bubbles:true}));topic.dispatchEvent(new Event('input',{bubbles:true}));fillSuggestions()})});
   list.style.display=filtered.length?'block':'none';
  };
  topic.addEventListener('focus',render,{once:true});
  topic.addEventListener('click',render);
  topic.addEventListener('input',render);
  document.addEventListener('click',e=>{if(!wrap.contains(e.target))list.style.display='none'},{once:false});
  if(topics.length&&!text(topic.value)){topic.value=topics[0];topic.dispatchEvent(new Event('change',{bubbles:true}))}
  fillSuggestions();
 };
 attachDropdown();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
})();