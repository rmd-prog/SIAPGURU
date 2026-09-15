(()=>{
'use strict';
/* SIAP GURU cloud persistence v4
   Sinkronisasi dilakukan sebelum modul membaca ulang data cloud. Jika D1
   memiliki data yang berbeda dari cache perangkat, halaman dimuat ulang
   sekali setelah hydration agar semua modul membaca data cloud terbaru.
*/
const API_BASE='https://siapguru.adm-sd.workers.dev/api';
const raw=sessionStorage.getItem('siapguru_user');
let user=null;try{user=raw?JSON.parse(raw):null}catch(_){user=null}
if(!user?.id)return;
const PREFIX='siapguru_';
const RELOAD_FLAG='siapguru_sync_reload_in_progress_v1';
if(sessionStorage.getItem(RELOAD_FLAG)==='1')sessionStorage.removeItem(RELOAD_FLAG);
let ready=false,hydrating=false,writeChain=Promise.resolve();
const isKey=k=>String(k||'').startsWith(PREFIX)&&String(k)!=='siapguru_user';
const send=(key,value,remove=false)=>{
  writeChain=writeChain.then(async()=>{
    const body={user_id:String(user.id),key:String(key)};
    if(remove)body.remove=true;else body.value=String(value??'');
    const r=await fetch(`${API_BASE}/sync`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
    if(!r.ok)throw new Error(`SYNC_HTTP_${r.status}`);
    return r.json().catch(()=>({}));
  }).catch(e=>{console.warn('SIAP GURU cloud write:',e?.message||e);return null});
  return writeChain;
};
const originalSet=Storage.prototype.setItem;
const originalRemove=Storage.prototype.removeItem;
Storage.prototype.setItem=function(key,value){
  originalSet.call(this,key,value);
  if(this===window.localStorage&&ready&&!hydrating&&isKey(key))send(key,value);
};
Storage.prototype.removeItem=function(key){
  originalRemove.call(this,key);
  if(this===window.localStorage&&ready&&!hydrating&&isKey(key))send(key,'',true);
};
function localKeys(){
  const out=[];
  for(let i=0;i<window.localStorage.length;i++){
    const k=window.localStorage.key(i);
    if(isKey(k))out.push([k,window.localStorage.getItem(k)]);
  }
  return out;
}
async function boot(){
  let remoteChanged=false;
  try{
    const r=await fetch(`${API_BASE}/sync?user_id=${encodeURIComponent(user.id)}`,{cache:'no-store'});
    const d=await r.json().catch(()=>({}));
    if(!r.ok||!d.ok)throw new Error('SYNC_GET_FAILED');
    const remote=Array.isArray(d.items)?d.items:[];
    const remoteKeys=new Set(remote.map(x=>String(x?.key||'')));
    hydrating=true;
    /* Remote wins only when the key exists in D1. Track real changes. */
    for(const x of remote){
      if(!isKey(x.key)||typeof x.value!=='string')continue;
      const old=window.localStorage.getItem(x.key);
      if(old!==x.value){
        remoteChanged=true;
        originalSet.call(window.localStorage,x.key,x.value);
      }
    }
    /* First device / newly introduced module: upload local data not yet in D1. */
    for(const [k,v] of localKeys()){
      if(!remoteKeys.has(k))await send(k,v);
    }
  }catch(e){
    console.warn('SIAP GURU cloud sync:',e?.message||e);
  }finally{
    hydrating=false;
    ready=true;
    window.dispatchEvent(new CustomEvent('siapguru-cloud-sync-ready'));
    /* Modules are defer-loaded and may already have read old local data.
       Reload once so every module initializes from the hydrated cloud cache. */
    if(remoteChanged&&sessionStorage.getItem(RELOAD_FLAG)!=='1'){
      sessionStorage.setItem(RELOAD_FLAG,'1');
      setTimeout(()=>window.location.reload(),80);
    }
  }
}
boot();
})();