(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_TIME_FINAL_V1__)return;
window.__SIAP_GURU_RPM_TIME_FINAL_V1__=true;
const round5=n=>Math.max(5,Math.round(n/5)*5);
const times=jp=>{jp=Math.max(1,Number(jp)||2);const total=jp*35;let awal=10,penutup=10;if(total<20){awal=5;penutup=5}const inti=total-awal-penutup;let memahami=round5(inti*.30),mengaplikasi=round5(inti*.50),merefleksi=inti-memahami-mengaplikasi;if(merefleksi<5){merefleksi=5;mengaplikasi=Math.max(5,inti-memahami-merefleksi)}return{total,awal,inti,memahami,mengaplikasi,merefleksi,penutup}};
const text=(room,id)=>room?.querySelector('#'+id)?.value?.trim()||'';
function sync(){
 const room=document.querySelector('.sg-rpm-room');if(!room)return;
 const jp=Math.max(1,Number(text(room,'sgRJP'))||2),t=times(jp);
 const start=text(room,'sgRStart')||'Guru membuka pembelajaran, membangun kesiapan belajar, mengaitkan pengalaman awal, dan menyampaikan arah pembelajaran.';
 const understand=text(room,'sgRUnderstand')||'Peserta didik mengamati stimulus, mengeksplorasi sumber belajar, mengidentifikasi informasi penting, berdiskusi, dan membangun pemahaman melalui pengalaman belajar yang relevan.';
 const apply=text(room,'sgRApply')||'Peserta didik menerapkan pemahaman melalui tugas, praktik, penyelidikan, kolaborasi, atau pemecahan masalah kontekstual serta menghasilkan bukti belajar.';
 const reflect=text(room,'sgRReflect')||'Peserta didik menelaah hasil dan proses belajar, menerima umpan balik, mengidentifikasi hal yang sudah dikuasai, dan menentukan perbaikan.';
 const end=text(room,'sgREnd')||'Guru dan peserta didik menyimpulkan pembelajaran, memberikan apresiasi, melakukan refleksi singkat, dan menentukan tindak lanjut.';
 const result=room.querySelector('#sgRResult');if(!result)return;
 const old=result.querySelector('.sg-rpm-time-final');if(old)old.remove();
 const block=document.createElement('section');block.className='sg-rpm-time-final';block.innerHTML=`<article><h3>D. KEGIATAN PEMBELAJARAN</h3><p><b>Alokasi waktu: ${t.total} menit (${jp} JP × 35 menit)</b></p><h4>Kegiatan Awal — ${t.awal} menit</h4><p>${start}</p><h4>Kegiatan Inti — ${t.inti} menit</h4><h5>1. Memahami — ${t.memahami} menit</h5><p>${understand}</p><h5>2. Mengaplikasi — ${t.mengaplikasi} menit</h5><p>${apply}</p><h5>3. Merefleksi — ${t.merefleksi} menit</h5><p>${reflect}</p><h4>Kegiatan Penutup — ${t.penutup} menit</h4><p>${end}</p></article>`;
 result.appendChild(block);
 const preview=room.querySelector('.sg-doc-preview-paper');if(preview){const ds=preview.querySelector('.sg-rpm-time-final-preview');if(ds)ds.remove();const p=document.createElement('section');p.className='sg-rpm-time-final-preview';p.innerHTML=`<div class="sg-rpm-preview-block-title">D. PENGALAMAN BELAJAR</div><h4>Kegiatan Awal — ${t.awal} menit</h4><p>${start}</p><h4>Kegiatan Inti — ${t.inti} menit</h4><h5>1. Memahami — ${t.memahami} menit</h5><p>${understand}</p><h5>2. Mengaplikasi — ${t.mengaplikasi} menit</h5><p>${apply}</p><h5>3. Merefleksi — ${t.merefleksi} menit</h5><p>${reflect}</p><h4>Kegiatan Penutup — ${t.penutup} menit</h4><p>${end}</p>`;preview.appendChild(p)}
}
function boot(){sync();document.addEventListener('click',e=>{if(e.target?.id==='sgRBuild')setTimeout(sync,50)},true);new MutationObserver(()=>{if(document.querySelector('.sg-rpm-room'))sync()}).observe(document.body,{subtree:true,childList:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
