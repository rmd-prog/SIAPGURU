/* SIAP GURU — Master BAB/Topik v1
   Generator dasar tidak memakai token/API AI.
   Dataset inti mencakup kelas 1-6; judul BAB yang belum diverifikasi ditandai sebagai BAB SIBI.
*/
(()=>{
  const KEY='siapguru_master_bab_v1';
  const base=[
    {id:'bi4-1',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:1,bab:'Bab 1 — Sudah Besar',subtopik:['Teks narasi','Kalimat transitif dan intransitif','Kosakata baru dan makna denotatif','Tulisan tegak bersambung','Kamus kartu'],jp:8,source:'Bahasa Indonesia: Lihat Sekitar untuk SD/MI Kelas IV (Edisi Revisi), 2024',sourceUrl:'https://buku.kemendikdasmen.go.id/'},
    {id:'bi4-2',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:1,bab:'Bab 2 — Di Bawah Atap',subtopik:[],jp:8,source:'Bahasa Indonesia: Lihat Sekitar Kelas IV (Edisi Revisi) — SIBI',sourceUrl:'https://buku.kemendikdasmen.go.id/'},
    {id:'bi4-3',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:1,bab:'Bab 3 — Lihat Sekitar',subtopik:[],jp:8,source:'Bahasa Indonesia: Lihat Sekitar Kelas IV (Edisi Revisi) — SIBI',sourceUrl:'https://buku.kemendikdasmen.go.id/'},
    {id:'bi4-4',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:1,bab:'Bab 4 — Meliuk dan Menerjang',subtopik:[],jp:8,source:'Bahasa Indonesia: Lihat Sekitar Kelas IV (Edisi Revisi) — SIBI',sourceUrl:'https://buku.kemendikdasmen.go.id/'},
    {id:'bi4-5',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:2,bab:'Bab 5 — Bertukar dan Membayar',subtopik:[],jp:8,source:'Bahasa Indonesia: Lihat Sekitar Kelas IV (Edisi Revisi) — SIBI',sourceUrl:'https://buku.kemendikdasmen.go.id/'},
    {id:'bi4-6',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:2,bab:'Bab 6 — Satu Titik',subtopik:[],jp:8,source:'Bahasa Indonesia: Lihat Sekitar Kelas IV (Edisi Revisi) — SIBI',sourceUrl:'https://buku.kemendikdasmen.go.id/'},
    {id:'bi4-7',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:2,bab:'Bab 7 — Asal-Usul',subtopik:[],jp:8,source:'Bahasa Indonesia: Lihat Sekitar Kelas IV (Edisi Revisi) — SIBI',sourceUrl:'https://buku.kemendikdasmen.go.id/'},
    {id:'bi4-8',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:2,bab:'Bab 8 — Sehatlah Ragaku',subtopik:[],jp:8,source:'Bahasa Indonesia: Lihat Sekitar Kelas IV (Edisi Revisi) — SIBI',sourceUrl:'https://buku.kemendikdasmen.go.id/'}
  ];

  // Struktur kelas 1-6. Untuk BAB yang belum diverifikasi judulnya, sistem sengaja
  // memakai label "Bab SIBI" agar tidak mengarang judul buku. Judul dapat diperbarui
  // kemudian dari buku SIBI tanpa mengubah generator RPM.
  const gradeRows=[];
  const add=(mapel,kelas,semester,bab,source)=>gradeRows.push({
    id:`seed-${mapel.replace(/[^a-z0-9]/gi,'').toLowerCase()}-${kelas}-${semester}-${bab}`,
    mapel,fase:kelas<=2?'A':kelas<=4?'B':'C',kelas,semester,
    bab:`Bab ${bab} — SIBI`,subtopik:[],jp:8,source,sourceUrl:'https://buku.kemendikdasmen.go.id/'
  });
  const addBoth=(mapel,kelas,babCount,source)=>{
    for(let i=1;i<=babCount;i++)add(mapel,kelas,i<=Math.ceil(babCount/2)?1:2,i,source);
  };

  // Buku/struktur yang tersedia lintas kelas di SIBI.
  for(let k=1;k<=6;k++){
    addBoth('Bahasa Indonesia',k,8,`Buku Bahasa Indonesia SD/MI Kelas ${k} — SIBI`);
    addBoth('Pendidikan Pancasila',k,4,`Buku Pendidikan Pancasila SD/MI Kelas ${k} — SIBI`);
    addBoth('Matematika',k,8,`Buku Matematika SD/MI Kelas ${k} — SIBI`);
    addBoth('PJOK',k,8,`Buku PJOK SD Kelas ${k} — SIBI`);
  }
  // IPAS mulai digunakan pada kelas 3.
  for(let k=3;k<=6;k++)addBoth('IPAS',k,8,`Buku IPAS SD/MI Kelas ${k} — SIBI`);

  const seed=[...base,...gradeRows.filter(r=>!base.some(b=>b.id===r.id))];
  const load=()=>{
    try{
      const raw=JSON.parse(localStorage.getItem(KEY)||'null');
      if(!Array.isArray(raw)||!raw.length)return seed;
      const ids=new Set(raw.map(x=>x.id));
      return [...raw,...seed.filter(x=>!ids.has(x.id))];
    }catch{return seed}
  };
  let data=load();
  const save=()=>localStorage.setItem(KEY,JSON.stringify(data));
  const phase=k=>k<=2?'A':k<=4?'B':'C';
  const qs=s=>String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function open(){
    let v=document.getElementById('sgMasterBabView');
    if(!v){v=document.createElement('section');v.id='sgMasterBabView';v.className='inner-view';v.hidden=true;document.querySelector('.main-content')?.appendChild(v)}
    v.hidden=false;
    document.querySelectorAll('.main-content>section').forEach(x=>{if(x!==v)x.hidden=true});
    render(v);
  }
  function render(v){
    const mapels=[...new Set(data.map(x=>x.mapel))].sort();
    v.innerHTML=`<div class="sg-master-bab-room"><div class="inner-view-head"><div><button class="back-button" type="button" data-sg-master-back>← Beranda</button><span class="eyebrow">PEMBELAJARAN</span><h1>Master BAB / Topik</h1><p>Bank topik kelas 1–6 untuk sumber Generate Pembelajaran Mendalam tanpa token AI.</p></div><div class="teacher-chip"><strong>${data.length}</strong><span>topik tersimpan</span></div></div><div class="sg-master-toolbar"><select id="sgMBMapel"><option value="">Semua mata pelajaran</option>${mapels.map(x=>`<option>${qs(x)}</option>`).join('')}</select><select id="sgMBKelas"><option value="">Semua kelas</option>${[1,2,3,4,5,6].map(x=>`<option value="${x}">Kelas ${x}</option>`).join('')}</select><select id="sgMBSem"><option value="">Semua semester</option><option value="1">Semester 1</option><option value="2">Semester 2</option></select><input id="sgMBCari" type="search" placeholder="Cari BAB / topik..."><button id="sgMBAdd" class="sg-export-primary" type="button">+ Tambah BAB</button></div><div id="sgMBList"></div><div class="sg-master-note"><strong>Sumber:</strong> SIBI Kementerian Pendidikan Dasar dan Menengah. Struktur mapel umum mengikuti BSKAP 046/H/KR/2025; Agama dan Budi Pekerti mengikuti BKPDM 020 Tahun 2026. Judul yang belum diverifikasi ditampilkan sebagai “Bab SIBI”, bukan judul rekaan.</div></div>`;
    const renderList=()=>{const m=document.getElementById('sgMBMapel')?.value,k=document.getElementById('sgMBKelas')?.value,s=document.getElementById('sgMBSem')?.value,q=(document.getElementById('sgMBCari')?.value||'').toLowerCase();const rows=data.filter(x=>(!m||x.mapel===m)&&(!k||String(x.kelas)===k)&&(!s||String(x.semester)===s)&&(!q||`${x.bab} ${(x.subtopik||[]).join(' ')}`.toLowerCase().includes(q)));document.getElementById('sgMBList').innerHTML=rows.length?`<div class="sg-master-table-wrap"><table class="sg-master-table"><thead><tr><th>BAB / TOPIK</th><th>Mapel</th><th>Kelas</th><th>Semester</th><th>JP</th><th>Sumber</th><th></th></tr></thead><tbody>${rows.map(x=>`<tr><td><strong>${qs(x.bab)}</strong><small>${qs((x.subtopik||[]).join(' • ')||'Subtopik dapat dilengkapi guru')}</small></td><td>${qs(x.mapel)}</td><td>${x.kelas}</td><td>${x.semester}</td><td>${x.jp}</td><td>${qs(x.source||'-')}</td><td><button type="button" class="sg-master-use" data-id="${x.id}">Gunakan</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-state">Belum ada BAB yang sesuai filter.</div>';document.querySelectorAll('.sg-master-use').forEach(b=>b.onclick=()=>use(b.dataset.id));};
    ['sgMBMapel','sgMBKelas','sgMBSem','sgMBCari'].forEach(id=>document.getElementById(id)?.addEventListener('input',renderList));
    document.getElementById('sgMBAdd').onclick=()=>addCustom(renderList);
    document.querySelector('[data-sg-master-back]')?.addEventListener('click',()=>{v.hidden=true;document.querySelectorAll('.main-content>section').forEach(x=>{if(x!==v)x.hidden=false})});
    renderList();
  }
  function addCustom(refresh){const mapel=prompt('Mata pelajaran:','Matematika');if(!mapel)return;const kelas=Number(prompt('Kelas 1-6:','4'));if(kelas<1||kelas>6)return alert('Kelas harus 1 sampai 6.');const semester=Number(prompt('Semester 1/2:','1'));if(semester<1||semester>2)return alert('Semester harus 1 atau 2.');const bab=prompt('Nama BAB / Topik:');if(!bab)return;const jp=Number(prompt('Alokasi JP:','8'))||8;data.push({id:'custom-'+Date.now(),mapel,fase:phase(kelas),kelas,semester,bab,subtopik:[],jp,source:'Ditambahkan guru'});save();refresh()}
  function use(id){const x=data.find(a=>a.id===id);if(!x)return;sessionStorage.setItem('siapguru_selected_topic',JSON.stringify(x));document.dispatchEvent(new CustomEvent('siapguru:topic-selected',{detail:x}));alert(`BAB/Topik dipilih: ${x.bab}\n\nTopik siap dipakai oleh generator Pembelajaran Mendalam.`)}
  window.SiapGuruMasterBab={open,getAll:()=>data,select:use};
  document.addEventListener('click',e=>{const a=e.target.closest?.('.sg-topnav-link');if(a&&a.textContent.trim()==='Master BAB / Topik'){e.preventDefault();e.stopPropagation();open()}},true);
  document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>{const sub=[...document.querySelectorAll('.sub-menu span,.sub-menu-button')];if(!sub.some(x=>x.textContent.trim()==='Master BAB / Topik')){const card=[...document.querySelectorAll('.menu-card')].find(x=>x.querySelector('h3')?.textContent.trim()==='Pembelajaran');const sm=card?.querySelector('.sub-menu');if(sm){const s=document.createElement('span');s.textContent='Master BAB / Topik';sm.appendChild(s)}}},150)});
})();
