(()=>{
const ROOM='.sg-perangkat-room';
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const text=v=>String(v??'').trim();
const esc=s=>text(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const pick=(x,...keys)=>{for(const k of keys){if(x&&x[k]!=null&&text(x[k]))return x[k]}return ''};
const records=()=>{
 const out=[];
 const add=(x,inheritedTopic='',inheritedSemester='')=>{
  if(!x||typeof x!=='object')return;
  const topic=text(pick(x,'topic','topik','bab','babTopik','bab_topik','judulBab','judulTopik','chapter','unit'))||inheritedTopic;
  const tp=text(pick(x,'text','tp','tujuan','tujuanPembelajaran'));
  const material=text(pick(x,'material','materi','materiPokok','bahanAjar'));
  const semester=text(pick(x,'semester','sem'))||inheritedSemester;
  if(topic||tp||material)out.push({topic,tp,material,media:text(pick(x,'media')),source:text(pick(x,'source','sumber','sumberBelajar')),element:text(pick(x,'element','elemen','cpElement')),jp:Number(pick(x,'jp','alokasiJp','alokasi','hours')||0)||0,semester,period:text(pick(x,'period','waktu','minggu'))});
  return {topic,semester};
 };
 const walk=(x,d=0,parentTopic='',parentSemester='')=>{
  if(!x||d>10)return;
  if(Array.isArray(x)){x.forEach(v=>walk(v,d+1,parentTopic,parentSemester));return}
  if(typeof x!=='object')return;
  const meta=add(x,parentTopic,parentSemester)||{topic:parentTopic,semester:parentSemester};
  const nextTopic=meta.topic||parentTopic,nextSemester=meta.semester||parentSemester;
  ['items','rows','data','tp','lessons','chapters','topics','records'].forEach(k=>{if(x[k])walk(x[k],d+1,nextTopic,nextSemester)});
 };
 ['siapguru_tp_draft','siapguru_prota_draft','siapguru_prosem_draft','siapguru_atp_draft'].forEach(k=>walk(read(k)));
 return out;
};
const ctxKey=t=>text(t)||'__tanpa_bab__';
const contexts=()=>read('siapguru_perangkat_bab_context_v1')||{};
const saveContext=room=>{
 const topic=text(room.querySelector('#sgPaTopic')?.value);if(!topic)return;
 const db=contexts();db[ctxKey(topic)]={topic,material:text(room.querySelector('#sgPaMaterial')?.value),media:text(room.querySelector('#sgPaMedia')?.value),source:text(room.querySelector('#sgPaSource')?.value),notes:text(room.querySelector('#sgPaNotes')?.value),lkpd:text(room.querySelector('#sgPaLkpd')?.value),assessment:text(room.querySelector('#sgPaAssessment')?.value),differentiation:text(room.querySelector('#sgPaDifferentiation')?.value),followup:text(room.querySelector('#sgPaFollowup')?.value)};localStorage.setItem('siapguru_perangkat_bab_context_v1',JSON.stringify(db));
};
const topicList=rs=>{const a=[];rs.forEach(r=>{if(r.topic&&!a.includes(r.topic))a.push(r.topic)});return a};
const apply=(room,topic)=>{
 topic=text(topic);if(!topic)return;
 const rs=records(), same=rs.filter(r=>r.topic===topic), base=same.length?same:rs.filter(r=>!r.topic);
 const tp=[];base.forEach(r=>{if(r.tp&&!tp.some(x=>x.tp===r.tp))tp.push(r)});
 const db=contexts(),saved=db[ctxKey(topic)]||{},first=base[0]||{};
 const jp=Math.max(1,tp.reduce((n,r)=>n+(r.jp||0),0)||base.reduce((n,r)=>n+(r.jp||0),0)||2);
 const material=saved.material||first.material||`Materi pembelajaran ${topic}, disusun sesuai TP pada BAB ini.`;
 const media=saved.media||first.media||'Buku teks/SIBI, media visual, LKPD, dan media pembelajaran yang relevan.';
 const source=saved.source||first.source||'Buku teks/SIBI, lingkungan sekitar, dan sumber digital yang relevan.';
 const lkpd=saved.lkpd||`LKPD ${topic}: kegiatan memahami konsep, latihan terarah, dan penerapan sesuai TP.`;
 const assessment=saved.assessment||`Asesmen ${topic}: cek pemahaman, tugas/unjuk kerja, dan asesmen sesuai TP.`;
 const diff=saved.differentiation||`Diferensiasi ${topic}: dukungan bertahap bagi peserta didik yang memerlukan bantuan dan pengayaan bagi yang sudah mencapai tujuan.`;
 const follow=saved.followup||`Remedial dan pengayaan ${topic} berdasarkan hasil asesmen dan ketercapaian TP.`;
 const set=(id,v)=>{const e=room.querySelector('#'+id);if(e)e.value=v};
 set('sgPaTopic',topic);set('sgPaJP',jp);set('sgPaMaterial',material);set('sgPaMedia',media);set('sgPaSource',source);set('sgPaNotes',saved.notes||'');set('sgPaLkpd',lkpd);set('sgPaAssessment',assessment);set('sgPaDifferentiation',diff);set('sgPaFollowup',follow);
 const list=room.querySelector('#sgPaTpList');
 if(list)list.innerHTML=tp.length?tp.map((r,i)=>`<div class="sg-pa-item"><div><strong>TP ${i+1}. ${esc(r.tp)}</strong><small>Elemen: ${esc(r.element||'-')} · ${r.jp||0} JP${r.period?' · '+esc(r.period):''}</small></div></div>`).join(''):'<div class="sg-pa-note">Belum ada TP khusus untuk BAB ini.</div>';
 ['sgPaMaterial','sgPaMedia','sgPaSource','sgPaNotes','sgPaLkpd','sgPaAssessment','sgPaDifferentiation','sgPaFollowup','sgPaJP'].forEach(id=>room.querySelector('#'+id)?.dispatchEvent(new Event('input',{bubbles:true})));
 window.__sgPerangkatActiveTopic=topic;
};
const boot=()=>{
 const room=document.querySelector(ROOM);if(!room||window.__sgPerangkatAutoV2Booted===room)return;window.__sgPerangkatAutoV2Booted=room;
 const sel=room.querySelector('#sgPaTopic');if(!sel)return;
 const rs=records(),topics=topicList(rs);
 if(sel.tagName!=='SELECT'){
  const old=text(sel.value),next=document.createElement('select');next.id='sgPaTopic';next.className=sel.className;next.style.cssText=sel.style.cssText;next.setAttribute('aria-label','BAB / Topik');sel.replaceWith(next);
 }
 const s=room.querySelector('#sgPaTopic'),current=text(s.value)||text(s.dataset.previousValue);
 s.innerHTML='<option value="">Pilih BAB / Topik...</option>'+topics.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
 if(current&&topics.includes(current))s.value=current;else if(topics.length)s.value=topics[0];
 s.addEventListener('change',()=>{saveContext(room);apply(room,s.value)});
 ['sgPaMaterial','sgPaMedia','sgPaSource','sgPaNotes','sgPaLkpd','sgPaAssessment','sgPaDifferentiation','sgPaFollowup'].forEach(id=>room.querySelector('#'+id)?.addEventListener('input',()=>saveContext(room)));
 if(s.value)apply(room,s.value);
 const reload=room.querySelector('#sgPaReload');if(reload&&!reload.dataset.sgBound){reload.dataset.sgBound='1';reload.addEventListener('click',()=>{window.__sgPerangkatAutoV2Booted=null;boot()})}
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
})();