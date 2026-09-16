(()=>{
  const boot=()=>{
    const home=document.getElementById('homeView');
    if(!home||home.dataset.sghV4==='1')return;
    const groups=[
      {name:'Pembelajaran',desc:'Perencanaan, perangkat, materi, dan AI.',items:['CP','ATP','TP','PROTA','PROSEM','Perangkat','RPM Deep Learning','LKPD','Materi','AI Generate']},
      {name:'Asesmen',desc:'Kelola penilaian dan analisis hasil belajar.',items:['Penilaian','Penilaian per Bab','Ulangan Semester','Akhir Semester','Rekap Nilai','Analisis']},
      {name:'Peserta Didik',desc:'Data, rombel, profil, dan perkembangan siswa.',items:['Data Siswa','Rombel','Profil','Perkembangan']},
      {name:'Dokumen',desc:'Kelola draft, dokumen selesai, template, dan riwayat.',items:['Draft','Selesai','Template','Riwayat']},
      {name:'Satuan Pendidikan',desc:'Identitas dan profil satuan pendidikan.',items:['Profil Satuan Pendidikan']}
    ];
    const icon={Pembelajaran:'▣',Asesmen:'✓', 'Peserta Didik':'♙',Dokumen:'▤','Satuan Pendidikan':'⌂'};
    const subIcon={CP:'○',ATP:'↗',TP:'◎',PROTA:'▦',PROSEM:'▤',Perangkat:'▥','RPM Deep Learning':'✦',LKPD:'▤',Materi:'▤','AI Generate':'✦',Penilaian:'✓','Penilaian per Bab':'☷','Ulangan Semester':'□','Akhir Semester':'◷','Rekap Nilai':'▥',Analisis:'⌁','Data Siswa':'♙',Rombel:'♧',Profil:'♙',Perkembangan:'⌁',Draft:'▤',Selesai:'✓',Template:'▥',Riwayat:'◷','Profil Satuan Pendidikan':'⌂'};
    home.dataset.sghV4='1';
    home.innerHTML='';
    const wrap=document.createElement('div'); wrap.className='sg-home-v4';
    wrap.innerHTML='<header class="sg-home-v4-header"><div><div class="sg-home-v4-eyebrow">PORTAL ADMINISTRASI GURU SD</div><h1>SIAP GURU</h1><p>Ruang kerja terpadu untuk pembelajaran, asesmen, peserta didik, dan dokumen.</p></div><button type="button" class="sg-home-v4-home">Beranda</button></header>';
    const intro=document.createElement('section'); intro.className='sg-home-v4-intro'; intro.innerHTML='<div><span>WORKSPACE</span><h2>Ruang Kerja Utama</h2><p>Semua kebutuhan guru tersusun dalam satu struktur yang lengkap.</p></div>';
    const grid=document.createElement('div'); grid.className='sg-home-v4-grid';
    groups.forEach(g=>{
      const card=document.createElement('section'); card.className='sg-home-v4-group'; card.dataset.group=g.name;
      card.innerHTML=`<div class="sg-home-v4-group-head"><div class="sg-home-v4-main-icon">${icon[g.name]||'•'}</div><div><h3>${g.name}</h3><p>${g.desc}</p></div><span class="sg-home-v4-count">${g.items.length}</span></div>`;
      const list=document.createElement('div'); list.className='sg-home-v4-items';
      g.items.forEach(item=>{const b=document.createElement('button');b.type='button';b.className='sg-home-v4-item';b.dataset.sghItem=item;b.innerHTML=`<span class="sg-home-v4-item-icon">${subIcon[item]||'•'}</span><span>${item}</span><span class="sg-home-v4-arrow">›</span>`;list.appendChild(b)});
      card.appendChild(list); grid.appendChild(card);
    });
    intro.appendChild(grid); wrap.appendChild(intro);
    const note=document.createElement('div'); note.className='sg-home-v4-note'; note.innerHTML='<strong>SIAP GURU 2026/2027</strong><span>Administrasi • Pembelajaran • Asesmen • Peserta Didik • Dokumen</span>'; wrap.appendChild(note);
    home.appendChild(wrap);
    wrap.querySelector('.sg-home-v4-home')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,80));else setTimeout(boot,80);
  new MutationObserver(()=>setTimeout(boot,40)).observe(document.body,{childList:true,subtree:true});
})();
