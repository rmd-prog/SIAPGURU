/* SIAP GURU — RPM date bridge compatibility loader */
(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_DATE_BRIDGE_COMPAT__)return;
window.__SIAP_GURU_RPM_DATE_BRIDGE_COMPAT__=true;
const cleanup=()=>document.querySelectorAll('[data-rpm-date-bridge-v2]').forEach(el=>el.remove());
cleanup();
new MutationObserver(cleanup).observe(document.documentElement,{childList:true,subtree:true});
if(document.querySelector('script[data-rpm-date-bridge-v3]'))return;
const s=document.createElement('script');
s.src='assets/js/siap-guru-rpm-date-bridge-v3.js?v=1';
s.dataset.rpmDateBridgeV3='1';
s.defer=true;
document.head.appendChild(s);
})();
