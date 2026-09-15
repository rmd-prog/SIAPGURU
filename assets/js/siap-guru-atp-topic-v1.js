/* SIAP GURU — ATP BAB/TOPIK V1
   Mengikat TP ATP ke Master BAB/Topik tanpa menyentuh CP, D1/Worker, Login, Dashboard, Student Data, atau RPM.
*/
(()=>{
  const install=()=>{
    const room=document.querySelector('.sg-atp-room');
    if(!room||room.dataset.topicBridgeV1==='1')return;
    const host=room.querySelector('.sg-atp-fields');
    const subject=room.querySelector('#sgAtpSubject');
    const phase=room.querySelector('#sgAtpPhase');
    const klass=room.querySelector('#sgAtpClass');
    const semester=room.querySelector('#sgAtpSemester');
    const auto=room.querySelector('#sgAtpAuto');
    const list=room.querySelector('#sgAtpList');
    const add=window.__sgAtpAddItem;
    if(!host||!subject||!phase||!klass||!semester||!list||typeof add!=='function')return;
    room.dataset.topicBridgeV1='1';

    const label=document.createElement('label');
    label.textContent='BAB / Topik Pembelajaran';
    const select=document.createElement('select');
    select.id='sgAtpTopic';
    select.innerHTML='<option value="__all__">Semua BAB / Topik</option>';
    label.appendChild(select);
    host.appendChild(label);

    const getTopics=()=>{
      const api=window.SiapGuruMasterBab;
      if(!api?.getAll)return [];
      const sem=semester.value;
      return api.getAll().filter(x=>String(x.mapel||'')===String(subject.value||'')
        && String(x.kelas||'')===String(klass.value||'')
        && (sem==='year'||String(x.semester||'')===String(sem)));
    };
    const fill=()=>{
      const current=select.value;
      const topics=getTopics();
      select.innerHTML='<option value="__all__">Semua BAB / Topik</option>'+
        topics.map((x,i)=>`<option value="${String(x.id||i).replace(/"/g,'&quot;')}">${String(x.bab||`BAB ${i+1}`).replace(/</g,'&lt;')}</option>`).join('');
      if([...select.options].some(o=>o.value===current))select.value=current;
    };
    const topicData=()=>{
      const topics=getTopics();
      if(select.value==='__all__')return topics;
      return topics.filter(x=>String(x.id)===String(select.value));
    };
    const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
    const verbs=['mengidentifikasi','menjelaskan','menerapkan','menganalisis','mengomunikasikan','merefleksikan'];
    const makeText=(topic,i)=>{
      const t=clean(topic?.bab)||'topik pembelajaran';
      const sub=Array.isArray(topic?.subtopik)&&topic.subtopik.length?clean(topic.subtopik[i%topic.subtopik.length]):'';
      const v=verbs[i%verbs.length];
      return `Peserta didik mampu ${v} ${sub?`${sub} pada topik ${t}`:`konsep dan keterampilan pada topik ${t}`} melalui pembelajaran yang kontekstual dan bermakna.`;
    };
    const distribute=(n,total)=>{
      if(!n||!total)return [];
      const base=Math.floor(total/n),rem=total-(base*n);
      return Array.from({length:n},(_,i)=>Math.max(1,base+(i<rem?1:0)));
    };
    const replaceAuto=()=>{
      const old=room.querySelector('#sgAtpAuto');
      if(!old)return;
      const fresh=old.cloneNode(true);
      old.replaceWith(fresh);
      fresh.addEventListener('click',e=>{
        e.preventDefault();e.stopImmediatePropagation();
        const topics=topicData();
        if(!topics.length){list.innerHTML='<div class="sg-atp-empty">Belum ada BAB/Topik untuk pilihan mapel, kelas, dan semester ini.</div>';return;}
        list.innerHTML='';
        const total=Number(room.querySelector('#sgAtpTotalJp')?.value||0);
        const annualMap={'Pendidikan Pancasila':144,'Bahasa Indonesia':216,'Matematika':180,'IPAS':180,'PJOK':108,'Seni Musik':108,'Seni Rupa':108,'Seni Tari':108,'Seni Teater':108,'Bahasa Inggris':72};
        const annual=annualMap[subject.value]||0;
        const weeks=klass.value==='6'?32:36;
        const semWeeks=semester.value==='year'?weeks:(klass.value==='6'?14:18);
        const target=total|| (annual?Math.round(annual/weeks*semWeeks):topics.reduce((s,x)=>s+Number(x.jp||0),0));
        const jps=distribute(topics.length,target);
        topics.forEach((topic,i)=>{
          add();
          const item=list.lastElementChild;
          if(!item)return;
          item.dataset.topicId=topic.id||'';
          item.dataset.topic=topic.bab||'';
          const text=item.querySelector('.sg-atp-text');
          if(text)text.textContent=makeText(topic,i);
          const inp=item.querySelector('.sg-atp-jp');
          if(inp)inp.value=jps[i]||Number(topic.jp||1)||1;
        });
        if(room.querySelector('#sgAtpName')){
          const n=room.querySelector('#sgAtpName');
          if(!n.value.trim()||n.dataset.autoName)n.value=`ATP ${subject.value} Kelas ${klass.value} Fase ${phase.value}`;
        }
        if(room.querySelector('#sgAtpTotalJp'))room.querySelector('#sgAtpTotalJp').value=target;
        window.dispatchEvent(new CustomEvent('sg:atp-updated'));
      },true);
    };
    const refresh=()=>{fill();replaceAuto();};
    [subject,phase,klass,semester].forEach(el=>el.addEventListener('change',refresh));
    fill();
    replaceAuto();
  };
  const obs=new MutationObserver(install);
  obs.observe(document.body,{childList:true,subtree:true});
  install();
})();
