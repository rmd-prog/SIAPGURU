/* SIAP GURU — UNIFIED CANONICAL DOCUMENT ENGINE V3
   Master Chapter V11 -> Master JP V2 -> chapter-scoped content.
   No generic annual draft is allowed to masquerade as a selected BAB.
*/
(()=>{'use strict';
const KEY='siapguru_unified_document_v3';
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(_){return false}};
const M=()=>window.SiapGuruMasterChapterBankV11||null;
const JP=()=>window.SiapGuruMasterJPV1||null;
const E=()=>window.SiapGuruChapterEngineV11||null;
const phase=k=>Number(k)<=2?'A':Number(k)<=4?'B':'C';
const slug=s=>String(s??'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const canonical=x=>{
 const k=Number(x?.kelas||x?.class||0),m=x?.mapel||x?.subject||'',n=Number(x?.no||x?.chapterNo||0);
 const ch=M()?.getChapter?.(k,m,n)||E()?.resolve?.({kelas:k,mapel:m,no:n})||null;
 if(!ch)return null;
 const j=JP()?.getChapterJp?.(k,m,n)||null;
 return {...ch,kelas:k,mapel:ch.mapel||m,no:n,chapterNo:n,chapterId:ch.chapterId||ch.id||`ch-${k}-${slug(m)}-${n}`,bab:ch.title||ch.bab||'',title:ch.title||ch.bab||'',semester:j?.semester==null?null:Number(j.semester),jp:j?.configured?Number(j.jp):null,jpConfigured:!!j?.configured,jpSource:j?.configured?'MASTER_JP_CHAPTER':'MASTER_JP_NOT_CONFIGURED'};
};
const same=(v,c)=>!!(v&&c&&String(v.chapterId||'')===String(c.chapterId||''));
const draft=(keys,c)=>{
 for(const k of keys){
  const v=read(k);
  if(!v)continue;
  if(same(v,c))return v;
  if(Array.isArray(v.items)){
   const items=v.items.filter(q=>q&&String(q.chapterId||'')===String(c.chapterId));
   if(items.length)return {...v,chapterId:c.chapterId,chapterNo:c.no,items};
  }
 }
 return null;
};
const tp=(c)=>{
 const d=draft(['siapguru_tp_v11_draft','siapguru_tp_draft'],c);
 if(Array.isArray(d?.items)&&d.items.length)return d.items.map((q,i)=>({...q,chapterId:c.chapterId,chapterNo:c.no,chapterTitle:c.title,bab:c.title,order:i+1}));
 const topic=String(c.title||'').toLowerCase();
 const math={
  1:['membaca dan menuliskan bilangan cacah sampai 100.000 serta menentukan nilai tempat setiap angka','membandingkan dan mengurutkan bilangan cacah sampai 100.000 dengan menggunakan nilai tempat','menyusun komposisi dan menguraikan dekomposisi bilangan cacah sampai 100.000','melakukan operasi penjumlahan, pengurangan, perkalian, dan pembagian bilangan cacah sampai 100.000','menyelesaikan masalah sehari-hari yang melibatkan bilangan cacah sampai 100.000 serta menjelaskan strategi penyelesaiannya'],
  2:['menentukan kelipatan dan kelipatan persekutuan dari bilangan yang diberikan','menentukan faktor dan faktor persekutuan suatu bilangan','menentukan KPK dan FPB dengan menggunakan faktorisasi prima','menerapkan KPK dan FPB untuk menyelesaikan masalah kontekstual','menjelaskan hubungan faktor, kelipatan, KPK, dan FPB berdasarkan strategi penyelesaian yang digunakan'],
  3:['membandingkan dan mengurutkan pecahan menggunakan representasi yang sesuai','menjumlahkan pecahan dengan strategi yang tepat','mengurangkan pecahan dengan strategi yang tepat','menyelesaikan masalah sehari-hari yang melibatkan penjumlahan dan pengurangan pecahan','menjelaskan dan memeriksa ketepatan strategi penyelesaian masalah pecahan'],
  4:['menjelaskan makna keliling sebagai ukuran panjang batas suatu bangun datar','menentukan keliling segitiga dan segi empat','menentukan keliling segi banyak berdasarkan panjang sisi-sisinya','menentukan keliling bangun gabungan dengan strategi yang tepat','menyelesaikan masalah kontekstual yang berkaitan dengan keliling bangun datar'],
  5:['menjelaskan konsep luas daerah sebagai ukuran banyaknya satuan luas yang menutupi suatu bangun','menentukan luas berbagai bangun datar dengan satuan yang sesuai','menentukan luas bangun gabungan dengan memecahnya menjadi beberapa bangun sederhana','menganalisis hubungan keliling dan luas daerah bangun datar','menyelesaikan masalah sehari-hari yang berkaitan dengan luas daerah bangun datar'],
  6:['mengidentifikasi sudut siku-siku dan mengenali sudut pada berbagai objek','menjelaskan pengertian sudut berdasarkan dua sinar garis yang berpotongan','mengukur dan membandingkan besar sudut menggunakan alat ukur yang sesuai','melukis sudut dengan besar tertentu secara tepat','menyelesaikan masalah sehari-hari yang melibatkan pengukuran dan perbandingan sudut'],
  7:['mengidentifikasi ciri-ciri segitiga berdasarkan sisi dan sudutnya','membandingkan ciri-ciri berbagai segitiga menggunakan representasi yang sesuai','mengidentifikasi dan membandingkan ciri-ciri berbagai segi empat','mengelompokkan bangun datar berdasarkan persamaan dan perbedaan cirinya','menjelaskan alasan pengelompokan bangun datar berdasarkan ciri yang ditemukan'],
  8:['mengumpulkan data sederhana dari lingkungan sekitar dengan cara yang sesuai','menyajikan data dalam bentuk piktogram','menyajikan data dalam bentuk diagram batang','membandingkan dan menafsirkan informasi dari tabel, piktogram, dan diagram batang','menyelesaikan masalah sehari-hari dengan menggunakan informasi yang diperoleh dari data'],
  9:['membaca dan menuliskan bilangan cacah sampai 1.000.000 serta menentukan nilai tempatnya','membandingkan dan mengurutkan bilangan cacah sampai 1.000.000','menyusun komposisi dan menguraikan dekomposisi bilangan sampai 1.000.000','melakukan operasi hitung pada bilangan cacah sesuai situasi yang diberikan','menyelesaikan masalah kontekstual yang melibatkan bilangan cacah sampai 1.000.000']
 };
 const mathNo=/^bilangan cacah sampai 100\.000$/i.test(c.title)?1:null;
 const n=c.mapel==='Matematika'?(Number(c.no)):null;
 if(n&&math[n])return math[n].map((text,i)=>({id:c.chapterId+':tp:math:'+String(i+1),chapterId:c.chapterId,chapterNo:c.no,chapterTitle:c.title,bab:c.title,order:i+1,text:'Peserta didik mampu '+text+'.',element:n===8?'Analisis Data dan Peluang':(n===4||n===5||n===6||n===7?'Pengukuran dan Geometri':'Bilangan'),cp:'',jp:null,jpSource:'BOOK_ALIGNED_TP',semester:String(c.semester||'')}));
 const ipas=/^cahaya dan sifatnya$/i.test(c.title)||/harmoni dalam ekosistem/i.test(c.title);
 if(c.mapel==='IPAS'&&ipas){
  const patterns=/cahaya|bunyi|mendengar/.test(topic)?['mengidentifikasi sumber dan sifat cahaya atau bunyi yang ditemukan pada '+c.title,'menjelaskan hubungan antara sumber cahaya atau bunyi dengan peristiwa yang diamati','melakukan percobaan sederhana untuk mengamati sifat cahaya atau bunyi','menganalisis hasil pengamatan tentang cahaya atau bunyi berdasarkan bukti','menyajikan hasil percobaan tentang cahaya atau bunyi secara lisan, tulisan, atau visual','merefleksikan manfaat pemahaman tentang cahaya atau bunyi dalam kehidupan sehari-hari']:['mengidentifikasi komponen biotik dan abiotik serta perannya dalam ekosistem','menjelaskan hubungan antarmakhluk hidup dan lingkungannya dalam menjaga keseimbangan ekosistem','menganalisis contoh rantai atau jaring-jaring makanan berdasarkan hubungan antarmakhluk hidup','menganalisis perubahan pada salah satu komponen ekosistem dan memprediksi dampaknya terhadap keseimbangan ekosistem','menyajikan hasil pengamatan tentang hubungan antarkomponen ekosistem serta upaya menjaga keseimbangannya','merefleksikan tindakan yang dapat dilakukan untuk menjaga keseimbangan ekosistem di lingkungan sekitar'];
  return patterns.map((text,i)=>({id:c.chapterId+':tp:auto:'+String(i+1),chapterId:c.chapterId,chapterNo:c.no,chapterTitle:c.title,bab:c.title,order:i+1,text:'Peserta didik mampu '+text+'.',element:'Pemahaman IPAS',cp:'',jp:null,jpSource:'BOOK_ALIGNED_TP',semester:String(c.semester||'')}));
 }
 return [];
};
const canonicalCP=c=>{const t=String(c.title||'').toLowerCase();if(c.mapel==='Matematika')return {chapterId:c.chapterId,mapel:c.mapel,kelas:c.kelas,fase:phase(c.kelas),element:'Bilangan',source:'CP_MATEMATIKA_FASE_C',statement:'Pada akhir Fase C, murid memiliki pemahaman dan intuisi bilangan (number sense) pada bilangan cacah sampai 1.000.000; membaca, menulis, menentukan nilai tempat, membandingkan, mengurutkan, melakukan komposisi dan dekomposisi bilangan; menyelesaikan masalah yang berkaitan dengan uang; melakukan operasi penjumlahan, pengurangan, perkalian, dan pembagian bilangan cacah sampai 100.000; serta menyelesaikan masalah yang berkaitan dengan KPK dan FPB.'};if(c.mapel==='IPAS'&&/cahaya|bunyi|mendengar/.test(t))return {chapterId:c.chapterId,mapel:c.mapel,kelas:c.kelas,fase:phase(c.kelas),source:'IPAS_BAB1_BOOK_CP',statement:'Berdasarkan pemahamannya terhadap konsep gelombang (bunyi dan cahaya), peserta didik mendemonstrasikan bagaimana penerapannya dalam kehidupan sehari-hari.'};if(c.mapel==='IPAS'&&/harmoni|ekosistem/.test(t))return {chapterId:c.chapterId,mapel:c.mapel,kelas:c.kelas,fase:phase(c.kelas),source:'IPAS_EKOSISTEM_CONTEXT',statement:'Peserta didik menganalisis hubungan antarkomponen dalam ekosistem dan mengevaluasi dampak aktivitas manusia terhadap keseimbangan ekosistem.'};return null};
const materials=(c,t)=>{
 const rows=JP()?.getCanonicalMaterials?.(c.kelas,c.mapel,c.no)||[];
 if(rows.length)return {chapterId:c.chapterId,mapel:c.mapel,kelas:c.kelas,bab:c.title,source:'MASTER_JP_CANONICAL_MATERIALS',materials:rows};
 const d=draft(['siapguru_materi_draft'],c);
 if(d)return d;
 return {chapterId:c.chapterId,mapel:c.mapel,kelas:c.kelas,bab:c.title,source:'CANONICAL_MATERIALS_NOT_CONFIGURED',materials:[],focus:'Materi canonical belum tersedia untuk BAB ini.'};
};
const build=x=>{
 const c=canonical(x); if(!c?.chapterId)throw Error('BAB tidak ditemukan di Master Chapter V11.');
 const t=tp(c),m=materials(c,t);
 const cp=draft(['siapguru_cp_draft','siapguru_cp'],c)||canonicalCP(c)||{chapterId:c.chapterId,mapel:c.mapel,kelas:c.kelas,fase:phase(c.kelas),source:'CP_BUILDER_CONTEXTUAL',statement:'CP fase '+phase(c.kelas)+' dikontekstualisasikan pada BAB '+c.no+' — '+c.title+'.'};
 const at=draft(['siapguru_atp_draft'],c)||{chapterId:c.chapterId,mapel:c.mapel,kelas:c.kelas,semester:c.semester,jp:c.jp,items:t.map((q,i)=>({order:i+1,chapterId:c.chapterId,tp:q.text,jp:q.jp??null}))};
 const pt={chapterId:c.chapterId,mapel:c.mapel,kelas:c.kelas,semester:c.semester,bab:c.title,chapterNo:c.no,jp:c.jp,jpSource:c.jpSource,source:'MASTER_CHAPTER_V11 + MASTER_JP_V2'};
 const ps=draft(['siapguru_prosem_draft'],c)||{chapterId:c.chapterId,mapel:c.mapel,kelas:c.kelas,semester:c.semester,bab:c.title,jp:c.jp,jpSource:c.jpSource};
 const p=draft(['siapguru_perangkat_draft'],c)||{chapterId:c.chapterId,mapel:c.mapel,kelas:c.kelas,bab:c.title,jp:c.jp,model:'Pembelajaran Mendalam',tp:t};
 const l=draft(['siapguru_lkpd_draft'],c)||{chapterId:c.chapterId,mapel:c.mapel,kelas:c.kelas,bab:c.title,instructions:'Aktivitas untuk BAB '+c.no+' — '+c.title+'.',questions:t.map((q,i)=>(i+1)+'. '+q.text)};
 const a=draft(['siapguru_asesmen_draft','siapguru_penilaian_bab_draft'],c)||{chapterId:c.chapterId,mapel:c.mapel,kelas:c.kelas,bab:c.title,formative:t.map(q=>({tp:q.text})),summative:{type:'Akhir BAB',basis:'TP BAB '+c.no}};
 const r=draft(['siapguru_rpm_deep_learning_v11','siapguru_rpm_draft'],c)||{chapterId:c.chapterId,mapel:c.mapel,kelas:c.kelas,semester:c.semester,jp:c.jp,bab:c.title,tp:t,canonicalJp:c.jp};
 const ai=draft(['siapguru_ai_super_draft'],c)||{chapterId:c.chapterId,mapel:c.mapel,kelas:c.kelas,bab:c.title,source:'Unified Canonical Builder V3',inputs:{tp:!!t.length,materi:m.source==='MASTER_JP_CANONICAL_MATERIALS',perangkat:true,lkpd:true,asesmen:true,rpm:true},status:'Siap diproses AI SUPER'};
 const sections={CP:cp,TP:t,ATP:at,PROTA:pt,PROSEM:ps,Materi:m,Perangkat:p,LKPD:l,Asesmen:a,RPM:r,AI:ai};
 const canonicalFlags={CP:!!cp?.chapterId,TP:t.every(q=>q?.chapterId===c.chapterId),ATP:!!at?.chapterId,PROTA:pt.jp!=null,PROSEM:ps?.jp==null||ps?.chapterId===c.chapterId,Materi:m.source==='MASTER_JP_CANONICAL_MATERIALS',Perangkat:!!p?.chapterId,LKPD:!!l?.chapterId,Asesmen:!!a?.chapterId,RPM:!!r?.chapterId,AI:!!ai?.chapterId};
 const b={version:'UNIFIED-CANONICAL-V3',chapterId:c.chapterId,kelas:c.kelas,mapel:c.mapel,fase:phase(c.kelas),semester:c.semester,no:c.no,bab:c.title,jp:c.jp,jpSource:c.jpSource,source:'Master Chapter V11 → Master JP V2 → Chapter-scoped bundle',sections,validation:{required:Object.keys(sections),missing:Object.keys(sections).filter(k=>sections[k]==null),canonicalFlags,canonicalReady:Object.values(canonicalFlags).every(Boolean)}};
 write(KEY,b);write('siapguru_unified_document_current',b);return b;
};
const get=x=>{const b=read('siapguru_unified_document_current')||read(KEY),c=canonical(x);return b&&c&&String(b.chapterId)===String(c.chapterId)?b:null};
window.SiapGuruUnifiedEngine={version:'3',build,get,key:x=>canonical(x)?.chapterId||String(x?.id||'')};
})();