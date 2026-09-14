(()=>{
/* SIAP GURU — learning chain bridge v4
   TP → PROTA → RPM → LKPD → Materi
   Adds annual multi-BAB TP aggregation from Master BAB.
   Local only; no token/API, D1, Worker, login, or navigation changes. */
const read=(k,store=localStorage)=>{try{return JSON.parse(store.getItem(k)||'null')}catch(_){return null}};
const norm=v=>String(v??'').trim().toLowerCase();
const sameTopic=(a,b)=>{if(!a||!b)return true;return norm(a)===norm(b)};
const fill=(root,id,value,force=false)=>{const el=root.querySelector('#'+id);if(!el||value==null||value==='')return;if(force||!String(el.value||'').trim()||el.value==='-')el.value=value};
const autoLoad=room=>{if(!room)return;const tp=read('siapguru_tp_draft')||{};const selected=read('siapguru_selected_topic',sessionStorage)||{};const downstream=room.classList.contains('sg-lkpd-room')||room.classList.contains('sg-materi-room');if(downstream&&selected.bab&&tp.topic&&!sameTopic(selected.bab,tp.topic))return;const ids=room.classList.contains('sg-lkpd-room')?['sgLLoad']:room.classList.contains('sg-materi-room')?['sgMLoad']:[];ids.forEach(id=>{const b=room.querySelector('#'+id);if(b&&!b.dataset.chainAuto){b.dataset.chainAuto='1';setTimeout(()=>b.click(),120)}})};
const annualTp=()=>{
 const room=document.querySelector('.sg-tp-room');if(!room||room.querySelector('#sgTpAllBab'))return;
 const ref=room.querySelector('#sgTpImport');if(!ref)return;
 const b=document.createElement('button');b.id='sgTpAllBab';b.type='button';b.className='sg-tp-secondary';b.textContent='Ambil Semua BAB';ref.insertAdjacentElement('afterend',b);
 b.addEventListener('click',()=>{
  const master=read('siapguru_master_bab_v1')||[];
  const subject=room.querySelector('#sgTpSubject')?.value?.trim()||'';
  const klass=room.querySelector('#sgTpClass')?.value?.trim()||'';
  const phase=room.querySelector('#sgTpPhase')?.value?.trim()||'';
  if(!master.length){alert('Master BAB belum tersedia. Buka Master BAB / Topik sekali agar bank BAB dimuat.');return}
  const rows=master.filter(x=>String(x.mapel||'').trim()===subject&&String(x.kelas||'').trim()===klass&&(!phase||String(x.fase||'').trim()===phase));
  if(!rows.length){alert(`Belum ada Master BAB untuk ${subject} kelas ${klass}.`);return}
  const verbs=['memahami','mengidentifikasi','menerapkan','mengomunikasikan'];
  const items=[];
  rows.forEach((r,bi)=>{
   const bab=String(r.bab||`Bab ${bi+1}`).trim();
   const sem=String(r.semester||((bi<Math.ceil(rows.length/2))?'1':'2'))==='2'?'2':'1';
   const base=Math.max(1,Math.round((Number(r.jp)||8)/4));
   verbs.forEach((v,i)=>items.push({id:`tp-bab-${r.id||bi}-${i}-${Date.now()}`,text:`BAB ${bi+1} — ${bab}: Peserta didik mampu ${v} konsep, prosedur, dan penerapan pada materi ${bab} melalui kegiatan belajar yang kontekstual dan bermakna.`,element:'',cp:'',jp:base,semester:sem,topic:bab,acdId:r.id||''}));
  });
  const payload={name:`TP ${subject} Kelas ${klass} — 1 Tahun`,subject,phase,class:klass,group:'umum',semester:'1',topic:'SEMUA BAB / 1 TAHUN',totalJp:items.reduce((n,x)=>n+x.jp,0),items};
  localStorage.setItem('siapguru_tp_draft',JSON.stringify(payload));
  sessionStorage.removeItem('siapguru_selected_topic');
  const tpLink=[...document.querySelectorAll('.sg-topnav-link')].find(x=>x.textContent.trim()==='TP');
  room.remove();window.__sgTpBoot=0;
  setTimeout(()=>tpLink?.click(),60);
 });
};
const sync=()=>{
 const room=document.querySelector('.sg-room-view');if(!room)return;
 annualTp();
 const topic=read('siapguru_selected_topic',sessionStorage)||{};const tp=read('siapguru_tp_draft')||{};const rpm=read('siapguru_rpm_generated',sessionStorage)||read('siapguru_rpm_draft')||{};const topicMatchesTp=!topic.bab||!tp.topic||sameTopic(topic.bab,tp.topic);const safeTp=topicMatchesTp?tp:{};const source=Object.assign({},safeTp,rpm,topic);
 if(room.classList.contains('sg-lkpd-room')){fill(room,'sgLSubject',source.subject||source.mapel);fill(room,'sgLPhase',source.phase);fill(room,'sgLClass',source.class||source.kelas);fill(room,'sgLSemester',String(source.semester||'1'));fill(room,'sgLTopic',source.topic||source.bab);fill(room,'sgLJP',source.jp)}
 if(room.classList.contains('sg-materi-room')){fill(room,'sgMSubject',source.subject||source.mapel);fill(room,'sgMPhase',source.phase);fill(room,'sgMClass',source.class||source.kelas);fill(room,'sgMSemester',String(source.semester||'1'));fill(room,'sgMTopic',source.topic||source.bab);fill(room,'sgMJP',source.jp)}
 if(room.classList.contains('sg-rpm-room')){fill(room,'sgRSubject',source.subject||source.mapel);fill(room,'sgRPhase',source.phase);fill(room,'sgRClass',source.class||source.kelas);fill(room,'sgRSemester',String(source.semester||'1'));fill(room,'sgRTopic',source.topic||source.bab);fill(room,'sgRJP',source.jp)}
 autoLoad(room);
};
const boot=()=>{sync();setTimeout(sync,150);setTimeout(sync,500)};
document.addEventListener('click',()=>setTimeout(boot,80),true);document.addEventListener('siapguru:topic-selected',()=>setTimeout(sync,50));new MutationObserver(()=>sync()).observe(document.querySelector('.main-content')||document.body,{childList:true,subtree:true});
})();