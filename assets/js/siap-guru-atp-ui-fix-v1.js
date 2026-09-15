/* SIAP GURU — ATP UI FIX V1
   Local ATP fixes only: dynamic name + semester scope.
*/
(()=>{
  const install=()=>{
    const room=document.querySelector('.sg-atp-room');
    if(!room||room.dataset.uiFixV1==='1')return;
    room.dataset.uiFixV1='1';
    const name=room.querySelector('#sgAtpName');
    const subject=room.querySelector('#sgAtpSubject');
    const phase=room.querySelector('#sgAtpPhase');
    const klass=room.querySelector('#sgAtpClass');
    const semester=room.querySelector('#sgAtpSemester');
    if(!name||!subject||!phase||!klass||!semester)return;

    const syncName=()=>{
      const s=subject.value||'Mata Pelajaran';
      const k=klass.value||'';
      const p=phase.value||'';
      const generated=`ATP ${s} Kelas ${k} Fase ${p}`;
      const old=name.dataset.autoName||'';
      if(!name.value.trim()||name.value.trim()===old||/^ATP\s+.+\s+Kelas\s+\d+\s+Fase\s+[ABC]$/i.test(name.value.trim())){
        name.value=generated;
        name.dataset.autoName=generated;
      }
    };

    const current=semester.value;
    semester.innerHTML='<option value="1">Semester 1</option><option value="2">Semester 2</option><option value="year">1 Tahun</option>';
    semester.value=current==='2'?'2':current==='year'?'year':'1';
    [subject,phase,klass].forEach(el=>el.addEventListener('change',syncName));
    syncName();
  };
  const obs=new MutationObserver(install);
  obs.observe(document.body,{childList:true,subtree:true});
  install();
})();
