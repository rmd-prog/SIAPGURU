/* SIAP GURU navigation stability
   Reset only the stale RPM boot guard before RPM's native capture handler.
   Intentionally does NOT prevent, stop, intercept, or replace the RPM click.
   No D1, Worker, login, Dashboard, or RPM content is changed. */
(()=>{
  const resetRpmGuard=(event)=>{
    const target=event.target instanceof Element?event.target:null;
    const link=target?.closest('.sg-topnav-link');
    if(link&&link.textContent.trim()==='RPM Deep Learning'){
      window.__sgRpmBoot=0;
    }
  };
  document.addEventListener('pointerdown',resetRpmGuard,true);
  document.addEventListener('click',resetRpmGuard,true);

  // RPM CP bridge: load after the existing navigation guard, before RPM Generate is clicked.
  const loadRpmCpBridge=()=>{
    if(document.querySelector('script[data-rpm-cp-final]'))return;
    const s=document.createElement('script');
    s.src='assets/js/siap-guru-rpm-cp-final-v1.js?v=1';
    s.dataset.rpmCpFinal='1';
    document.head.appendChild(s);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadRpmCpBridge,{once:true});
  else loadRpmCpBridge();
})();
