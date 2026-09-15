/* SIAP GURU — PROSEM scope bridge V4
   Passive only: enriches the PROSEM room after navigation.
   Navigation ownership belongs to siap-guru-nav-stability.js.
*/
(()=>{
  if(window.__sgProsemScopeV4)return;
  window.__sgProsemScopeV4=true;
  const KEY='siapguru_prosem_draft';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){return null}};
  const save=scope=>{try{const d=read()||{};localStorage.setItem(KEY,JSON.stringify({...d,scope,version:'PROSEM-4',savedAt:new Date().toISOString()}))}catch(_){}};
  const apply=room=>{
    if(!room||room.dataset.prosemScopeReady==='1')return;
    const cards=[...room.querySelectorAll('.sg-prosem-card')];
    if(cards.length<3)return;
    room.dataset.prosemScopeReady='1';
    const box=document.createElement('div');
    box.className='sg-prosem-scope';
    box.innerHTML='<label><span>Cakupan PROSEM</span><select id="sgProsemScope"><option value="1">Semester 1</option><option value="2">Semester 2</option><option value="year">1 Tahun</option></select></label>';
    (cards[0].querySelector('.sg-prosem-actions')?.parentElement||cards[0]).appendChild(box);
    const select=box.querySelector('#sgProsemScope');
    const old=read();
    select.value=['1','2','year'].includes(old?.scope)?old.scope:'year';
    const refresh=()=>{
      const v=select.value;
      cards[1].hidden=v==='2';
      cards[2].hidden=v==='1';
      if(v==='year'){cards[1].hidden=false;cards[2].hidden=false}
      save(v);
    };
    select.addEventListener('change',refresh);
    refresh();
  };
  const scan=()=>document.querySelectorAll('.sg-prosem-room').forEach(apply);
  scan();
  if(typeof MutationObserver==='function')new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
})();