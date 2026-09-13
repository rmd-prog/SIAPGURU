document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.querySelector('.main-content');
  const homeView = document.getElementById('homeView');
  if (!mainContent || !homeView || document.getElementById('draftView')) return;

  const style = document.createElement('style');
  style.textContent = `
    .sg-draft-view{padding:28px 0 42px}.sg-draft-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:22px}.sg-draft-back{border:0;background:transparent;padding:0;color:inherit;font:inherit;cursor:pointer;margin-bottom:10px}.sg-draft-eyebrow{display:block;font-size:.72rem;letter-spacing:.12em;font-weight:700;opacity:.65}.sg-draft-head h1{margin:5px 0 7px}.sg-draft-head p{margin:0;opacity:.72}.sg-draft-card{border:1px solid rgba(15,23,42,.08);background:var(--sg-surface,#fff);border-radius:18px;padding:22px;box-shadow:0 8px 24px rgba(15,23,42,.04)}.sg-draft-toolbar{display:flex;justify-content:space-between;gap:14px;align-items:center;margin-bottom:16px}.sg-draft-toolbar h2{margin:0;font-size:1rem}.sg-draft-note{padding:34px 20px;text-align:center;border:1px dashed rgba(15,23,42,.14);border-radius:14px;opacity:.72}.sg-draft-note strong{display:block;color:inherit;opacity:1;margin-bottom:6px}.sg-draft-note span{display:block;font-size:.9rem}.sg-draft-badge{display:inline-flex;align-items:center;padding:7px 10px;border-radius:999px;background:rgba(15,23,42,.05);font-size:.78rem;font-weight:700}.sg-draft-info{margin-top:14px;font-size:.86rem;opacity:.62}@media(max-width:700px){.sg-draft-head{display:block}.sg-draft-card{padding:16px}}
  `;
  document.head.appendChild(style);

  const view = document.createElement('section');
  view.id = 'draftView';
  view.className = 'inner-view sg-draft-view';
  view.hidden = true;
  view.setAttribute('aria-label', 'Dokumen Draft');
  view.innerHTML = `
    <div class="sg-draft-head">
      <div>
        <button type="button" class="sg-draft-back">← Beranda</button>
        <span class="sg-draft-eyebrow">DOKUMEN</span>
        <h1>Draft</h1>
        <p>Ruang untuk menyiapkan dokumen sebelum diselesaikan dan disimpan sebagai dokumen final.</p>
      </div>
      <span class="sg-draft-badge">Draft</span>
    </div>
    <div class="sg-draft-card">
      <div class="sg-draft-toolbar"><h2>Draft tersimpan</h2><span class="structure-note">Belum ada data draft</span></div>
      <div class="sg-draft-note"><strong>Belum ada draft</strong><span>Draft akan muncul di sini setelah fitur pembuatan dokumen dihubungkan ke penyimpanan dokumen SIAP GURU.</span></div>
      <div class="sg-draft-info">Fondasi ini tidak mengubah D1 atau Worker. Data dokumen belum dibuat karena backend dokumen belum tersedia di repo.</div>
    </div>`;
  mainContent.appendChild(view);

  const closeMenus = () => document.querySelectorAll('.sg-topnav-item.is-open').forEach(item => {
    item.classList.remove('is-open');
    item.setAttribute('aria-expanded', 'false');
  });

  const open = () => {
    closeMenus();
    homeView.hidden = true;
    document.getElementById('studentsView')?.setAttribute('hidden', '');
    document.getElementById('profileView')?.setAttribute('hidden', '');
    document.querySelector('.sg-rombel-view')?.setAttribute('hidden', '');
    view.hidden = false;
    window.scrollTo({top:0, behavior:'smooth'});
  };

  view.querySelector('.sg-draft-back')?.addEventListener('click', () => {
    view.hidden = true;
    homeView.hidden = false;
    window.scrollTo({top:0, behavior:'smooth'});
  });

  const bind = () => document.querySelectorAll('.sg-topnav-link').forEach(link => {
    if (link.textContent.trim() === 'Draft' && !link.dataset.sgDraftBound) {
      link.dataset.sgDraftBound = '1';
      link.addEventListener('click', event => { event.preventDefault(); open(); });
    }
  });
  bind();
});