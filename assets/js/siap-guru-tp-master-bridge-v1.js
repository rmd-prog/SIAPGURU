/* SIAP GURU — TP ↔ Master BAB bridge
   Ensures Master BAB is ready before TP opens its selector.
   Scoped to TP only; no changes to ATP/RPM/Dashboard/Login/D1/Worker.
*/
(()=>{
  if(window.__sgTpMasterBridgeV1)return;
  window.__sgTpMasterBridgeV1=1;
  const SRC='assets/js/siap-guru-master-bab-v1.js?v=7';
  const openMaster=()=>{
    if(window.SiapGuruMasterBab?.open){
      window.SiapGuruMasterBab.open();
      return true;
    }
    return false;
  };
  const ensureMaster=()=>{
    if(openMaster())return;
    let script=document.querySelector('script[data-sg-tp-master]');
    if(!script){
      script=document.createElement('script');
      script.src=SRC;
      script.dataset.sgTpMaster='1';
      script.onload=()=>openMaster();
      script.onerror=()=>{
        const n=document.getElementById('sgTpNotice');
        if(n){n.textContent='Master BAB gagal dimuat. Silakan coba lagi.';n.hidden=false;}
      };
      document.head.appendChild(script);
      return;
    }
    let tries=0;
    const wait=()=>{
      if(openMaster())return;
      if(++tries<30)setTimeout(wait,100);
      else{
        const n=document.getElementById('sgTpNotice');
        if(n){n.textContent='Master BAB belum siap. Silakan coba lagi.';n.hidden=false;}
      }
    };
    wait();
  };
  document.addEventListener('click',e=>{
    const b=e.target instanceof Element?e.target.closest('#sgTpMaster'):null;
    if(!b)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    ensureMaster();
  },true);
})();
