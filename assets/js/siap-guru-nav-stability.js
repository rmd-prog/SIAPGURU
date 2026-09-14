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
})();
