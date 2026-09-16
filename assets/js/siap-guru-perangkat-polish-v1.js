(()=>{
const ROOM='.sg-perangkat-room';
const DRAFT='siapguru_perangkat_draft';
const CTX='siapguru_perangkat_bab_context_v1';
const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_) {}};
const topic=room=>clean(room?.querySelector('#sgPaTopic')?.value);
const polish=v=>{
  let s=clean(v);
  if(!s)return '';
  const before=s;
  s=s.replace(/\s+dalam pembelajaran\s+.*?\s+Fase\s+[A-C]\s+Kelas\s+[^,.;]+/gi,'');
  s=s.replace(/\s+Fase\s+[A-C]\s+Kelas\s+[^,.;]+/gi,'');
  s=s.replace(/\s{2,}/g,' ').replace(/\s+([,.;])/g,'$1');
  return s===before?before:s;
};
const sync=room=>{
  const t=topic(room);
  if(!t||t==='SEMUA BAB / 1 TAHUN')return;
  const df=room.querySelector('#sgPaDifferentiation'),ff=room.querySelector('#sgPaFollowup');
  if(!df&&!ff)return;
  let changed=false;
  if(df){const n=polish(df.value);if(n!==df.value){df.value=n;df.dispatchEvent(new Event('input',{bubbles:true}));changed=true}}
  if(ff){const n=polish(ff.value);if(n!==ff.value){ff.value=n;ff.dispatchEvent(new Event('input',{bubbles:true}));changed=true}}
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
  if(window.__sgPerangkatPolishV1)return;
  window.__sgPerangkatPolishV1=1;
  const run=()=>{const room=document.querySelector(ROOM);if(room)sync(room)};
  new MutationObserver(run).observe(document.body,{childList:true,subtree:true,characterData:true});
  document.addEventListener('input',e=>{if(e.target?.id==='sgPaDifferentiation'||e.target?.id==='sgPaFollowup')run()},true);
  run();
  window.setInterval(run,500);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();