document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.querySelector('.main-content');
  const homeView = document.getElementById('homeView');
  if (!mainContent || !homeView || document.getElementById('draftView')) return;

  const style = document.createElement('style');
  style.textContent = `
    .sg-draft-view,.sg-selesai-view,.sg-template-view{padding:28px 0 42px}.sg-draft-head,.sg-selesai-head,.sg-template-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:22px}.sg-draft-back,.sg-selesai-back,.sg-template-back{border:0;background:transparent;padding:0;color:inherit;font:inherit;cursor:pointer;margin-bottom:10px}.sg-draft-eyebrow,.sg-selesai-eyebrow,.sg-template-eyebrow{display:block;font-size:.72rem;letter-spacing:.12em;font-weight:700;opacity:.65}.sg-draft-head h1,.sg-selesai-head h1,.sg-template-head h1{margin:5px 0 7px}.sg-draft-head p,.sg-selesai-head p,.sg-template-head p{margin:0;opacity:.72}.sg-draft-card,.sg-selesai-card,.sg-template-card{border:1px solid rgba(15,23,42,.08);background:var(--sg-surface,#fff);border-radius:18px;padding:22px;box-shadow:0 8px 24px rgba(15,23,42,.04)}.sg-draft-toolbar{display:flex;justify-content:space-between;gap:14px;align-items:center;margin-bottom:16px}.sg-draft-toolbar h2{margin:0;font-size:1rem}.sg-draft-note,.sg-selesai-note,.sg-template-note{padding:34px 20px;text-align:center;border:1px dashed rgba(15,23,42,.14);border-radius:14px;opacity:.72}.sg-draft-note strong,.sg-selesai-note strong,.sg-template-note strong{display:block;color:inherit;opacity:1;margin-bottom:6px}.sg-draft-note span,.sg-selesai-note span,.sg-template-note span{display:block;font-size:.9rem}.sg-draft-badge,.sg-template-badge{display:inline-flex;align-items:center;padding:7px 10px;border-radius:999px;background:rgba(15,23,42,.05);font-size:.78rem;font-weight:700}.sg-selesai-count{padding:12px 15px;border-radius:14px;background:var(--sg-surface,#fff);border:1px solid rgba(15,23,42,.08);white-space:nowrap}.sg-draft-info,.sg-selesai-info,.sg-template-info{margin-top:14px;font-size:.86rem;opacity:.62}@media(max-width:700px){.sg-draft-head,.sg-selesai-head,.sg-template-head{display:block}.sg-draft-card,.sg-selesai-card,.sg-template-card{padding:16px}.sg-selesai-count,.sg-template-badge{display:inline-block;margin-top:14px}}
  `;
  document.head.appendChild(style);

  const view = document.createElement('section');
  view.id = 'draftView';
  view.className = 'inner-view sg-draft-view';
  view.hidden = true;
  view.setAttribute('aria-label', 'Dokumen Draft');
  view.innerHTML = `
    <div class="sg-draft-head"><div><button type="button" class="sg-draft-back">← Beranda</button><span class="sg-draft-eyebrow">DOKUMEN</span><h1>Draft</h1><p>Ruang untuk menyiapkan dokumen sebelum diselesaikan dan disimpan sebagai dokumen final.</p></div><span class="sg-draft-badge">Draft</span></div>
    <div class="sg-draft-card"><div class="sg-draft-toolbar"><h2>Draft tersimpan</h2><span class="structure-note">Belum ada data draft</span></div><div class="sg-draft-note"><strong>Belum ada draft</strong><span>Draft akan muncul di sini setelah fitur pembuatan dokumen dihubungkan ke penyimpanan dokumen SIAP GURU.</span></div><div class="sg-draft-info">Fondasi ini tidak mengubah D1 atau Worker. Data dokumen belum dibuat karena backend dokumen belum tersedia di repo.</div></div>`;
  mainContent.appendChild(view);

  const selesaiView = document.createElement('section');
  selesaiView.id = 'selesaiView';
  selesaiView.className = 'inner-view sg-selesai-view';
  selesaiView.hidden = true;
  selesaiView.setAttribute('aria-label', 'Dokumen Selesai');
  selesaiView.innerHTML = `
    <div class="sg-selesai-head"><div><button type="button" class="sg-selesai-back">← Beranda</button><span class="sg-selesai-eyebrow">DOKUMEN</span><h1>Selesai</h1><p>Dokumen yang sudah selesai dan siap digunakan.</p></div><div class="sg-selesai-count"><strong>0 dokumen</strong><br><span>Belum ada dokumen terhubung</span></div></div>
    <div class="sg-selesai-card"><div class="sg-draft-toolbar"><h2>Dokumen selesai</h2><span class="structure-note">Belum ada data</span></div><div class="sg-selesai-note"><strong>Belum ada dokumen selesai</strong><span>Modul tampilan sudah disiapkan. Data final akan ditampilkan setelah sumber dokumen tersedia.</span></div><div class="sg-selesai-info">Tidak ada perubahan pada D1 atau Worker. Repo saat ini belum memiliki API penyimpanan dokumen.</div></div>`;
  mainContent.appendChild(selesaiView);

  const templateView = document.createElement('section');
  templateView.id = 'templateView';
  templateView.className = 'inner-view sg-template-view';
  templateView.hidden = true;
  templateView.setAttribute('aria-label', 'Dokumen Template');
  templateView.innerHTML = `
    <div class="sg-template-head"><div><button type="button" class="sg-template-back">← Beranda</button><span class="sg-template-eyebrow">DOKUMEN</span><h1>Template</h1><p>Templat dokumen yang dapat menjadi dasar pembuatan dokumen guru.</p></div><span class="sg-template-badge">Template</span></div>
    <div class="sg-template-card"><div class="sg-draft-toolbar"><h2>Template tersedia</h2><span class="structure-note">Belum ada data</span></div><div class="sg-template-note"><strong>Belum ada template</strong><span>Modul tampilan sudah disiapkan. Template akan ditampilkan setelah sumber template resmi tersedia.</span></div><div class="sg-template-info">Tidak ada perubahan pada D1 atau Worker. Repo saat ini belum memiliki API penyimpanan template.</div></div>`;
  mainContent.appendChild(templateView);

  const closeMenus = () => document.querySelectorAll('.sg-topnav-item.is-open').forEach(item => {
    item.classList.remove('is-open'); item.setAttribute('aria-expanded', 'false');
  });

  const hideViews = () => {
    homeView.hidden = true;
    document.getElementById('studentsView')?.setAttribute('hidden','');
    document.getElementById('profileView')?.setAttribute('hidden','');
    document.querySelector('.sg-rombel-view')?.setAttribute('hidden','');
    view.hidden = true;
    selesaiView.hidden = true;
    templateView.hidden = true;
  };
  const openDraft = () => { closeMenus(); hideViews(); view.hidden=false; window.scrollTo({top:0,behavior:'smooth'}); };
  const openSelesai = () => { closeMenus(); hideViews(); selesaiView.hidden=false; window.scrollTo({top:0,behavior:'smooth'}); };
  const openTemplate = () => { closeMenus(); hideViews(); templateView.hidden=false; window.scrollTo({top:0,behavior:'smooth'}); };
  const backHome = (target) => { target.hidden=true; homeView.hidden=false; window.scrollTo({top:0,behavior:'smooth'}); };

  view.querySelector('.sg-draft-back')?.addEventListener('click', () => backHome(view));
  selesaiView.querySelector('.sg-selesai-back')?.addEventListener('click', () => backHome(selesaiView));
  templateView.querySelector('.sg-template-back')?.addEventListener('click', () => backHome(templateView));

  document.querySelectorAll('.sg-topnav-link').forEach(link => {
    const text = link.textContent.trim();
    if (text === 'Draft' && !link.dataset.sgDraftBound) { link.dataset.sgDraftBound='1'; link.addEventListener('click', event => { event.preventDefault(); openDraft(); }); }
    if (text === 'Selesai' && !link.dataset.sgSelesaiBound) { link.dataset.sgSelesaiBound='1'; link.addEventListener('click', event => { event.preventDefault(); openSelesai(); }); }
    if (text === 'Template' && !link.dataset.sgTemplateBound) { link.dataset.sgTemplateBound='1'; link.addEventListener('click', event => { event.preventDefault(); openTemplate(); }); }
  });
  document.querySelectorAll('.sub-menu span').forEach(item => {
    const text=item.textContent.trim();
    if (text==='Selesai' && !item.dataset.sgSelesaiBound) { item.dataset.sgSelesaiBound='1'; item.style.cursor='pointer'; item.addEventListener('click', event => { event.stopPropagation(); openSelesai(); }); }
    if (text==='Template' && !item.dataset.sgTemplateBound) { item.dataset.sgTemplateBound='1'; item.style.cursor='pointer'; item.addEventListener('click', event => { event.stopPropagation(); openTemplate(); }); }
  });
});