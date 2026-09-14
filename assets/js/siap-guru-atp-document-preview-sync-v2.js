/* SIAP GURU — ATP document preview sync
   Event-driven only. No MutationObserver and no global click polling. */
(()=>{
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const val=(r,s)=>r.querySelector(s)?.value?.trim()||'';
  const sync=room=>{
    if(!room?.classList.contains('sg-atp-room'))return;
    const preview=room.querySelector('.sg-doc-preview'),paper=preview?.querySelector('.sg-doc-preview-paper');
    if(!paper)return;
    const rows=[...room.querySelectorAll('.sg-atp-item')].map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.dataset.element||'-')}</td><td>${esc(x.dataset.cp||'-')}</td><td>${esc(x.querySelector('.sg-atp-text')?.textContent||'-')}</td><td>${esc(x.querySelector('.sg-atp-jp')?.value||'2')}</td></tr>`).join('');
    const html=`<div class="sg-doc-ident"><div><b>Satuan Pendidikan</b><span>SD</span></div><div><b>Mata Pelajaran</b><span>${esc(val(room,'#sgAtpSubject'))||'-'}</span></div><div><b>Fase / Kelas</b><span>${esc(val(room,'#sgAtpPhase'))||'-'} / ${esc(val(room,'#sgAtpClass'))||'-'}</span></div><div><b>Tahun Pelajaran</b><span>2026/2027</span></div><div><b>Semester</b><span>${esc(val(room,'#sgAtpSemester'))==='2'?'Semester 2':'Semester 1'}</span></div><div><b>Total JP</b><span>${esc(val(room,'#sgAtpTotalJp'))||'-'}</span></div></div><h3>Urutan Tujuan Pembelajaran</h3><table><thead><tr><th>No.</th><th>Elemen CP</th><th>CP</th><th>Tujuan Pembelajaran</th><th>JP</th></tr></thead><tbody>${rows||'<tr><td colspan="5">Belum ada tujuan pembelajaran.</td></tr>'}</tbody></table>`;
    if(paper.dataset.sgAtpPreviewHtml===html)return;
    paper.dataset.sgAtpPreviewHtml=html;paper.innerHTML=html;
  };
  const schedule=room=>{clearTimeout(room.__sgAtpPreviewTimer);room.__sgAtpPreviewTimer=setTimeout(()=>sync(room),40)};
  const boot=()=>{if(window.__sgAtpPreviewSyncV4)return;window.__sgAtpPreviewSyncV4=1;document.addEventListener('input',e=>{const r=e.target.closest?.('.sg-atp-room');if(r)schedule(r)},true);document.addEventListener('change',e=>{const r=e.target.closest?.('.sg-atp-room');if(r)schedule(r)},true);window.addEventListener('sg:atp-updated',()=>{const r=document.querySelector('.sg-atp-room');if(r)sync(r)})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();