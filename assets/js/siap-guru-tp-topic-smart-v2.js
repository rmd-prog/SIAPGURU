/* SIAP GURU — TP BAB/Topik smart filter v2
   Keeps BAB/Topik synchronized with Mapel/Fase/Kelas/Semester.
   Scoped only to TP flow. Does not touch D1/Worker/RPM/ATP.
*/
(()=>{
  if(window.__sgTpTopicSmartV2)return;
  window.__sgTpTopicSmartV2=1;

  const wait=(fn,n=30)=>{if(fn())return true;if(n>0)setTimeout(()=>wait(fn,n-1),100);return false};
  const clean=v=>String(v??'').trim();
  const readSelected=()=>{try{return JSON.parse(sessionStorage.getItem('siapguru_selected_topic')||'null')||{}}catch(_){return {}}};

  const init=()=>{
    const room=document.querySelector('.sg-tp-room');
    const old=room?.querySelector('#sgTpTopic');
    if(!room||!old)return false;

    let select=old;
    if(select.tagName!=='SELECT'){
      const replacement=document.createElement('select');
      replacement.id='sgTpTopic';
      replacement.className=select.className||'';
      replacement.dataset.topicSmart='1';
      replacement.setAttribute('aria-label','BAB / Topik');
      select.replaceWith(replacement);
      select=replacement;
    }else select.dataset.topicSmart='1';

    const masterButton=room.querySelector('#sgTpMaster');
    if(masterButton)masterButton.hidden=true;

    const context=detail=>{
      const d=detail||readSelected();
      return {
        mapel:clean(d.mapel||room.querySelector('#sgTpSubject')?.value),
        fase:clean(d.fase||room.querySelector('#sgTpPhase')?.value),
        kelas:clean(d.kelas||room.querySelector('#sgTpClass')?.value),
        semester:clean(d.semester||room.querySelector('#sgTpSemester')?.value)
      };
    };

    const rowsFor=(ctx)=>{
      const all=window.SiapGuruMasterBab?.getAll?.()||[];
      return all.filter(x=>{
        if(ctx.mapel&&clean(x.mapel)!==ctx.mapel)return false;
        if(ctx.fase&&clean(x.fase)!==ctx.fase)return false;
        if(ctx.kelas&&clean(x.kelas)!==ctx.kelas)return false;
        if(ctx.semester&&clean(x.semester)!==ctx.semester)return false;
        return true;
      });
    };

    const render=(detail,reset)=>{
      const ctx=context(detail);
      const current=clean(select.value);
      let rows=rowsFor(ctx);
      if(!rows.length&&ctx.mapel){
        rows=(window.SiapGuruMasterBab?.getAll?.()||[]).filter(x=>clean(x.mapel)===ctx.mapel&&(!ctx.kelas||clean(x.kelas)===ctx.kelas));
      }
      const preferred=detail?.id||readSelected().id||'';
      select.innerHTML='<option value="">Pilih BAB / Topik</option>'+rows.map(x=>`<option value="${String(x.id).replace(/"/g,'&quot;')}">${String(x.bab||'Bab').replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}</option>`).join('');
      const wanted=reset?'':(preferred||current);
      const hit=rows.find(x=>String(x.id)===wanted||clean(x.bab)===wanted);
      select.value=hit?String(hit.id):'';
      if(reset&&!hit){
        try{sessionStorage.removeItem('siapguru_selected_topic')}catch(_){ }
      }
    };

    const choose=()=>{
      const id=select.value;
      if(!id)return;
      const ctx=context();
      const row=rowsFor(ctx).find(x=>String(x.id)===id) || (window.SiapGuruMasterBab?.getAll?.()||[]).find(x=>String(x.id)===id);
      if(!row)return;
      try{sessionStorage.setItem('siapguru_selected_topic',JSON.stringify(row))}catch(_){ }
      document.dispatchEvent(new CustomEvent('siapguru:topic-selected',{detail:row}));
    };

    if(select.dataset.smartBound!=='1'){
      select.dataset.smartBound='1';
      select.addEventListener('change',choose);
      ['sgTpSubject','sgTpPhase','sgTpClass','sgTpSemester'].forEach(id=>{
        room.querySelector('#'+id)?.addEventListener('change',()=>{
          try{sessionStorage.removeItem('siapguru_selected_topic')}catch(_){ }
          setTimeout(()=>render(null,true),0);
        });
      });
    }

    if(!window.__sgTpTopicSmartV2Bound){
      window.__sgTpTopicSmartV2Bound=1;
      document.addEventListener('siapguru:topic-selected',e=>{
        const r=document.querySelector('.sg-tp-room');
        if(!r)return;
        setTimeout(()=>{
          const s=r.querySelector('#sgTpTopic');
          if(!s||s.dataset.smartBound!=='1')return;
          const d=e.detail||readSelected();
          const rows=rowsFor({mapel:clean(d.mapel),fase:clean(d.fase),kelas:clean(d.kelas),semester:clean(d.semester)});
          s.innerHTML='<option value="">Pilih BAB / Topik</option>'+rows.map(x=>`<option value="${String(x.id).replace(/"/g,'&quot;')}">${String(x.bab||'Bab').replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}</option>`).join('');
          const hit=rows.find(x=>String(x.id)===String(d.id));
          s.value=hit?String(hit.id):'';
        },0);
      },true);
    }

    wait(()=>{
      if(!window.SiapGuruMasterBab?.getAll)return false;
      render(readSelected(),false);return true;
    },30);
    return true;
  };

  wait(init,30);
  document.addEventListener('siapguru:topic-selected',()=>setTimeout(init,0),true);
})();
