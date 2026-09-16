(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_DATE_BRIDGE_V7__)return;
window.__SIAP_GURU_RPM_DATE_BRIDGE_V7__=true;
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
const yearStart=(year,semester)=>{const y=Number(String(year||'2026/2027').slice(0,4))||2026;return new Date(semester===2?y+1:y,semester===2?0:6,semester===2?1:22,12,0,0)};
function prosemRows(x,mode){
 const p=readProsem();if(!p||!Array.isArray(p.items))return [];
 const ps=norm(p.subject),px=norm(p.class||p.kelas),xs=norm(x.subject),xc=norm(x.class);
 if(ps&&xs&&ps.toLowerCase()!==xs.toLowerCase())return [];
 if(px&&xc&&px!==xc)return [];
 const wanted=mode==='semester'?String(x.semester||'1'):'';
 const rows=p.items.filter(r=>!wanted||String(semOf(r))===wanted).filter(r=>cleanBab(r));
 return rows.map((r,i)=>({raw:r,bab:cleanBab(r),semester:semOf(r),jp:jp(r),order:i}));
}
function allocate(rows,semester){
 // Sama seperti PROSEM Matrix V4: 4 minggu per bulan, 24 slot per semester.
 // Bedanya RPM memakai tanggal kalender nyata, dengan titik awal pembelajaran 22 Juli 2026.
 const out=[];let cursor=0;
 rows.forEach(r=>{const weeks=Math.max(1,Math.ceil(r.jp/4)),slots=[];for(let k=0;k<weeks;k++)slots.push(cursor++);out.push({...r,slots})});
 return out;
}
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
function effectiveDates(year,semester,slot,days,cal){
 const out=[];
 // Semester 1 dimulai pada 22 Juli 2026 sesuai awal pembelajaran yang ditetapkan.
 // Slot berikutnya bergerak 7 hari agar urutan minggu PROSEM tetap konsisten.
 const d0=yearStart(year,semester);d0.setDate(d0.getDate()+slot*7);
 for(let k=0;k<7;k++){
  const d=new Date(d0);d.setDate(d.getDate()+k);const n=d.getDay(),date=iso(d);
  if(days.includes(n)&&(!cal||cal.isEffective?.(String(year||'2026/2027'),date)))out.push({date,day:dayName(n),slot});
 }
 return out;
}
function planTopics(x,mode){
 const sched=S?.(),cal=C?.();if(!sched)return [];
 const rows=prosemRows(x,mode);if(!rows.length)return [];
 const days=sched.getDays(x.class,x.subject);if(!days.length)return [];
 const groups=[];rows.forEach(r=>{let g=groups[groups.length-1];if(!g||g.bab!==r.bab){g={bab:r.bab,semester:r.semester,rows:[]};groups.push(g)}g.rows.push(r)});
 const out=[];let meeting=1;
 groups.forEach(g=>{
  const allocated=allocate(g.rows,g.semester);allocated.forEach(r=>{
   const dates=[];r.slots.forEach(slot=>effectiveDates(x.year,g.semester,slot,days,cal).forEach(v=>dates.push(v)));
   const unique=[...new Map(dates.map(v=>[v.date,v])).values()];
   const per=Math.max(1,Math.ceil((r.jp||2)/Math.max(1,unique.length)));
   unique.forEach(v=>out.push({topic:g.bab,semester:g.semester,jp:per,meeting:meeting++,date:v.date,day:v.day,prosemWeek:v.slot+1}));
  });
 });
 return out;
}
function mount(){
 const room=document.querySelector('.sg-rpm-room');if(!room)return false;if(room.querySelector('[data-rpm-date-bridge]'))return true;
 const host=room.querySelector('.sg-rpm-shell')||room,card=document.createElement('section');card.className='sg-rpm-card';card.dataset.rpmDateBridge='1';
 card.innerHTML=`<div class="sg-rpm-section"><div><span class="sg-rpm-label">RPM OTOMATIS</span><h2>Jadwal &amp; Tanggal Otomatis</h2><span class="sg-rpm-muted">PROSEM → BAB/Topik → Minggu PROSEM → Jadwal SD → Kalender SD → Tanggal</span></div></div><div id="sgRDateNotice" class="sg-rpm-empty">Membaca data PROSEM...</div><div class="sg-rpm-actions"><button type="button" class="sg-rpm-secondary" data-rpm-mode="year">⚡ Otomatis 1 Tahun</button><button type="button" class="sg-rpm-secondary" data-rpm-mode="semester">📘 Otomatis Semester</button><button type="button" class="sg-rpm-primary" data-rpm-mode="day">📝 Otomatis Harian</button></div><div id="sgRDateTopicPick" style="margin-top:10px"></div><div id="sgRDateResult" class="sg-rpm-result"><div class="sg-rpm-empty">Menunggu data PROSEM.</div></div>`;
 host.insertBefore(card,host.firstChild);
 const notice=card.querySelector('#sgRDateNotice'),result=card.querySelector('#sgRDateResult'),pick=card.querySelector('#sgRDateTopicPick');let mode='day';
 const info=()=>{const subject=$(room,'sgRSubject')?.value?.trim()||'',phase=$(room,'sgRPhaseClass')?.value?.trim()||'',year=$(room,'sgRYear')?.value?.trim()||'2026/2027',topic=$(room,'sgRTopic')?.value?.trim()||'',semester=$(room,'sgRSemester')?.value?.trim()||'1',jpv=Math.max(1,Number($(room,'sgRJP')?.value)||2);return{subject,phase,year,topic,jp:jpv,semester,class:cls(phase)}};
 const renderTopicPicker=x=>{const gs=[...new Set(prosemRows(x,mode).map(r=>r.bab))];if(!gs.length){pick.innerHTML='';return}const selected=x.topic&&gs.includes(x.topic)?x.topic:gs[0];pick.innerHTML=`<label class="sg-rpm-field"><span>BAB / TOPIK</span><select id="sgRDateTopicSelect">${gs.map(r=>`<option value="${esc(r)}" ${r===selected?'selected':''}>${esc(r)}</option>`).join('')}</select></label>`};
 const render=()=>{const x=info(),sched=S?.(),p=readProsem();if(!p||!Array.isArray(p.items)){notice.textContent='PROSEM belum tersedia.';pick.innerHTML='';result.innerHTML='<div class="sg-rpm-empty">RPM tidak membuat tanggal sendiri. Buka/simpan PROSEM terlebih dahulu.</div>';return}if(!x.class||!x.subject){notice.textContent='Kelas dan Mapel belum tersedia.';return}const days=sched?.getDays(x.class,x.subject)||[];if(!days.length){notice.textContent=`Jadwal ${x.subject} untuk Kelas ${x.class} belum diatur.`;result.innerHTML='<div class="sg-rpm-empty">Atur jadwal mengajar terlebih dahulu. Tanggal tetap mengikuti minggu PROSEM.</div>';return}renderTopicPicker(x);const all=planTopics(x,mode);if(!all.length){notice.textContent='PROSEM tidak memiliki BAB/Topik untuk Kelas + Mapel ini.';result.innerHTML='<div class="sg-rpm-empty">Tidak ada data PROSEM yang cocok. PROSEM tidak diubah.</div>';return}const selected=card.querySelector('#sgRDateTopicSelect')?.value||x.topic;const shown=mode==='day'?all.filter(r=>r.topic===selected):all;notice.textContent=`${x.subject} • Kelas ${x.class} • ${days.map(dayName).join(', ')} • Tahun Ajaran ${x.year} • Mulai pembelajaran 22 Juli 2026`;const title=mode==='year'?'Otomatis 1 Tahun':mode==='semester'?'Otomatis Semester':'Otomatis Harian';result.innerHTML=`<article><h3>${title}</h3><div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:8px">Pertemuan</th><th style="text-align:left;padding:8px">Hari</th><th style="text-align:left;padding:8px">Tanggal</th><th style="text-align:left;padding:8px">BAB / Topik</th><th style="text-align:left;padding:8px">Minggu PROSEM</th><th style="text-align:left;padding:8px">JP</th></tr></thead><tbody>${shown.map(r=>`<tr><td style="padding:8px">${r.meeting}</td><td style="padding:8px">${esc(r.day)}</td><td style="padding:8px">${esc(r.date)}</td><td style="padding:8px">${esc(r.topic)}</td><td style="padding:8px">${r.prosemWeek}</td><td style="padding:8px">${r.jp}</td></tr>`).join('')}</tbody></table></div></article>`};
 card.addEventListener('click',e=>{const b=e.target.closest('[data-rpm-mode]');if(!b)return;mode=b.dataset.rpmMode;card.querySelectorAll('[data-rpm-mode]').forEach(x=>{x.classList.toggle('sg-rpm-primary',x===b);x.classList.toggle('sg-rpm-secondary',x!==b)});render()});
 card.addEventListener('change',e=>{if(e.target?.id==='sgRDateTopicSelect'){const topic=e.target.value,field=$(room,'sgRTopic');if(field&&topic){field.value=topic;field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new Event('change',{bubbles:true}))}render();return}render()});
 room.addEventListener('input',render);room.addEventListener('change',render);render();return true;
}
window.SiapGuruRPMDateBridge={version:'RPM-DATE-BRIDGE-V7',mount};
const watch=()=>mount();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});new MutationObserver(watch).observe(document.documentElement,{childList:true,subtree:true});let tries=0;const timer=setInterval(()=>{if(mount()||++tries>80)clearInterval(timer)},500);
})();
