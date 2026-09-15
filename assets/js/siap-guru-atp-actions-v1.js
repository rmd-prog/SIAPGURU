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

    const downloadAtp=()=>{
      const clone=room.cloneNode(true);
      clone.querySelector('.sg-room-back')?.remove();
      clone.querySelector('.sg-atp-actions')?.remove();
      clone.querySelector('.sg-atp-footer')?.remove();
      clone.querySelectorAll('button').forEach(b=>b.remove());
      clone.querySelectorAll('input,select,textarea').forEach(el=>{
        const span=document.createElement('span');
        span.textContent=el.value||el.textContent||'';
        span.className='sg-atp-export-value';
        el.replaceWith(span);
      });
      const w=window.open('','_blank');
      if(!w){alert('Popup diblokir browser. Izinkan popup untuk Download.');return}
      const css='@page{size:F4 landscape;margin:12mm}body{font-family:Arial,sans-serif;margin:0;color:#172033;font-size:11px}.sg-atp-room{max-width:1080px;margin:auto}.sg-atp-room h1{font-size:20px;margin:0 0 10px}.sg-atp-panel{border:1px solid #cfd5df;border-radius:8px;padding:10px;margin:8px 0}.sg-atp-fields{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}.sg-atp-fields label{font-size:10px;font-weight:700;display:block}.sg-atp-export-value{display:block;border:1px solid #e1e5eb;border-radius:5px;padding:6px;margin-top:3px;min-height:14px}.sg-atp-list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.sg-atp-item{border:1px solid #d7dce4;border-radius:7px;padding:9px;break-inside:avoid}.sg-atp-item-tools,.sg-atp-item-foot input,.sg-atp-edit{display:none!important}.sg-atp-item-foot{border-top:1px solid #eee;margin-top:6px;padding-top:5px}@media(max-width:800px){.sg-atp-fields{grid-template-columns:repeat(2,1fr)}.sg-atp-list{grid-template-columns:1fr 1fr}}@media(max-width:520px){.sg-atp-fields,.sg-atp-list{grid-template-columns:1fr}}';
      w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>ATP — '+String(room.querySelector('#sgAtpName')?.value||'SIAP GURU').replace(/[<>]/g,'')+'</title><style>'+css+'</style></head><body>'+clone.outerHTML+'</body></html>');
      w.document.close();
      w.focus();
      setTimeout(()=>w.print(),350);
    };
    const dl=make('sgAtpDownload','Download','sg-atp-download',downloadAtp);
    if(dl)footer.appendChild(dl);
  };
  const obs=new MutationObserver(install);obs.observe(document.body,{childList:true,subtree:true});install();
})();
