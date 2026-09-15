/* SIAP GURU — ATP BAB/TOPIK V2
   Waits for the ATP room API before installing. Local ATP only.
*/
(()=>{
  const install=()=>{
    const room=document.querySelector('.sg-atp-room');
    if(!room||room.dataset.topicBridgeV2==='1')return false;
    const host=room.querySelector('.sg-atp-fields');
    const subject=room.querySelector('#sgAtpSubject');
    const phase=room.querySelector('#sgAtpPhase');
    const klass=room.querySelector('#sgAtpClass');
    const semester=room.querySelector('#sgAtpSemester');
    const list=room.querySelector('#sgAtpList');
    const add=window.__sgAtpAddItem;
    if(!host||!subject||!phase||!klass||!semester||!list||typeof add!=='function')return false;
    room.dataset.topicBridgeV2='1';

    const label=document.createElement('label');
    label.textContent='BAB / Topik Pembelajaran';
    const select=document.createElement('select');
    select.id='sgAtpTopic';
    label.appendChild(select);
    host.appendChild(label);

    const getTopics=()=>{
      const api=window.SiapGuruMasterBab;
      if(!api?.getAll)return [];
      const sem=semester.value;
      return api.getAll().filter(x=>String(x.mapel||'')===String(subject.value||'') && String(x.kelas||'')===String(klass.value||'') && (sem==='year'||String(x.semester||'')===String(sem)));
    };
    const fill=()=>{
      const current=select.value;
      const topics=getTopics();
      select.innerHTML='<option value="__all__">Semua BAB / Topik</option>'+topics.map((x,i)=>`<option value="${String(x.id||i).replace(/"/g,'&quot;')}">${String(x.bab||`BAB ${i+1}`).replace(/</g,'&lt;')}</option>`).join('');
      if([...select.options].some(o=>o.value===current))select.value=current;
    };
    const topicData=()=>{
      const topics=getTopics();
      return select.value==='__all__'?topics:topics.filter(x=>String(x.id)===String(select.value));
    };
    const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
    const verbs=['mengidentifikasi','menjelaskan','menerapkan','menganalisis','mengomunikasikan','merefleksikan'];
    const makeText=(topic,i)=>{
      const t=clean(topic?.bab)||'topik pembelajaran';
      const subs=Array.isArray(topic?.subtopik)?topic.subtopik.filter(Boolean):[];
      const sub=subs.length?clean(subs[i%subs.length]):'';
      return `Peserta didik mampu ${verbs[i%verbs.length]} ${sub?`${sub} pada topik ${t}`:`konsep utama pada topik ${t}`} melalui pembelajaran yang kontekstual dan bermakna.`;
    };
    const distribute=(n,total)=>{
      if(!n||!total)return [];
      const base=Math.floor(total/n),rem=total-base*n;
      return Array.from({length:n},(_,i)=>base+(i<rem?1:0));
    };
    const setAutoName=()=>{
      const n=room.querySelector('#sgAtpName');
      if(!n)return;
      const generated=`ATP ${subject.value||'Mata Pelajaran'} Kelas ${klass.value||''} Fase ${phase.value||''}`.replace(/\s+/g,' ').trim();
      if(!n.value.trim()||n.dataset.autoName===n.value.trim()){n.value=generated;n.dataset.autoName=generated;}
    };
    const rebuild=()=>{
      fill();
      setAutoName();
    };
    const oldAuto=room.querySelector('#sgAtpAuto');
    if(oldAuto){
      const fresh=oldAuto.cloneNode(true);
      oldAuto.replaceWith(fresh);
      fresh.addEventListener('click',e=>{
        e.preventDefault();e.stopImmediatePropagation();
        const topics=topicData();
        if(!topics.length){list.innerHTML='<div class="sg-atp-empty">Belum ada BAB/Topik untuk mapel, kelas, dan semester ini.</div>';return;}
        list.innerHTML='';
        const entered=Number(room.querySelector('#sgAtpTotalJp')?.value||0);
        const annualMap={'Pendidikan Pancasila':144,'Bahasa Indonesia':216,'Matematika':180,'IPAS':180,'PJOK':108,'Seni Musik':108,'Seni Rupa':108,'Seni Tari':108,'Seni Teater':108,'Bahasa Inggris':72};
        const annual=annualMap[subject.value]||0;
        const weeks=klass.value==='6'?32:36;
        const semWeeks=semester.value==='year'?weeks:(klass.value==='6'?14:18);
        const target=entered|| (annual?Math.round(annual/weeks*semWeeks):topics.reduce((s,x)=>s+Number(x.jp||0),0));
        const jps=distribute(topics.length,target);
        topics.forEach((topic,i)=>{
          add();
          const item=list.lastElementChild;
          if(!item)return;
          item.dataset.topicId=topic.id||'';
          item.dataset.topic=topic.bab||'';
          item.dataset.cp=item.dataset.cp||'';
          const text=item.querySelector('.sg-atp-text');
          if(text)text.textContent=makeText(topic,i);
          const inp=item.querySelector('.sg-atp-jp');
          if(inp)inp.value=Math.max(1,jps[i]||Number(topic.jp||1)||1);
        });
        const totalEl=room.querySelector('#sgAtpTotalJp');
        if(totalEl)totalEl.value=target;
        setAutoName();
        window.dispatchEvent(new CustomEvent('sg:atp-updated'));
      },true);
    }
    [subject,phase,klass,semester].forEach(el=>el.addEventListener('change',rebuild));
    fill();
    setAutoName();
    return true;
  };
  const obs=new MutationObserver(()=>install());
  obs.observe(document.body,{childList:true,subtree:true});
  install();
  const timer=setInterval(()=>{if(install())clearInterval(timer)},250);
  setTimeout(()=>clearInterval(timer),10000);
})();
