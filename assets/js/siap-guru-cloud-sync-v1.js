(()=>{
'use strict';
/* SIAP GURU cloud persistence v2
   D1 is the shared source for explicitly supported user data.
   localStorage remains the immediate UI cache.
*/
const API_BASE='https://siapguru.adm-sd.workers.dev/api';
const raw=sessionStorage.getItem('siapguru_user');
let user=null;try{user=raw?JSON.parse(raw):null}catch(_){user=null}
if(!user?.id)return;
const PREFIX='siapguru_';
const SYNC_KEYS=new Set([
  'siapguru_prota_draft',
  'siapguru_prosem_draft',
  'siapguru_tp_draft',
  'siapguru_atp_draft',
  'siapguru_cp_draft'
]);
let ready=false,hydrating=false,writeChain=Promise.resolve();
const isKey=k=>SYNC_KEYS.has(String(k));
const send=(key,value,remove=false)=>{
  writeChain=writeChain.then(()=>fetch(`${API_BASE}/sync`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({user_id:String(user.id),key:String(key),...(remove?{remove:true}:{value:String(value??'')})})}).then(r=>r.ok?r.json():Promise.reject(new Error('SYNC_HTTP')))).catch(()=>null);
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
async function boot(){
  try{
    const r=await fetch(`${API_BASE}/sync?user_id=${encodeURIComponent(user.id)}`,{cache:'no-store'});
    const d=await r.json().catch(()=>({}));
    if(!r.ok||!d.ok)throw new Error('SYNC_GET_FAILED');
    const remote=Array.isArray(d.items)?d.items:[];
    hydrating=true;
    if(remote.length){
      remote.forEach(x=>{if(isKey(x.key)&&typeof x.value==='string')originalSet.call(window.localStorage,x.key,x.value)});
    }else{
      const local=[];
      for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(isKey(k))local.push([k,localStorage.getItem(k)])}
      for(const [k,v] of local)await send(k,v);
    }
  }catch(e){console.warn('SIAP GURU cloud sync:',e?.message||e)}
  finally{hydrating=false;ready=true;window.dispatchEvent(new CustomEvent('siapguru-cloud-sync-ready'))}
}
boot();
})();