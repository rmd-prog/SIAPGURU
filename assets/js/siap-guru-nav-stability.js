/* SIAP GURU — RPM route stability
   Owns only the RPM menu click path. No D1, Worker, login, Dashboard, or RPM data is changed. */
(()=>{
  const resetRoomBoot=()=>{ window.__sgRpmBoot=0; };
  let opening=false;

  const openRPM=async()=>{
    resetRoomBoot();
    if(typeof window.__openSiapGuruRPM==='function'){
      window.__openSiapGuruRPM();
      return;
    }
    if(opening)return;
    opening=true;
    try{
      const response=await fetch('assets/js/siap-guru-rpm.js?v=7',{cache:'no-store'});
      if(!response.ok)throw new Error('RPM script gagal dimuat: '+response.status);
      let source=await response.text();
      source=source.replace('const boot=()=>{','const boot=window.__openSiapGuruRPM=()=>{');
      (0,eval)(source);
      if(typeof window.__openSiapGuruRPM==='function'){
        resetRoomBoot();
        window.__openSiapGuruRPM();
      }
    }catch(error){
      console.error('[SIAP GURU] RPM route:',error);
    }finally{
      opening=false;
    }
  };

  const findRPMLink=target=>{
    const el=target instanceof Element?target:null;
    const link=el?.closest('.sg-topnav-link');
    if(!link)return null;
    return link.textContent.trim()==='RPM Deep Learning'?link:null;
  };

  document.addEventListener('click',event=>{
    const link=findRPMLink(event.target);
    if(!link)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openRPM();
  },true);
})();
