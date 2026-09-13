document.addEventListener('DOMContentLoaded', () => {
  const closeMenus = () => document.querySelectorAll('.sg-topnav-item.is-open').forEach(item => {
    item.classList.remove('is-open'); item.setAttribute('aria-expanded','false');
  });
  const main = document.querySelector('.main-content');
  if (!main || document.querySelector('.sg-selesai-view')) return;
  const style = document.createElement('style');
  style.textContent = `
    .sg-selesai-view{padding:28px 0 40px}.sg-selesai-head{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin-bottom:22px}.sg-selesai-back{border:0;background:transparent;padding:0;color:inherit;font:inherit;cursor:pointer;margin-bottom:10px}.sg-selesai-eyebrow{display:block;font-size:.72rem;letter-spacing:.12em;font-weight:700;opacity:.65}.sg-selesai-head h1{margin:5px 0 7px}.sg-selesai-head p{margin:0;opacity:.72}.sg-selesai-count{padding:12px 15px;border-radius:14px;background:var(--sg-surface,#fff);border:1px solid rgba(15,23,42,.08);white-space:nowrap}.sg-selesai-panel{border:1px solid rgba(15,23,42,.08);background:var(--sg-surface,#fff);border-radius:18px;overflow:hidden}.sg-selesai-toolbar{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:16px 18px;border-bottom:1px solid rgba(15,23,42,.07)}.sg-selesai-toolbar h2{margin:0;font-size:1rem}.sg-selesai-search{width:min(320px,100%);padding:10px 12px;border:1px solid rgba(15,23,42,.12);border-radius:11px;background:transparent}.sg-selesai-empty{padding:44px 24px;text-align:center;opacity:.65}.sg-selesai-empty strong{display:block;margin-bottom:6px;opacity:.85}.sg-selesai-note{font-size:.86rem}@media(max-width:700px){.sg-selesai-head,.sg-selesai-toolbar{display:block}.sg-selesai-count{display:inline-block;margin-top:14px}.sg-selesai-search{margin-top:12px}}
  `;
  document.head.appendChild(style);
  const view = document.createElement('section');
  view.className='sg-selesai-view'; view.hidden=true; view.setAttribute('aria-label','Dokumen Selesai');
  view.innerHTML=`<div class="sg-selesai-head"><div><button type="button" class="sg-selesai-back">← Beranda</button><span class="sg-selesai-eyebrow">DOKUMEN</span><h1>Selesai</h1><p>Dokumen yang sudah selesai dan siap digunakan.</p></div><div class="sg-selesai-count"><strong id="sgSelesaiCount">0 dokumen</strong><br><span>Belum ada dokumen terhubung</span></div></div><div class="sg-selesai-panel"><div class="sg-selesai-toolbar"><h2>Dokumen selesai</h2><input class="sg-selesai-search" type="search" placeholder="Cari dokumen..." disabled></div><div class="sg-selesai-empty"><strong>Belum ada dokumen selesai</strong><span class="sg-selesai-note">Modul ini sudah disiapkan tanpa mengubah database. Data dokumen akan ditampilkan setelah sumber dokumen tersedia.</span></div></div>`;
  main.appendChild(view);
  const open=()=>{closeMenus(); document.getElementById('homeView').hidden=true; document.getElementById('studentsView').hidden=true; document.getElementById('profileView').hidden=true; document.querySelectorAll('.inner-view').forEach(v=>{if(v!==view)v.hidden=true}); view.hidden=false; window.scrollTo({top:0,behavior:'smooth'});};
  view.querySelector('.sg-selesai-back')?.addEventListener('click',()=>{view.hidden=true;document.getElementById('homeView').hidden=false;window.scrollTo({top:0,behavior:'smooth'});});
  document.querySelectorAll('.sg-topnav-link').forEach(link=>{if(link.textContent.trim()==='Selesai')link.addEventListener('click',e=>{e.preventDefault();open();});});
  document.querySelectorAll('.sub-menu span').forEach(item=>{if(item.textContent.trim()==='Selesai'){item.style.cursor='pointer';item.addEventListener('click',open);}});
});