(()=>{
const boot=()=>{
 const room=document.querySelector('.sg-perangkat-room'); if(!room)return;
 const input=room.querySelector('#sgPaTopic'); if(!input)return;
 if(input.tagName==='SELECT')return;
 const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
 const topics=[]; const add=v=>{v=String(v??'').trim();if(v&&!topics.includes(v))topics.push(v)};
 const walk=(x,d=0)=>{if(!x||d>8)return;if(Array.isArray(x)){x.forEach(v=>walk(v,d+1));return}if(typeof x!=='object')return;add(x.topic);add(x.topik);add(x.bab);add(x.babTopik);add(x.bab_topik);add(x.materiPokok);add(x.judulBab);add(x.judulTopik);add(x.chapter);add(x.unit);['items','rows','data','tp','lessons','chapters','topics'].forEach(k=>x[k]&&walk(x[k],d+1))};
 ['siapguru_tp_draft','siapguru_prota_draft','siapguru_prosem_draft','siapguru_atp_draft'].forEach(k=>walk(read(k)));
 let old=String(input.value||'').trim(); const select=document.createElement('select'); select.id=input.id; select.className=input.className; select.style.cssText=input.style.cssText; select.setAttribute('aria-label','BAB / Topik'); select.innerHTML='<option value="">Pilih BAB / Topik...</option>'+topics.map(t=>`<option value="${t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}">${t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</option>`).join(''); if(old&&topics.includes(old))select.value=old; input.replaceWith(select); select.addEventListener('change',()=>{try{sessionStorage.setItem('siapguru_selected_topic',JSON.stringify({topic:select.value}))}catch(_){}});
};
const run=()=>{boot();if(!document.querySelector('.sg-perangkat-room select#sgPaTopic'))setTimeout(boot,150);setTimeout(boot,500);setTimeout(boot,1000)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
new MutationObserver(()=>boot()).observe(document.body,{childList:true,subtree:true});
})();
