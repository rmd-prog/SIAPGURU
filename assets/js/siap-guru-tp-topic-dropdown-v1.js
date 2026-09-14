/* SIAP GURU — TP BAB/Topik dropdown v1
   UI bridge only. Tidak menyentuh D1/Worker/RPM/ATP.
*/
(()=>{
  if(window.__sgTpTopicDropdownV1)return;
  window.__sgTpTopicDropdownV1=1;

  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const wait=(fn,n=20)=>{if(fn())return; if(n>0)setTimeout(()=>wait(fn,n-1),100)};

  const init=()=>{
    const room=document.querySelector('.sg-tp-room');
    const select=room?.querySelector('#sgTpTopic');
    if(!room||!select)return false;
    if(select.tagName==='SELECT'&&select.dataset.topicDropdown==='1')return true;

    const oldValue=select.value||'';
    const replacement=document.createElement('select');
    replacement.id='sgTpTopic';
    replacement.dataset.topicDropdown='1';
    replacement.className=select.className||'';
    replacement.setAttribute('aria-label','BAB / Topik');
    replacement.innerHTML='<option value="">Pilih BAB / Topik</option>';
    select.replaceWith(replacement);

    const masterButton=room.querySelector('#sgTpMaster');
    if(masterButton)masterButton.hidden=true;

    const getTopics=()=>{
      try{
        const all=window.SiapGuruMasterBab?.getAll?.()||[];
        const mapel=room.querySelector('#sgTpSubject')?.value?.trim()||'';
        const kelas=room.querySelector('#sgTpClass')?.value?.trim()||'';
        const semester=room.querySelector('#sgTpSemester')?.value||'';
        let rows=all.filter(x=>{
          if(mapel&&String(x.mapel||'').trim()!==mapel)return false;
          if(kelas&&String(x.kelas||'').trim()!==kelas)return false;
          if(semester&&String(x.semester||'')!==semester)return false;
          return true;
        });
        if(!rows.length && mapel)rows=all.filter(x=>String(x.mapel||'').trim()===mapel);
        return rows;
      }catch(_){return []}
    };

    const render=()=>{
      const current=replacement.value||oldValue||'';
      const rows=getTopics();
      replacement.innerHTML='<option value="">Pilih BAB / Topik</option>'+
        rows.map(x=>`<option value="${esc(x.id)}">${esc(x.bab||'Bab')}</option>`).join('');
      const hit=rows.find(x=>String(x.id)===current||String(x.bab||'')===current);
      if(hit)replacement.value=hit.id;
    };

    const choose=()=>{
      const id=replacement.value;
      if(!id)return;
      const row=getTopics().find(x=>String(x.id)===id);
      if(!row)return;
      try{sessionStorage.setItem('siapguru_selected_topic',JSON.stringify(row))}catch(_){ }
      document.dispatchEvent(new CustomEvent('siapguru:topic-selected',{detail:row}));
    };

    replacement.addEventListener('change',choose);
    room.querySelector('#sgTpSemester')?.addEventListener('change',()=>setTimeout(render,0));
    room.querySelector('#sgTpSubject')?.addEventListener('change',()=>setTimeout(render,0));
    room.querySelector('#sgTpClass')?.addEventListener('change',()=>setTimeout(render,0));

    wait(()=>{
      const ready=!!window.SiapGuruMasterBab?.getAll;
      if(ready){render();return true}
      return false;
    },30);
    return true;
  };

  wait(init,30);
  document.addEventListener('siapguru:topic-selected',()=>setTimeout(init,0));
})();
