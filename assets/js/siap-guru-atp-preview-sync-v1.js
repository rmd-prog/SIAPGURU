/* SIAP GURU — ATP document preview sync
   Keeps the existing generic document preview synchronized with ATP room changes.
   ATP only. No D1, Worker, login, Dashboard, or RPM changes. */
(()=>{
  const refresh=room=>{
    if(!room?.classList.contains('sg-atp-room'))return;
    const preview=room.querySelector('.sg-doc-preview');
    if(preview){
      preview.remove();
      delete room.dataset.sgDocPreview;
    }
    // The existing document-preview MutationObserver will rebuild the ATP preview.
  };
  const boot=()=>{
    document.querySelectorAll('.sg-atp-room').forEach(room=>{
      if(room.dataset.atpPreviewSync==='1')return;
      room.dataset.atpPreviewSync='1';
      room.addEventListener('input',e=>{
        if(e.target.matches('input,textarea,select'))setTimeout(()=>refresh(room),20);
      });
      room.addEventListener('change',()=>setTimeout(()=>refresh(room),20));
      room.addEventListener('click',()=>setTimeout(()=>refresh(room),60));
    });
  };
  document.addEventListener('DOMContentLoaded',boot);
  setTimeout(boot,300);
  new MutationObserver(boot).observe(document.querySelector('.main-content')||document.body,{childList:true,subtree:true});
})();
