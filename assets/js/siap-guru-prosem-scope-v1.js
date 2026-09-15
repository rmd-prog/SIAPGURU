(()=>{
  if(window.__sgProsemScopeV1)return;
  window.__sgProsemScopeV1=1;
  const KEY='siapguru_prosem_draft';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){return null}};
  const writeScope=scope=>{try{const d=read()||{};localStorage.setItem(KEY,JSON.stringify({...d,scope,version:'PROSEM-4',savedAt:new Date().toISOString()}))}catch(_) {}};
  const apply=room=>{
    if(!room||room.dataset.prosemScopeReady==='1')return;
    room.dataset.prosemScopeReady='1';
    const cards=[...room.querySelectorAll('.sg-prosem-card')];
    const identity=cards[0],sem1=cards[1],sem2=cards[2];
    if(!identity||!sem1||!sem2)return;
    const saved=read();
    let scope=saved?.scope||'year';
    const section=identity.querySelector('.sg-prosem-grid');
    if(!section)return;
    const wrap=document.createElement('label');
    wrap.className='sg-prosem-scope-control';
    wrap.innerHTML='<span>Cakupan PROSEM</span><select id="sgProsemScope"><option value="1">Semester 1</option><option value="2">Semester 2</option><option value="year">1 Tahun</option></select>';
    section.appendChild(wrap);
    const select=wrap.querySelector('#sgProsemScope');
    select.value=scope;
    const applyScope=()=>{
      scope=select.value;
      sem1.hidden=scope==='2';
      sem2.hidden=scope==='1';
      writeScope(scope);
      const notice=room.querySelector('#sgProsemNotice');
      if(notice){notice.textContent=scope==='year'?'Cakupan: 1 Tahun.':`Cakupan: Semester ${scope}.`;notice.hidden=false;clearTimeout(window.__sgProsemScopeNotice);window.__sgProsemScopeNotice=setTimeout(()=>notice.hidden=true,1800)}
    };
    select.addEventListener('change',applyScope);
    applyScope();
  };
  const watch=()=>{
    const room=document.querySelector('.sg-prosem-room');
    if(room)apply(room);
  };
  watch();
  new MutationObserver(watch).observe(document.body,{childList:true,subtree:true});
})();
