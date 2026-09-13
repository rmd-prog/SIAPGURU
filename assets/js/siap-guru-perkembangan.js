document.addEventListener('DOMContentLoaded', () => {
  const rawUser = sessionStorage.getItem('siapguru_user');
  let user = null;
  try { user = rawUser ? JSON.parse(rawUser) : null; } catch (_) {}
  if (!user?.id) return;

  const API_BASE = 'https://siapguru.adm-sd.workers.dev/api';
  const esc = (v) => String(v ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const closeMenus = () => document.querySelectorAll('.sg-topnav-item.is-open').forEach(x => { x.classList.remove('is-open'); x.setAttribute('aria-expanded','false'); });

  const style = document.createElement('style');
  style.textContent = `
    .sg-perkembangan-view{padding:4px 0 40px}.sg-perkembangan-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;padding:22px;border:1px solid rgba(205,219,235,.8);border-radius:17px;background:linear-gradient(115deg,#fff,#eef7ff 45%,#f5f0ff 75%,#effaf6);box-shadow:0 10px 25px rgba(45,75,110,.05)}
    .sg-perkembangan-back{border:0;background:transparent;padding:0;margin:0 0 12px;color:#657083;font:inherit;font-size:11px;font-weight:750;cursor:pointer}.sg-perkembangan-head h1{margin:5px 0 4px;font-size:clamp(25px,4vw,34px)}.sg-perkembangan-head p{margin:0;color:#748196;font-size:12px}.sg-perkembangan-stat{min-width:150px;padding:11px 13px;border:1px solid rgba(216,225,237,.9);border-radius:11px;background:rgba(255,255,255,.82)}.sg-perkembangan-stat strong,.sg-perkembangan-stat span{display:block}.sg-perkembangan-stat strong{font-size:17px}.sg-perkembangan-stat span{margin-top:3px;color:#7c8a9c;font-size:10px}
    .sg-perkembangan-toolbar{display:flex;justify-content:space-between;align-items:center;gap:10px;margin:15px 0 10px}.sg-perkembangan-search{width:min(430px,100%);padding:11px 13px;border:1px solid #dfe3e8;border-radius:10px;background:#fff;outline:none;font-size:12px}.sg-perkembangan-filter{padding:10px 11px;border:1px solid #dfe3e8;border-radius:10px;background:#fff;color:#4b5668;font-size:11px}
    .sg-perkembangan-list{display:grid;gap:8px}.sg-perkembangan-student{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:12px;padding:13px 15px;border:1px solid #e0e6ed;border-radius:13px;background:#fff}.sg-perkembangan-avatar{width:34px;height:34px;border-radius:9px;display:grid;place-items:center;background:linear-gradient(135deg,#eaf5ff,#f2edff);color:#4f6d91;font-weight:800;font-size:12px}.sg-perkembangan-student strong{display:block;font-size:12px;color:#25364a}.sg-perkembangan-student span{display:block;margin-top:3px;color:#8a96a6;font-size:9px}.sg-perkembangan-badges{display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end}.sg-perkembangan-badge{padding:5px 7px;border-radius:7px;background:#f5f7fa;border:1px solid #e7edf3;color:#69788b;font-size:9px}.sg-perkembangan-empty{padding:28px;text-align:center;color:#7a8797;border:1px dashed #dbe3eb;border-radius:13px;background:#fff}.sg-perkembangan-error{color:#b42318}
    @media(max-width:650px){.sg-perkembangan-head,.sg-perkembangan-toolbar{display:block}.sg-perkembangan-stat{display:inline-block;margin-top:13px}.sg-perkembangan-search{width:100%;margin-bottom:8px}.sg-perkembangan-student{grid-template-columns:34px minmax(0,1fr)}.sg-perkembangan-badges{grid-column:2;justify-content:flex-start}}
  `;
  document.head.appendChild(style);

  const main = document.querySelector('.main-content');
  if (!main || document.querySelector('.sg-perkembangan-view')) return;
  const view = document.createElement('section');
  view.className = 'sg-perkembangan-view';
  view.hidden = true;
  view.setAttribute('aria-label','Perkembangan Peserta Didik');
  view.innerHTML = `
    <div class="sg-perkembangan-head"><div><button type="button" class="sg-perkembangan-back">← Beranda</button><span class="eyebrow">PESERTA DIDIK</span><h1>Perkembangan</h1><p>Pantau perkembangan peserta didik berdasarkan data siswa yang menjadi akses guru.</p></div><div class="sg-perkembangan-stat"><strong id="sgPerkembanganCount">0 siswa</strong><span id="sgPerkembanganMeta">Memuat data...</span></div></div>
    <div class="sg-perkembangan-toolbar"><input id="sgPerkembanganSearch" class="sg-perkembangan-search" type="search" placeholder="Cari nama, NIS, NISN, atau rombel..." autocomplete="off"><select id="sgPerkembanganFilter" class="sg-perkembangan-filter"><option value="">Semua rombel</option></select></div>
    <div id="sgPerkembanganList" class="sg-perkembangan-list"><div class="sg-perkembangan-empty">Memuat peserta didik...</div></div>`;
  main.appendChild(view);

  let students = [];
  const render = () => {
    const list = document.getElementById('sgPerkembanganList');
    const q = (document.getElementById('sgPerkembanganSearch')?.value || '').trim().toLowerCase();
    const rombel = document.getElementById('sgPerkembanganFilter')?.value || '';
    let rows = students.filter(s => !rombel || String(s.rombel || '') === rombel);
    if (q) rows = rows.filter(s => [s.nama,s.nis,s.nisn,s.rombel,s.kelas].some(v => String(v ?? '').toLowerCase().includes(q)));
    document.getElementById('sgPerkembanganCount').textContent = `${rows.length} siswa`;
    if (!rows.length) { list.innerHTML = '<div class="sg-perkembangan-empty">Tidak ada peserta didik yang cocok.</div>'; return; }
    list.innerHTML = rows.map((s,i) => {
      const initial = String(s.nama || 'S').trim().charAt(0).toUpperCase();
      return `<article class="sg-perkembangan-student"><div class="sg-perkembangan-avatar">${esc(initial)}</div><div><strong>${esc(s.nama || '-')}</strong><span>NIS ${esc(s.nis || '-')} • NISN ${esc(s.nisn || '-')}</span></div><div class="sg-perkembangan-badges"><span class="sg-perkembangan-badge">Kelas ${esc(s.kelas ?? '-')}</span><span class="sg-perkembangan-badge">${esc(s.rombel || 'Tanpa rombel')}</span></div></article>`;
    }).join('');
  };

  const load = async () => {
    try {
      const response = await fetch(`${API_BASE}/students?user_id=${encodeURIComponent(user.id)}`, { cache:'no-store' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.message || 'Data perkembangan gagal dimuat.');
      students = data.students || [];
      const select = document.getElementById('sgPerkembanganFilter');
      const keys = [...new Set(students.map(s => String(s.rombel || '')).filter(Boolean))].sort();
      select.innerHTML = '<option value="">Semua rombel</option>' + keys.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');
      document.getElementById('sgPerkembanganMeta').textContent = keys.length ? keys.join(' • ') : 'Belum ada rombel';
      render();
    } catch (error) {
      document.getElementById('sgPerkembanganList').innerHTML = `<div class="sg-perkembangan-empty sg-perkembangan-error">${esc(error?.message || 'Data perkembangan gagal dimuat.')}</div>`;
    }
  };

  const open = () => {
    closeMenus();
    document.getElementById('homeView').hidden = true;
    document.getElementById('studentsView').hidden = true;
    document.getElementById('profileView')?.setAttribute('hidden','');
    document.querySelector('.sg-room-view')?.remove();
    view.hidden = false;
    window.scrollTo({top:0,behavior:'smooth'});
    load();
  };

  view.querySelector('.sg-perkembangan-back')?.addEventListener('click', () => { view.hidden = true; document.getElementById('homeView').hidden = false; window.scrollTo({top:0,behavior:'smooth'}); });
  document.getElementById('sgPerkembanganSearch')?.addEventListener('input', render);
  document.getElementById('sgPerkembanganFilter')?.addEventListener('change', render);

  document.querySelectorAll('.sg-topnav-link').forEach(link => {
    if (link.textContent.trim() === 'Perkembangan') link.addEventListener('click', event => { event.preventDefault(); open(); });
  });
});