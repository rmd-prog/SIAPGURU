(()=>{
  const install=()=>{
    const room=document.querySelector('.sg-atp-room');
    if(!room||room.dataset.actionsReady==='1')return;
    room.dataset.actionsReady='1';
    const actions=room.querySelector('.sg-atp-actions');
    if(!actions)return;
    if(room.querySelector('#sgAtpAuto'))return;
    const b=document.createElement('button');
    b.type='button';b.id='sgAtpAuto';b.className='sg-atp-auto';b.textContent='Isi ATP Otomatis';
    b.addEventListener('click',()=>{
      const select=room.querySelector('#sgAtpElement');
      const add=window.__sgAtpAddItem;
      const list=room.querySelector('#sgAtpList');
      if(!select||typeof add!=='function'||!list)return;
      list.innerHTML='';
      [...select.options].forEach(opt=>{select.value=opt.value;select.dispatchEvent(new Event('change'));add()});
      room.querySelector('#sgAtpCount')?.scrollIntoView({block:'nearest'});
    });
    actions.appendChild(b);
  };
  const obs=new MutationObserver(install);obs.observe(document.body,{childList:true,subtree:true});install();
})();
