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
    const select=wrap.querySelector('select');
    select.value=scope==='1'||scope==='2'?scope:'year';
    const recap1=document.createElement('div');
    recap1.className='sg-prosem-recap sg-prosem-recap-sem1';
    recap1.innerHTML='<div><span>Semester 1</span><strong>0 JP</strong></div><div><span>Cakupan</span><strong>Semester 1</strong></div>';
    const update=()=>{
      const v=select.value;
      sem1.hidden=v==='2'; sem2.hidden=v==='1';
      if(v==='1'&&!sem1.querySelector('.sg-prosem-recap-sem1')) sem1.querySelector('.sg-prosem-table-wrap')?.after(recap1);
      if(v!=='1'&&recap1.parentNode)recap1.remove();
      const sum=card=>[...card.querySelectorAll('tbody tr')].reduce((n,tr)=>{const i=tr.querySelector('input.sg-prosem-jp');return n+(i?Number(i.value)||0:0)},0);
      const a=sum(sem1),b=sum(sem2);
      const r1=sem1.querySelector('.sg-prosem-recap-sem1');
      if(r1)r1.querySelector('strong').textContent=`${a} JP`;
      const r2=sem2.querySelector('.sg-prosem-recap');
      if(r2){const vals=r2.querySelectorAll('strong');if(vals[0])vals[0].textContent=`${a} JP`;if(vals[1])vals[1].textContent=`${b} JP`;if(vals[2])vals[2].textContent=`${a+b} JP`;}
      writeScope(v);
    };
    select.addEventListener('change',update);
    room.addEventListener('input',e=>{if(e.target.matches('.sg-prosem-jp'))update()});
    room.addEventListener('click',e=>{if(e.target.closest('#sgProsemSave'))setTimeout(()=>writeScope(select.value),0)});
    update();
  };
  const boot=()=>{
    const room=document.querySelector('.sg-prosem-room');
    if(room)apply(room);
  };
  boot();
  const mo=new MutationObserver(boot);
  mo.observe(document.body,{childList:true,subtree:true});
})();