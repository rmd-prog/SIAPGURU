document.addEventListener('DOMContentLoaded', () => {
  const rawUser = sessionStorage.getItem('siapguru_user');
  let user = null;
  try { user = rawUser ? JSON.parse(rawUser) : null; } catch (_) {}
  if (!user?.id) return;

  const API_BASE = 'https://siapguru.adm-sd.workers.dev/api';
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const closeMenus = () => document.querySelectorAll('.sg-topnav-item.is-open').forEach(item => {
    item.classList.remove('is-open');
    item.setAttribute('aria-expanded', 'false');
  });

  const style = document.createElement('style');
  style.textContent = `
    .sg-rombel-view{padding:28px 0 40px}.sg-rombel-head{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;margin-bottom:22px}.sg-rombel-back{border:0;background:transparent;padding:0;color:inherit;font:inherit;cursor:pointer;margin-bottom:10px}.sg-rombel-eyebrow{display:block;font-size:.72rem;letter-spacing:.12em;font-weight:700;opacity:.65}.sg-rombel-head h1{margin:5px 0 7px}.sg-rombel-head p{margin:0;opacity:.72}.sg-rombel-access{padding:12px 15px;border-radius:14px;background:var(--sg-surface,#fff);border:1px solid rgba(15,23,42,.08);white-space:nowrap}.sg-rombel-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:22px}.sg-rombel-card{border:1px solid rgba(15,23,42,.08);background:var(--sg-surface,#fff);border-radius:18px;padding:18px;cursor:pointer;text-align:left;box-shadow:0 8px 24px rgba(15,23,42,.04)}.sg-rombel-card:hover,.sg-rombel-card.is-active{transform:translateY(-1px);border-color:rgba(15,23,42,.18)}.sg-rombel-card strong{display:block;font-size:1.15rem}.sg-rombel-card span{display:block;margin-top:5px;opacity:.65;font-size:.86rem}.sg-rombel-list{border:1px solid rgba(15,23,42,.08);background:var(--sg-surface,#fff);border-radius:18px;overflow:hidden}.sg-rombel-list-head{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:16px 18px;border-bottom:1px solid rgba(15,23,42,.07)}.sg-rombel-list-head h2{margin:0;font-size:1rem}.sg-rombel-search{width:min(320px,100%);padding:10px 12px;border:1px solid rgba(15,23,42,.12);border-radius:11px;background:transparent}.sg-rombel-table-wrap{overflow:auto}.sg-rombel-table{width:100%;border-collapse:collapse}.sg-rombel-table th,.sg-rombel-table td{padding:12px 14px;text-align:left;border-bottom:1px solid rgba(15,23,42,.06);font-size:.9rem}.sg-rombel-table th{font-size:.76rem;text-transform:uppercase;letter-spacing:.05em;opacity:.6}.sg-rombel-empty{padding:28px;text-align:center;opacity:.62}.sg-rombel-error{color:#b42318}@media(max-width:700px){.sg-rombel-head,.sg-rombel-list-head{display:block}.sg-rombel-access{display:inline-block;margin-top:14px}.sg-rombel-search{margin-top:12px}}
  `;
  document.head.appendChild(style);

  const mainContent = document.querySelector('.main-content');
  if (!mainContent || document.querySelector('.sg-rombel-view')) return;
  const view = document.createElement('section');
  view.className = 'sg-rombel-view';
  view.hidden = true;
  view.setAttribute('aria-label', 'Rombel');
  view.innerHTML = `
    <div class="sg-rombel-head">
      <div><button type="button" class="sg-rombel-back">← Beranda</button><span class="sg-rombel-eyebrow">PESERTA DIDIK</span><h1>Rombel</h1><p>Kelompok belajar yang berada dalam akses guru.</p></div>
      <div class="sg-rombel-access"><strong id="sgRombelAccessCount">0 rombel</strong><br><span id="sgRombelAccessMeta">Memuat akses...</span></div>
    </div>
    <div id="sgRombelGrid" class="sg-rombel-grid"><div class="sg-rombel-empty">Memuat rombel...</div></div>
    <div class="sg-rombel-list">
      <div class="sg-rombel-list-head"><h2 id="sgRombelListTitle">Pilih rombel</h2><input id="sgRombelSearch" class="sg-rombel-search" type="search" placeholder="Cari nama, NIS, atau NISN..." autocomplete="off"></div>
      <div class="sg-rombel-table-wrap"><table class="sg-rombel-table"><thead><tr><th>No.</th><th>NIS</th><th>NISN</th><th>Nama</th><th>L/P</th><th>Kelas</th><th>Rombel</th></tr></thead><tbody id="sgRombelTableBody"><tr><td colspan="7" class="sg-rombel-empty">Pilih rombel untuk melihat siswa.</td></tr></tbody></table></div>
    </div>`;
  mainContent.appendChild(view);

  let allStudents = [];
  let selectedRombel = '';

  const renderStudents = () => {
    const body = document.getElementById('sgRombelTableBody');
    const q = document.getElementById('sgRombelSearch')?.value.trim().toLowerCase() || '';
    if (!body) return;
    let rows = selectedRombel ? allStudents.filter(s => String(s.rombel || '') === selectedRombel) : [];
    if (q) rows = rows.filter(s => [s.nama,s.nis,s.nisn].some(v => String(v || '').toLowerCase().includes(q)));
    if (!rows.length) { body.innerHTML = `<tr><td colspan="7" class="sg-rombel-empty">${selectedRombel ? 'Tidak ada siswa yang cocok.' : 'Pilih rombel untuk melihat siswa.'}</td></tr>`; return; }
    body.innerHTML = rows.map((s,i) => `<tr><td>${i+1}</td><td>${escapeHtml(s.nis || '-')}</td><td>${escapeHtml(s.nisn || '-')}</td><td><strong>${escapeHtml(s.nama || '-')}</strong></td><td>${escapeHtml(s.jenis_kelamin || '-')}</td><td>${escapeHtml(s.kelas ?? '-')}</td><td>${escapeHtml(s.rombel || '-')}</td></tr>`).join('');
  };

  const renderRombel = (access) => {
    const grid = document.getElementById('sgRombelGrid');
    if (!grid) return;
    const keys = [...new Set((access || []).map(x => `${x.kelas}|||${x.rombel || ''}`))].map(key => {
      const [kelas, rombel] = key.split('|||');
      return { kelas, rombel };
    }).filter(x => x.rombel);
    document.getElementById('sgRombelAccessCount').textContent = `${keys.length} rombel`;
    document.getElementById('sgRombelAccessMeta').textContent = keys.length ? keys.map(x => `Kelas ${x.kelas} • ${x.rombel}`).join(' • ') : 'Belum ada rombel terhubung';
    if (!keys.length) { grid.innerHTML = '<div class="sg-rombel-empty">Belum ada rombel yang terhubung ke akun guru.</div>'; return; }
    grid.innerHTML = keys.map(x => {
      const count = allStudents.filter(s => String(s.kelas) === String(x.kelas) && String(s.rombel || '') === x.rombel).length;
      return `<button type="button" class="sg-rombel-card" data-kelas="${escapeHtml(x.kelas)}" data-rombel="${escapeHtml(x.rombel)}"><strong>${escapeHtml(x.rombel)}</strong><span>Kelas ${escapeHtml(x.kelas)} • ${count} siswa</span></button>`;
    }).join('');
    grid.querySelectorAll('.sg-rombel-card').forEach(card => card.addEventListener('click', () => {
      grid.querySelectorAll('.sg-rombel-card').forEach(c => c.classList.remove('is-active'));
      card.classList.add('is-active');
      selectedRombel = card.dataset.rombel || '';
      document.getElementById('sgRombelListTitle').textContent = `Siswa ${selectedRombel} • Kelas ${card.dataset.kelas}`;
      document.getElementById('sgRombelSearch').value = '';
      renderStudents();
    }));
  };

  const load = async () => {
    const grid = document.getElementById('sgRombelGrid');
    try {
      const response = await fetch(`${API_BASE}/students?user_id=${encodeURIComponent(user.id)}`, { cache: 'no-store' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.message || 'Data rombel gagal dimuat.');
      allStudents = data.students || [];
      renderRombel(data.access || []);
      renderStudents();
    } catch (error) {
      if (grid) grid.innerHTML = `<div class="sg-rombel-empty sg-rombel-error">${escapeHtml(error?.message || 'Data rombel gagal dimuat.')}</div>`;
    }
  };

  const open = () => {
    closeMenus();
    document.getElementById('homeView').hidden = true;
    document.getElementById('studentsView').hidden = true;
    document.querySelector('.sg-room-view')?.remove();
    view.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    load();
  };

  view.querySelector('.sg-rombel-back')?.addEventListener('click', () => { view.hidden = true; document.getElementById('homeView').hidden = false; window.scrollTo({ top: 0, behavior: 'smooth' }); });
  document.getElementById('sgRombelSearch')?.addEventListener('input', renderStudents);

  document.querySelectorAll('.sg-topnav-link').forEach(link => {
    if (link.textContent.trim() === 'Rombel') link.addEventListener('click', event => { event.preventDefault(); open(); });
  });
});