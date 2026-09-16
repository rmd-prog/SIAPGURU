/* SIAP GURU — Perangkat Master BAB sync v1
   Menunggu Master BAB, lalu memaksa Perangkat membaca seluruh BAB
   sesuai kelas + mapel aktif. Tidak mengubah TP/Materi.
*/
(()=>{
 const norm=v=>String(v??'').trim().toLowerCase().replace(/\s+/g,' ');
 const kelasOf=v=>{const m=String(v??'').match(/\d+/);return m?Number(m[0]):0};
 const wait=()=>{
  const room=document.querySelector('.sg-perangkat-room');
  const api=window.SiapGuruMasterBab;
  if(!room||!api?.getAll)return setTimeout(wait,150);
  const rows=api.getAll();
  if(!Array.isArray(rows)||!rows.length)return setTimeout(wait,150);
  const user=(()=>{try{return JSON.parse(sessionStorage.getItem('siapguru_user')||'null')||{}}catch(_){return {}}})();
  const selected=(()=>{try{return JSON.parse(sessionStorage.getItem('siapguru_selected_topic')||'null')||{}}catch(_){return {}}})();
  const subject=norm(selected.mapel||selected.mapelName||room.querySelector('#sgPaSubject')?.value||user.mapel);
  const activeClass=kelasOf(selected.kelas||user.kelas||room.dataset.kelas);
  const scoped=rows.filter(r=>{
    const sameSubject=!subject||norm(r.mapel)===subject;
    const rk=kelasOf(r.kelas);
    const sameClass=!activeClass||!rk||rk===activeClass;
    return sameSubject&&sameClass;
  });
  if(!scoped.length)return setTimeout(wait,300);
  const original=api.getAll;
  api.getAll=()=>scoped;
  window.__sgPerangkatAutoV2Booted=null;
  const topic=room.querySelector('#sgPaTopic');
  topic?.dispatchEvent(new Event('sg-master-ready',{bubbles:true}));
  room.appendChild(document.createElement('i'));
  setTimeout(()=>{if(window.SiapGuruMasterBab?.getAll===api.getAll)window.SiapGuruMasterBab.getAll=original},0);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
