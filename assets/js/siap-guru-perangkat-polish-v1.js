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
  .replace(new RegExp('\\s+pada\\s+'+escRe(t)+'(?=\\s*[,;.\\s]|$)','gi'),'')
  .replace(/\s+dalam pembelajaran\s+.*?\s+Fase\s+[A-C]\s+Kelas\s+[^,.;]+/gi,'')
  .replace(/\s+Fase\s+[A-C]\s+Kelas\s+[^,.;]+/gi,'')
  .replace(/\s{2,}/g,' ')
  .replace(/\s+([,.;])/g,'$1');
const polishDiff=(v,t)=>{
  let s=stripContext(v,t);
  if(!s)return '';
  const m=s.match(/^(Diferensiasi\s+[^:]+:\s*konten difokuskan pada\s+)(.*?)(;\s*proses\s+)/i);
  if(!m)return s;
  const focus=clean(m[2]).replace(/\s+pada\s+$/i,'');
  return `${m[1]}${focus}; proses untuk peserta didik yang memerlukan dukungan menggunakan contoh konkret, pemodelan, pertanyaan penuntun, dan langkah bertahap pada fokus tersebut, sedangkan peserta didik yang sudah mencapai tujuan mendapat tantangan untuk memperluas atau menerapkan fokus pada konteks baru; produk dapat berupa teks/hasil tulisan dan presentasi lisan sesuai tingkat kesiapan, disesuaikan dengan kesiapan tanpa mengubah tujuan inti.`;
};
const polishFollow=(v,t)=>{
  let s=stripContext(v,t);
  if(!s)return '';
  const prefix=new RegExp('^Remedial dan pengayaan\\s+[^:]+:\\s*remedial mengulang dan memperkuat\\s+','i');
  if(!prefix.test(s))return s;
  const body=s.replace(prefix,'');
  const marker=body.search(/\s*(?:,\s*contoh konkret|\s+melalui\s+penjelasan ulang|;\s*pengayaan memperluas)\b/i);
  if(marker<0)return s;
  const focus=clean(body.slice(0,marker)).replace(/[,:;.]\s*$/,'').replace(/\s+pada\s+$/i,'');
  if(!focus)return s;
  return `Remedial dan pengayaan ${t}: remedial mengulang dan memperkuat ${focus} melalui penjelasan ulang, contoh konkret, latihan terbimbing, umpan balik, dan perbaikan hasil kerja sampai tujuan inti tercapai; pengayaan memperluas ${focus} melalui konteks baru, tugas yang lebih kompleks, pengembangan teks/hasil tulisan dan presentasi lisan sesuai tingkat kesiapan, atau presentasi/penjelasan mandiri.`;
};
const sync=room=>{
  const t=topic(room);
  if(!t||t==='SEMUA BAB / 1 TAHUN')return;
  const df=room.querySelector('#sgPaDifferentiation'),ff=room.querySelector('#sgPaFollowup');
  if(!df&&!ff)return;
  let changed=false;
  if(df){const n=polishDiff(df.value,t);if(n!==df.value){df.value=n;df.dispatchEvent(new Event('input',{bubbles:true}));changed=true}}
  if(ff){const n=polishFollow(ff.value,t);if(n!==ff.value){ff.value=n;ff.dispatchEvent(new Event('input',{bubbles:true}));changed=true}}
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
  if(window.__sgPerangkatPolishV3)return;
  window.__sgPerangkatPolishV3=1;
  const run=()=>{const room=document.querySelector(ROOM);if(room)sync(room)};
  new MutationObserver(run).observe(document.body,{childList:true,subtree:true,characterData:true});
  document.addEventListener('input',e=>{if(e.target?.id==='sgPaDifferentiation'||e.target?.id==='sgPaFollowup')run()},true);
  run();
  window.setInterval(run,500);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();