/* SIAP GURU — MASTER JP V2
   Single source of truth for annual, semester, chapter and material JP.
   IMPORTANT: no equal-distribution fallback. Missing allocations stay UNCONFIGURED.
   Chapter identity comes from MASTER CHAPTER BANK V11.
   Koding & AI is intentionally Class V only.
*/
(()=>{'use strict';
if(window.__SG_MASTER_JP_V2__)return;window.__SG_MASTER_JP_V2__=1;
const M=window.SiapGuruMasterChapterBankV11;
const N=s=>String(s??'').replace(/\s+/g,' ').trim();
const K=s=>N(s).toLowerCase().replace(/[’‘]/g,"'");
const aliases=new Map([
 ['ipas','ipas'],['ilmu pengetahuan alam dan sosial','ipas'],
 ['pendidikan jasmani, olahraga, dan kesehatan','pjok'],['pendidikan jasmani olahraga dan kesehatan','pjok'],['pjok','pjok'],
 ['pai dan bp','pendidikan agama islam dan budi pekerti']
]);
const subjectKey=s=>aliases.get(K(s))||K(s);
const annual={
 'pendidikan agama islam dan budi pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},
 'pendidikan agama kristen dan budi pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},
 'pendidikan agama katolik dan budi pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},
 'pendidikan agama hindu dan budi pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},
 'pendidikan agama buddha dan budi pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},
 'pendidikan agama khonghucu dan budi pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},
 'pendidikan pancasila':{1:144,2:144,3:144,4:144,5:144,6:128},
 'bahasa indonesia':{1:252,2:288,3:216,4:216,5:216,6:192},
 'matematika':{1:144,2:180,3:180,4:180,5:180,6:160},
 'ipas':{1:0,2:0,3:180,4:180,5:180,6:160},
 'pjok':{1:108,2:108,3:108,4:108,5:108,6:96},
 'seni musik':{1:108,2:108,3:108,4:108,5:108,6:96},
 'seni rupa':{1:108,2:108,3:108,4:108,5:108,6:96},
 'seni tari':{1:108,2:108,3:108,4:108,5:108,6:96},
 'seni teater':{1:108,2:108,3:108,4:108,5:108,6:96},
 'seni dan budaya':{1:108,2:108,3:108,4:108,5:108,6:96},
 'bahasa inggris':{1:0,2:0,3:72,4:72,5:72,6:64},
 'koding dan kecerdasan artifisial':{5:72}
};
/* JP GOVERNANCE V3: annual = curriculum intrakurikuler reference; chapter/material JP are NEVER equalized automatically.
   Chapter JP may be VERIFIED/REFERENCE/PLANNING only when sourced; otherwise UNCONFIGURED.
   Material JP is independently audited and never derived by division. Kokurikuler is tracked separately. */
const materialMasterSources={
 '5|bahasa indonesia':{
  source:'Buku Bahasa Indonesia: Bergerak Bersama untuk SD Kelas V (2021) dan dokumen Prota/Prosem sekolah yang mengacu pada edisi tersebut',
  status:'SOURCE_AUDIT_ALIGNED_REFERENCE'
 },
 '5|pendidikan pancasila':{
  source:'Buku Pendidikan Pancasila untuk SD/MI Kelas V, Kemdikbudristek, cetak pertama 2023, ISBN 978-623-194-651-5',
  status:'SOURCE_AUDIT_ALIGNED_REFERENCE'
 },
 '5|matematika':{
  source:'Buku Matematika untuk SD/MI Kelas V, 2022, ISBN 978-602-427-916-5 dan Buku Panduan Guru ISBN 978-602-427-899-1',
  status:'SOURCE_AUDIT_ALIGNED_REFERENCE'
 }
};
const materialMaster={
'5|bahasa indonesia':{
  'ch-5-bahasa-indonesia-1':[
   {materialId:'mat-5-bahasa-indonesia-1-1',material:"Kata sifat"},
   {materialId:'mat-5-bahasa-indonesia-1-2',material:"Sinonim dan antonim"},
   {materialId:'mat-5-bahasa-indonesia-1-3',material:"Makna awalan pe-"},
   {materialId:'mat-5-bahasa-indonesia-1-4',material:"Kalimat majemuk setara"},
   {materialId:'mat-5-bahasa-indonesia-1-5',material:"Penulisan teks deskripsi"},
   {materialId:'mat-5-bahasa-indonesia-1-6',material:"Puisi akrostik"}
  ],
  'ch-5-bahasa-indonesia-2':[
   {materialId:'mat-5-bahasa-indonesia-2-1',material:"Jenis buku fiksi dan nonfiksi"},
   {materialId:'mat-5-bahasa-indonesia-2-2',material:"Bagian dan proses pembuatan buku"},
   {materialId:'mat-5-bahasa-indonesia-2-3',material:"Unsur intrinsik cerita"},
   {materialId:'mat-5-bahasa-indonesia-2-4',material:"Majas metafora, personifikasi, dan hiperbola"},
   {materialId:'mat-5-bahasa-indonesia-2-5',material:"Kalimat langsung dan tidak langsung"},
   {materialId:'mat-5-bahasa-indonesia-2-6',material:"Teks naratif dan deskriptif"}
  ],
  'ch-5-bahasa-indonesia-3':[
   {materialId:'mat-5-bahasa-indonesia-3-1',material:"Kisah prestasi melalui hobi"},
   {materialId:'mat-5-bahasa-indonesia-3-2',material:"Menulis surat"},
   {materialId:'mat-5-bahasa-indonesia-3-3',material:"Awalan me-"},
   {materialId:'mat-5-bahasa-indonesia-3-4',material:"Akhiran -lah dan -kan"},
   {materialId:'mat-5-bahasa-indonesia-3-5',material:"Teks prosedur"},
   {materialId:'mat-5-bahasa-indonesia-3-6',material:"Membuat karya kreatif"}
  ],
  'ch-5-bahasa-indonesia-4':[
   {materialId:'mat-5-bahasa-indonesia-4-1',material:"Ide pokok"},
   {materialId:'mat-5-bahasa-indonesia-4-2',material:"Wawancara"},
   {materialId:'mat-5-bahasa-indonesia-4-3',material:"Kata tanya"},
   {materialId:'mat-5-bahasa-indonesia-4-4',material:"Idiom"},
   {materialId:'mat-5-bahasa-indonesia-4-5',material:"Menggali informasi dari tokoh"},
   {materialId:'mat-5-bahasa-indonesia-4-6',material:"Nilai kewirausahaan"}
  ],
  'ch-5-bahasa-indonesia-5':[
   {materialId:'mat-5-bahasa-indonesia-5-1',material:"Singkatan dan akronim"},
   {materialId:'mat-5-bahasa-indonesia-5-2',material:"Fakta dan opini"},
   {materialId:'mat-5-bahasa-indonesia-5-3',material:"Iklan"},
   {materialId:'mat-5-bahasa-indonesia-5-4',material:"Menulis surel"},
   {materialId:'mat-5-bahasa-indonesia-5-5',material:"Teks eksplanasi"},
   {materialId:'mat-5-bahasa-indonesia-5-6',material:"Presentasi"}
  ],
  'ch-5-bahasa-indonesia-6':[
   {materialId:'mat-5-bahasa-indonesia-6-1',material:"Huruf kapital"},
   {materialId:'mat-5-bahasa-indonesia-6-2',material:"Kalimat perintah"},
   {materialId:'mat-5-bahasa-indonesia-6-3',material:"Menulis angka dan bilangan"},
   {materialId:'mat-5-bahasa-indonesia-6-4',material:"Membaca tatap dan memindai (scanning)"},
   {materialId:'mat-5-bahasa-indonesia-6-5',material:"Informasi lokasi wisata"},
   {materialId:'mat-5-bahasa-indonesia-6-6',material:"Menulis pengumuman"}
  ],
  'ch-5-bahasa-indonesia-7':[
   {materialId:'mat-5-bahasa-indonesia-7-1',material:"Membaca sekilas (skimming)"},
   {materialId:'mat-5-bahasa-indonesia-7-2',material:"Membuat ringkasan"},
   {materialId:'mat-5-bahasa-indonesia-7-3',material:"Ide pokok"},
   {materialId:'mat-5-bahasa-indonesia-7-4',material:"Kalimat utama dan kalimat penjelas"},
   {materialId:'mat-5-bahasa-indonesia-7-5',material:"Kata penghubung"},
   {materialId:'mat-5-bahasa-indonesia-7-6',material:"Imbuhan pe-an"},
   {materialId:'mat-5-bahasa-indonesia-7-7',material:"Teks eksposisi"}
  ],
  'ch-5-bahasa-indonesia-8':[
   {materialId:'mat-5-bahasa-indonesia-8-1',material:"Awalan ter-"},
   {materialId:'mat-5-bahasa-indonesia-8-2',material:"Kata hubung"},
   {materialId:'mat-5-bahasa-indonesia-8-3',material:"Kalimat saran atau tanggapan"},
   {materialId:'mat-5-bahasa-indonesia-8-4',material:"Pantun nasihat"},
   {materialId:'mat-5-bahasa-indonesia-8-5',material:"Menulis naskah pidato"},
   {materialId:'mat-5-bahasa-indonesia-8-6',material:"Membaca pidato"},
   {materialId:'mat-5-bahasa-indonesia-8-7',material:"Kampanye antiperundungan"}
   ],

  recommended:{
   'ch-5-bahasa-indonesia-1':{jp:27,source:'Prota/Prosem 2023/2024–2025/2026 yang mengacu Buku Bahasa Indonesia: Bergerak Bersama Kelas V edisi 2021',status:'REFERENCE_NOT_OFFICIAL'},
   'ch-5-bahasa-indonesia-2':{jp:27,source:'Prota/Prosem 2023/2024–2025/2026 yang mengacu Buku Bahasa Indonesia: Bergerak Bersama Kelas V edisi 2021',status:'REFERENCE_NOT_OFFICIAL'},
   'ch-5-bahasa-indonesia-3':{jp:27,source:'Prota/Prosem 2023/2024–2025/2026 yang mengacu Buku Bahasa Indonesia: Bergerak Bersama Kelas V edisi 2021',status:'REFERENCE_NOT_OFFICIAL'},
   'ch-5-bahasa-indonesia-4':{jp:27,source:'Prota/Prosem 2023/2024–2025/2026 yang mengacu Buku Bahasa Indonesia: Bergerak Bersama Kelas V edisi 2021',status:'REFERENCE_NOT_OFFICIAL'},
   'ch-5-bahasa-indonesia-5':{jp:27,source:'Prota/Prosem 2023/2024–2025/2026 yang mengacu Buku Bahasa Indonesia: Bergerak Bersama Kelas V edisi 2021',status:'REFERENCE_NOT_OFFICIAL'},
   'ch-5-bahasa-indonesia-6':{jp:27,source:'Prota/Prosem 2023/2024–2025/2026 yang mengacu Buku Bahasa Indonesia: Bergerak Bersama Kelas V edisi 2021',status:'REFERENCE_NOT_OFFICIAL'},
   'ch-5-bahasa-indonesia-7':{jp:27,source:'Prota/Prosem 2023/2024–2025/2026 yang mengacu Buku Bahasa Indonesia: Bergerak Bersama Kelas V edisi 2021',status:'REFERENCE_NOT_OFFICIAL'},
   'ch-5-bahasa-indonesia-8':{jp:27,source:'Prota/Prosem 2023/2024–2025/2026 yang mengacu Buku Bahasa Indonesia: Bergerak Bersama Kelas V edisi 2021',status:'REFERENCE_NOT_OFFICIAL'}
  },
 },

 '5|pendidikan pancasila':{
  'ch-5-pendidikan-pancasila-1':[
   {materialId:'mat-5-pendidikan-pancasila-1-1',material:'Sejarah Kelahiran Pancasila'},
   {materialId:'mat-5-pendidikan-pancasila-1-2',material:'Meneladani Perilaku Pancasila'},
   {materialId:'mat-5-pendidikan-pancasila-1-3',material:'Membiasakan Perilaku Pancasila'}
  ],
  'ch-5-pendidikan-pancasila-2':[
   {materialId:'mat-5-pendidikan-pancasila-2-1',material:'Macam-Macam Norma dalam Kehidupanku'},
   {materialId:'mat-5-pendidikan-pancasila-2-2',material:'Penerapan Norma dalam Kehidupanku'},
   {materialId:'mat-5-pendidikan-pancasila-2-3',material:'Mempraktikkan Norma di Lingkunganku'},
   {materialId:'mat-5-pendidikan-pancasila-2-4',material:'Arti Penting Musyawarah dalam Kehidupanku'}
  ],
  'ch-5-pendidikan-pancasila-3':[
   {materialId:'mat-5-pendidikan-pancasila-3-1',material:'Budaya Daerah Indonesia'},
   {materialId:'mat-5-pendidikan-pancasila-3-2',material:'Ayo Lestarikan Budaya Daerah'}
  ],
  'ch-5-pendidikan-pancasila-4':[
   {materialId:'mat-5-pendidikan-pancasila-4-1',material:'Mengenal Karakteristik Wilayah'},
   {materialId:'mat-5-pendidikan-pancasila-4-2',material:'Gotong Royong di Lingkungan Sekitar'},
   {materialId:'mat-5-pendidikan-pancasila-4-3',material:'Praktik Gotong Royong di Lingkungan Sekitar'}
  ]
},
'5|seni musik':{
  'ch-5-seni-musik-1':[
   {materialId:'mat-5-seni-musik-1-1',material:'Alat Musik Ritmis'},
   {materialId:'mat-5-seni-musik-1-2',material:'Alat Musik Melodis'}
  ],
  'ch-5-seni-musik-2':[
   {materialId:'mat-5-seni-musik-2-1',material:'Irama'},
   {materialId:'mat-5-seni-musik-2-2',material:'Melodi'}
  ],
  'ch-5-seni-musik-3':[
   {materialId:'mat-5-seni-musik-3-1',material:'Mengenal Istilah Musik'},
   {materialId:'mat-5-seni-musik-3-2',material:'Mengapresiasi Penampilan Musik melalui Audiovisual'}
  ],
  'ch-5-seni-musik-4':[
   {materialId:'mat-5-seni-musik-4-1',material:'Membuat Musik dengan Benda Sekitar'},
   {materialId:'mat-5-seni-musik-4-2',material:'Membuat Musik dengan Anggota Tubuh'}
  ],
  'ch-5-seni-musik-5':[
   {materialId:'mat-5-seni-musik-5-1',material:'Teknik Bernyanyi'},
   {materialId:'mat-5-seni-musik-5-2',material:'Menyanyikan Lagu Daerah'}
  ],
  'ch-5-seni-musik-6':[
   {materialId:'mat-5-seni-musik-6-1',material:'Membuat Alat Musik Melodis'},
   {materialId:'mat-5-seni-musik-6-2',material:'Membuat Kreasi Musik'}
  ]
 },
 '5|matematika':{
  'ch-5-matematika-1':[
   {materialId:'mat-5-matematika-1-1',material:'Membaca dan Menulis Bilangan Cacah Sampai 100.000 dan Menentukan Nilai Tempatnya'},
   {materialId:'mat-5-matematika-1-2',material:'Membandingkan dan Mengurutkan Bilangan Cacah Sampai 100.000'},
   {materialId:'mat-5-matematika-1-3',material:'Komposisi dan Dekomposisi Bilangan Sampai 100.000'},
   {materialId:'mat-5-matematika-1-4',material:'Operasi Hitung pada Bilangan Cacah Sampai 100.000'}
  ],
  'ch-5-matematika-2':[
   {materialId:'mat-5-matematika-2-1',material:'Kelipatan'},
   {materialId:'mat-5-matematika-2-2',material:'Kelipatan Persekutuan'},
   {materialId:'mat-5-matematika-2-3',material:'Faktor'},
   {materialId:'mat-5-matematika-2-4',material:'Faktor Persekutuan'},
   {materialId:'mat-5-matematika-2-5',material:'Menentukan KPK dan FPB dengan Menggunakan Faktor Prima'}
  ],
  'ch-5-matematika-3':[
   {materialId:'mat-5-matematika-3-1',material:'Membandingkan dan Mengurutkan Pecahan'},
   {materialId:'mat-5-matematika-3-2',material:'Penjumlahan Bilangan Pecahan'},
   {materialId:'mat-5-matematika-3-3',material:'Pengurangan Bilangan Pecahan'}
  ],
  'ch-5-matematika-4':[
   {materialId:'mat-5-matematika-4-1',material:'Apakah Keliling Bangun Datar Itu?'},
   {materialId:'mat-5-matematika-4-2',material:'Keliling Segitiga'},
   {materialId:'mat-5-matematika-4-3',material:'Keliling Segi Empat'},
   {materialId:'mat-5-matematika-4-4',material:'Keliling Segi Banyak'},
   {materialId:'mat-5-matematika-4-5',material:'Keliling Bangun Gabungan'}
  ],
  'ch-5-matematika-5':[
   {materialId:'mat-5-matematika-5-1',material:'Konsep Luas Daerah Bangun Datar'},
   {materialId:'mat-5-matematika-5-2',material:'Luas Daerah Bangun Datar'},
   {materialId:'mat-5-matematika-5-3',material:'Luas Daerah Bangun Gabungan'},
   {materialId:'mat-5-matematika-5-4',material:'Hubungan Keliling dan Luas Daerah Bangun Datar'}
  ],
  'ch-5-matematika-6':[
   {materialId:'mat-5-matematika-6-1',material:'Sudut Siku-Siku'},
   {materialId:'mat-5-matematika-6-2',material:'Pengertian Sudut'},
   {materialId:'mat-5-matematika-6-3',material:'Mengukur dan Membandingkan Sudut'},
   {materialId:'mat-5-matematika-6-4',material:'Melukis Sudut'}
  ],
  'ch-5-matematika-7':[
   {materialId:'mat-5-matematika-7-1',material:'Membandingkan Ciri-Ciri Segitiga'},
   {materialId:'mat-5-matematika-7-2',material:'Membandingkan Ciri-Ciri Segi Empat'}
  ],
  'ch-5-matematika-8':[
   {materialId:'mat-5-matematika-8-1',material:'Mengumpulkan Data'},
   {materialId:'mat-5-matematika-8-2',material:'Piktogram'},
   {materialId:'mat-5-matematika-8-3',material:'Diagram Batang'}
  ],
  'ch-5-matematika-9':[
   {materialId:'mat-5-matematika-9-1',material:'Membaca dan Menulis Bilangan Cacah Sampai 1.000.000 dan Menentukan Nilai Tempatnya'},
   {materialId:'mat-5-matematika-9-2',material:'Mengurutkan dan Membandingkan Bilangan Sampai 1.000.000'},
   {materialId:'mat-5-matematika-9-3',material:'Komposisi dan Dekomposisi Bilangan Sampai 1.000.000'}
  ]

  },
};
const allocation={
  '5|pendidikan pancasila':{chapters:{
    'ch-5-pendidikan-pancasila-1':{jp:36,semester:1},
    'ch-5-pendidikan-pancasila-2':{jp:36,semester:1},
    'ch-5-pendidikan-pancasila-3':{jp:36,semester:2},
    'ch-5-pendidikan-pancasila-4':{jp:36,semester:2}
  }},
  '5|seni musik':{chapters:{
    'ch-5-seni-musik-1':{jp:18,semester:1},
    'ch-5-seni-musik-2':{jp:18,semester:1},
    'ch-5-seni-musik-3':{jp:18,semester:1},
    'ch-5-seni-musik-4':{jp:18,semester:2},
    'ch-5-seni-musik-5':{jp:18,semester:2},
    'ch-5-seni-musik-6':{jp:18,semester:2}
  }},
  /* Verified book-guide recommendation, kept separate from school planning JP.
     These values must not be silently forced into annual totals. */
  '5|ipas':{recommended:{
    'ch-5-ipas-2':{jp:27,source:'Buku Panduan Guru IPAS SD Kelas V 2021, Bab 2'},
    'ch-5-ipas-3':{jp:27,source:'Buku Panduan Guru IPAS SD Kelas V 2021, Bab 3'},
    'ch-5-ipas-5':{jp:24,source:'Buku Panduan Guru IPAS SD Kelas V 2021, Bab 5'}
  }}
};
const materialCatalog=materialMaster;
const materialRows=(kelas,mapel,chapter)=>{
 const c=getChapterJp(kelas,mapel,chapter);if(!c)return null;
 const ch=M?.getChapter?.(kelas,mapel,Number(chapter));if(!ch)return null;
 const rows=materialMaster[key(kelas,mapel)]?.[ch.chapterId]||[];
 return rows.map(r=>{const v=c.materials?.[r.materialId]??c.materials?.[r.material]??null;return {...r,chapterId:ch.chapterId,chapterNo:ch.no,jp:v==null?null:Number(v),configured:v!=null};});
};
const getMaterialMaster=(kelas,mapel,chapter)=>materialRows(kelas,mapel,chapter)||[];
const getCanonicalMaterials=(kelas,mapel,chapter)=>{
 const s=structure(kelas,mapel),ch=M?.getChapter?.(kelas,mapel,Number(chapter));if(!s||!ch)return [];
 const rows=materialMaster[key(kelas,mapel)]?.[ch.chapterId]||[];
 return rows.map(r=>({...r,chapterId:ch.chapterId,chapterNo:ch.no,kelas:Number(kelas),mapel:s.mapel}));
};
const weeks=k=>Number(k)===6?32:36;
const structure=(kelas,mapel)=>M?.getStructure?.(kelas,mapel)||null;
const annualJp=(kelas,mapel)=>{const k=Number(kelas),s=subjectKey(mapel);if(s==='koding dan kecerdasan artifisial'&&k!==5)return 0;return Number(annual[s]?.[k]||0)};
const key=(kelas,mapel)=>`${Number(kelas)}|${subjectKey(mapel)}`;
const cfg=(kelas,mapel)=>allocation[key(kelas,mapel)]||null;
const chapterRows=(kelas,mapel)=>{
 const s=structure(kelas,mapel),a=annualJp(kelas,mapel),c=cfg(kelas,mapel);
 if(!s||!Array.isArray(s.chapters)||!a)return[];
 return s.chapters.map((title,i)=>{
   const no=i+1,ch=M?.getChapter?.(kelas,mapel,no),id=ch?.chapterId||`ch-${kelas}-${subjectKey(mapel).replace(/[^a-z0-9]+/g,'-')}-${no}`;
   const x=c?.chapters?.[id]||c?.chapters?.[String(no)]||null;
   return {kelas:Number(kelas),mapel:s.mapel,chapterNo:no,chapterId:id,chapter:title,
     jp:x?.jp==null?null:Number(x.jp),semester:x?.semester==null?null:Number(x.semester),
     configured:!!x,weight:x?.weight==null?null:Number(x.weight),materials:x?.materials||{}};
 });
};
const getChapterJp=(kelas,mapel,chapter)=>{
 const row=chapterRows(kelas,mapel).find(x=>x.chapterNo===Number(chapter)||x.chapterId===chapter)||null;
 if(!row)return null;
 const rec=cfg(kelas,mapel)?.recommended?.[row.chapterId]||null;
 return rec?{...row,recommendedJp:Number(rec.jp),recommendedSource:rec.source}:row;
};
const getMaterialJp=(kelas,mapel,chapter,materials=[])=>{
 const c=getChapterJp(kelas,mapel,chapter); if(!c)return null;
 const canonical=materialRows(kelas,mapel,chapter)||[];
 if(canonical.length)return {...c,materials:canonical};
 const names=(Array.isArray(materials)?materials:[]).map(N).filter(Boolean);
 return {...c,materials:names.map((name,i)=>{
   const id=`undefined:material:${i+1}`,v=c.materials?.[id]??c.materials?.[name]??null;
   return {materialId:id,material:name,jp:v==null?null:Number(v),configured:v!=null};
 })};
};
const semesterJp=(kelas,mapel,semester)=>{
 const rows=chapterRows(kelas,mapel).filter(x=>Number(x.semester)===Number(semester));
 if(!rows.length||rows.some(x=>x.jp==null))return null;
 return rows.reduce((n,x)=>n+Number(x.jp||0),0);
};
const all=(kelas,mapel)=>{
 if(kelas!=null&&mapel)return chapterRows(kelas,mapel);
 if(kelas!=null)return Object.keys(annual).flatMap(s=>chapterRows(kelas,s));
 return Object.keys(annual).flatMap(s=>Object.keys(annual[s]).flatMap(k=>chapterRows(Number(k),s)));
};
const recommendedJp=(kelas,mapel,chapter)=>{
 const r=getChapterJp(kelas,mapel,chapter);
 return r?.recommendedJp==null?null:{jp:r.recommendedJp,source:r.recommendedSource||''};
};
const auditMaterialMaster=()=>{
 const issues=[];
 for(const [sk,source] of Object.entries(materialMasterSources||{})){
   const [kelas,mapel]=sk.split('|');const s=structure(kelas,mapel);
   if(!s||!Array.isArray(s.chapters)){issues.push({type:'MATERIAL_SOURCE_NO_STRUCTURE',key:sk});continue;}
   const catalog=materialMaster[sk]||{};
   s.chapters.forEach((_,i)=>{
     const ch=M?.getChapter?.(kelas,mapel,i+1);const rows=catalog[ch?.chapterId]||[];
     if(!rows.length)issues.push({type:'MATERIAL_MASTER_MISSING',key:sk,chapterId:ch?.chapterId,chapterNo:i+1});
     else rows.forEach(r=>{if(!r.materialId||!r.material)issues.push({type:'MATERIAL_CANONICAL_INVALID',key:sk,chapterId:ch?.chapterId,materialId:r.materialId||''});});
   });
   issues.push({type:'MATERIAL_SOURCE_STATUS',key:sk,status:source.status,source:source.source});
 }
 return {ok:issues.filter(x=>x.type!=='MATERIAL_SOURCE_STATUS').length===0,issues};
};
const materialIntegrity=()=>{
 const out=[];
 for(const [sk,chapters] of Object.entries(materialMaster||{})){
  const [kelas,mapel]=sk.split('|');
  for(const [chapterId,rows] of Object.entries(chapters||{})){
   if(!Array.isArray(rows))continue;
   const bad=rows.filter(r=>!r.materialId||!N(r.material));
   const ids=new Set();
   rows.forEach(r=>{if(ids.has(r.materialId))out.push({type:'DUPLICATE_MATERIAL_ID',key:sk,chapterId,materialId:r.materialId});ids.add(r.materialId);});
   if(bad.length)out.push({type:'INVALID_MATERIAL_ROW',key:sk,chapterId,count:bad.length});
   const ch=M?.getChapter?.(kelas,mapel,Number(String(chapterId).split('-').pop()));
   if(!ch||ch.chapterId!==chapterId)out.push({type:'MATERIAL_CHAPTER_BINDING_MISMATCH',key:sk,chapterId});
  }
 }
 return {ok:out.length===0,issues:out};
};
const auditMaterialJpTotals=()=>{
 const issues=[],warnings=[];
 for(const [sk,chs] of Object.entries(materialMaster||{})){
  for(const [cid,rows] of Object.entries(chs||{})){
   if(!Array.isArray(rows))continue;
   const chapterNo=Number(String(cid).split('-').pop());
   const c=getChapterJp(...sk.split('|'),chapterNo);
   const chapterJp=c?.jp;
   const configured=rows.filter(r=>r.jp!=null);
   if(chapterJp!=null){
    if(configured.length!==rows.length)warnings.push({type:'MATERIAL_JP_NOT_CONFIGURED',key:sk,chapterId:cid,chapterJp,missing:rows.filter(r=>r.jp==null).map(r=>r.materialId)});
    else {const total=configured.reduce((n,r)=>n+Number(r.jp||0),0);if(total!==Number(chapterJp))issues.push({type:'CHAPTER_MATERIAL_SUM_MISMATCH',key:sk,chapterId:cid,chapterJp,materialTotal:total});}
   }
  }
 }
 return {ok:issues.length===0,issues,warnings,policy:'UNCONFIGURED_IS_ACCEPTABLE_WHEN_NO_EXPLICIT_SOURCE'};
};
const auditMatrix=()=>{
 const rows=[];
 for(const [s,classes] of Object.entries(annual)){
  for(const [k,a] of Object.entries(classes)){
   if(!a)continue;
   const kelas=Number(k), structureRow=structure(k,s), chapters=chapterRows(k,s);
   const missing=chapters.filter(x=>x.jp==null);
   const configured=chapters.filter(x=>x.jp!=null);
   const noStructure=!structureRow||!chapters.length;
   const total=configured.reduce((n,x)=>n+Number(x.jp||0),0);
   const semesterMissing=chapters.filter(x=>x.semester==null);
   const equal=configured.length>1&&configured.every(x=>Number(x.jp)===Number(configured[0].jp));
   const source=materialMasterSources[`${kelas}|${s}`]||null;
   const rec=chapters.map(x=>cfg(k,s)?.recommended?.[x.chapterId]||null).filter(Boolean);
   const status=noStructure?'NO_MASTER_STRUCTURE':(missing.length?'UNCONFIGURED':(total!==Number(a)?'CONFLICT':(source?.status==='SOURCE_AUDIT_PENDING'?'NEEDS_SOURCE':(rec.length?'REFERENCE':'PLANNING'))));
   rows.push({
    kelas,mapel:structureRow?.mapel||s,annualJp:Number(a),chapterCount:chapters.length,
    configuredChapterCount:configured.length,chapterTotal:total,semesterConfigured:semesterMissing.length===0,
    semesterMissing:semesterMissing.map(x=>x.chapterId),equalConfiguredChapterJp:equal,
    equalizationWarning:equal&&missing.length===0&&configured.length>1?'REVIEW_SOURCE':'',
    status,source:source?.source||'',sourceStatus:source?.status||'',
    recommendedCount:rec.length
   });
  }
 }
 return rows;
};
const audit=()=>{
 const matrix=auditMatrix(),issues=[],warnings=[];
 matrix.forEach(r=>{
  if(r.status==='CONFLICT')issues.push({type:'CHAPTER_TOTAL_MISMATCH',...r});
  /* UNCONFIGURED is an accepted governance state when no explicit JP source exists. */
  if(r.status==='UNCONFIGURED')warnings.push({type:'JP_NOT_CONFIGURED',...r});
  if(r.status==='NO_MASTER_STRUCTURE')warnings.push({type:'NO_MASTER_STRUCTURE',...r});
  if(!r.semesterConfigured)warnings.push({type:'SEMESTER_NOT_CONFIGURED',...r});
  if(r.equalizationWarning)warnings.push({type:'EQUAL_JP_REQUIRES_SOURCE_REVIEW',...r});
 });
 const materialStructure=auditMaterialMaster();
 const materialIntegrityResult=materialIntegrity();
 const materialJp=auditMaterialJpTotals();
 return {
  ok:issues.filter(x=>!['EQUAL_JP_REQUIRES_SOURCE_REVIEW','NO_MASTER_STRUCTURE'].includes(x.type)).length===0&&materialStructure.ok&&materialIntegrityResult.ok,
  version:'MASTER_JP_V2',
  governance:'NO_EQUAL_DISTRIBUTION_FALLBACK',
  matrix,
  issues,
  warnings,
  structural:{materialMaster:materialStructure,materialIntegrity:materialIntegrityResult},
  materialJp:{ok:materialJp.ok,issues:materialJp.issues,policy:'UNCONFIGURED_IS_ACCEPTABLE_WHEN_NO_EXPLICIT_SOURCE'},
  subjects:Object.keys(annual).length,
  configured:Object.keys(allocation).length,
  materialMaster:Object.keys(materialMaster).length
 };
};
window.SiapGuruMasterJPV1={version:'MASTER_JP_V2',annualJp,semesterJp,getChapterJp,recommendedJp,getMaterialJp,getMaterialMaster,materialRows,getCanonicalMaterials,chapterRows,all,audit,auditMaterialMaster,auditMaterialJpTotals,materialIntegrity,subjectKey,annual:JSON.parse(JSON.stringify(annual)),allocation,materialMaster,materialCatalog,materialMasterSources};
window.SiapGuruMasterJPV2=window.SiapGuruMasterJPV1;
document.dispatchEvent(new CustomEvent('sg:master-jp-v2-ready',{detail:audit()}));
})();