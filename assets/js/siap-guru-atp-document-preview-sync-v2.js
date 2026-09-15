/* SIAP GURU — ATP document preview sync
   Visual template sync only. Keeps generated ATP data intact. */
(()=>{
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const val=(r,s)=>r.querySelector(s)?.value?.trim()||'';
  const sync=room=>{
    if(!room?.classList.contains('sg-atp-room'))return;
    const preview=room.querySelector('.sg-doc-preview'),paper=preview?.querySelector('.sg-doc-preview-paper');
    if(!paper)return;
    const sem=val(room,'#sgAtpSemester');
    const semesterLabel=sem==='2'?'Semester 2':sem==='year'?'1 Tahun':'Semester 1';
    const rows=[...room.querySelectorAll('.sg-atp-item')].map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.dataset.element||'-')}</td><td>${esc(x.dataset.cp||'-')}</td><td>${esc(x.querySelector('.sg-atp-text')?.textContent||'-')}</td><td>${esc(x.querySelector('.sg-atp-jp')?.value||'2')}</td></tr>`).join('');
    const html=`<div class="sg-atp-document">
      <div class="sg-atp-doc-title">ALUR TUJUAN PEMBELAJARAN</div>
      <div class="sg-atp-doc-subtitle">SIAP GURU • Kurikulum Merdeka</div>
      <table class="sg-atp-doc-meta"><tbody>
        <tr><th>Satuan Pendidikan</th><td>SD</td><th>Mata Pelajaran</th><td>${esc(val(room,'#sgAtpSubject'))||'-'}</td></tr>
        <tr><th>Fase / Kelas</th><td>${esc(val(room,'#sgAtpPhase'))||'-'} / ${esc(val(room,'#sgAtpClass'))||'-'}</td><th>Tahun Pelajaran</th><td>2026/2027</td></tr>
        <tr><th>Semester</th><td>${semesterLabel}</td><th>Total JP</th><td>${esc(val(room,'#sgAtpTotalJp'))||'-'}</td></tr>
      </tbody></table>
      <div class="sg-atp-doc-section-title">URUTAN TUJUAN PEMBELAJARAN</div>
      <table class="sg-atp-doc-table"><thead><tr><th>No.</th><th>Elemen CP</th><th>Capaian Pembelajaran</th><th>Tujuan Pembelajaran</th><th>JP</th></tr></thead><tbody>${rows||'<tr><td colspan="5" class="sg-atp-doc-empty">Belum ada tujuan pembelajaran.</td></tr>'}</tbody></table>
      <div class="sg-atp-doc-total"><span>Total Alokasi Waktu</span><strong>${esc(val(room,'#sgAtpTotalJp'))||'-'} JP</strong></div>
    </div>`;
    if(paper.dataset.sgAtpPreviewHtml===html)return;
    paper.dataset.sgAtpPreviewHtml=html;paper.innerHTML=html;
  };
  const schedule=room=>{clearTimeout(room.__sgAtpPreviewTimer);room.__sgAtpPreviewTimer=setTimeout(()=>sync(room),40)};
  const boot=()=>{if(window.__sgAtpPreviewSyncV4)return;window.__sgAtpPreviewSyncV4=1;document.addEventListener('input',e=>{const r=e.target.closest?.('.sg-atp-room');if(r)schedule(r)},true);document.addEventListener('change',e=>{const r=e.target.closest?.('.sg-atp-room');if(r)schedule(r)},true);window.addEventListener('sg:atp-updated',()=>{const r=document.querySelector('.sg-atp-room');if(r)sync(r)})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();