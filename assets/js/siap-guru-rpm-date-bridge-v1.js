(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_DATE_BRIDGE_V5__)return;
window.__SIAP_GURU_RPM_DATE_BRIDGE_V5__=true;
const S=()=>window.SiapGuruRPMSchedule,D=()=>window.SiapGuruRPMDate,C=()=>window.SiapGuruRPMCalendar,M=()=>window.SiapGuruMasterBab;
const $=(root,id)=>root?.querySelector('#'+id);
const cls=v=>String(v||'').match(/\b([1-6])\b/)?.[1]||'';
const norm=s=>String(s??'').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const dayName=n=>['','Senin','Selasa','Rabu','Kamis','Jumat'][n]||'';
const yearStart=(year,semester)=>semester==='2'?`${Number(String(year).slice(0,4))+1}-01-01`:`${Number(String(year).slice(0,4))}-07-01`;
const nextDay=iso=>{const d=new Date(`${iso}T12:00:00`);d.setDate(d.getDate()+1);return d};
function masterTopics(x,semester){
 const rows=M?.()?.getAll?.()||[];
 return rows.filter(r=>String(r?.kelas)===String(x.class)&&norm(r?.mapel).toLowerCase()===norm(x.subject).toLowerCase()&&(!semester||String(r?.semester)===String(semester))&&norm(r?.bab));
}
function topicRows(x,mode){
 const sem=mode==='semester'?String(x.semester||'1'):'';
 const rows=masterTopics(x,sem);
 if(rows.length)return rows;
 return masterTopics(x,'');
}
function planTopics(x,mode){
 const date=D?.(),cal=C?.(),sched=S?.();
 if(!date||!cal||!sched)return [];
 const topics=topicRows(x,mode);
 if(!topics.length)return [];
 const start=yearStart(x.year,mode==='semester'?String(x.semester||'1'):'1');
 let cursor=new Date(`${start}T12:00:00`),out=[];
 const semester=mode==='semester'?String(x.semester||'1'):'';
 for(const t of topics){
  const jp=Math.max(1,Number(t.jp)||Number(x.jp)||8);
  const meetings=Math.max(1,Math.ceil(jp/2));
  const dates=date.plan(x.class,x.subject,cursor,meetings,x.year);
  if(!dates.length)continue;
  dates.forEach((r,i)=>out.push({topic:t.bab,semester:t.semester,jp,meeting:i+1,date:r.date,day:r.day}));
  cursor=nextDay(dates[dates.length-1].date);
  if(mode==='semester'&&semester&&String(t.semester)!==semester)continue;
 }
 return out;
}
function mount(){
 const room=document.querySelector('.sg-rpm-room');
 if(!room)return false;
 if(room.querySelector('[data-rpm-date-bridge]'))return true;
 const host=room.querySelector('.sg-rpm-shell')||room;
 const card=document.createElement('section');
 card.className='sg-rpm-card';
 card.dataset.rpmDateBridge='1';
 card.innerHTML=`<div class="sg-rpm-section"><div><span class="sg-rpm-label">RPM OTOMATIS</span><h2>Jadwal &amp; Tanggal Otomatis</h2><span class="sg-rpm-muted">Kelas + Mapel → BAB/Topik → Jadwal SD → Kalender SD → Tanggal</span></div></div><div id="sgRDateNotice" class="sg-rpm-empty">Menyiapkan mesin jadwal, BAB/Topik, dan tanggal...</div><div class="sg-rpm-actions"><button type="button" class="sg-rpm-secondary" data-rpm-mode="year">⚡ Otomatis 1 Tahun</button><button type="button" class="sg-rpm-secondary" data-rpm-mode="semester">📘 Otomatis Semester</button><button type="button" class="sg-rpm-primary" data-rpm-mode="day">📝 Otomatis Harian</button></div><div id="sgRDateTopicPick" style="margin-top:10px"></div><div id="sgRDateResult" class="sg-rpm-result"><div class="sg-rpm-empty">Menunggu data RPM.</div></div>`;
 host.insertBefore(card,host.firstChild);
 const notice=card.querySelector('#sgRDateNotice'),result=card.querySelector('#sgRDateResult'),pick=card.querySelector('#sgRDateTopicPick');
 let mode='day';
 const info=()=>{const subject=$(room,'sgRSubject')?.value?.trim()||'',phase=$(room,'sgRPhaseClass')?.value?.trim()||'',year=$(room,'sgRYear')?.value?.trim()||'2026/2027',topic=$(room,'sgRTopic')?.value?.trim()||'',semester=$(room,'sgRSemester')?.value?.trim()||'1',jp=Math.max(1,Number($(room,'sgRJP')?.value)||2);return{subject,phase,year,topic,jp,semester,class:cls(phase)}};
 const renderTopicPicker=x=>{
  const rows=masterTopics(x,mode==='semester'?x.semester:'');
  if(!rows.length){pick.innerHTML='';return}
  const selected=x.topic||rows[0].bab;
  pick.innerHTML=`<label class="sg-rpm-field"><span>BAB / TOPIK</span><select id="sgRDateTopicSelect">${rows.map(r=>`<option value="${esc(r.bab)}" ${r.bab===selected?'selected':''}>${esc(r.bab)}</option>`).join('')}</select></label>`;
 };
 const render=()=>{
  const x=info(),sched=S?.(),date=D?.(),cal=C?.();
  if(!x.class||!x.subject){notice.textContent='Kelas dan Mapel belum tersedia.';pick.innerHTML='';result.innerHTML='<div class="sg-rpm-empty">Lengkapi identitas RPM terlebih dahulu.</div>';return}
  const days=sched?.getDays(x.class,x.subject)||[];
  if(!days.length){notice.textContent=`Jadwal ${x.subject} untuk Kelas ${x.class} belum diatur.`;pick.innerHTML='';result.innerHTML='<div class="sg-rpm-empty">Atur jadwal mengajar pada Master Jadwal Kelas terlebih dahulu. Tidak ada tanggal yang dibuat secara tebakan.</div>';return}
  if(!date||!cal){notice.textContent='Mesin tanggal belum siap. Coba buka ulang RPM.';return}
  renderTopicPicker(x);
  const all=planTopics(x,mode);
  if(!all.length){notice.textContent='Belum ada BAB/Topik yang dapat dijadwalkan.';result.innerHTML='<div class="sg-rpm-empty">Master BAB/Topik belum memiliki data untuk kelas dan mapel ini.</div>';return}
  const selected=card.querySelector('#sgRDateTopicSelect')?.value||x.topic;
  const shown=mode==='day'?all.filter(r=>r.topic===selected).slice(0,Math.max(1,Math.ceil(x.jp/2))):all;
  const semText=mode==='semester'?` • Semester ${x.semester}`:'';
  notice.textContent=`${x.subject} • Kelas ${x.class} • ${days.map(dayName).join(', ')} • Tahun Ajaran ${x.year}${semText}`;
  const title=mode==='year'?'Otomatis 1 Tahun':mode==='semester'?'Otomatis Semester':'Otomatis Harian';
  result.innerHTML=`<article><h3>${title}</h3><div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:8px">Pertemuan</th><th style="text-align:left;padding:8px">Hari</th><th style="text-align:left;padding:8px">Tanggal</th><th style="text-align:left;padding:8px">BAB / Topik</th><th style="text-align:left;padding:8px">JP</th></tr></thead><tbody>${shown.map(r=>`<tr><td style="padding:8px">${r.meeting}</td><td style="padding:8px">${esc(r.day)}</td><td style="padding:8px">${esc(r.date)}</td><td style="padding:8px">${esc(r.topic)}</td><td style="padding:8px">${r.jp}</td></tr>`).join('')}</tbody></table></div></article>`;
 };
 card.addEventListener('click',e=>{const b=e.target.closest('[data-rpm-mode]');if(!b)return;mode=b.dataset.rpmMode;card.querySelectorAll('[data-rpm-mode]').forEach(x=>{x.classList.toggle('sg-rpm-primary',x===b);x.classList.toggle('sg-rpm-secondary',x!==b)});render()});
 card.addEventListener('change',e=>{if(e.target?.id==='sgRDateTopicSelect'){const topic=e.target.value;const field=$(room,'sgRTopic');if(field&&topic){field.value=topic;field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new Event('change',{bubbles:true}))}render();return}render()});
 room.addEventListener('input',render);room.addEventListener('change',render);
 render();
 return true;
}
window.SiapGuruRPMDateBridge={version:'RPM-DATE-BRIDGE-V5',mount};
const watch=()=>mount();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});
new MutationObserver(watch).observe(document.documentElement,{childList:true,subtree:true});
let tries=0;const timer=setInterval(()=>{if(mount()||++tries>80)clearInterval(timer)},500);
})();
