(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_DATE_BRIDGE_V6__)return;
window.__SIAP_GURU_RPM_DATE_BRIDGE_V6__=true;
const S=()=>window.SiapGuruRPMSchedule,C=()=>window.SiapGuruRPMCalendar;
const $=(root,id)=>root?.querySelector('#'+id);
const norm=s=>String(s??'').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const cls=v=>String(v||'').match(/\b([1-6])\b/)?.[1]||'';
const dayName=n=>['','Senin','Selasa','Rabu','Kamis','Jumat'][n]||'';
const semOf=x=>String(x?.semester||x?.sem||1)==='2'?2:1;
const jp=x=>Number(x?.jp)||Number(x?.alokasi)||Number(x?.jam)||0;
const cleanBab=x=>{let b=norm(x?.bab);if(b&&!/^(materi|materi pembelajaran|pembelajaran)$/i.test(b))return b;let t=norm(x?.text);let m=t.match(/^(?:TP\s*)?(\d+)\.(\d+)/i)||t.match(/\bBAB\s*(\d+)\b/i);return m?'BAB '+m[1]:''};
const readProsem=()=>{try{return JSON.parse(localStorage.getItem('siapguru_prosem_draft')||'null')}catch(_){return null}};
function prosemGroups(x,mode){
 const p=readProsem();
 if(!p||!Array.isArray(p.items))return [];
 if(norm(p.subject)&&norm(p.subject).toLowerCase()!==norm(x.subject).toLowerCase())return [];
 const pc=norm(p.class||p.kelas),xc=norm(x.class);if(pc&&xc&&pc!==xc)return [];
 const sem=mode==='semester'?String(x.semester||'1'):'';
 const groups=[];
 p.items.filter(r=>!sem||String(semOf(r))===sem).forEach(r=>{
  const b=cleanBab(r);if(!b)return;
  let g=groups[groups.length-1];if(!g||g.bab!==b){g={bab:b,items:[],weeks:[]};groups.push(g)}
  g.items.push(r);
 });
 return groups.map(g=>{
  let cursor=0,weeks=[];
  for(const r of g.items){const n=Math.max(1,Math.ceil(jp(r)/4));for(let k=0;k<n;k++)weeks.push(cursor++);}
  return {...g,weeks:[...new Set(weeks)]};
 });
}
const monthFor=(semester,slot)=>semester===1?6+Math.floor(slot/4):Math.floor(slot/4);
const yearFor=(year,semester)=>Number(String(year||'2026/2027').slice(0,4))+(semester===2?1:0);
function weekDates(year,semester,slot,days,cal){
 const month=monthFor(semester,slot),y=yearFor(year,semester),week=slot%4;
 const first=1+week*7,last=Math.min(new Date(y,month+1,0).getDate(),first+6),out=[];
 for(let day=first;day<=last;day++){
  const d=new Date(y,month,day),n=d.getDay();
  const iso=`${y}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  if(days.includes(n)&&(!cal||cal.isEffective?.(`${String(year||'2026/2027')}`,iso)))out.push({date:iso,day:dayName(n),slot});
 }
 return out;
}
function planTopics(x,mode){
 const sched=S?.(),cal=C?.(),groups=prosemGroups(x,mode);if(!sched||!groups.length)return [];
 const days=sched.getDays(x.class,x.subject);if(!days.length)return [];
 const out=[];let meeting=1;
 groups.forEach(g=>{
  const sem=mode==='semester'?Number(x.semester||1):semOf(g.items[0]);
  const dates=[];g.weeks.forEach(slot=>weekDates(x.year,sem,slot,days,cal).forEach(r=>dates.push({...r,semester:sem})));
  const unique=[...new Map(dates.map(r=>[r.date,r])).values()];
  const total=Math.max(1,g.items.reduce((n,r)=>n+jp(r),0)||Number(x.jp)||2);
  let remaining=total;
  unique.forEach((r,i)=>{const left=unique.length-i,per=i===unique.length-1?remaining:Math.max(1,Math.ceil(remaining/left));remaining-=per;out.push({topic:g.bab,semester:sem,jp:per,meeting:meeting++,date:r.date,day:r.day,prosemWeek:r.slot%4+1});});
 });
 return out;
}
function mount(){
 const room=document.querySelector('.sg-rpm-room');if(!room)return false;
 if(room.querySelector('[data-rpm-date-bridge]'))return true;
 const host=room.querySelector('.sg-rpm-shell')||room,card=document.createElement('section');card.className='sg-rpm-card';card.dataset.rpmDateBridge='1';
 card.innerHTML=`<div class="sg-rpm-section"><div><span class="sg-rpm-label">RPM OTOMATIS</span><h2>Jadwal &amp; Tanggal Otomatis</h2><span class="sg-rpm-muted">PROSEM → BAB/Topik → Minggu PROSEM → Jadwal SD → Kalender SD → Tanggal</span></div></div><div id="sgRDateNotice" class="sg-rpm-empty">Membaca data PROSEM...</div><div class="sg-rpm-actions"><button type="button" class="sg-rpm-secondary" data-rpm-mode="year">⚡ Otomatis 1 Tahun</button><button type="button" class="sg-rpm-secondary" data-rpm-mode="semester">📘 Otomatis Semester</button><button type="button" class="sg-rpm-primary" data-rpm-mode="day">📝 Otomatis Harian</button></div><div id="sgRDateTopicPick" style="margin-top:10px"></div><div id="sgRDateResult" class="sg-rpm-result"><div class="sg-rpm-empty">Menunggu data PROSEM.</div></div>`;
 host.insertBefore(card,host.firstChild);
 const notice=card.querySelector('#sgRDateNotice'),result=card.querySelector('#sgRDateResult'),pick=card.querySelector('#sgRDateTopicPick');let mode='day';
 const info=()=>{const subject=$(room,'sgRSubject')?.value?.trim()||'',phase=$(room,'sgRPhaseClass')?.value?.trim()||'',year=$(room,'sgRYear')?.value?.trim()||'2026/2027',topic=$(room,'sgRTopic')?.value?.trim()||'',semester=$(room,'sgRSemester')?.value?.trim()||'1',jpv=Math.max(1,Number($(room,'sgRJP')?.value)||2);return{subject,phase,year,topic,jp:jpv,semester,class:cls(phase)}};
 const renderTopicPicker=x=>{const gs=prosemGroups(x,mode),rows=gs.map(g=>g.bab);if(!rows.length){pick.innerHTML='';return}const selected=x.topic&&rows.includes(x.topic)?x.topic:rows[0];pick.innerHTML=`<label class="sg-rpm-field"><span>BAB / TOPIK</span><select id="sgRDateTopicSelect">${rows.map(r=>`<option value="${esc(r)}" ${r===selected?'selected':''}>${esc(r)}</option>`).join('')}</select></label>`};
 const render=()=>{const x=info(),sched=S?.(),p=readProsem();if(!p||!Array.isArray(p.items)){notice.textContent='PROSEM belum tersedia.';pick.innerHTML='';result.innerHTML='<div class="sg-rpm-empty">RPM tidak membuat tanggal sendiri. Buka/simpan PROSEM terlebih dahulu.</div>';return}if(!x.class||!x.subject){notice.textContent='Kelas dan Mapel belum tersedia.';return}const days=sched?.getDays(x.class,x.subject)||[];if(!days.length){notice.textContent=`Jadwal ${x.subject} untuk Kelas ${x.class} belum diatur.`;result.innerHTML='<div class="sg-rpm-empty">Atur jadwal mengajar terlebih dahulu. Tanggal tetap mengikuti minggu yang ditandai PROSEM.</div>';return}renderTopicPicker(x);const all=planTopics(x,mode);if(!all.length){notice.textContent='PROSEM tidak memiliki BAB/Topik untuk Kelas + Mapel ini.';result.innerHTML='<div class="sg-rpm-empty">Tidak ada data PROSEM yang cocok. PROSEM tidak diubah.</div>';return}const selected=card.querySelector('#sgRDateTopicSelect')?.value||x.topic;const shown=mode==='day'?all.filter(r=>r.topic===selected):all;notice.textContent=`${x.subject} • Kelas ${x.class} • ${days.map(dayName).join(', ')} • Tahun Ajaran ${x.year} • Sumber tanggal: PROSEM`;const title=mode==='year'?'Otomatis 1 Tahun':mode==='semester'?'Otomatis Semester':'Otomatis Harian';result.innerHTML=`<article><h3>${title}</h3><div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:8px">Pertemuan</th><th style="text-align:left;padding:8px">Hari</th><th style="text-align:left;padding:8px">Tanggal</th><th style="text-align:left;padding:8px">BAB / Topik</th><th style="text-align:left;padding:8px">Minggu PROSEM</th><th style="text-align:left;padding:8px">JP</th></tr></thead><tbody>${shown.map(r=>`<tr><td style="padding:8px">${r.meeting}</td><td style="padding:8px">${esc(r.day)}</td><td style="padding:8px">${esc(r.date)}</td><td style="padding:8px">${esc(r.topic)}</td><td style="padding:8px">${r.prosemWeek}</td><td style="padding:8px">${r.jp}</td></tr>`).join('')}</tbody></table></div></article>`};
 card.addEventListener('click',e=>{const b=e.target.closest('[data-rpm-mode]');if(!b)return;mode=b.dataset.rpmMode;card.querySelectorAll('[data-rpm-mode]').forEach(x=>{x.classList.toggle('sg-rpm-primary',x===b);x.classList.toggle('sg-rpm-secondary',x!==b)});render()});
 card.addEventListener('change',e=>{if(e.target?.id==='sgRDateTopicSelect'){const topic=e.target.value,field=$(room,'sgRTopic');if(field&&topic){field.value=topic;field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new Event('change',{bubbles:true}))}render();return}render()});
 room.addEventListener('input',render);room.addEventListener('change',render);render();return true;
}
window.SiapGuruRPMDateBridge={version:'RPM-DATE-BRIDGE-V6',mount};
const watch=()=>mount();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});new MutationObserver(watch).observe(document.documentElement,{childList:true,subtree:true});let tries=0;const timer=setInterval(()=>{if(mount()||++tries>80)clearInterval(timer)},500);
})();
