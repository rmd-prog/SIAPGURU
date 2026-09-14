/* SIAP GURU — TP ↔ Master BAB selection bridge
   Makes "Gunakan" in Master BAB return the selected topic to the TP room.
   Scoped only to TP flow.
*/
(()=>{
  if(window.__sgTpMasterSelectBridgeV1)return;
  window.__sgTpMasterSelectBridgeV1=1;
  document.addEventListener('click',e=>{
    const b=e.target instanceof Element?e.target.closest('.sg-master-use'):null;
    if(!b)return;
    const tp=document.querySelector('.sg-tp-room');
    if(!tp)return;
    const id=b.dataset.id;
    const list=window.SiapGuruMasterBab?.getAll?.()||[];
    const x=list.find(item=>String(item.id)===String(id));
    if(!x)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    sessionStorage.setItem('siapguru_selected_topic',JSON.stringify(x));
    document.dispatchEvent(new CustomEvent('siapguru:topic-selected',{detail:x}));
    const master=document.getElementById('sgMasterBabView');
    if(master)master.hidden=true;
    tp.hidden=false;
    tp.scrollIntoView({block:'start'});
  },true);
})();
