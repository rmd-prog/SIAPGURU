/* SIAP GURU — PERANGKAT Media + Bahan Ajar guard v1 */
(()=>{
  const ROOM='.sg-perangkat-room';
  const text=v=>String(v??'').trim();
  const selected=()=>{try{return JSON.parse(sessionStorage.getItem('siapguru_selected_topic')||'null')||{}}catch(_){return {}}};
  const topic=()=>text(document.querySelector(`${ROOM} #sgPaTopic`)?.value)||text(selected()?.bab||selected()?.topic);
  const subject=()=>{const s=selected();const room=document.querySelector(ROOM);return text(s?.mapel||s?.mapelName||room?.querySelector('#sgPaSubject')?.value)};
  const media=(t,m)=>{
    const x=t.toLowerCase(),s=m.toLowerCase();
    if(s.includes('matematika')){if(/pecahan|desimal/.test(x))return 'Buku teks/SIBI, model atau kartu pecahan, garis bilangan, benda konkret, media visual, dan LKPD.';if(/kpk|fpb/.test(x))return 'Buku teks/SIBI, kartu bilangan, tabel faktor dan kelipatan, garis bilangan, papan tulis/media visual, dan LKPD.';if(/bangun|sudut|lingkaran|kubus|balok/.test(x))return 'Buku teks/SIBI, model bangun, alat ukur, gambar/jaring-jaring, media visual, dan LKPD.';return 'Buku teks/SIBI, kartu bilangan, benda konkret, media visual, dan LKPD.'}
    if(s.includes('ipas')){if(/cahaya|bunyi/.test(x))return 'Buku teks/SIBI, senter/cermin, sumber bunyi sederhana, video/simulasi, dan LKPD percobaan.';if(/ekosistem|harmoni/.test(x))return 'Buku teks/SIBI, gambar/rantai makanan, video atau simulasi ekosistem, lingkungan sekitar, dan LKPD observasi.';if(/gaya/.test(x))return 'Buku teks/SIBI, benda sekitar untuk percobaan gaya, gambar/video, dan LKPD eksperimen.';return 'Buku teks/SIBI, media visual, benda/lingkungan sekitar, dan LKPD.'}
    if(s.includes('bahasa indonesia'))return 'Buku teks/SIBI, contoh teks sesuai topik, kartu kosakata, media visual/audio, dan LKPD.';
    if(s.includes('pendidikan pancasila'))return 'Buku teks/SIBI, gambar/infografis, kartu situasi, lingkungan sekolah, dan LKPD.';
    if(s.includes('pjok'))return 'Buku teks/SIBI, alat permainan/olahraga sederhana, demonstrasi gerak, dan LKPD.';
    if(s.includes('seni'))return 'Buku teks/SIBI, contoh karya, alat dan bahan berkarya, media visual, dan LKPD.';
    if(s.includes('agama'))return 'Buku teks/SIBI, teks/kisah teladan, media visual/audio, dan LKPD refleksi.';
    return `Buku teks/SIBI, media visual, lingkungan sekitar, dan LKPD yang relevan dengan ${t}.`;
  };
  const source=(t,m)=>{const s=m.toLowerCase();if(s.includes('matematika'))return 'Buku teks/SIBI, contoh soal kontekstual, benda konkret, lingkungan sekitar, dan sumber belajar digital yang relevan.';if(s.includes('ipas'))return 'Buku teks/SIBI, lingkungan alam sekitar, hasil pengamatan/percobaan, dan sumber digital tepercaya.';if(s.includes('pendidikan pancasila'))return 'Buku teks/SIBI, lingkungan sekolah/masyarakat, contoh situasi nyata, dan sumber belajar resmi.';if(s.includes('bahasa indonesia'))return 'Buku teks/SIBI, teks bacaan yang sesuai topik, contoh penggunaan bahasa, dan sumber belajar resmi.';return `Buku teks/SIBI, bahan referensi pendukung, lingkungan sekitar, dan sumber belajar resmi yang relevan dengan ${t}.`};
  const genericMedia=v=>/Media pembelajaran yang relevan dengan/i.test(text(v));
  const genericSource=v=>/Buku teks\/SIBI, lingkungan sekitar, dan sumber digital yang relevan/i.test(text(v));
  const apply=()=>{const r=document.querySelector(ROOM);if(!r)return;const t=topic(),m=subject();if(!t)return;const a=r.querySelector('#sgPaMedia'),b=r.querySelector('#sgPaSource');if(a&&(!text(a.value)||genericMedia(a.value)))a.value=media(t,m);if(b&&(!text(b.value)||genericSource(b.value)))b.value=source(t,m)};
  if(window.__sgPerangkatMediaSourceV1)return;window.__sgPerangkatMediaSourceV1=1;
  new MutationObserver(apply).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('change',e=>{if(e.target?.id==='sgPaTopic')setTimeout(apply,20)},true);
  document.addEventListener('input',e=>{if(e.target?.id==='sgPaTopic')setTimeout(apply,20)},true);
  setTimeout(apply,100);setInterval(apply,500);
})();
