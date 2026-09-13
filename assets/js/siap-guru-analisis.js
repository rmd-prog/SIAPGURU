(()=>{
  let opening=false;

  const openAnalisis=()=>{
    if(opening)return;
    const existing=document.querySelector('.sg-an-room');
    if(existing){existing.scrollIntoView({behavior:'smooth',block:'start'});return;}

    const home=document.getElementById('homeView');
    const studentsView=document.getElementById('studentsView');
    const main=document.querySelector('.main-content');
    if(!home||!main)return;

    opening=true;
    try{
      home.hidden=true;
      if(studentsView)studentsView.hidden=true;
      document.querySelectorAll('.sg-room-view').forEach(x=>x.remove());

      const room=document.createElement('section');
      room.className='sg-room-view sg-an-room';
      main.appendChild(room);
      window.__sgAnalisisBoot=1;

      const esc=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
      const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
      let u={};try{u=JSON.parse(sessionStorage.getItem('siapguru_user')||'null')||{}}catch(_){u={}};
      const defs=[
        ['siapguru_penilaian_draft','Penilaian'],
        ['siapguru_penilaian_bab_draft','Penilaian per Bab'],
        ['siapguru_ulangan_semester_draft','Ulangan Semester'],
        ['siapguru_akhir_semester_draft','Akhir Semester']
      ];

      room.innerHTML=`
        <style>
          .sg-an-room{max-width:1120px;margin:0 auto;padding:22px 0 44px}
          .sg-an-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:18px}
          .sg-an-back{border:0;background:transparent;padding:0;cursor:pointer;font:inherit;margin-bottom:10px;color:var(--sg-text,#1f2937);font-weight:700}
          .sg-an-back:hover{opacity:.72}
          .sg-an-eye{display:block;font-size:.7rem;letter-spacing:.12em;font-weight:800;opacity:.58;margin-bottom:7px}
          .sg-an-title{display:flex;gap:12px;align-items:center}
          .sg-an-title h1{margin:0 0 4px;font-size:1.55rem;line-height:1.2}
          .sg-an-title p{margin:0;opacity:.68;font-size:.88rem}
          .sg-an-icon{width:40px;height:40px;flex:0 0 40px;border-radius:11px;display:grid;place-items:center;background:#f1f4f8;color:#334155;font-size:.78rem;font-weight:800}
          .sg-an-status{padding:7px 10px;border:1px solid #e5eaf1;border-radius:999px;background:#f7f9fb;color:#64748b;font-size:.72rem;font-weight:800;white-space:nowrap}
          .sg-an-grid{display:grid;gap:14px}
          .sg-an-card{border:1px solid #e5eaf1;background:var(--sg-surface,#fff);border-radius:17px;padding:18px;box-shadow:0 8px 24px rgba(30,45,70,.05)}
          .sg-an-label{font-size:.68rem;letter-spacing:.12em;font-weight:800;opacity:.58}
          .sg-an-filters{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:12px}
          .sg-an-filters label{font-size:.8rem;font-weight:700;color:#334155}
          .sg-an-filters select,.sg-an-search{width:100%;box-sizing:border-box;margin-top:6px;padding:10px 11px;border:1px solid #dfe5ed;border-radius:10px;background:#fff;color:#1f2937;outline:none;font:inherit}
          .sg-an-filters select:focus,.sg-an-search:focus{border-color:#94a3b8;box-shadow:0 0 0 3px rgba(100,116,139,.1)}
          .sg-an-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
          .sg-an-stat{padding:15px;border:1px solid #e5eaf1;border-radius:14px;background:#fff}
          .sg-an-stat span{display:block;font-size:.76rem;opacity:.62}
          .sg-an-stat strong{display:block;font-size:1.35rem;line-height:1.2;margin-top:6px;color:#1f2937}
          .sg-an-tools{display:flex;justify-content:space-between;gap:12px;align-items:end}
          .sg-an-search{max-width:240px}
          .sg-an-table{width:100%;border-collapse:separate;border-spacing:0;margin-top:14px;overflow:hidden;border:1px solid #e5eaf1;border-radius:12px}
          .sg-an-table th,.sg-an-table td{padding:11px 10px;border-bottom:1px solid #e8edf3;text-align:left;font-size:.82rem}
          .sg-an-table th{background:#f7f9fb;color:#475569;font-size:.72rem;letter-spacing:.02em;font-weight:800}
          .sg-an-table tr:last-child td{border-bottom:0}
          .sg-an-table tbody tr:hover td{background:#fafbfd}
          .sg-an-note{margin:12px 2px 0;font-size:.78rem;opacity:.6;line-height:1.5}
          .sg-an-error{padding:13px;border-radius:12px;background:rgba(220,38,38,.06);border:1px solid rgba(220,38,38,.12);font-size:.84rem}
          @media(max-width:760px){
            .sg-an-room{padding:16px 0 32px}
            .sg-an-head{display:block;margin-bottom:14px}
            .sg-an-status{display:inline-flex;margin-top:10px}
            .sg-an-filters{grid-template-columns:1fr 1fr}
            .sg-an-stats{grid-template-columns:1fr 1fr}
            .sg-an-tools{display:block}
            .sg-an-search{max-width:none}
            .sg-an-card{padding:15px}
            .sg-an-table{min-width:760px}
            .sg-an-card:has(.sg-an-table){overflow:auto}
          }
          @media(max-width:460px){
            .sg-an-filters,.sg-an-stats{grid-template-columns:1fr}
            .sg-an-title h1{font-size:1.35rem}
            .sg-an-title p{font-size:.82rem}
          }
        </style>
        <div class="sg-an-head"><div><button type="button" class="sg-an-back">← Kembali ke Beranda</button><span class="sg-an-eye">ASESMEN</span><div class="sg-an-title"><span class="sg-an-icon">AN</span><div><h1>Analisis</h1><p>Analisis hasil asesmen berdasarkan data yang sudah tersimpan di SIAP GURU.</p></div></div></div><span class="sg-an-status">ASESMEN → ANALISIS</span></div>
        <div class="sg-an-grid">
          <div class="sg-an-card"><span class="sg-an-label">FILTER ANALISIS</span><div class="sg-an-filters"><label>Mapel<select id="anSub"><option value="">Semua mapel</option></select></label><label>Fase<select id="anPhase"><option value="">Semua fase</option><option>A</option><option>B</option><option>C</option></select></label><label>Kelas<select id="anClass"><option value="">Semua kelas</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select></label><label>Semester<select id="anSem"><option value="">Semua semester</option><option>1</option><option>2</option></select></label></div></div>
          <div class="sg-an-stats"><div class="sg-an-stat"><span>Total siswa</span><strong id="anTotal">0</strong></div><div class="sg-an-stat"><span>Sudah dinilai</span><strong id="anRated">0</strong></div><div class="sg-an-stat"><span>Ketuntasan</span><strong id="anPct">0%</strong></div><div class="sg-an-stat"><span>Belum tuntas</span><strong id="anBelow">0</strong></div><div class="sg-an-stat"><span>Rata-rata</span><strong id="anAvg">—</strong></div></div>
          <div class="sg-an-card"><div class="sg-an-tools"><div><span class="sg-an-label">HASIL ANALISIS</span><h2 style="margin:5px 0 0">Analisis per peserta didik</h2></div><input id="anSearch" class="sg-an-search" type="search" placeholder="Cari siswa..."></div><div style="overflow:auto"><table class="sg-an-table"><thead><tr><th>No.</th><th>Nama</th><th>Rombel</th><th>Nilai</th><th>Status</th><th>Tindak lanjut</th></tr></thead><tbody id="anBody"><tr><td colspan="6">Menyiapkan analisis...</td></tr></tbody></table></div><p class="sg-an-note">Analisis membaca sumber asesmen lokal yang sudah digunakan modul penilaian. Tidak membuat nilai baru dan tidak mengubah D1/Worker.</p></div>
        </div>`;

      const $=id=>room.querySelector('#'+id);
      const back=room.querySelector('.sg-an-back');
      back.onclick=()=>{room.remove();window.__sgAnalisisBoot=0;opening=false;home.hidden=false;window.scrollTo({top:0,behavior:'smooth'})};

      let students=[];
      const name=s=>String(s?.nama||s?.name||s?.student_name||'').trim();
      const key=s=>String(s?.id??s?.nisn??s?.nis??name(s));
      const score=d=>{
        if(!d)return[];
        const cs=Array.isArray(d.components)?d.components:[],out=[];
        Object.entries(d.scores||{}).forEach(([k,v])=>{
          const rated=cs.some((c,i)=>v?.[i]!==''&&v?.[i]!=null);
          if(!rated)return;
          const total=cs.reduce((a,c)=>a+Number(c.weight||0),0);
          const value=total?cs.reduce((a,c,i)=>a+Number(v?.[i]??0)*Number(c.weight||0)/total,0):(cs.length?cs.reduce((a,c,i)=>a+Number(v?.[i]??0),0)/cs.length:0);
          out.push({k,value,target:Number(d.target||75)});
        });
        return out;
      };
      const render=()=>{
        const sub=$('anSub').value,ph=$('anPhase').value,cl=$('anClass').value,se=$('anSem').value,q=$('anSearch').value.toLowerCase().trim();
        const src=defs.map(([k,l])=>({key:k,label:l,data:read(k)})).filter(x=>x.data).filter(x=>(!sub||String(x.data.subject||'')===sub)&&(!ph||String(x.data.phase||'').replace(/^fase\s*/i,'').toUpperCase()===ph)&&(!cl||String(x.data.class||x.data.kelas||'')===cl)&&(!se||String(x.data.semester||'')===se));
        const map=new Map();src.forEach(x=>score(x.data).forEach(z=>{const old=map.get(z.k)||[];old.push(z);map.set(z.k,old)}));
        const rows=students.filter(s=>!q||[name(s),s.nis,s.nisn,s.rombel].some(v=>String(v||'').toLowerCase().includes(q)));
        let rated=0,below=0,sum=0;
        const body=$('anBody');
        body.innerHTML=rows.length?rows.map((s,i)=>{const a=map.get(key(s))||[];const avg=a.length?a.reduce((x,z)=>x+z.value,0)/a.length:null;const target=a.length?Math.max(...a.map(z=>z.target||75)):75;if(avg!=null){rated++;sum+=avg;if(avg<target)below++}const status=avg==null?'Belum dinilai':avg>=target?'Tuntas':'Belum tuntas';const action=avg==null?'Lengkapi penilaian':avg<target?'Remedial / pendampingan':'Pengayaan';return`<tr><td>${i+1}</td><td><strong>${esc(name(s)||'-')}</strong></td><td>${esc(s.rombel||'-')}</td><td>${avg==null?'—':avg.toFixed(1)}</td><td>${status}</td><td>${action}</td></tr>`}).join(''):'<tr><td colspan="6">Tidak ada siswa sesuai filter.</td></tr>';
        $('anTotal').textContent=rows.length;$('anRated').textContent=rated;$('anBelow').textContent=below;$('anPct').textContent=rated?Math.round((rated-below)/rated*100)+'%':'0%';$('anAvg').textContent=rated?(sum/rated).toFixed(1):'—';
      };

      ['anSub','anPhase','anClass','anSem'].forEach(id=>$(id).addEventListener('change',render));
      $('anSearch').addEventListener('input',render);

      const load=async()=>{
        try{
          const r=await fetch(`https://siapguru.adm-sd.workers.dev/api/students?user_id=${encodeURIComponent(u.id||'')}`,{cache:'no-store'});
          const d=await r.json().catch(()=>({}));
          if(!r.ok||!d.ok)throw Error(d.message||'Data siswa gagal dimuat.');
          students=Array.isArray(d.students)?d.students:[];
          const subs=[...new Set(defs.map(([k])=>read(k)?.subject).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'id'));
          $('anSub').innerHTML='<option value="">Semua mapel</option>'+subs.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
          render();
        }catch(e){
          $('anBody').innerHTML=`<tr><td colspan="6"><div class="sg-an-error">${esc(e.message||'Data siswa gagal dimuat.')}</div></td></tr>`;
        }finally{opening=false;}
      };
      opening=false;
      load();
      room.scrollIntoView({behavior:'smooth',block:'start'});
    }catch(e){
      opening=false;
      window.__sgAnalisisBoot=0;
      const room=document.querySelector('.sg-an-room');
      if(room)room.innerHTML=`<div class="sg-an-error">Analisis gagal dimuat: ${String(e?.message||e)}</div>`;
      else home.hidden=false;
      console.error('[SIAP GURU] Analisis boot error',e);
    }
  };

  window.__openSiapGuruAnalisis=openAnalisis;
  document.addEventListener('click',event=>{
    const target=event.target?.closest?.('[data-view="analisis"], .sg-topnav-link');
    if(!target)return;
    const isAnalisis=target.dataset.view==='analisis'||target.textContent.trim()==='Analisis';
    if(!isAnalisis)return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openAnalisis();
  },true);
})();