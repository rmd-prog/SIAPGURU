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

  const cards = document.querySelectorAll('.summary-card');
  const statIds = ['students', 'perangkat', 'nilai', 'rpm'];
  cards.forEach((card, index) => {
    if (statIds[index]) card.setAttribute('data-stat-card', statIds[index]);
  });

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

      const list = document.getElementById('studentPreview');
      if (list) {
        list.innerHTML = '';
        if (!data.students?.length) {
          list.innerHTML = '<div class="empty-state">Belum ada data siswa untuk akses guru ini.</div>';
        } else {
          data.students.forEach(student => {
            const row = document.createElement('div');
            row.className = 'student-row';
            row.innerHTML = `<div><strong>${escapeHtml(student.nama || '-')}</strong><span>${escapeHtml([student.nis ? `NIS ${student.nis}` : '', student.rombel || (student.kelas ? `Kelas ${student.kelas}` : '')].filter(Boolean).join(' • '))}</span></div>`;
            list.appendChild(row);
          });
        }
      }
    } catch (error) {
      const list = document.getElementById('studentPreview');
      if (list) list.innerHTML = `<div class="empty-state error-state">${escapeHtml(error?.message || 'Data dashboard gagal dimuat.')}</div>`;
    }
  };

  loadDashboard();
});
