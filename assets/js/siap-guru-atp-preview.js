(()=>{
 const make=()=>{
  const room=document.querySelector('.sg-atp-room');
  if(!room||room.dataset.atpPreviewReady==='1')return;
  const list=room.querySelector('#sgAtpList');
  if(!list)return;
  room.dataset.atpPreviewReady='1';
  const section=document.createElement('section');
  section.className='sg-atp-preview-wrap';
  section.innerHTML=`<div class="sg-atp-preview-head"><div><span class="sg-atp-label">PRATINJAU DOKUMEN</span><h2>Template ATP Siap Cetak</h2><p>Pratinjau dokumen yang akan dicetak atau diunduh.</p></div></div><div id="sgAtpDocument" class="sg-atp-document"><div class="sg-atp-doc-title">ALUR TUJUAN PEMBELAJARAN (ATP)</div><div class="sg-atp-doc-subtitle">Kurikulum Merdeka · Tahun Pelajaran 2026/2027</div><table class="sg-atp-doc-meta"><tbody><tr><th>Nama ATP</th><td data-doc="name">-</td><th>Semester</th><td data-doc="semester">-</td></tr><tr><th>Mata Pelajaran</th><td data-doc="subject">-</td><th>Fase / Kelas</th><td data-doc="phaseclass">-</td></tr><tr><th>Total JP</th><td data-doc="totaljp">-</td><th>Kelompok</th><td data-doc="group">-</td></tr></tbody></table><table class="sg-atp-doc-table"><thead><tr><th>No.</th><th>Elemen CP</th><th>Capaian Pembelajaran</th><th>Tujuan Pembelajaran</th><th>JP</th></tr></thead><tbody data-doc="items"><tr><td colspan="5">Belum ada tujuan pembelajaran.</td></tr></tbody><tfoot><tr><th colspan="4">Total Alokasi Waktu</th><th data-doc="sum">0 JP</th></tr></tfoot></table><div class="sg-atp-doc-sign"><div>Mengetahui,<br>Kepala Sekolah<br><br><br>________________________</div><div>Guru/Pendidik<br><br><br><br>________________________</div></div></div></section>`;
  room.querySelector('.sg-atp-footer')?.insertAdjacentElement('afterend',section);
  const esc=v=>String(v??'-').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const render=()=>{
   const q=s=>room.querySelector(s), val=s=>q(s)?.value||'';
   q('[data-doc="name"]').textContent=val('#sgAtpName')||'-';
   q('[data-doc="semester"]').textContent=val('#sgAtpSemester')==='2'?'Semester 2':'Semester 1';
   q('[data-doc="subject"]').textContent=val('#sgAtpSubject')||'-';
   q('[data-doc="phaseclass"]').textContent=`Fase ${val('#sgAtpPhase')||'-'} / Kelas ${val('#sgAtpClass')||'-'}`;
   q('[data-doc="totaljp"]').textContent=val('#sgAtpTotalJp')?`${val('#sgAtpTotalJp')} JP`:'-';
   q('[data-doc="group"]').textContent=val('#sgAtpGroup')==='agama'?'Agama & Budi Pekerti':'Mapel Umum';
   const rows=[...list.querySelectorAll('.sg-atp-item')];let total=0;
   q('[data-doc="items"]').innerHTML=rows.length?rows.map((it,i)=>{const jp=Number(it.querySelector('.sg-atp-jp')?.value||0);total+=jp;return `<tr><td>${i+1}</td><td>${esc(it.dataset.element)}</td><td>${esc(it.dataset.cp)}</td><td>${esc(it.querySelector('.sg-atp-text')?.textContent||'')}</td><td>${jp}</td></tr>`}).join(''):`<tr><td colspan="5">Belum ada tujuan pembelajaran.</td></tr>`;
   q('[data-doc="sum"]').textContent=`${total} JP`;
  };
  render();
  room.addEventListener('input',e=>{if(e.target.matches('input,textarea,select'))render()});
  room.addEventListener('click',()=>setTimeout(render,30));
  if(window.SiapGuruExport?.attach)window.SiapGuruExport.attach(room);
 };
 const boot=()=>{make();if(!document.querySelector('.sg-atp-preview-observer')){const root=document.querySelector('.main-content')||document.body;const marker=document.createElement('i');marker.className='sg-atp-preview-observer';marker.hidden=true;document.body.appendChild(marker);new MutationObserver(make).observe(root,{childList:true,subtree:true})}};
 document.addEventListener('DOMContentLoaded',boot);setTimeout(boot,250);
})();