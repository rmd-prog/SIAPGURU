/* SIAP GURU — Safety Layer V1 / Stability Contract V3
   Passive diagnostics + automatic runtime guards for every module.
   Guards may stop runaway observers, but never change feature data,
   navigation, authentication, D1/Worker state, or protected business logic.
*/
(()=>{
  if(window.__sgSafetyLayerV1)return;
  window.__sgSafetyLayerV1=true;
  const state=window.__sgSafetyState={version:3,errors:[],rejections:[],longTasks:0,guardTrips:0,moduleErrors:[],startedAt:Date.now(),autoRecovered:0};
  const keep=(arr,item,max=50)=>{arr.push(item);if(arr.length>max)arr.shift()};
  const now=()=>Date.now();
  const note=(name,message)=>{state.guardTrips++;keep(state.moduleErrors,{time:now(),name:String(name||'runtime'),message:String(message||'Guard activated')})};
  window.addEventListener('error',e=>keep(state.errors,{time:now(),message:String(e.message||'Unknown error'),source:e.filename||'',line:e.lineno||0,col:e.colno||0}),true);
  window.addEventListener('unhandledrejection',e=>keep(state.rejections,{time:now(),reason:String(e.reason?.message||e.reason||'Unknown rejection')}),true);
  if('PerformanceObserver' in window){try{const po=new PerformanceObserver(list=>{for(const entry of list.getEntries())if(entry.duration>=200)state.longTasks++});po.observe({type:'longtask',buffered:true});state.longTaskObserver=true}catch(_){state.longTaskObserver=false}}
  const debounce=(fn,wait=120)=>{let timer=0;const wrapped=(...args)=>{clearTimeout(timer);timer=setTimeout(()=>{timer=0;try{fn(...args)}catch(err){keep(state.moduleErrors,{time:now(),name:'debounce',message:String(err?.message||err)})}},Math.max(0,wait))};wrapped.cancel=()=>{clearTimeout(timer);timer=0};return wrapped};
  const throttle=(fn,wait=120)=>{let last=0,timer=0,pending=null;const wrapped=(...args)=>{const t=now(),remain=Math.max(0,wait-(t-last));pending=args;if(remain===0){last=t;pending=null;try{fn(...args)}catch(err){keep(state.moduleErrors,{time:t,name:'throttle',message:String(err?.message||err)})};return}if(!timer)timer=setTimeout(()=>{timer=0;last=now();const a=pending;pending=null;try{fn(...a)}catch(err){keep(state.moduleErrors,{time:now(),name:'throttle',message:String(err?.message||err)})}},remain)};wrapped.cancel=()=>{clearTimeout(timer);timer=0;pending=null};return wrapped};
  const run=(name,fn)=>{try{return fn()}catch(err){note(name,err?.message||err);return undefined}};
  const once=(name,fn)=>{const key='__sgOnce_'+String(name||'default');if(window[key])return window[key];return window[key]=run(name,fn)};
  const guardObserver=(name,callback,options)=>{if(typeof MutationObserver!=='function')return null;const limit=Math.max(20,Number(options?.maxCallbacks||120)),windowMs=Math.max(1000,Number(options?.windowMs||3000));let count=0,started=0,dead=false,observer=null;const invoke=records=>{if(dead)return;const t=now();if(!started||t-started>windowMs){started=t;count=0}count++;if(count>limit){dead=true;try{observer?.disconnect()}catch(_){}state.autoRecovered++;note(name,'MutationObserver runaway detected; observer disconnected automatically');return}run(name,()=>callback(records))};observer=new MutationObserver(invoke);observer.observe(options?.target||document.body,options?.observe||{subtree:true,childList:true});return observer};
  /* Automatic protection for future modules that instantiate MutationObserver directly. */
  try{const NativeMutationObserver=window.MutationObserver;if(NativeMutationObserver&&!NativeMutationObserver.__sgGuarded){const GuardedMutationObserver=function(callback){let observer=null,dead=false,count=0,started=0;const limit=120,windowMs=3000;const guarded=records=>{if(dead)return;const t=now();if(!started||t-started>windowMs){started=t;count=0}count++;if(count>limit){dead=true;try{observer?.disconnect()}catch(_){}state.autoRecovered++;note('MutationObserver','Runaway observer automatically disconnected');return}try{callback(records,observer)}catch(err){note('MutationObserver',err?.message||err)}};observer=new NativeMutationObserver(guarded);return observer};GuardedMutationObserver.prototype=NativeMutationObserver.prototype;GuardedMutationObserver.__sgGuarded=true;window.MutationObserver=GuardedMutationObserver}}catch(_){ }
  window.SiapGuruStability={version:3,debounce,throttle,run,once,guardObserver,health:()=>window.__sgSafetyHealth()};
  window.__sgSafetyHealth=()=>({ok:state.errors.length===0&&state.rejections.length===0&&state.guardTrips===0,errors:state.errors.slice(),rejections:state.rejections.slice(),moduleErrors:state.moduleErrors.slice(),longTasks:state.longTasks,guardTrips:state.guardTrips,autoRecovered:state.autoRecovered,uptimeMs:now()-state.startedAt,stabilityVersion:3});
})();
