(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_CALENDAR_UI_V1__)return;
window.__SIAP_GURU_RPM_CALENDAR_UI_V1__=true;
const C=()=>window.SiapGuruRPMCalendar;
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function loadDateEngine(){if(window.SiapGuruRPMDate)return Promise.resolve();if(document.querySelector('script[data-sg-rpm-date-engine]'))return Promise.resolve();return new Promise(resolve=>{const s=document.createElement('script');s.src='assets/js/siap-guru-rpm-date-engine-v1.js?v=1';s.defer=true;s.dataset.sgRpmDateEngine='1';s.onload=resolve;s.onerror=resolve;document.head.appendChild(s)})}
function mount(){
 if(document.querySelector('[data-sg-rpm-calendar]'))return;
 const anchor=document.querySelector('.sg-rpm-room'); if(!anchor)return;
 const box=document.createElement('section');box.className='sg-rpm-card';box.dataset.sgRpmCalendar='1';
 box.innerHTML=`<div class="sg-rpm-section"><div><span class="sg-rpm-label">KALENDER PENDIDIKAN SD</span><h2>Kalender SD 2026/2027</h2><p class="sg-rpm-muted">Atur hari/tanggal tidak efektif. Tanggal RPM akan dihitung otomatis berdasarkan jadwal mengajar.</p></div></div><div class="sg-rpm-grid"><label class="sg-rpm-field"><span>Tahun Ajaran</span><select id="sgRCalYear"><option value="2026/2027">2026/2027</option><option value="2027/2028">2027/2028</option></select></label><label class="sg-rpm-field"><span>Tanggal tidak efektif</span><input id="sgRCalDate" type="date"></label><label class="sg-rpm-field"><span>Keterangan</span><input id="sgRCalNote" placeholder="Libur / kegiatan sekolah / lainnya"></label></div><div class="sg-rpm-actions"><button type="button" id="sgRCalAdd" class="sg-rpm-primary">Tambah tanggal</button></div><div id="sgRCalList" class="sg-rpm-result"></div>`;
 anchor.prepend(box);
 const year=box.querySelector('#sgRCalYear'),date=box.querySelector('#sgRCalDate'),note=box.querySelector('#sgRCalNote'),list=box.querySelector('#sgRCalList');
 const render=()=>{const data=C()?.get(year.value)||{nonEffective:[],notes:{}};const rows=(data.nonEffective||[]).map(d=>`<div style="display:flex;justify-content:space-between;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(0,0,0,.08)"><span><strong>${esc(d)}</strong> — ${esc(data.notes?.[d]||'Tidak efektif')}</span><button type="button" data-remove="${esc(d)}" class="sg-rpm-secondary">Hapus</button></div>`).join('');list.innerHTML=rows||'<div class="sg-rpm-empty">Belum ada tanggal tidak efektif untuk tahun ajaran ini.</div>'};
 box.querySelector('#sgRCalAdd').onclick=()=>{if(!date.value)return;C()?.add(year.value,date.value,note.value.trim());note.value='';render()};
 year.onchange=render;list.onclick=e=>{const b=e.target.closest('[data-remove]');if(b){C()?.remove(year.value,b.dataset.remove);render()}};render();
}
const boot=()=>{if(document.querySelector('.sg-rpm-room'))loadDateEngine().then(mount)};
new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});boot();
})();
