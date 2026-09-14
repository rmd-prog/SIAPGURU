(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_TIME_FINAL_V2__)return;
window.__SIAP_GURU_RPM_TIME_FINAL_V2__=true;
const round5=n=>Math.max(5,Math.round(n/5)*5);
const times=jp=>{jp=Math.max(1,Number(jp)||2);const total=jp*35;let awal=10,penutup=10;if(total<20){awal=5;penutup=5}const inti=total-awal-penutup;let memahami=round5(inti*.30),mengaplikasi=round5(inti*.50),merefleksi=inti-memahami-mengaplikasi;if(merefleksi<5){merefleksi=5;mengaplikasi=Math.max(5,inti-memahami-merefleksi)}return{total,awal,inti,memahami,mengaplikasi,merefleksi,penutup}};
const room=()=>document.querySelector('.sg-rpm-room');
const val=(r,id)=>r?.querySelector('#'+id)?.value?.trim()||'';
function apply(){
 const r=room();if(!r)return;
 const result=r.querySelector('#sgRResult');if(!result)return;
 const jp=Math.max(1,Number(val(r,'sgRJP'))||2),t=times(jp);
 const find=prefix=>[...result.querySelectorAll('article')].find(a=>(a.querySelector('h3')?.textContent||'').trim().startsWith(prefix));
 const rename=(prefix,label)=>{const a=find(prefix);if(a){const h=a.querySelector('h3');if(h)h.textContent=label;}};
 rename('Berkesadaran',`Kegiatan Awal — Mindful (Berkesadaran) — ${t.awal} menit`);
 rename('Memahami',`Memahami — ${t.memahami} menit`);
 rename('Mengaplikasi',`Mengaplikasi — ${t.mengaplikasi} menit`);
 rename('Merefleksi',`Merefleksi — ${t.merefleksi} menit`);
 rename('Menggembirakan',`Kegiatan Penutup — Joyful (Menggembirakan) — ${t.penutup} menit`);
 result.dataset.rpmTiming=`${t.total}`;
 try{
   const s=JSON.parse(sessionStorage.getItem('siapguru_rpm_generated')||'null');
   if(s){s.rpmTiming=t;s.version='RPM-SUPER-FINAL-5';sessionStorage.setItem('siapguru_rpm_generated',JSON.stringify(s));if(window.SiapGuruRPMFinal?.syncPreview)window.SiapGuruRPMFinal.syncPreview(r,s)}
 }catch(_){}
}
function boot(){
 document.addEventListener('click',e=>{if(e.target?.id==='sgRBuild')setTimeout(apply,250)},true);
 let last='';
 setInterval(()=>{const r=room(),result=r?.querySelector('#sgRResult');const sig=result?.dataset.rpmFinalV1||'';if(r&&result&&sig&&sig!==last){last=sig;setTimeout(apply,20)}},250);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();