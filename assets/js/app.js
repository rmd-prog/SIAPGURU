document.addEventListener('DOMContentLoaded', () => {
  const rawUser = sessionStorage.getItem('siapguru_user');
  let user = null;

  try { user = rawUser ? JSON.parse(rawUser) : null; } catch (_) {}

  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const name = user.nama || 'Guru';
  const kelas = user.kelas ? `Kelas ${user.kelas}` : '';
  const rombel = user.rombel || '';
  const mapel = user.mapel || '';
  const meta = [kelas, rombel, mapel].filter(Boolean).join(' • ') || 'Guru';

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('userNameTop', name);
  setText('teacherName', name);
  setText('teacherMeta', meta);
  setText('welcomeTitle', `Selamat datang, ${name}`);
  setText('welcomeText', 'Ruang kerja guru Anda sudah siap. Pilih modul yang ingin dikerjakan.');

  document.getElementById('logoutButton')?.addEventListener('click', () => {
    sessionStorage.removeItem('siapguru_user');
    window.location.href = 'login.html';
  });
});
