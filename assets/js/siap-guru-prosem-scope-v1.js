/* SIAP GURU — PROSEM route bridge V2
   Owns only the PROSEM menu route. It does not render or alter PROSEM data.
*/
(()=>{
  if(window.__sgProsemRouteBridgeV2)return;
  window.__sgProsemRouteBridgeV2=true;
  const isProsem=el=>el instanceof Element&&el.textContent.trim()==='PROSEM';
  const trigger=()=>{
    const source=[...document.querySelectorAll('.sub-menu span')].find(isProsem);
    if(source){source.click();return true}
    const top=[...document.querySelectorAll('.sg-topnav-link')].find(isProsem);
    if(top){top.click();return true}
    return false;
  };
  window.addEventListener('click',e=>{
    if(e.__sgProsemRouteReplay)return;
    const t=e.target instanceof Element?e.target.closest('.sg-topnav-link'):null;
    if(!isProsem(t))return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const ev=new MouseEvent('click',{bubbles:true,cancelable:true,view:window});
    Object.defineProperty(ev,'__sgProsemRouteReplay',{value:true});
    const source=[...document.querySelectorAll('.sub-menu span')].find(isProsem);
    if(source)source.dispatchEvent(ev);else t.dispatchEvent(ev);
  },true);
})();