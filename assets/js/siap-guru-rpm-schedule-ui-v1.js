(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_SCHEDULE_UI_V1__)return;
window.__SIAP_GURU_RPM_SCHEDULE_UI_V1__=true;
const DAYS=[['1','Senin'],['2','Selasa'],['3','Rabu'],['4','Kamis'],['5','Jumat']];
const norm=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,' ');
const clsVal=room=>{const e=room.querySelector('#sgRPhaseClass');return String(e?.value||'').split('/').pop().trim()};
const subjectVal=room=>String(room.querySelector('#sgRSubject')?.value||'').trim();
const classNumber=room=>{const m=clsVal(room).match(/(?:kelas\s*)?([1-6])$/i);return m?m[1]:''};
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function mount(room){
 if(room.querySelector('[data-rpm-schedule-ui]'))return;
 const topic=room.querySelector('#sgRTopic');
 const anchor=topic?.closest('.sg-rpm-grid');
 if(!anchor||!window.SiapGuruRPMSchedule)return;
 const box=document.createElement('section');box.className='sg-rpm-card';box.dataset.rpmScheduleUi='1';
 box.innerHTML=`<div class="sg-rpm-section"><div><span class="sg-rpm-label">MASTER JADWAL</span><h2>Jadwal Mengajar</h2><p class="sg-rpm-muted">Atur sekali per Kelas + Mata Pelajaran. Hari dan tanggal RPM akan mengikuti jadwal ini otomatis.</p></div><span class="sg-rpm-muted" data-rpm-schedule-status>Belum dibaca</span></div><div class="sg-rpm-grid"><div class="sg-rpm-field"><span>Kelas</span><input data-rpm-schedule-class readonly></div><div class="sg-rpm-field"><span>Mata Pelajaran</span><input data-rpm-schedule-mapel readonly></div></div><div class="sg-rpm-field" style="margin-top:10px"><span>Hari Mengajar</span><div data-rpm-schedule-days style="display:flex;flex-wrap:wrap;gap:8px"></div></div><div class="sg-rpm-actions" style="margin-top:10px"><button type="button" class="sg-rpm-primary" data-rpm-schedule-save>Simpan Jadwal</button><button type="button" class="sg-rpm-secondary" data-rpm-schedule-clear>Hapus Jadwal Kelas + Mapel</button></div><div class="sg-rpm-empty" data-rpm-schedule-note hidden></div>`;
 anchor.closest('.sg-rpm-card')?.after(box);
 const daysEl=box.querySelector('[data-rpm-schedule-days]');
 DAYS.forEach(([v,label])=>{const l=document.createElement('label');l.innerHTML=`<input type="checkbox" value="${v}" data-rpm-day> ${label}`;daysEl.appendChild(l)});
 const cls=box.querySelector('[data-rpm-schedule-class]'),map=box.querySelector('[data-rpm-schedule-mapel]'),status=box.querySelector('[data-rpm-schedule-status]'),note=box.querySelector('[data-rpm-schedule-note]');
 const refresh=()=>{const c=classNumber(room),m=subjectVal(room);cls.value=c?`Kelas ${c}`:'-';map.value=m||'-';const days=c&&m?window.SiapGuruRPMSchedule.getDays(c,m):[];box.querySelectorAll('[data-rpm-day]').forEach(e=>e.checked=days.includes(Number(e.value)));status.textContent=days.length?`${days.length} hari tersimpan`:'Jadwal belum diatur';note.hidden=true;if(!c||!m){note.textContent='Kelas dan mata pelajaran belum terbaca dari RPM.';note.hidden=false}else if(!days.length){note.textContent='Jadwal belum tersedia. Pilih hari mengajar lalu Simpan Jadwal.';note.hidden=false}};
 box.querySelector('[data-rpm-schedule-save]').onclick=()=>{const c=classNumber(room),m=subjectVal(room),days=[...box.querySelectorAll('[data-rpm-day]:checked')].map(e=>Number(e.value));if(!c||!m){note.textContent='Kelas atau mata pelajaran belum terbaca.';note.hidden=false;return}window.SiapGuruRPMSchedule.setSchedule(c,m,days);refresh();note.textContent=days.length?'Jadwal tersimpan dan siap dipakai RPM otomatis.':'Jadwal dikosongkan.';note.hidden=false};
 box.querySelector('[data-rpm-schedule-clear]').onclick=()=>{const c=classNumber(room),m=subjectVal(room);if(!c||!m)return;window.SiapGuruRPMSchedule.setSchedule(c,m,[]);refresh()};
 const watch=new MutationObserver(()=>refresh());watch.observe(room,{subtree:true,childList:true,characterData:true});
 refresh();
}
const boot=()=>{const room=document.querySelector('.sg-rpm-room');if(room)mount(room)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
new MutationObserver(boot).observe(document.body,{subtree:true,childList:true});
})();