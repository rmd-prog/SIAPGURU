/* SIAP GURU — PROSEM direct route */
(()=>{
  if(window.__sgProsemRouteV1)return;
  window.__sgProsemRouteV1=1;
  const bind=()=>{
    document.querySelectorAll('.sg-topnav-dropdown').forEach(drop=>{
      if(drop.dataset.prosemRouteBound==='1')return;
      drop.dataset.prosemRouteBound='1';
      drop.addEventListener('click',e=>{
        const el=e.target instanceof Element?e.target.closest('.sg-topnav-link'):null;
        if(!el||el.textContent.trim()!=='PROSEM')return;
        e.preventDefault();
        if(typeof window.__openSiapGuruProsem==='function'){
          window.__openSiapGuruProsem();
        }
      });
    });
  };
  bind();
  if(typeof MutationObserver==='function')new MutationObserver(bind).observe(document.body,{subtree:true,childList:true});
})();