/* SIAP GURU — TP <- ATP import context sync v1
   Setelah Ambil dari ATP, BAB/Topik lama wajib dilepas.
   ATP tidak memiliki BAB/Topik, jadi TP menunggu pemilihan BAB baru.
   Scoped only to TP. Tidak menyentuh D1/Worker/RPM/ATP.
*/
(()=>{
  if(window.__sgTpAtpImportSyncV1)return;
  window.__sgTpAtpImportSyncV1=1;

  document.addEventListener('click',e=>{
    const b=e.target instanceof Element?e.target.closest('#sgTpImport'):null;
    if(!b)return;

    // Biarkan handler asli TP menyelesaikan import ATP terlebih dahulu.
    setTimeout(()=>{
      const room=document.querySelector('.sg-tp-room');
      if(!room)return;

      const subject=room.querySelector('#sgTpSubject')?.value?.trim()||'';
      const fase=room.querySelector('#sgTpPhase')?.value?.trim()||'';
      const kelas=room.querySelector('#sgTpClass')?.value?.trim()||'';
      const semester=room.querySelector('#sgTpSemester')?.value||'1';
      const topic=room.querySelector('#sgTpTopic');

      // Import ATP mengganti konteks TP, tetapi ATP memang tidak membawa BAB.
      // Karena itu BAB lama (mis. "Harmoni dalam Ekosistem") tidak boleh ikut.
      try{sessionStorage.removeItem('siapguru_selected_topic')}catch(_){ }
      if(topic){topic.value='';topic.dispatchEvent(new Event('change',{bubbles:false}))}

      // Beri tahu smart BAB dropdown untuk membangun ulang daftar berdasarkan
      // Mapel + Fase + Kelas + Semester yang baru dari ATP, tanpa memilih BAB lama.
      document.dispatchEvent(new CustomEvent('siapguru:topic-selected',{
        detail:{mapel:subject,fase,kelas,semester,id:'',bab:''}
      }));
    },0);
  },false);
})();
