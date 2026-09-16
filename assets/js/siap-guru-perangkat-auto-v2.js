(()=>{
const boot=()=>{
 const room=document.querySelector('.sg-perangkat-room'); if(!room)return;
 if(window.__sgPerangkatAutoV2Booted===room)return; window.__sgPerangkatAutoV2Booted=room;
 const q=id=>room.querySelector('#'+id);
 const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
 const text=v=>String(v??'').trim();
 const esc=s=>text(s).replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[m]));
 const collectRecords=()=>{
  const out=[];
  const add=x=>{if(!x||typeof x!=='object')return;const topic=text(x.topic||x.topik||x.bab||x.babTopik||x.bab_topik||x.materi||x.materiPokok||x.judulBab||x.judulTopik||x.chapter||x.unit);const tp=text(x.text||x.tp||x.tujuan||x.tujuanPembelajaran);if(topic||tp)out.push({topic,tp,jp:Number(x.jp||x.alokasiJp||x.alokasi||x.hours||0)||0,element:text(x.element||x.elemen||x.cpElement),period:text(x.period||x.waktu||x.minggu),material:text(x.material||x.materi||x.materiPokok),media:text(x.media),source:text(x.source||x.sumber||x.sumberBelajar)});};
  const walk=(x,d=0)=>{if(!x||d>7)return;if(Array.isArray(x)){x.forEach(v=>walk(v,d+1));return}if(typeof x!=='object')return;add(x);['items','rows','data','tp','lessons','chapters','topics'].forEach(k=>x[k]&&walk(x[k],d+1));};
  ['siapguru_tp_draft','siapguru_prota_draft','siapguru_prosem_draft','siapguru_atp_draft'].forEach(k=>walk(read(k)));
  try{walk(JSON.parse(sessionStorage.getItem('siapguru_selected_topic')||'null'))}catch(_){ }
  return out;
 };
 const contextKey=t=>text(t)||'__tanpa_bab__';
 const loadContexts=()=>read('siapguru_perangkat_bab_context_v1')||{};
 const saveCurrent=()=>{const sel=q('sgPaTopic');if(!sel)return;const topic=text(sel.value);if(!topic)return;const db=loadContexts();db[contextKey(topic)]={topic,material:text(q('sgPaMaterial')?.value),media:text(q('sgPaMedia')?.value),source:text(q('sgPaSource')?.value),notes:text(q('sgPaNotes')?.value),lkpd:text(q('sgPaLkpd')?.value),assessment:text(q('sgPaAssessment')?.value),differentiation:text(q('sgPaDifferentiation')?.value),followup:text(q('sgPaFollowup')?.value)};localStorage.setItem('siapguru_perangkat_bab_context_v1',JSON.stringify(db));};
 const topics=()=>{const out=[];collectRecords().forEach(r=>{if(r.topic&&!out.includes(r.topic))out.push(r.topic)});return out;};
 const applyTopic=topic=>{
  topic=text(topic);if(!topic)return;
  saveCurrent();
  try{sessionStorage.setItem('siapguru_selected_topic',JSON.stringify({topic}))}catch(_){ }
  const records=collectRecords().filter(r=>r.topic===topic);
  const tp=records.filter((r,i,a)=>r.tp&&a.findIndex(z=>z.tp===r.tp)===i);
  const jp=Math.max(1,tp.reduce((n,r)=>n+(r.jp||0),0)||records.reduce((n,r)=>n+(r.jp||0),0)||2);
  const db=loadContexts(),saved=db[contextKey(topic)]||{};
  const first=tp[0]||records[0]||{};
  const set=(id,v)=>{const el=q(id);if(el){el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}))}};
  set('sgPaTopic',topic);
  set('sgPaJP',jp);
  set('sgPaMaterial',saved.material||first.material||`Materi pembelajaran: ${topic}.\nFokus materi disesuaikan dengan tujuan pembelajaran pada BAB ini.`);
  set('sgPaMedia',saved.media||first.media||'Buku teks, media visual, LKPD, dan media pembelajaran yang relevan.');
  set('sgPaSource',saved.source||first.source||'Buku teks/SIBI, lingkungan sekitar, dan sumber digital yang relevan.');
  set('sgPaNotes',saved.notes||'');
  set('sgPaLkpd',saved.lkpd||`LKPD ${topic}: kegiatan memahami konsep, latihan terarah, dan tugas penerapan sesuai TP BAB ini.`);
  set('sgPaAssessment',saved.assessment||`Asesmen ${topic}: cek pemahaman, tugas/unjuk kerja, dan asesmen sesuai tujuan pembelajaran BAB ini.`);
  set('sgPaDifferentiation',saved.differentiation||`Diferensiasi ${topic}: dukungan bertahap bagi peserta didik yang memerlukan bantuan dan pengayaan bagi yang sudah mencapai tujuan.`);
  set('sgPaFollowup',saved.followup||`Remedial dan pengayaan ${topic} berdasarkan hasil asesmen dan ketercapaian TP.`);
  const list=q('sgPaTpList');if(list)list.innerHTML=tp.length?tp.map((r,i)=>`<div class="sg-pa-item"><div><strong>TP ${i+1}. ${esc(r.tp)}</strong><small>Elemen: ${esc(r.element||'-')} · ${r.jp||0} JP${r.period?' · '+esc(r.period):''}</small></div></div>`).join(''):'<div class="sg-pa-note">Belum ada TP khusus untuk BAB ini.</div>';
  window.__sgPerangkatActiveTopic=topic;
 };
 const replaceTopic=()=>{
  let sel=q('sgPaTopic');if(!sel)return 0;
  if(sel.tagName!=='SELECT'){
   const old=text(sel.value),next=document.createElement('select');next.id='sgPaTopic';next.className=sel.className;next.style.cssText=sel.style.cssText;next.setAttribute('aria-label','BAB / Topik');sel.replaceWith(next);sel=next;if(old)sel.dataset.previousValue=old;
  }
  const list=topics(),active=text(sel.value)||text(sel.dataset.previousValue)||text(window.__sgPerangkatActiveTopic);
  sel.innerHTML='<option value="">Pilih BAB / Topik...</option>'+list.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
  if(active&&list.includes(active))sel.value=active;else if(!sel.value&&list.length)sel.value=list[0];
  delete sel.dataset.previousValue;
  if(!sel.dataset.sgBound){sel.dataset.sgBound='1';sel.addEventListener('change',()=>{window.__sgPerangkatActiveTopic='';applyTopic(sel.value)})}
  if(sel.value&&sel.value!==window.__sgPerangkatActiveTopic)applyTopic(sel.value);
  return list.length;
 };
 const run=()=>{replaceTopic();if(!q('sgPaTopic')?.value&&!window.__sgTopicRetryV2){let i=0;window.__sgTopicRetryV2=setInterval(()=>{i++;if(replaceTopic()||i>=20){clearInterval(window.__sgTopicRetryV2);window.__sgTopicRetryV2=null}},500)}};
 run();
 new MutationObserver(()=>replaceTopic()).observe(room,{childList:true,subtree:true});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
})();