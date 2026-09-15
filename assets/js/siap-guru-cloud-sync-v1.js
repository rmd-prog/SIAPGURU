(()=>{
  const API_BASE='https://siapguru.adm-sd.workers.dev/api';
  const PREFIX='siapguru_';
  const rawUser=sessionStorage.getItem('siapguru_user');
  let user=null;
  try{user=rawUser?JSON.parse(rawUser):null}catch(_){user=null}
  if(!user?.id)return;

  let hydrating=false;
  let ready=false;
  const isSyncKey=key=>typeof key==='string'&&key.startsWith(PREFIX);
  const safeValue=value=>typeof value==='string'?value:JSON.stringify(value??null);

  const push=(key,value)=>{
    if(!ready||hydrating||!isSyncKey(key))return;
    fetch(`${API_BASE}/sync`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({user_id:user.id,key,value:safeValue(value)})}).catch(()=>{});
  };
  const removeRemote=key=>{
    if(!ready||hydrating||!isSyncKey(key))return;
    fetch(`${API_BASE}/sync`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({user_id:user.id,key,remove:true})}).catch(()=>{});
  };

  const originalSet=Storage.prototype.setItem;
  const originalRemove=Storage.prototype.removeItem;
  const originalClear=Storage.prototype.clear;
  Storage.prototype.setItem=function(key,value){
    originalSet.call(this,key,value);
    if(this===window.localStorage)push(String(key),String(value));
  };
  Storage.prototype.removeItem=function(key){
    originalRemove.call(this,key);
    if(this===window.localStorage)removeRemote(String(key));
  };
  Storage.prototype.clear=function(){
    const keys=[];
    if(this===window.localStorage)for(let i=0;i<this.length;i++){const k=this.key(i);if(isSyncKey(k))keys.push(k)}
    originalClear.call(this);
    keys.forEach(removeRemote);
  };

  const boot=async()=>{
    try{
      const response=await fetch(`${API_BASE}/sync?user_id=${encodeURIComponent(user.id)}`,{cache:'no-store'});
      const data=await response.json().catch(()=>({}));
      if(!response.ok||!data.ok)throw new Error('SYNC_FAILED');
      const remote=Array.isArray(data.items)?data.items:[];
      hydrating=true;
      if(remote.length){
        remote.forEach(item=>{if(isSyncKey(item.key)&&typeof item.value==='string')originalSet.call(window.localStorage,item.key,item.value)});
      }else{
        const local=[];
        for(let i=0;i<window.localStorage.length;i++){const key=window.localStorage.key(i);if(isSyncKey(key))local.push([key,window.localStorage.getItem(key)])}
        await Promise.all(local.map(([key,value])=>fetch(`${API_BASE}/sync`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({user_id:user.id,key,value})}).catch(()=>null)));
      }
    }catch(_){
      // Offline/server failure must never block the existing localStorage workflow.
    }finally{
      hydrating=false;
      ready=true;
      window.dispatchEvent(new CustomEvent('siapguru-cloud-sync-ready'));
    }
  };
  boot();
})();
