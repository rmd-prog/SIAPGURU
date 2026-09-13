document.addEventListener('DOMContentLoaded', () => {
  const rombelSelect = document.getElementById('rombel');
  const table = document.getElementById('planTable');
  const plansKey = 'siapGuruPlans';
  const rombelKey = 'siapGuruRombel';
  const esc = value => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function getPlans(){ return JSON.parse(localStorage.getItem(plansKey) || '[]'); }
  function getRombel(){ return JSON.parse(localStorage.getItem(rombelKey) || '[]'); }

  function render(){
    const rombel = getRombel(), plans = getPlans();
    rombelSelect.innerHTML = '<option value="">Pilih rombel</option>' + rombel.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('');
    table.innerHTML = plans.length ? plans.map((p,i) => `<tr><td>${i+1}</td><td>${esc(p.rombel)}</td><td>${esc(p.mapel)}</td><td>${esc(p.materi)}</td><td>${esc(p.alokasi)}</td></tr>`).join('') : '<tr><td colspan="5" class="empty">Belum ada rencana.</td></tr>';
    document.getElementById('countRombel').textContent = rombel.length;
    document.getElementById('countMapel').textContent = new Set(plans.map(p => p.mapel.toLowerCase())).size;
    document.getElementById('countRencana').textContent = plans.length;
  }

  document.getElementById('savePlan')?.addEventListener('click', () => {
    const rombel = rombelSelect.value, mapel = document.getElementById('mapel').value.trim(), materi = document.getElementById('materi').value.trim(), alokasi = document.getElementById('alokasi').value.trim(), message = document.getElementById('message');
    if(!rombel || !mapel || !materi){ message.textContent = 'Rombel, mata pelajaran, dan materi wajib diisi.'; return; }
    const plans = getPlans(); plans.push({rombel,mapel,materi,alokasi:alokasi || '-'}); localStorage.setItem(plansKey, JSON.stringify(plans));
    document.getElementById('mapel').value=''; document.getElementById('materi').value=''; document.getElementById('alokasi').value=''; message.textContent='Rencana pembelajaran tersimpan ✓'; render();
  });

  document.getElementById('saveNote')?.addEventListener('click', () => {
    localStorage.setItem('siapGuruLearningNote', document.getElementById('catatan').value); document.getElementById('noteMessage').textContent='Catatan tersimpan di perangkat ini ✓';
  });

  document.getElementById('catatan').value = localStorage.getItem('siapGuruLearningNote') || '';
  render();
});
