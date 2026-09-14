(()=>{
  async function openRPM(){
    try{
      window.__sgRpmBoot=0;
      const res=await fetch('assets/js/siap-guru-rpm.js?rpmfix='+Date.now(),{cache:'no-store'});
      if(!res.ok) throw new Error('RPM source '+res.status);
      let code=await res.text();
      const close='})();';
      const pos=code.lastIndexOf(close);
      if(pos<0) throw new Error('RPM wrapper tidak ditemukan');
      code=code.slice(0,pos)+';window.__openSiapGuruRPM=boot;'+code.slice(pos);
      (0,eval)(code);
      window.__sgRpmBoot=0;
      if(typeof window.__openSiapGuruRPM!=='function') throw new Error('boot RPM tidak tersedia');
      window.__openSiapGuruRPM();
    }catch(err){
      console.error('RPM navigation:',err);
    }
  }
  window.__forceOpenSiapGuruRPM=openRPM;
  document.addEventListener('click',e=>{
    const link=e.target.closest?.('.sg-topnav-link');
    if(!link||link.textContent.trim()!=='RPM Deep Learning')return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openRPM();
  },true);
})();
