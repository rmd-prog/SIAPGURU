/* SIAP GURU — Perangkat Master BAB scope bridge v1
   Scope dropdown to active Kelas + Mapel without replacing Auto V2 logic.
*/
(()=>{
  const ROOM='.sg-perangkat-room',KEY='siapguru_selected_topic';
  const text=v=>String(v??'').trim();
  const esc=s=>text(s).replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const roman={i:1,ii:2,iii:3,iv:4,v:5,vi:6};
  const kelas=v=>{const s=text(v).toLowerCase().replace(/^kelas\s*/,'').replace(/[^iv0-9]/g,'');return roman[s]||Number(s)||0};
  const norm=v=>text(v).toLowerCase().replace(/\s+/g,' ');
  const selected=()=>{try{return JSON.parse(sessionStorage.getItem(KEY)||'null')||{}}catch(_){return {}}};
  const scopeRows=(room)=>{
    const rows=window.SiapGuruMasterBab?.getAll?.();
    if(!Array.isArray(rows)||!rows.length)return [];
    const s=selected(), cls=kelas(room.querySelector('#sgPaClass')?.value)||kelas(s?.kelas), mapel=norm(room.querySelector('#sgPaSubject')?.value)||norm(s?.mapel||s?.mapelName);
    let out=rows.filter(r=>r?.bab&&(!cls||kelas(r.kelas)===cls)&&(!mapel||norm(r.mapel)===mapel));
    if(!out.length&&mapel)out=rows.filter(r=>r?.bab&&(!cls||kelas(r.kelas)===cls)&&norm(r.mapel).includes(mapel)||(!cls&&norm(r.mapel).includes(mapel)));
    return out.filter((r,i,a)=>{const b=text(r.bab);return b&&!a.slice(0,i).some(x=>text(x.bab)===b)});
  };
  const rebuild=()=>{
    const room=document.querySelector(ROOM),sel=room?.querySelector('#sgPaTopic');
    if(!room||!sel||sel.tagName!=='SELECT')return;
    const rows=scopeRows(room);if(!rows.length)return;
    const current=text(sel.value)||text(selected()?.bab||selected()?.topic);
    const html='<option value="">Pilih BAB / Topik...</option>'+rows.map(r=>`<option value="${esc(r.bab)}">${esc(r.bab)}</option>`).join('');
    const signature=rows.map(r=>`${r.id||''}:${r.bab}`).join('|');
    if(sel.dataset.sgMasterScope===signature)return;
    sel.innerHTML=html;sel.dataset.sgMasterScope=signature;
    if(current&&rows.some(r=>text(r.bab)===current))sel.value=current;else if(rows.length)sel.value=rows[0].bab;
  };
  let timer=0;
  const run=()=>{clearTimeout(timer);timer=setTimeout(rebuild,40)};
  const boot=()=>{run();if(!window.__sgPerangkatMasterScopeWatch){window.__sgPerangkatMasterScopeWatch=1;new MutationObserver(run).observe(document.body,{childList:true,subtree:true});document.addEventListener('change',e=>{if(e.target?.id==='sgPaClass'||e.target?.id==='sgPaSubject')run()},true)}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
