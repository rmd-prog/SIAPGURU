/* SIAP GURU — TP Annual Chain v1
   Adds a visible one-year generator that uses Master BAB as the sole topic source.
*/
(()=>{
  const norm=v=>String(v??'').trim().toLowerCase();
  const readMaster=()=>window.SiapGuruMasterBab?.getAll?.()||(()=>{try{return JSON.parse(localStorage.getItem('siapguru_master_bab_v1')||'[]')}catch(_){return[]}})();
  const build=()=>{
    const room=document.querySelector('.sg-tp-room'); if(!room||room.dataset.annualReady==='1')return;
    room.dataset.annualReady='1';
    const toolbar=room.querySelector('.sg-tp-toolbar'), footer=room.querySelector('.sg-tp-footer');
    const b=document.createElement('button'); b.id='sgTpAnnual'; b.type='button'; b.className='sg-tp-primary'; b.textContent='⚡ Generate TP 1 Tahun';
    (footer||toolbar)?.appendChild(b);
    b.onclick=()=>{
      const subject=room.querySelector('#sgTpSubject')?.value?.trim()||'';
      const klass=room.querySelector('#sgTpClass')?.value?.trim()||'';
      const phase=room.querySelector('#sgTpPhase')?.value?.trim()||'';
      if(!subject||!klass){alert('Mapel dan kelas belum tersedia.');return}
      const rows=readMaster().filter(x=>norm(x.mapel)===norm(subject)&&String(x.kelas).trim()===String(klass).trim()&&(!phase||!x.fase||norm(x.fase)===norm(phase)));
      if(!rows.length){alert('Master BAB untuk mapel dan kelas ini belum ditemukan.');return}
      const items=[]; rows.forEach((r,i)=>{
        const bab=String(r.bab||`Bab ${i+1}`).trim(); const sem=String(r.semester||'1')==='2'?'2':'1'; const jp=Math.max(1,Number(r.jp)||8);
        const templates=[`Peserta didik mampu memahami konsep dan informasi penting pada materi ${bab}.`,`Peserta didik mampu mengidentifikasi unsur, ciri, prosedur, atau informasi pada materi ${bab}.`,`Peserta didik mampu menerapkan pengetahuan tentang ${bab} melalui latihan dan konteks kehidupan sehari-hari.`,`Peserta didik mampu mengomunikasikan hasil belajar tentang ${bab} melalui bentuk yang sesuai.`];
        templates.forEach((text,j)=>items.push({id:`tp-annual-${Date.now()}-${i}-${j}`,text,element:'',cp:'',jp:Math.max(1,Math.round(jp/templates.length)),acdId:r.id||'',topic:bab,semester:sem}));
      });
      const payload={name:`TP ${subject} Kelas ${klass} — 1 Tahun`,subject,phase,class:klass,semester:'1',group:'umum',topic:'SEMUA BAB / 1 TAHUN',totalJp:items.reduce((n,x)=>n+x.jp,0),items,savedAt:new Date().toISOString(),version:'TP-ANNUAL-1'};
      localStorage.setItem('siapguru_tp_draft',JSON.stringify(payload));
      const list=room.querySelector('#sgTpList');
      if(list){list.innerHTML=items.map((x,i)=>`<article class="sg-tp-item"><div class="sg-tp-item-head"><span class="sg-tp-number">${i+1}</span><div class="sg-tp-main"><strong>${x.topic}</strong><span class="sg-tp-badge">Semester ${x.semester} • ${x.jp} JP</span></div></div><p class="sg-tp-text">${x.text}</p><div class="sg-tp-foot"><span>TP dari Master BAB</span><label>JP <input class="sg-tp-jp" type="number" min="1" value="${x.jp}"></label></div></article>`).join('')}
      alert(`TP 1 tahun berhasil dibuat dari ${rows.length} BAB (${items.length} TP). JP total ${payload.totalJp}.`);
    };
  };
  const watch=()=>{if(document.querySelector('.sg-tp-room'))build()};
  new MutationObserver(watch).observe(document.body,{childList:true,subtree:true}); watch();
})();
