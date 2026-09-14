(()=>{
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const sync=room=>{
    if(!room?.classList.contains('sg-atp-room'))return;
    const preview=room.querySelector('.sg-doc-preview');
    if(!preview)return;
    const rows=[...room.querySelectorAll('.sg-atp-item')];
    const ident=preview.querySelector('.sg-doc-ident');
    if(ident){
      const vals=[
        ['Mata Pelajaran','input[id*="Subject" i]'],
        ['Fase / Kelas','input[id*="Phase" i]'],
        ['Tahun Pelajaran',null]
      ];
      const subject=room.querySelector('#sgAtpSubject')?.value||'-';
      const phase=room.querySelector('#sgAtpPhase')?.value||'-';
      const kelas=room.querySelector('#sgAtpClass')?.value||'-';
      const semester=room.querySelector('#sgAtpSemester')?.value||'-';
      const total=room.querySelector('#sgAtpTotalJp')?.value||'-';
      const cells=[...ident.querySelectorAll('div')];
      const set=(label,text)=>{const d=cells.find(x=>x.querySelector('b')?.textContent.trim()===label);if(d)d.querySelector('span').textContent=text};
      set('Mata Pelajaran',subject);set('Fase / Kelas',`${phase} / ${kelas}`);set('Tahun Pelajaran','2026/2027');set('Semester',semester==='2'?'Semester 2':'Semester 1');set('Total JP',total);
    }
    const tbody=preview.querySelector('table tbody');
    if(!tbody)return;
    tbody.innerHTML=rows.length?rows.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.dataset.element||'-')}</td><td>${esc(x.dataset.cp||'-')}</td><td>${esc(x.querySelector('.sg-atp-text')?.textContent||'-')}</td><td>${esc(x.querySelector('.sg-atp-jp')?.value||'0')}</td></tr>`).join(''):'<tr><td colspan="5">Belum ada tujuan pembelajaran.</td></tr>';
  };
  const scan=()=>document.querySelectorAll('.sg-atp-room').forEach(sync);
  document.addEventListener('input',e=>{if(e.target.closest?.('.sg-atp-room'))setTimeout(scan,0)});
  document.addEventListener('change',e=>{if(e.target.closest?.('.sg-atp-room'))setTimeout(scan,0)});
  document.addEventListener('click',e=>{if(e.target.closest?.('.sg-atp-room'))setTimeout(scan,50)});
  document.addEventListener('DOMContentLoaded',()=>{scan();const root=document.querySelector('.main-content')||document.body;new MutationObserver(()=>scan()).observe(root,{childList:true,subtree:true})});
  setTimeout(scan,500);
})();
