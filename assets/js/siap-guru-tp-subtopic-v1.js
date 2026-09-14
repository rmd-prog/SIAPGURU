(()=>{
/* SIAP GURU — TP compatibility loader
   Restore the previously working TP AUTO FINAL v4 generator.
   No subtopic workaround, no duplicate TP generation. */
if(window.__sgTpAutoV4)return;
if(document.querySelector('script[data-sg-tp-auto-v4]'))return;
const s=document.createElement('script');
s.src='assets/js/siap-guru-tp-auto-v1.js?v=4';
s.dataset.sgTpAutoV4='1';
s.defer=true;
s.onload=()=>{};
s.onerror=()=>{};
document.head.appendChild(s);
})();
