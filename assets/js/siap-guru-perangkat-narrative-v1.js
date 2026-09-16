(()=>{
const ROOM='.sg-perangkat-room';
const DRAFT='siapguru_perangkat_draft';
const CTX='siapguru_perangkat_bab_context_v1';
const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const topic=r=>clean(r?.querySelector('#sgPaTopic')?.value);
const subject=r=>clean(r?.querySelector('#sgPaSubject')?.value);
const material=r=>clean(r?.querySelector('#sgPaMaterial')?.value);
const follow=r=>r?.querySelector('#sgPaFollowup');
const diff=r=>r?.querySelector('#sgPaDifferentiation');
const compactFocus=(t,s,m)=>{
 const x=(t+' '+s+' '+m).toLowerCase();
 const parts=[];
 const add=v=>{if(v&&!parts.some(p=>p.toLowerCase()===v.toLowerCase()))parts.push(v)};
 if(/bahasa indonesia|bahasa/.test(x)){
  if(/hobi/.test(x))return 'pemahaman informasi dan kosakata tentang hobi, unsur kebahasaan dalam deskripsi, penyusunan teks deskripsi, serta presentasi lisan';
  if(/deskripsi|aku yang unik|orang|tokoh/.test(x))return 'pemahaman informasi dan kosakata, unsur kebahasaan teks deskripsi, penyusunan tulisan, serta komunikasi hasil belajar';
  if(/membaca|bacaan|buku|teks/.test(x))return 'pemahaman informasi dan kosakata, analisis isi teks, penyusunan tanggapan, serta penyampaian hasil belajar';
  return 'pemahaman informasi dan kosakata, penggunaan bahasa sesuai konteks, penyusunan produk bahasa, serta komunikasi hasil belajar';
 }
 if(/matematika/.test(x)){
  if(/pecahan|desimal/.test(x))return 'pemahaman representasi dan operasi bilangan, strategi penyelesaian masalah, serta penerapan dalam konteks sehari-hari';
  if(/kpk|fpb/.test(x))return 'pemahaman faktor dan kelipatan, strategi menentukan KPK dan FPB, serta penerapan dalam masalah sehari-hari';
  if(/bangun|sudut|lingkaran|kubus|balok/.test(x))return 'pemahaman sifat dan pengukuran bangun, strategi penyelesaian masalah geometri, serta penerapannya dalam konteks nyata';
  if(/data|diagram|peluang/.test(x))return 'pengumpulan dan penyajian data, pembacaan serta penafsiran informasi, dan penyelesaian masalah berbasis data';
  if(/ukur|panjang|berat|luas|volume|kecepatan|debit/.test(x))return 'pemahaman besaran dan satuan, keterampilan pengukuran dan konversi, serta penerapan dalam kehidupan sehari-hari';
  return 'pemahaman konsep bilangan, strategi operasi dan pemecahan masalah, serta penerapan matematika dalam konteks sehari-hari';
 }
 if(/ipas/.test(x)){
  if(/cahaya|bunyi/.test(x))return 'pemahaman sifat cahaya dan bunyi, hasil pengamatan atau percobaan, serta pemanfaatannya dalam kehidupan';
  if(/ekosistem|harmoni/.test(x))return 'pemahaman komponen dan hubungan dalam ekosistem, keseimbangan lingkungan, serta upaya menjaga keberlanjutan';
  if(/gaya/.test(x))return 'pemahaman jenis dan pengaruh gaya, hasil pengamatan atau percobaan, serta penerapannya dalam kehidupan sehari-hari';
  if(/energi/.test(x))return 'pemahaman bentuk dan perubahan energi, sumber serta pemanfaatannya, dan upaya penghematan energi';
  return 'pemahaman konsep sains, pengamatan atau penyelidikan terhadap fenomena, serta penerapannya dalam kehidupan sehari-hari';
 }
 if(/pendidikan pancasila|pancasila/.test(x))return 'pemahaman nilai Pancasila, aturan serta hak dan kewajiban, keragaman dan persatuan, serta penerapannya dalam kehidupan';
 if(/pjok/.test(x))return 'pemahaman dan praktik keterampilan gerak, strategi aktivitas jasmani, kebugaran, keselamatan, serta pola hidup sehat';
 if(/seni/.test(x))return 'pemahaman unsur dan teknik berkarya, proses serta ekspresi kreatif, dan apresiasi terhadap karya';
 if(/agama/.test(x))return 'pemahaman ajaran dan nilai keagamaan, keteladanan, praktik, serta penerapannya dalam perilaku sehari-hari';
 add('pemahaman konsep dan informasi utama');add('penerapan melalui aktivitas atau produk sesuai karakter materi');add('komunikasi dan refleksi hasil belajar');
 return parts.join(', ');
};
const rewriteFollow=(r)=>{
 const f=follow(r);if(!f)return false;
 const raw=clean(f.value);if(raw.length<420)return false;
 const t=topic(r);if(!t||t==='SEMUA BAB / 1 TAHUN')return false;
 const focus=compactFocus(t,subject(r),material(r));
 const next=`Remedial dan pengayaan ${t}: remedial mengulang dan memperkuat ${focus} melalui penjelasan ulang, contoh konkret, latihan terbimbing, umpan balik, dan perbaikan hasil kerja sampai tujuan inti tercapai; pengayaan memperluas kemampuan tersebut melalui konteks baru, tugas yang lebih kompleks, pengembangan produk sesuai karakter materi, atau presentasi/penjelasan mandiri.`;
 if(f.value===next)return false;
 f.value=next;f.dispatchEvent(new Event('input',{bubbles:true}));f.dispatchEvent(new Event('change',{bubbles:true}));
 const d=read(DRAFT);if(d&&typeof d==='object'){d.topic=t;d.followup=next;write(DRAFT,d)}
 const db=read(CTX)||{};const old=db[t]&&typeof db[t]==='object'?db[t]:{topic:t};old.topic=t;old.followup=next;db[t]=old;write(CTX,db);
 return true;
};
const rewriteDiff=(r)=>{
 const f=diff(r);if(!f)return false;const raw=clean(f.value);if(raw.length<520)return false;
 const t=topic(r);if(!t||t==='SEMUA BAB / 1 TAHUN')return false;
 const focus=compactFocus(t,subject(r),material(r));
 const next=`Diferensiasi ${t}: konten difokuskan pada ${focus}; proses untuk peserta didik yang memerlukan dukungan menggunakan contoh konkret, pemodelan, pertanyaan penuntun, dan langkah bertahap, sedangkan peserta didik yang sudah mencapai tujuan mendapat tantangan untuk memperluas atau menerapkan fokus pada konteks baru; produk disesuaikan dengan kesiapan tanpa mengubah tujuan inti.`;
 if(f.value===next)return false;
 f.value=next;f.dispatchEvent(new Event('input',{bubbles:true}));f.dispatchEvent(new Event('change',{bubbles:true}));
 const d=read(DRAFT);if(d&&typeof d==='object'){d.topic=t;d.differentiation=next;write(DRAFT,d)}
 const db=read(CTX)||{};const old=db[t]&&typeof db[t]==='object'?db[t]:{topic:t};old.topic=t;old.differentiation=next;db[t]=old;write(CTX,db);
 return true;
};
const run=()=>{const r=document.querySelector(ROOM);if(!r)return;rewriteFollow(r);rewriteDiff(r)};
const boot=()=>{if(window.__sgPerangkatNarrativeV1)return;window.__sgPerangkatNarrativeV1=1;run();new MutationObserver(run).observe(document.body,{childList:true,subtree:true,characterData:true});document.addEventListener('input',e=>{if(['sgPaTopic','sgPaMaterial','sgPaSubject','sgPaFollowup','sgPaDifferentiation'].includes(e.target?.id))setTimeout(run,0)},true);window.setInterval(run,500)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
