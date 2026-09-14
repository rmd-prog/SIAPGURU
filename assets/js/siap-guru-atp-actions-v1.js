(()=>{
  const install=()=>{
    const room=document.querySelector('.sg-atp-room');
    if(!room||room.dataset.actionsReady==='1')return;
    room.dataset.actionsReady='1';
    const actions=room.querySelector('.sg-atp-actions');
    const footer=room.querySelector('.sg-atp-footer');
    if(!actions||!footer)return;
    const make=(id,text,cls,fn)=>{
      if(room.querySelector('#'+id))return;
      const b=document.createElement('button');b.type='button';b.id=id;b.className=cls;b.textContent=text;b.addEventListener('click',fn);return b;
    };
    const auto=make('sgAtpAuto','Isi ATP Otomatis','sg-atp-auto',()=>{
      const select=room.querySelector('#sgAtpElement');
      const add=window.__sgAtpAddItem;
      const list=room.querySelector('#sgAtpList');
      if(!select||typeof add!=='function')return;
      list.innerHTML='';
      [...select.options].forEach((opt,i)=>{
        select.value=opt.value;
        select.dispatchEvent(new Event('change'));
        add();
      });
      room.querySelector('#sgAtpCount')?.scrollIntoView({block:'nearest'});
    });
    if(auto)actions.appendChild(auto);
    const dl=make('sgAtpDownload','Download','sg-atp-download',()=>{
      if(window.SiapGuruExport?.direct){window.SiapGuruExport.direct(room);return;}
      const clone=room.cloneNode(true);
      clone.querySelector('.sg-room-back')?.remove();
      clone.querySelector('#sgAtpAuto')?.remove();
      clone.querySelector('#sgAtpAdd')?.remove();
      clone.querySelector('.sg-atp-footer')?.remove();
      const w=window.open('','_blank');
      if(!w)return;
      w.document.write('<!doctype html><html><head><title>ATP</title><style>body{font-family:Arial,sans-serif;margin:24px;color:#172033}.sg-atp-room{max-width:1080px;margin:auto}.sg-atp-grid{display:block}.sg-atp-panel{border:1px solid #ddd;border-radius:8px;padding:12px;margin:10px 0}.sg-atp-list{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.sg-atp-item{border:1px solid #ddd;border-radius:7px;padding:9px}.sg-atp-item-tools,.sg-atp-item-foot input{display:none}.sg-atp-item-foot{border-top:1px solid #eee;margin-top:6px;padding-top:5px}.sg-atp-edit{display:none}@media(max-width:800px){.sg-atp-list{grid-template-columns:1fr 1fr}}@media(max-width:520px){.sg-atp-list{grid-template-columns:1fr}}</style></head><body>'+clone.outerHTML+'</body></html>');
      w.document.close();w.focus();setTimeout(()=>w.print(),300);
    });
    if(dl)footer.appendChild(dl);
  };
  const obs=new MutationObserver(install);obs.observe(document.body,{childList:true,subtree:true});install();
})();
