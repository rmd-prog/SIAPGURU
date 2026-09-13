/* SIAP GURU — navigation stability layer
   Clears stale in-memory room boot guards before Pembelajaran/Asesmen navigation.
   No data, D1, Worker, login, or room content is changed. */
(()=>{
  const learning = new Set(['CP','ATP','TP','PROTA','PROSEM','Perangkat','RPM Deep Learning','LKPD','Materi','AI Generate']);
  const assessment = new Set(['Penilaian','Penilaian per Bab','Ulangan Semester','Akhir Semester','Rekap Nilai','Analisis']);
  const resetRoomBoots=()=>{
    window.__sgAtpBoot=0;
    window.__sgTpBoot=0;
    window.__sgProtaBoot=0;
    window.__sgProsemBoot=0;
    window.__sgPerangkatBoot=0;
    window.__sgRpmBoot=0;
    window.__sgPenilaianBoot=0;
    window.__sgPenilaianBabBoot=false;
    window.__sgUlanganSemesterBoot=false;
    window.__sgAkhirSemesterBoot=false;
    window.__sgRekapNilaiBoot=0;
  };
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('.sg-topnav-link');
    if(!link)return;
    const text=link.textContent.trim();
    if(learning.has(text)||assessment.has(text)) resetRoomBoots();
  },true);
})();
