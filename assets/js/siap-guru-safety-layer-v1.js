/* SIAP GURU — Safety Layer V1
   Purpose: observe runtime failures and long main-thread stalls without owning feature logic.
   This layer must stay passive: it never navigates, clicks, reloads, or mutates feature state.
*/
(()=>{
  if(window.__sgSafetyLayerV1)return;
  window.__sgSafetyLayerV1=true;
  const state=window.__sgSafetyState={version:1,errors:[],rejections:[],longTasks:0,startedAt:Date.now()};
  const keep=(arr,item,max=20)=>{arr.push(item);if(arr.length>max)arr.shift()};
  window.addEventListener('error',e=>{
    keep(state.errors,{time:Date.now(),message:String(e.message||'Unknown error'),source:e.filename||'',line:e.lineno||0,col:e.colno||0});
  },true);
  window.addEventListener('unhandledrejection',e=>{
    keep(state.rejections,{time:Date.now(),reason:String(e.reason?.message||e.reason||'Unknown rejection')});
  },true);
  if('PerformanceObserver' in window){
    try{
      const po=new PerformanceObserver(list=>{
        for(const entry of list.getEntries()){
          if(entry.duration>=200)state.longTasks++;
        }
      });
      po.observe({type:'longtask',buffered:true});
      state.longTaskObserver=true;
    }catch(_){state.longTaskObserver=false}
  }
  window.__sgSafetyHealth=()=>({
    ok:state.errors.length===0&&state.rejections.length===0,
    errors:state.errors.slice(),
    rejections:state.rejections.slice(),
    longTasks:state.longTasks,
    uptimeMs:Date.now()-state.startedAt
  });
})();
