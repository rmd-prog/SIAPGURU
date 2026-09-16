(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_AUTHOR_SYNC_V1__)return;
window.__SIAP_GURU_RPM_AUTHOR_SYNC_V1__=true;
const getUser=()=>{try{return JSON.parse(sessionStorage.getItem('siapguru_user')||'null')}catch(_){return null}};
const syncAuthor=()=>{const room=document.querySelector('.sg-rpm-room');if(!room)return false;const user=getUser();const name=String(user?.nama||user?.name||'').trim();const author=room.querySelector('#sgRAuthor');if(author&&name){author.value=name;author.readOnly=true;author.title='Diambil otomatis dari nama guru yang sedang login';author.dataset.auto='1'}return !!author};
const addSync=()=>{const room=document.querySelector('.sg-rpm-room');if(!room)return false;if(!room.querySelector('#sgRAutoSync')){const actions=room.querySelector('.sg-rpm-actions');if(actions){const b=document.createElement('button');b.id='sgRAutoSync';b.type='button';b.className='sg-rpm-secondary';b.textContent='⚡ Sinkronkan Otomatis';b.addEventListener('click',()=>{syncAuthor();try{window.__SG_RPM_AUTO_SYNC?.()}catch(_){}});actions.appendChild(b)}}syncAuthor();return true};
const boot=()=>{let n=0;const tick=()=>{if(addSync()||n++>40)return;setTimeout(tick,250)};tick()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
new MutationObserver(()=>addSync()).observe(document.documentElement,{childList:true,subtree:true});
})();