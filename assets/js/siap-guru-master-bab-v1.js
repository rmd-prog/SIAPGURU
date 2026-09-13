/* SIAP GURU — Master BAB/Topik v1
   Generator dasar tidak memakai token/API AI.
   Data awal memakai sumber buku teks yang dapat diverifikasi; struktur siap diperluas per mapel/fase/kelas.
*/
(()=>{
  const KEY='siapguru_master_bab_v1';
  const seed=[
    {id:'bi4-1',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:1,bab:'Bab 1 — Sudah Besar',subtopik:['Teks narasi','Kalimat transitif dan intransitif','Kosakata baru dan makna denotatif','Tulisan tegak bersambung','Kamus kartu'],jp:8,source:'Bahasa Indonesia: Lihat Sekitar untuk SD/MI Kelas IV (Edisi Revisi), 2024',sourceUrl:'https://annibuku.com/bse/bahasa-indonesia-lihat-sekitar-untuk-sdmi-kelas-iv-edisi-revisi-4114'},
    {id:'bi4-2',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:1,bab:'Bab 2 — Di Bawah Atap',subtopik:[],jp:8,source:'Bahasa Indonesia: Lihat Sekitar untuk SD/MI Kelas IV (Edisi Revisi), 2024',sourceUrl:'https://annibuku.com/bse/bahasa-indonesia-lihat-sekitar-untuk-sdmi-kelas-iv-edisi-revisi-4114'},
    {id:'bi4-3',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:1,bab:'Bab 3 — Lihat Sekitar',subtopik:[],jp:8,source:'Bahasa Indonesia: Lihat Sekitar untuk SD/MI Kelas IV (Edisi Revisi), 2024',sourceUrl:'https://annibuku.com/bse/bahasa-indonesia-lihat-sekitar-untuk-sdmi-kelas-iv-edisi-revisi-4114'},
    {id:'bi4-4',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:1,bab:'Bab 4 — Meliuk dan Menerjang',subtopik:[],jp:8,source:'Bahasa Indonesia: Lihat Sekitar untuk SD/MI Kelas IV (Edisi Revisi), 2024',sourceUrl:'https://annibuku.com/bse/bahasa-indonesia-lihat-sekitar-untuk-sdmi-kelas-iv-edisi-revisi-4114'},
    {id:'bi4-5',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:2,bab:'Bab 5 — Bertukar dan Membayar',subtopik:[],jp:8,source:'Bahasa Indonesia: Lihat Sekitar untuk SD/MI Kelas IV (Edisi Revisi), 2024',sourceUrl:'https://annibuku.com/bse/bahasa-indonesia-lihat-sekitar-untuk-sdmi-kelas-iv-edisi-revisi-4114'},
    {id:'bi4-6',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:2,bab:'Bab 6 — Satu Titik',subtopik:[],jp:8,source:'Bahasa Indonesia: Lihat Sekitar untuk SD/MI Kelas IV (Edisi Revisi), 2024',sourceUrl:'https://annibuku.com/bse/bahasa-indonesia-lihat-sekitar-untuk-sdmi-kelas-iv-edisi-revisi-4114'},
    {id:'bi4-7',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:2,bab:'Bab 7 — Asal-Usul',subtopik:[],jp:8,source:'Bahasa Indonesia: Lihat Sekitar untuk SD/MI Kelas IV (Edisi Revisi), 2024',sourceUrl:'https://annibuku.com/bse/bahasa-indonesia-lihat-sekitar-untuk-sdmi-kelas-iv-edisi-revisi-4114'},
    {id:'bi4-8',mapel:'Bahasa Indonesia',fase:'B',kelas:4,semester:2,bab:'Bab 8 — Sehatlah Ragaku',subtopik:[],jp:8,source:'Bahasa Indonesia: Lihat Sekitar untuk SD/MI Kelas IV (Edisi Revisi), 2024',sourceUrl:'https://annibuku.com/bse/bahasa-indonesia-lihat-sekitar-untuk-sdmi-kelas-iv-edisi-revisi-4114'}
  ];
  const load=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return Array.isArray(x)&&x.length?x:seed}catch{return seed}};
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
    v.innerHTML=`<div class="sg-master-bab-room"><div class="inner-view-head"><div><button class="back-button" type="button" data-sg-master-back>← Beranda</button><span class="eyebrow">PEMBELAJARAN</span><h1>Master BAB / Topik</h1><p>Bank topik yang menjadi sumber Generate Otomatis Pembelajaran Mendalam.</p></div><div class="teacher-chip"><strong>${data.length}</strong><span>topik tersimpan</span></div></div><div class="sg-master-toolbar"><select id="sgMBMapel"><option value="">Semua mata pelajaran</option>${mapels.map(x=>`<option>${qs(x)}</option>`).join('')}</select><select id="sgMBKelas"><option value="">Semua kelas</option>${[1,2,3,4,5,6].map(x=>`<option value="${x}">Kelas ${x}</option>`).join('')}</select><select id="sgMBSem"><option value="">Semua semester</option><option value="1">Semester 1</option><option value="2">Semester 2</option></select><input id="sgMBCari" type="search" placeholder="Cari BAB / topik..."><button id="sgMBAdd" class="sg-export-primary" type="button">+ Tambah BAB</button></div><div id="sgMBList"></div><div class="sg-master-note"><strong>Sumber kebijakan:</strong> mapel umum tetap mengacu BSKAP 046/H/KR/2025, sedangkan Agama dan Budi Pekerti memakai pembaruan BKPDM 020 Tahun 2026. Dataset dapat ditambah tanpa token AI.</div></div>`;
    const renderList=()=>{const m=document.getElementById('sgMBMapel')?.value,k=document.getElementById('sgMBKelas')?.value,s=document.getElementById('sgMBSem')?.value,q=(document.getElementById('sgMBCari')?.value||'').toLowerCase();const rows=data.filter(x=>(!m||x.mapel===m)&&(!k||String(x.kelas)===k)&&(!s||String(x.semester)===s)&&(!q||`${x.bab} ${(x.subtopik||[]).join(' ')}`.toLowerCase().includes(q)));document.getElementById('sgMBList').innerHTML=rows.length?`<div class="sg-master-table-wrap"><table class="sg-master-table"><thead><tr><th>BAB / TOPIK</th><th>Mapel</th><th>Kelas</th><th>Semester</th><th>JP</th><th>Sumber</th><th></th></tr></thead><tbody>${rows.map(x=>`<tr><td><strong>${qs(x.bab)}</strong><small>${qs((x.subtopik||[]).join(' • ')||'Subtopik siap diisi')}</small></td><td>${qs(x.mapel)}</td><td>${x.kelas}</td><td>${x.semester}</td><td>${x.jp}</td><td>${qs(x.source||'-')}</td><td><button type="button" class="sg-master-use" data-id="${x.id}">Gunakan</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-state">Belum ada BAB yang sesuai filter.</div>';rows.forEach(()=>{});document.querySelectorAll('.sg-master-use').forEach(b=>b.onclick=()=>use(b.dataset.id));};
    ['sgMBMapel','sgMBKelas','sgMBSem','sgMBCari'].forEach(id=>document.getElementById(id)?.addEventListener('input',renderList));
    document.getElementById('sgMBAdd').onclick=()=>add(renderList);
    document.querySelector('[data-sg-master-back]')?.addEventListener('click',()=>{v.hidden=true;document.getElementById('homeView')?.removeAttribute('hidden')});
    renderList();
  }
  function add(refresh){const mapel=prompt('Mata pelajaran:','Matematika');if(!mapel)return;const kelas=Number(prompt('Kelas 1-6:','4'));if(!kelas)return;const semester=Number(prompt('Semester 1/2:','1'));const bab=prompt('Nama BAB / Topik:');if(!bab)return;const jp=Number(prompt('Alokasi JP:','8'))||8;data.push({id:'custom-'+Date.now(),mapel,fase:phase(kelas),kelas,semester,bab,subtopik:[],jp,source:'Ditambahkan guru'});save();refresh()}
  function use(id){const x=data.find(a=>a.id===id);if(!x)return;sessionStorage.setItem('siapguru_selected_topic',JSON.stringify(x));document.dispatchEvent(new CustomEvent('siapguru:topic-selected',{detail:x}));alert(`BAB/Topik dipilih: ${x.bab}\n\nTopik siap dipakai oleh generator Pembelajaran Mendalam.`)}
  window.SiapGuruMasterBab={open,getAll:()=>data,select:use};
  document.addEventListener('click',e=>{const a=e.target.closest?.('.sg-topnav-link');if(a&&a.textContent.trim()==='Master BAB / Topik'){e.preventDefault();e.stopPropagation();open()}},true);
  document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>{const sub=[...document.querySelectorAll('.sub-menu span,.sub-menu-button')];if(!sub.some(x=>x.textContent.trim()==='Master BAB / Topik')){const card=[...document.querySelectorAll('.menu-card')].find(x=>x.querySelector('h3')?.textContent.trim()==='Pembelajaran');const sm=card?.querySelector('.sub-menu');if(sm){const s=document.createElement('span');s.textContent='Master BAB / Topik';sm.appendChild(s)}}},150)});
})();
