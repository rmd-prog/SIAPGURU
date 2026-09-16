(()=>{
const boot=()=>{
 const room=document.querySelector('.sg-perangkat-room');
 if(!room)return;
 const q=id=>room.querySelector('#'+id);
 const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
 const text=v=>String(v??'').trim();
 const collectTopics=()=>{
  const out=[];
  const add=v=>{const s=text(v);if(s&&!out.includes(s))out.push(s)};
  const walk=(x,d=0)=>{
   if(!x||d>6)return;
   if(Array.isArray(x)){x.forEach(v=>walk(v,d+1));return}
   if(typeof x!=='object')return;
   ['topic','topik','bab','babTopik','bab_topik','materi','materiPokok','judulBab','judulTopik','chapter','unit'].forEach(k=>add(x[k]));
   ['items','rows','data','tp','lessons','chapters','topics'].forEach(k=>x[k]&&walk(x[k],d+1));
   ['topic','topik','bab','materi','babTopik','bab_topik'].forEach(k=>x[k]&&typeof x[k]==='object'&&walk(x[k],d+1));
  };
  ['siapguru_selected_topic','siapguru_tp_draft','siapguru_prota_draft','siapguru_prosem_draft','siapguru_atp_draft'].forEach(k=>walk(read(k)));
  try{walk(JSON.parse(sessionStorage.getItem('siapguru_selected_topic')||'null'))}catch(_){ }
  return out;
 };
 const replaceTopic=()=>{
  const old=q('sgPaTopic');if(!old)return;
  let sel=q('sgPaTopicSelect');
  if(!sel){
   sel=document.createElement('select');sel.id='sgPaTopicSelect';sel.className=old.className;sel.style.cssText=old.style.cssText;sel.setAttribute('aria-label','BAB / Topik');
   old.replaceWith(sel);
  }
  const topics=collectTopics();
  const current=text(sel.value)||text(old?.value);
  sel.innerHTML='<option value="">Pilih BAB / Topik...</option>'+topics.map(x=>`<option value="${x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}">${x.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</option>`).join('');
  if(current&&topics.includes(current))sel.value=current;
  if(!sel.value&&topics.length)sel.value=topics[0];
  if(!sel.dataset.sgBound){
   sel.dataset.sgBound='1';
   sel.addEventListener('change',()=>{sel.dispatchEvent(new Event('input',{bubbles:true}));});
  }
  return topics.length;
 };
 const run=()=>{const n=replaceTopic();if(!n&&window.__sgTopicRetry==null){let i=0;window.__sgTopicRetry=setInterval(()=>{i++;const got=replaceTopic();if(got||i>=20){clearInterval(window.__sgTopicRetry);window.__sgTopicRetry=null}},500)}};
 run();
 new MutationObserver(()=>replaceTopic()).observe(room,{childList:true,subtree:true});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
})();