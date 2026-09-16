(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_DATE_BRIDGE_V3__)return;
window.__SIAP_GURU_RPM_DATE_BRIDGE_V3__=true;
const S=()=>window.SiapGuruRPMSchedule,D=()=>window.SiapGuruRPMDate,C=()=>window.SiapGuruRPMCalendar;
const $=(root,id)=>root?.querySelector('#'+id);
const cls=v=>String(v||'').match(/\b([1-6])\b/)?.[1]||'';
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function mount(){
 const room=document.querySelector('.sg-rpm-room');
 if(!room)return false;
 const host=room.querySelector('.sg-rpm-shell');
 if(!host)return false;
 if(room.querySelector('[data-rpm-date-bridge]'))return true;
 const card=document.createElement('section');
 card.className='sg-rpm-card';
 card.dataset.rpmDateBridge='1';
 card.innerHTML=`<div class="sg-rpm-section"><div><span class="sg-rpm-label">RPM OTOMATIS</span><h2>Jadwal &amp; Tanggal Otomatis</h2><span class="sg-rpm-muted">Kelas + Mapel → Jadwal SD → Kalender SD → Tanggal</span></div></div><div id="sgRDateNotice" class="sg-rpm-empty">Menyiapkan mesin jadwal dan tanggal...</div><div class="sg-rpm-actions"><button type="button" class="sg-rpm-secondary" data-rpm-mode="year">⚡ Otomatis 1 Tahun</button><button type="button" class="sg-rpm-secondary" data-rpm-mode="semester">📘 Otomatis Semester</button><button type="button" class="sg-rpm-primary" data-rpm-mode="day">📝 Otomatis Harian</button></div><div id="sgRDateResult" class="sg-rpm-result"><div class="sg-rpm-empty">Pilih BAB dan pastikan jadwal mapel sudah tersedia.</div></div>`;
 host.insertBefore(card,host.firstChild);
 const notice=card.querySelector('#sgRDateNotice'),result=card.querySelector('#sgRDateResult');
 let mode='day';
 const info=()=>{const subject=$(room,'sgRSubject')?.value?.trim()||'',phase=$(room,'sgRPhaseClass')?.value?.trim()||'',year=$(room,'sgRYear')?.value?.trim()||'2026/2027',topic=$(room,'sgRTopic')?.value?.trim()||'',jp=Math.max(1,Number($(room,'sgRJP')?.value)||2);return{subject,phase,year,topic,jp,class:cls(phase)}};
 const render=()=>{
  const x=info(),sched=S?.(),date=D?.(),cal=C?.();
  if(!x.class||!x.subject){notice.textContent='Kelas dan Mapel belum tersedia.';result.innerHTML='<div class="sg-rpm-empty">Lengkapi identitas RPM terlebih dahulu.</div>';return}
  const days=sched?.getDays(x.class,x.subject)||[];
  if(!days.length){notice.textContent=`Jadwal ${x.subject} untuk Kelas ${x.class} belum diatur.`;result.innerHTML='<div class="sg-rpm-empty">Atur jadwal mengajar pada Master Jadwal Kelas terlebih dahulu. Tidak ada tanggal yang dibuat secara tebakan.</div>';return}
  if(!date||!cal){notice.textContent='Mesin tanggal belum siap. Coba buka ulang RPM.';return}
  const start=new Date();
  const count=mode==='year'?120:mode==='semester'?60:Math.max(1,Math.ceil(x.jp/2));
  const rows=date.plan(x.class,x.subject,start,count,x.year);
  const shown=mode==='day'?rows.slice(0,Math.max(1,Math.ceil(x.jp/2))):rows;
  notice.textContent=`${x.subject} • Kelas ${x.class} • ${days.map(n=>['','Senin','Selasa','Rabu','Kamis','Jumat'][n]).join(', ')} • ${x.year}`;
  if(!shown.length){result.innerHTML='<div class="sg-rpm-empty">Belum ada tanggal efektif yang cocok dengan jadwal dan Kalender SD.</div>';return}
  const title=mode==='year'?'Otomatis 1 Tahun':mode==='semester'?'Otomatis Semester':'Otomatis Harian';
  result.innerHTML=`<article><h3>${title}${x.topic?' — '+esc(x.topic):''}</h3><div style="overflow:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:8px">Pertemuan</th><th style="text-align:left;padding:8px">Hari</th><th style="text-align:left;padding:8px">Tanggal</th><th style="text-align:left;padding:8px">Topik/BAB</th></tr></thead><tbody>${shown.map(r=>`<tr><td style="padding:8px">${r.meeting}</td><td style="padding:8px">${esc(r.day)}</td><td style="padding:8px">${esc(r.date)}</td><td style="padding:8px">${esc(x.topic||'-')}</td></tr>`).join('')}</tbody></table></div></article>`;
 };
 card.addEventListener('click',e=>{const b=e.target.closest('[data-rpm-mode]');if(!b)return;mode=b.dataset.rpmMode;card.querySelectorAll('[data-rpm-mode]').forEach(x=>{x.classList.toggle('sg-rpm-primary',x===b);x.classList.toggle('sg-rpm-secondary',x!==b)});render()});
 room.addEventListener('input',render);room.addEventListener('change',render);
 render();
 return true;
}
window.SiapGuruRPMDateBridge={version:'RPM-DATE-BRIDGE-V3',mount};
const watch=()=>mount();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});
new MutationObserver(watch).observe(document.documentElement,{childList:true,subtree:true});
let tries=0;const timer=setInterval(()=>{if(mount()||++tries>80)clearInterval(timer)},500);
})();
