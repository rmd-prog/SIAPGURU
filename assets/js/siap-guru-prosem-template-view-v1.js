(()=>{
  const boot=()=>{
    document.querySelectorAll('.sg-prosem-room').forEach(room=>{
      if(room.dataset.sgProsemTemplateReady==='1')return;
      const make=()=>{
        const l1=room.querySelector('#sgProsemList1'),l2=room.querySelector('#sgProsemList2');
        if(!l1||!l2)return;
        room.dataset.sgProsemTemplateReady='1';
        const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
        const val=(tr,f)=>{const e=tr.querySelector(`[data-field="${f}"]`);return e?e.value:''};
        const rows=(tbody)=>[...tbody.querySelectorAll('tr')].filter(tr=>tr.querySelector('[data-field]'));
        const renderTable=(tbody,sem)=>{
          const data=rows(tbody).map(tr=>({period:val(tr,'period'),materi:val(tr,'materi'),text:val(tr,'text'),jp:val(tr,'jp'),assessment:val(tr,'assessment'),note:val(tr,'note')}));
          const body=data.length?data.map((x,i)=>`<tr><td class="sg-prosem-t-no">${i+1}</td><td>${esc(x.period)}</td><td>${esc(x.materi)}</td><td>${esc(x.text)}</td><td class="sg-prosem-t-jp">${esc(x.jp||'0')}</td><td>${esc(x.assessment)}</td><td>${esc(x.note)}</td></tr>`).join(''):`<tr><td colspan="7" class="sg-prosem-t-empty">Belum ada rencana Semester ${sem}.</td></tr>`;
          const total=data.reduce((n,x)=>n+(Number(x.jp)||0),0);
          return {body,total,count:data.length};
        };
        const refresh=()=>{
          const a=renderTable(l1,1),b=renderTable(l2,2);
          const school=room.querySelector('#sgProsemSchool')?.value||'';
          const subject=room.querySelector('#sgProsemSubject')?.value||'-';
          const phase=room.querySelector('#sgProsemPhase')?.value||'-';
          const cls=room.querySelector('#sgProsemClass')?.value||'-';
          const year=room.querySelector('#sgProsemYear')?.value||'';
          const weeks=room.querySelector('#sgProsemWeeks')?.value||'';
          const notes=room.querySelector('#sgProsemNotes')?.value||'';
          let preview=room.querySelector('.sg-prosem-template-main');
          if(!preview){
            preview=document.createElement('section');preview.className='sg-prosem-template-main';
            const anchor=room.querySelector('.sg-prosem-note-card');
            (anchor||room.querySelector('.sg-prosem-shell')||room).appendChild(preview);
          }
          preview.innerHTML=`<div class="sg-prosem-template-paper">
            <div class="sg-prosem-template-kicker">PRATINJAU DOKUMEN</div>
            <h2 class="sg-prosem-template-title">PROGRAM SEMESTER (PROSEM)</h2>
            <p class="sg-prosem-template-subtitle">Kurikulum Merdeka • Tahun Pelajaran ${esc(year)}</p>
            <div class="sg-prosem-template-identity">
              <div><span>Satuan Pendidikan</span><strong>${esc(school)}</strong></div>
              <div><span>Mata Pelajaran</span><strong>${esc(subject)}</strong></div>
              <div><span>Fase</span><strong>${esc(phase)}</strong></div>
              <div><span>Kelas</span><strong>${esc(cls)}</strong></div>
              <div><span>Tahun Pelajaran</span><strong>${esc(year)}</strong></div>
              <div><span>Minggu Efektif / Tahun</span><strong>${esc(weeks)}</strong></div>
            </div>
            <div class="sg-prosem-template-section">
              <div class="sg-prosem-template-section-head"><div><span>SEMESTER 1</span><h3>GANJIL</h3></div><strong>${a.total} JP</strong></div>
              <div class="sg-prosem-template-table-wrap"><table class="sg-prosem-template-table"><thead><tr><th>No.</th><th>Minggu / Periode</th><th>BAB / Materi Pokok</th><th>Tujuan Pembelajaran</th><th>JP</th><th>Asesmen</th><th>Keterangan</th></tr></thead><tbody>${a.body}</tbody></table></div>
            </div>
            <div class="sg-prosem-template-section">
              <div class="sg-prosem-template-section-head"><div><span>SEMESTER 2</span><h3>GENAP</h3></div><strong>${b.total} JP</strong></div>
              <div class="sg-prosem-template-table-wrap"><table class="sg-prosem-template-table"><thead><tr><th>No.</th><th>Minggu / Periode</th><th>BAB / Materi Pokok</th><th>Tujuan Pembelajaran</th><th>JP</th><th>Asesmen</th><th>Keterangan</th></tr></thead><tbody>${b.body}</tbody></table></div>
            </div>
            <div class="sg-prosem-template-recap"><div><span>Semester 1</span><strong>${a.total} JP</strong></div><div><span>Semester 2</span><strong>${b.total} JP</strong></div><div><span>Total PROSEM</span><strong>${a.total+b.total} JP</strong></div></div>
            ${notes.trim()?`<div class="sg-prosem-template-notes"><strong>Catatan</strong><p>${esc(notes).replace(/\n/g,'<br>')}</p></div>`:''}
          </div>`;
        };
        room.addEventListener('input',e=>{if(e.target.matches('[data-field],#sgProsemSchool,#sgProsemSubject,#sgProsemPhase,#sgProsemClass,#sgProsemYear,#sgProsemWeeks,#sgProsemNotes'))setTimeout(refresh,0)});
        room.addEventListener('change',e=>{if(e.target.matches('[data-field],#sgProsemSchool,#sgProsemSubject,#sgProsemPhase,#sgProsemClass,#sgProsemYear,#sgProsemWeeks,#sgProsemNotes'))setTimeout(refresh,0)});
        room.addEventListener('click',e=>{if(e.target.closest('#sgProsemAdd,#sgProsemLoad,[data-del],#sgProsemClear'))setTimeout(refresh,30)});
        refresh();
      };
      make();
    });
  };
  const style=()=>{if(document.getElementById('sg-prosem-template-style'))return;const s=document.createElement('style');s.id='sg-prosem-template-style';s.textContent=`.sg-prosem-template-main{margin:22px 0 34px}.sg-prosem-template-paper{background:#fff;border:1px solid #dfe5ec;border-radius:18px;padding:28px;box-shadow:0 10px 28px rgba(15,23,42,.06);color:#172033}.sg-prosem-template-kicker{font-size:11px;font-weight:800;letter-spacing:.14em;color:#64748b;margin-bottom:6px}.sg-prosem-template-title{margin:0;text-align:center;font-size:23px;letter-spacing:.01em}.sg-prosem-template-subtitle{text-align:center;margin:5px 0 20px;color:#64748b;font-size:13px}.sg-prosem-template-identity{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:22px}.sg-prosem-template-identity>div{border:1px solid #e2e8f0;border-radius:10px;padding:9px 11px;background:#f8fafc}.sg-prosem-template-identity span{display:block;font-size:10px;color:#64748b;margin-bottom:3px}.sg-prosem-template-identity strong{display:block;font-size:12px}.sg-prosem-template-section{margin-top:20px}.sg-prosem-template-section-head{display:flex;align-items:flex-end;justify-content:space-between;border-bottom:2px solid #172033;padding:0 2px 7px;margin-bottom:9px}.sg-prosem-template-section-head span{display:block;font-size:10px;letter-spacing:.12em;color:#64748b;font-weight:800}.sg-prosem-template-section-head h3{margin:2px 0 0;font-size:17px}.sg-prosem-template-section-head>strong{font-size:13px}.sg-prosem-template-table-wrap{overflow:auto}.sg-prosem-template-table{width:100%;border-collapse:collapse;font-size:11px;table-layout:fixed}.sg-prosem-template-table th,.sg-prosem-template-table td{border:1px solid #cbd5e1;padding:7px;vertical-align:top;word-break:break-word}.sg-prosem-template-table th{background:#f1f5f9;text-align:center;font-weight:800}.sg-prosem-t-no{width:34px;text-align:center}.sg-prosem-t-jp{width:42px;text-align:center;font-weight:700}.sg-prosem-t-empty{text-align:center;color:#64748b;padding:16px!important}.sg-prosem-template-recap{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:20px}.sg-prosem-template-recap>div{border:1px solid #dbe3ec;border-radius:10px;padding:10px 12px;background:#f8fafc}.sg-prosem-template-recap span{display:block;color:#64748b;font-size:10px}.sg-prosem-template-recap strong{font-size:15px}.sg-prosem-template-notes{margin-top:16px;padding:12px 14px;border-left:3px solid #64748b;background:#f8fafc;font-size:11px}.sg-prosem-template-notes p{margin:5px 0 0;line-height:1.5}@media(max-width:800px){.sg-prosem-template-paper{padding:17px;border-radius:14px}.sg-prosem-template-title{font-size:18px}.sg-prosem-template-identity{grid-template-columns:1fr 1fr}.sg-prosem-template-table{min-width:900px}.sg-prosem-template-recap{grid-template-columns:1fr}.sg-prosem-template-section-head{align-items:center}}`;document.head.appendChild(s)};
  style();boot();
  new MutationObserver(()=>boot()).observe(document.body,{childList:true,subtree:true});
})();