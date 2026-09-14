(()=>{
  function openRPM(){
    try{
      window.__sgRpmBoot=0;
      if(typeof window.__openSiapGuruRPM==='function'){
        window.__openSiapGuruRPM();
        return;
      }
      const s=document.createElement('script');
      s.src='assets/js/siap-guru-rpm.js?force='+Date.now();
      s.onload=()=>{
        window.__sgRpmBoot=0;
        if(typeof window.__openSiapGuruRPM==='function') window.__openSiapGuruRPM();
        else console.error('RPM: canonical boot belum tersedia');
      };
      s.onerror=e=>console.error('RPM: gagal memuat canonical source',e);
      document.head.appendChild(s);
    }catch(err){console.error('RPM navigation',err)}
  }
  window.__forceOpenSiapGuruRPM=openRPM;
  document.addEventListener('click',e=>{
    const link=e.target.closest?.('.sg-topnav-link');
    if(!link || link.textContent.trim()!=='RPM Deep Learning') return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openRPM();
  },true);
})();