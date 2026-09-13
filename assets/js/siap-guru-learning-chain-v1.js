(()=>{
/* SIAP GURU — learning chain bridge
   TP → RPM → LKPD → Materi
   Local only; no token/API, D1, Worker, login, or navigation changes. */
const read=(k,store=localStorage)=>{try{return JSON.parse(store.getItem(k)||'null')}catch(_){return null}};
const fill=(root,id,value,force=false)=>{const el=root.querySelector('#'+id);if(!el||value==null||value==='')return;if(force||!String(el.value||'').trim()||el.value==='-')el.value=value};
const sync=()=>{
 const room=document.querySelector('.sg-room-view');if(!room)return;
 const topic=read('siapguru_selected_topic',sessionStorage)||{};
 const tp=read('siapguru_tp_draft')||{};
 const rpm=read('siapguru_rpm_generated',sessionStorage)||read('siapguru_rpm_draft')||{};
 const source=Object.assign({},tp,rpm,topic);
 if(room.classList.contains('sg-lkpd-room')){
   fill(room,'sgLSubject',source.subject||source.mapel);fill(room,'sgLPhase',source.phase);fill(room,'sgLClass',source.class||source.kelas);fill(room,'sgLSemester',String(source.semester||'1'));fill(room,'sgLTopic',source.topic||source.bab);fill(room,'sgLJP',source.jp);
 }
 if(room.classList.contains('sg-materi-room')){
   fill(room,'sgMSubject',source.subject||source.mapel);fill(room,'sgMPhase',source.phase);fill(room,'sgMClass',source.class||source.kelas);fill(room,'sgMSemester',String(source.semester||'1'));fill(room,'sgMTopic',source.topic||source.bab);fill(room,'sgMJP',source.jp);
 }
 if(room.classList.contains('sg-rpm-room')){
   fill(room,'sgRSubject',source.subject||source.mapel);fill(room,'sgRPhase',source.phase);fill(room,'sgRClass',source.class||source.kelas);fill(room,'sgRSemester',String(source.semester||'1'));fill(room,'sgRTopic',source.topic||source.bab);fill(room,'sgRJP',source.jp);
 }
};
const boot=()=>{sync();setTimeout(sync,150);setTimeout(sync,500)};
document.addEventListener('click',()=>setTimeout(boot,80),true);
document.addEventListener('siapguru:topic-selected',()=>setTimeout(sync,50));
new MutationObserver(()=>sync()).observe(document.querySelector('.main-content')||document.body,{childList:true,subtree:true});
})();
