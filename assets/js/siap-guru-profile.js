(() => {
  const esc = (value) => String(value ?? '').replace(/[&<>'\"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const getUser = () => { try { return JSON.parse(sessionStorage.getItem('siapguru_user') || 'null'); } catch { return null; } };

  function closeNav() {
    document.querySelectorAll('.sg-topnav-item.is-open').forEach((el) => {
      el.classList.remove('is-open');
      el.setAttribute('aria-expanded', 'false');
    });
  }

  function goHome() {
    const profile = document.getElementById('profileView');
    const students = document.getElementById('studentsView');
    const home = document.getElementById('homeView');
    if (profile) profile.hidden = true;
    if (students) students.hidden = true;
    if (home) home.hidden = false;
    document.querySelector('.sg-room-view')?.remove();
    closeNav();
    document.querySelectorAll('.active-menu').forEach((el) => el.classList.remove('active-menu'));
    document.querySelector('.menu-home')?.classList.add('active-menu');
    window.scrollTo(0, 0);
  }

  function renderProfile() {
    const view = document.getElementById('profileView');
    if (!view) return;
    const user = getUser() || {};
    const rows = [
      ['Nama Guru', user.nama || '—'], ['NIP', user.username || '—'],
      ['Role', user.role || '—'], ['Kelas', user.kelas || '—'],
      ['Rombel', user.rombel || '—'], ['Mata Pelajaran', user.mapel || '—']
    ];
    const access = user.rombel || user.kelas || 'Akses sesuai akun guru';
    view.innerHTML = `<div class="profile-page"><div class="inner-view-head profile-head"><div><button class="back-button profile-back" type="button">← Beranda</button><span class="eyebrow">PESERTA DIDIK</span><h1>Profil Guru</h1><p>Informasi akun dan akses kerja yang sedang digunakan.</p></div><div class="teacher-chip"><strong>${esc(user.nama || 'Guru')}</strong><span>${esc(access)}</span></div></div><div class="profile-grid"><section class="profile-card profile-main-card"><div class="profile-avatar">${esc((user.nama || 'G').trim().charAt(0).toUpperCase())}</div><div><span class="eyebrow">AKUN GURU</span><h2>${esc(user.nama || 'Guru')}</h2><p>${esc(user.role || 'Guru')}</p></div></section><section class="profile-card profile-detail-card"><div class="profile-card-title"><span class="eyebrow">DATA PROFIL</span><h2>Informasi akun</h2></div><div class="profile-details">${rows.map(([label,value]) => `<div class="profile-detail"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')}</div></section></div></div>`;
    view.querySelector('.profile-back')?.addEventListener('click', goHome);
  }

  function showProfile(event) {
    event?.preventDefault();
    event?.stopPropagation();
    const home = document.getElementById('homeView');
    const students = document.getElementById('studentsView');
    const rombel = document.getElementById('rombelView');
    const profile = document.getElementById('profileView');
    if (!profile) return;
    if (home) home.hidden = true;
    if (students) students.hidden = true;
    if (rombel) rombel.hidden = true;
    document.querySelector('.sg-room-view')?.remove();
    profile.hidden = false;
    closeNav();
    renderProfile();
    window.scrollTo(0, 0);
  }

  window.SIAPGURU_OPEN_PROFILE = showProfile;

  function bindProfileButtons() {
    document.querySelectorAll('[data-view="profile"]').forEach((button) => {
      if (button.dataset.profileBound === '1') return;
      button.dataset.profileBound = '1';
      button.addEventListener('click', showProfile, false);
    });
  }

  function injectStyles() {
    if (document.getElementById('siap-guru-profile-style')) return;
    const style = document.createElement('style');
    style.id = 'siap-guru-profile-style';
    style.textContent = `.profile-grid{display:grid;grid-template-columns:minmax(240px,.72fr) minmax(320px,1.28fr);gap:16px;margin-top:18px}.profile-card{background:var(--sg-card,#fff);border:1px solid rgba(15,23,42,.08);border-radius:18px;padding:22px;box-shadow:0 8px 28px rgba(15,23,42,.05)}.profile-main-card{display:flex;align-items:center;gap:16px;min-height:150px}.profile-avatar{width:64px;height:64px;border-radius:18px;display:grid;place-items:center;background:rgba(15,23,42,.06);font-size:25px;font-weight:800}.profile-card h2{margin:4px 0;font-size:20px}.profile-card p{margin:0;opacity:.7}.profile-card-title{margin-bottom:14px}.profile-details{display:grid;grid-template-columns:1fr 1fr;gap:10px}.profile-detail{padding:12px 14px;border-radius:12px;background:rgba(15,23,42,.035);display:flex;flex-direction:column;gap:4px;min-width:0}.profile-detail span{font-size:12px;opacity:.62}.profile-detail strong{font-size:14px;overflow-wrap:anywhere}@media(max-width:760px){.profile-grid{grid-template-columns:1fr}.profile-details{grid-template-columns:1fr}.profile-main-card{min-height:auto}}`;
    document.head.appendChild(style);
  }

  function loadSchoolInfo() {
    if (window.SiapGuruSchoolInfo || document.querySelector('script[data-siapguru-school-info]')) return;
    const script = document.createElement('script');
    script.src = 'assets/js/siap-guru-school-info-v1.js?v=2';
    script.dataset.siapguruSchoolInfo = '1';
    script.defer = true;
    document.head.appendChild(script);
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    bindProfileButtons();
    loadSchoolInfo();
  });
})();
