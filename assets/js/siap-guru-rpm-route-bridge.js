/* SIAP GURU RPM route bridge
   The deployed RPM script exposes its native boot function through the Pages build.
   This bridge is a bubble-phase fallback only: it does not block propagation. */
(()=>{
  const open=()=>{
    if(typeof window.__openSiapGuruRPM==='function'){
      window.__sgRpmBoot=0;
      window.__openSiapGuruRPM();
      return true;
    }
    return false;
  };
  document.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target:null;
    const link=target?.closest('.sg-topnav-link');
    if(link&&link.textContent.trim()==='RPM Deep Learning'){
      if(!document.querySelector('.sg-rpm-room')) open();
    }
  },false);
})();
