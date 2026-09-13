document.addEventListener('DOMContentLoaded', () => {
  const rawUser = sessionStorage.getItem('siapguru_user');
  let user = null;
  try { user = rawUser ? JSON.parse(rawUser) : null; } catch (_) {}
  if (!user?.id) { window.location.href = 'login.html'; return; }

  const API_BASE = 'https://siapguru.adm-sd.workers.dev/api';
  const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  const name = user.nama || 'Guru';
  setText('userNameTop', name);
  setText('teacherName', name);
  setText('welcomeTitle', `Selamat datang, ${name}`);
  setText('welcomeText', 'Ruang kerja guru Anda sudah siap. Data di bawah terhubung ke D1 sesuai akses guru.');
  setText('teacherMeta', [user.kelas ? `Kelas ${user.kelas}` : '', user.rombel ? `Rombel ${user.rombel}` : '', user.mapel || ''].filter(Boolean).join(' • ') || 'Guru');

  document.getElementById('logoutButton')?.addEventListener('click', () => {
    sessionStorage.removeItem('siapguru_user');
    window.location.href = 'login.html';
  });

  // Visual V1: top-level menu stays compact; only one submenu opens at a time.
  document.querySelectorAll('[data-menu-toggle]').forEach(card => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('[data-view="students"]')) return;
      const wasOpen = card.classList.contains('sg-open');
      document.querySelectorAll('[data-menu-toggle].sg-open').forEach(item => item.classList.remove('sg-open'));
      if (!wasOpen) card.classList.add('sg-open');
    });
  });

  const cards = document.querySelectorAll('.summary-card');
  const statIds = ['students', 'perangkat', 'nilai', 'rpm'];
  cards.forEach((card, index) => { if (statIds[index]) card.setAttribute('data-stat-card', statIds[index]); });

  const loadDashboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/dashboard?user_id=${encodeURIComponent(user.id)}`, { cache: 'no-store' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.message || 'Data dashboard gagal dimuat.');
      const stats = data.stats || {};
      const values = [stats.students ?? 0, stats.perangkat ?? 0, stats.nilai ?? 0, stats.rpm ?? 0];
      cards.forEach((card, index) => {
        const old = card.querySelector('.summary-value');
        if (old) old.remove();
        const value = document.createElement('strong');
        value.className = 'summary-value';
        value.textContent = values[index];
        card.appendChild(value);
      });
    } catch (error) {
      console.error('Dashboard:', error);
    }
  };

  const homeView = document.getElementById('homeView');
  const studentsView = document.getElementById('studentsView');
  const searchInput = document.getElementById('studentSearch');
  let searchTimer;

  const renderStudents = (students) => {
    const body = document.getElementById('studentsTableBody');
    if (!body) return;
    setText('studentResultCount', `${students.length} siswa`);
    body.innerHTML = '';
    if (!students.length) {
      body.innerHTML = '<tr><td colspan="7" class="empty-state">Tidak ada siswa yang cocok dengan pencarian.</td></tr>';
      return;
    }
    students.forEach((student, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${index + 1}</td><td>${escapeHtml(student.nis || '-')}</td><td>${escapeHtml(student.nisn || '-')}</td><td><strong>${escapeHtml(student.nama || '-')}</strong></td><td>${escapeHtml(student.jenis_kelamin || '-')}</td><td>${escapeHtml(student.kelas ?? '-')}</td><td>${escapeHtml(student.rombel || '-')}</td>`;
      body.appendChild(tr);
    });
  };

  const loadStudents = async (search = '') => {
    const body = document.getElementById('studentsTableBody');
    if (body && !search) body.innerHTML = '<tr><td colspan="7" class="empty-state">Memuat data siswa...</td></tr>';
    try {
      const url = `${API_BASE}/students?user_id=${encodeURIComponent(user.id)}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
      const response = await fetch(url, { cache: 'no-store' });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.message || 'Data siswa gagal dimuat.');
      renderStudents(data.students || []);
      setText('studentsAccessCount', `${(data.students || []).length} siswa`);
      const access = data.access || [];
      setText('studentsAccessMeta', access.length ? access.map(item => `Kelas ${item.kelas}${item.rombel ? ` • ${item.rombel}` : ''}`).join(' • ') : 'Belum ada rombel terhubung');
    } catch (error) {
      if (body) body.innerHTML = `<tr><td colspan="7" class="empty-state error-state">${escapeHtml(error?.message || 'Data siswa gagal dimuat.')}</td></tr>`;
      setText('studentResultCount', 'Gagal memuat');
    }
  };

  const openStudents = () => {
    homeView.hidden = true;
    studentsView.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    searchInput?.focus();
    loadStudents(searchInput?.value?.trim() || '');
  };

  document.querySelectorAll('[data-view="students"]').forEach(button => button.addEventListener('click', (event) => {
    event.stopPropagation();
    openStudents();
  }));
  document.getElementById('backHomeButton')?.addEventListener('click', () => {
    studentsView.hidden = true;
    homeView.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => loadStudents(searchInput.value.trim()), 220);
  });

  loadDashboard();
});
