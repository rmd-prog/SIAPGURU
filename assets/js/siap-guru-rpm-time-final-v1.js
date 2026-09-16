(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_AUTO_V1__)return;
window.__SIAP_GURU_RPM_AUTO_V1__=true;
const START='2026-07-22',YEAR='2026/2027';
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const day=['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const room=()=>document.querySelector('.sg-rpm-room');
const val=(r,id)=>r?.querySelector('#'+id)?.value?.trim()||'';
function dates(r){
 const cls=val(r,'sgRPhaseClass').split('/').pop()?.trim()||'';
 const mapel=val(r,'sgRSubject');
 const days=window.SiapGuruRPMSchedule?.getDays?.(cls,mapel)||[1,2,3,4,5];
 const out=[];let d=new Date(START+'T12:00:00'),guard=0;
 while(out.length<12&&guard++<500){
  const iso=d.toISOString().slice(0,10);
  const ok=days.includes(d.getDay())&&(window.SiapGuruRPMCalendar?.isEffective?window.SiapGuruRPMCalendar.isEffective(YEAR,iso):d.getDay()>=1&&d.getDay()<=5);
  if(ok)out.push({iso,day:day[d.getDay()]});
  d.setDate(d.getDate()+1);
 }
 return out;
}
function plan(r){
 let box=r.querySelector('#sgRDatePlan');if(!box){box=document.createElement('div');box.id='sgRDatePlan';box.className='sg-rpm-card';const result=r.querySelector('#sgRResult');result?.parentNode?.insertBefore(box,result)}
 const p=read('siapguru_prota_draft')||{},s=read('siapguru_prosem_draft')||{},topic=val(r,'sgRTopic')||'-',list=dates(r);
 box.innerHTML=`<div class="sg-rpm-section"><div><span class="sg-rpm-label">MESIN TANGGAL RPM</span><h2>Jadwal Pertemuan Otomatis</h2></div><span class="sg-rpm-muted">Anchor 22 Juli 2026</span></div><p style="margin:0 0 8px"><b>BAB:</b> ${esc(topic)} • <b>Sumber:</b> PROTA/PROSEM → Jadwal → Kalender Efektif</p><div class="sg-rpm-grid">${list.map((x,i)=>`<div class="sg-rpm-step"><b>Pertemuan ${i+1}</b><div>${x.day}, ${x.iso}</div></div>`).join('')}</div><small style="display:block;margin-top:8px">Tanggal tidak lagi ditentukan oleh RPM Core lama. Sistem mulai dari 22 Juli 2026, mengikuti hari mapel pada jadwal, lalu melewati tanggal yang tidak efektif.</small>`;
}
function autoTopic(r){try{const x=JSON.parse(sessionStorage.getItem('siapguru_selected_topic')||'null');if(x&&window.SiapGuruMasterBab){const subject=r.querySelector('#sgRSubject');if(subject&&!subject.value)subject.value=x.mapel||x.subject||'';const pc=r.querySelector('#sgRPhaseClass');if(pc&&!pc.value)pc.value=[x.fase,x.kelas||x.class].filter(Boolean).join(' / ');const sem=r.querySelector('#sgRSemester');if(sem&&x.semester)sem.value=String(x.semester);const topic=r.querySelector('#sgRTopic');if(topic&&!topic.value)topic.value=x.bab||x.topic||'';const jp=r.querySelector('#sgRJP');if(jp&&x.jp)jp.value=x.jp}}catch(_){}}
function addAutoButton(r){if(r.querySelector('#sgRAuto'))return;const btn=document.createElement('button');btn.id='sgRAuto';btn.type='button';btn.className='sg-rpm-secondary';btn.textContent='⚡ Sinkronkan Otomatis';const actions=r.querySelector('.sg-rpm-actions');actions?.appendChild(btn);btn.onclick=()=>{autoTopic(r);r.querySelector('#sgRLoad')?.click();setTimeout(()=>plan(r),80)};}
function boot(){document.addEventListener('click',e=>{const r=room();if(!r)return;if(e.target?.id==='sgRBuild'||e.target?.id==='sgRLoad'){setTimeout(()=>plan(r),100)}},true);const tick=()=>{const r=room();if(r){autoTopic(r);addAutoButton(r);plan(r)}};setTimeout(tick,250);setTimeout(tick,800)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();