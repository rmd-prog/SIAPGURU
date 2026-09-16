(()=>{
const ROOM='.sg-perangkat-room';
const DRAFT='siapguru_perangkat_draft';
const CTX='siapguru_perangkat_bab_context_v1';
const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_) {}};
const topic=room=>clean(room?.querySelector('#sgPaTopic')?.value);
const escRe=s=>String(s||'').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const stripContext=(s,t)=>clean(s)
  .replace(new RegExp(`\\s+pada\\s+${escRe(t)}(?=\\s*[,;.]|\\s*$)`,'gi'),'')
  .replace(/\s+dalam pembelajaran\s+.*?\s+Fase\s+[A-C]\s+Kelas\s+[^,.;]+/gi,'')
  .replace(/\s+Fase\s+[A-C]\s+Kelas\s+[^,.;]+/gi,'')
  .replace(/\s{2,}/g,' ')
  .replace(/\s+([,.;])/g,'$1');

const materialParts=room=>{
  const s=clean(room?.querySelector('#sgPaMaterial')?.value)
    .replace(/^Materi pokok\s+/i,'')
    .replace(/^Lingkup materi\s+/i,'')
    .replace(/\.$/,'');
  return s.split(/;|\n/).map(clean).filter(Boolean).slice(0,12);
};
const tpParts=room=>{
  const d=read('siapguru_tp_draft');
  const out=[];
  const walk=(x,depth=0)=>{
    if(!x||depth>8)return;
    if(Array.isArray(x)){x.forEach(v=>walk(v,depth+1));return}
    if(typeof x!=='object')return;
    const t=clean(x.tp||x.text||x.tujuan||x.tujuanPembelajaran);
    if(t&&!out.includes(t))out.push(t);
    Object.keys(x).forEach(k=>{if(['tp','text','tujuan','tujuanPembelajaran'].includes(k))return;if(x[k]&&typeof x[k]==='object')walk(x[k],depth+1)});
  };
  walk(d);
  return out.slice(0,8);
};
const compactFocus=room=>{
  const parts=[...materialParts(room),...tpParts(room)].map(s=>clean(s).replace(/^peserta didik mampu\s+/i,''));
  const uniq=[];parts.forEach(v=>{if(v&&!uniq.includes(v))uniq.push(v)});
  const all=uniq.join('; ').toLowerCase();
  const buckets=[];
  const add=v=>{if(v&&!buckets.includes(v))buckets.push(v)};

  const understand=[];
  uniq.forEach(v=>{
    const s=v.toLowerCase();
    if(/informasi|kosakata|kata sifat|sinonim|antonim|konsep|ciri|unsur|makna|jenis|sifat|nilai|aturan|norma|gerak dasar|pokok ajaran|kisah|tokoh|komponen|rantai|sumber energi|bentuk energi|materi dan perubahan/.test(s)) understand.push(v);
  });
  if(understand.length){
    const labels=[];
    if(/informasi|kosakata|kata sifat|sinonim|antonim/.test(understand.join(' ').toLowerCase())) labels.push('informasi, kosakata, dan unsur kebahasaan');
    else if(/nilai|aturan|norma|pokok ajaran|kisah|tokoh/.test(understand.join(' ').toLowerCase())) labels.push('konsep, nilai, dan penerapan dalam kehidupan');
    else if(/gerak dasar|permainan|kebugaran/.test(understand.join(' ').toLowerCase())) labels.push('konsep dan keterampilan gerak');
    else labels.push('konsep, ciri, unsur, dan keterkaitan materi');
    add(`pemahaman ${labels[0]}`);
  }

  const apply=[];
  uniq.forEach(v=>{
    const s=v.toLowerCase();
    if(/membandingkan|mengurutkan|operasi|menentukan|menghitung|menerapkan|pemecahan masalah|strategi|pengamatan|percobaan|penerapan|praktik|pengukuran|pencatatan|analisis|menganalisis|menggunakan/.test(s)) apply.push(v);
  });
  if(apply.length){
    const s=apply.join(' ').toLowerCase();
    if(/bilangan|pecahan|desimal|operasi|menghitung|kpk|fpb|bangun|sudut|keliling|luas|volume|pengukuran/.test(s)) add('penerapan konsep dan strategi pemecahan masalah');
    else if(/pengamatan|percobaan|penyelidikan|fenomena|ekosistem|energi|gaya|cahaya|bunyi/.test(s)) add('pengamatan, percobaan, dan penerapan konsep dalam konteks nyata');
    else add('penerapan kemampuan melalui aktivitas dan konteks yang relevan');
  }

  const produce=[];
  uniq.forEach(v=>{
    const s=v.toLowerCase();
    if(/menyusun|menulis|membuat|menghasilkan|teks|deskripsi|laporan|produk|karya|mempresentasikan|presentasi|menyajikan|mengomunikasikan|unjuk kerja|karya/.test(s)) produce.push(v);
  });
  if(produce.length){
    const s=produce.join(' ').toLowerCase();
    if(/presentasi|mempresentasikan|mengomunikasikan|menyajikan/.test(s)) add(/teks|deskripsi|menulis|menyusun/.test(s)?'penyusunan produk/tulisan dan komunikasi hasil belajar':'penyajian atau komunikasi hasil belajar');
    else if(/laporan|percobaan|penyelidikan/.test(s)) add('penyusunan laporan atau hasil penyelidikan');
    else add('penyusunan produk atau karya sesuai karakter materi');
  }

  if(!buckets.length){
    if(/bilangan|pecahan|desimal|kpk|fpb|bangun|sudut|matematika/.test(all)) add('pemahaman konsep dan strategi pemecahan masalah');
    else if(/pengamatan|percobaan|ekosistem|energi|gaya|cahaya|bunyi|ipas/.test(all)) add('pemahaman konsep, pengamatan, dan penerapan dalam konteks nyata');
    else add(`pemahaman dan penerapan materi pada BAB ${topic(room)}`);
  }
  return buckets.slice(0,3).join('; ');
};

const polishDiff=(v,t,room)=>{
  let s=stripContext(v,t);
  if(!s)return '';
  const m=s.match(/^(Diferensiasi\s+[^:]+:\s*konten difokuskan pada\s+)(.*?)(;\s*proses\s+)/i);
  if(!m)return s;
  const focus=compactFocus(room);
  return `${m[1]}${focus}; proses untuk peserta didik yang memerlukan dukungan menggunakan contoh konkret, pemodelan, pertanyaan penuntun, dan langkah bertahap pada fokus tersebut, sedangkan peserta didik yang sudah mencapai tujuan mendapat tantangan untuk memperluas atau menerapkan fokus pada konteks baru; produk dapat berupa teks/hasil tulisan dan presentasi lisan sesuai tingkat kesiapan, disesuaikan dengan kesiapan tanpa mengubah tujuan inti.`;
};
const polishFollow=(v,t,room)=>{
  let s=stripContext(v,t);
  if(!s)return '';
  const prefix=new RegExp(`^Remedial dan pengayaan\\s+[^:]+:\\s*remedial mengulang dan memperkuat\\s+`,'i');
  if(!prefix.test(s))return s;
  const body=s.replace(prefix,'');
  const focus=compactFocus(room);
  return `Remedial dan pengayaan ${t}: remedial mengulang dan memperkuat ${focus} melalui penjelasan ulang, contoh konkret, latihan terbimbing, umpan balik, dan perbaikan hasil kerja sampai tujuan inti tercapai; pengayaan memperluas ${focus} melalui konteks baru, tugas yang lebih kompleks, pengembangan produk sesuai karakter materi, atau presentasi/penjelasan mandiri.`;
};
const sync=room=>{
  const t=topic(room);
  if(!t||t==='SEMUA BAB / 1 TAHUN')return;
  const df=room.querySelector('#sgPaDifferentiation'),ff=room.querySelector('#sgPaFollowup');
  if(!df&&!ff)return;
  let changed=false;
  if(df){const n=polishDiff(df.value,t,room);if(n!==df.value){df.value=n;df.dispatchEvent(new Event('input',{bubbles:true}));changed=true}}
  if(ff){const n=polishFollow(ff.value,t,room);if(n!==ff.value){ff.value=n;ff.dispatchEvent(new Event('input',{bubbles:true}));changed=true}}
  if(!changed)return;
  const draft=read(DRAFT);
  if(draft&&typeof draft==='object'){
    draft.topic=t;
    if(df)draft.differentiation=df.value;
    if(ff)draft.followup=ff.value;
    write(DRAFT,draft);
  }
  const db=read(CTX)||{};
  const old=db[t]&&typeof db[t]==='object'?db[t]:{topic:t};
  old.topic=t;
  if(df)old.differentiation=df.value;
  if(ff)old.followup=ff.value;
  write(CTX,db);
};
const boot=()=>{
  if(window.__sgPerangkatPolishV4)return;
  window.__sgPerangkatPolishV4=1;
  const run=()=>{const room=document.querySelector(ROOM);if(room)sync(room)};
  new MutationObserver(run).observe(document.body,{childList:true,subtree:true,characterData:true});
  document.addEventListener('input',e=>{if(e.target?.id==='sgPaDifferentiation'||e.target?.id==='sgPaFollowup')run()},true);
  run();
  window.setInterval(run,500);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();