document.addEventListener('DOMContentLoaded', () => {
  const nama = document.getElementById('nama');
  const nip = document.getElementById('nip');
  const role = document.getElementById('role');
  const rombelInput = document.getElementById('rombel');
  const table = document.getElementById('rombelTable');
  const message = document.getElementById('message');
  const rombelMessage = document.getElementById('rombelMessage');

  const load = () => {
    const profile = JSON.parse(localStorage.getItem('siapGuruProfile') || '{}');
    nama.value = profile.nama || '';
    nip.value = profile.nip || '';
    role.value = profile.role || 'Guru';
    renderRombel();
  };

  const renderRombel = () => {
    const items = JSON.parse(localStorage.getItem('siapGuruRombel') || '[]');
    table.innerHTML = items.length ? items.map((item, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(item)}</td><td>Aktif</td></tr>`).join('') : '<tr><td colspan="3" class="empty">Belum ada rombel.</td></tr>';
  };

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  document.getElementById('saveGuru')?.addEventListener('click', () => {
    if (!nama.value.trim() || !nip.value.trim()) {
      message.textContent = 'Nama guru dan NIP wajib diisi.';
      return;
    }
    localStorage.setItem('siapGuruProfile', JSON.stringify({nama:nama.value.trim(), nip:nip.value.trim(), role:role.value}));
    message.textContent = 'Profil guru tersimpan di perangkat ini ✓';
  });

  document.getElementById('addRombel')?.addEventListener('click', () => {
    const value = rombelInput.value.trim().toUpperCase();
    if (!value) { rombelMessage.textContent = 'Isi nama rombel terlebih dahulu.'; return; }
    const items = JSON.parse(localStorage.getItem('siapGuruRombel') || '[]');
    if (items.includes(value)) { rombelMessage.textContent = 'Rombel tersebut sudah ada.'; return; }
    items.push(value);
    localStorage.setItem('siapGuruRombel', JSON.stringify(items));
    rombelInput.value = '';
    rombelMessage.textContent = 'Rombel ditambahkan ✓';
    renderRombel();
  });

  load();
});
