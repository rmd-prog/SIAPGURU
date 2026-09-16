(()=>{
  const ROOM='.sg-perangkat-room';
  const DRAFT='siapguru_perangkat_draft';
  const CTX='siapguru_perangkat_bab_context_v1';
  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
  const genericDiff=v=>{const s=clean(v);return !s||/dukungan bertahap bagi peserta didik yang memerlukan bantuan serta pengayaan bagi yang sudah mencapai tujuan|konten menggunakan .* sesuai kesiapan peserta didik; proses melalui pemodelan.*aktivitas mandiri.*produk disesuaikan tingkat kesiapan/i.test(s)};
  const genericFollow=v=>{const s=clean(v);return !s||/berdasarkan hasil asesmen dan kebutuhan peserta didik|remedial berfokus pada penguatan .* melalui penjelasan ulang.*pengayaan memperluas .* melalui tugas yang lebih menantang/i.test(s)};
  const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_) {}};
  const topic=room=>clean(room?.querySelector('#sgPaTopic')?.value);
  const material=room=>clean(room?.querySelector('#sgPaMaterial')?.value);
  const focus=room=>{const m=material(room).replace(/^Materi pokok\s+/i,'').replace(/^Lingkup materi\s+/i,'').replace(/\.$/,'');const a=m.split(/;|\n/).map(clean).filter(Boolean).slice(0,5);return a.length?a:[`kegiatan inti pada BAB ${topic(room)}`]};
  const product=f=>{const s=f.join(' ').toLowerCase();if(/teks|deskripsi|menulis|tulisan|presentasi/.test(s))return 'teks/hasil tulisan dan presentasi lisan sesuai tingkat kesiapan';if(/bilangan|pecahan|operasi|bangun|sudut|kpk|fpb|matematik/.test(s))return 'penyelesaian masalah dan penjelasan strategi secara bertahap hingga mandiri';if(/pengamatan|percobaan|ekosistem|energi|cahaya|bunyi|gaya|makhluk hidup/.test(s))return 'hasil pengamatan/percobaan, kesimpulan, atau laporan sederhana';return 'produk, unjuk kerja, atau penjelasan sesuai karakter materi dan tingkat kesiapan'};
  const diff=(t,f)=>`Diferensiasi ${t}: konten difokuskan pada ${f.slice(0,4).join(', ')}; proses untuk peserta didik yang memerlukan dukungan menggunakan contoh konkret, pemodelan, pertanyaan penuntun, dan langkah bertahap pada fokus tersebut, sedangkan peserta didik yang sudah mencapai tujuan mendapat tantangan untuk memperluas atau menerapkan fokus pada konteks baru; produk dapat berupa ${product(f)}, disesuaikan dengan kesiapan tanpa mengubah tujuan inti.`;
  const follow=(t,f)=>`Remedial dan pengayaan ${t}: remedial mengulang dan memperkuat ${f.slice(0,4).join(', ')} melalui penjelasan ulang, contoh konkret, latihan terbimbing, umpan balik, dan perbaikan hasil kerja sampai tujuan inti tercapai; pengayaan memperluas ${f.slice(0,4).join(', ')} melalui konteks baru, tugas yang lebih kompleks, pengembangan ${product(f)}, atau presentasi/penjelasan mandiri.`;
  const sync=room=>{
    const t=topic(room);if(!t||t==='SEMUA BAB / 1 TAHUN')return;
    const df=room.querySelector('#sgPaDifferentiation'),ff=room.querySelector('#sgPaFollowup');if(!df||!ff)return;
    let changed=false;const f=focus(room);
    if(genericDiff(df.value)){df.value=diff(t,f);changed=true;}
    if(genericFollow(ff.value)){ff.value=follow(t,f);changed=true;}
    if(!changed)return;
    df.dispatchEvent(new Event('input',{bubbles:true}));ff.dispatchEvent(new Event('input',{bubbles:true}));
    const draft=read(DRAFT);if(draft&&typeof draft==='object'){draft.topic=t;draft.differentiation=df.value;draft.followup=ff.value;write(DRAFT,draft)}
    const db=read(CTX)||{};const old=db[t]&&typeof db[t]==='object'?db[t]:{topic:t};old.topic=t;old.differentiation=df.value;old.followup=ff.value;old.manual=false;db[t]=old;write(CTX,db);
  };
  const boot=()=>{const run=()=>sync(document.querySelector(ROOM));run();if(window.__sgPerangkatStateGuard)return;window.__sgPerangkatStateGuard=1;new MutationObserver(run).observe(document.body,{childList:true,subtree:true});document.addEventListener('input',e=>{if(e.target?.id==='sgPaTopic'||e.target?.id==='sgPaMaterial'||e.target?.id==='sgPaDifferentiation'||e.target?.id==='sgPaFollowup')setTimeout(run,0)},true);setInterval(run,400)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
