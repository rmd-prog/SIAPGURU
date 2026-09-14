(()=>{
  const clean=s=>String(s||'').replace(/^\s*(?:TP\s*)?\d+[.)\-:]?\s*/i,'').replace(/\s+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const cap=s=>{s=clean(s);return s?s.charAt(0).toLowerCase()+s.slice(1):''};
  const profile=(text,topic)=>{
    const x=clean(text).replace(/[.!?]+$/,'');
    const m=x.match(/\b(mengidentifikasi|menjelaskan|menyebutkan|menguraikan|membandingkan|mengelompokkan|menganalisis|menentukan|menggunakan|menerapkan|mempraktikkan|membuat|menyusun|merancang|menunjukkan|menyajikan|mengomunikasikan|menyimpulkan|mengevaluasi|merefleksikan)\b/i);
    const action=m?m[0].toLowerCase():'menunjukkan';
    const rest=m?x.slice(m.index+m[0].length).replace(/^\s*(tentang|mengenai|terhadap|untuk)?\s*/i,''):x;
    return {action,content:clean(rest)||topic};
  };
  const modelPlan=(model,p,topic)=>{
    const a=p.action,c=p.content;
    const plans={
      'Problem Based Learning':{
        memahami:`Peserta didik mengamati situasi atau masalah yang berkaitan dengan ${topic}, kemudian ${a} ${c} melalui pertanyaan pemantik dan penyelidikan awal. Guru membantu kelompok merumuskan informasi yang perlu dicari serta bukti yang diperlukan.`,
        mengaplikasi:`Peserta didik menyelidiki masalah, mengolah informasi, lalu ${a} ${c} untuk menghasilkan solusi atau hasil kerja yang dapat dipertanggungjawabkan. Setiap kelompok menyajikan hasil dan memperoleh umpan balik untuk memperbaiki jawabannya.`,
        merefleksi:`Peserta didik menilai ketepatan solusi dan proses pemecahan masalah, menjelaskan alasan yang digunakan, lalu merefleksikan sejauh mana kemampuan ${a} ${c} telah tercapai dan apa yang perlu diperbaiki.`},
      'Project Based Learning':{
        memahami:`Peserta didik mengkaji pertanyaan mendasar tentang ${topic}, mengidentifikasi informasi yang diperlukan, dan ${a} ${c} sebagai dasar merancang proyek. Guru dan peserta didik menyepakati hasil akhir serta kriteria keberhasilan.`,
        mengaplikasi:`Peserta didik merancang langkah kerja, membagi peran, mengembangkan produk, dan ${a} ${c} melalui proses proyek. Guru memonitor perkembangan, memberi umpan balik, dan membantu peserta didik memperbaiki produk sampai siap dipresentasikan.`,
        merefleksi:`Peserta didik menguji dan mempresentasikan produk, menerima tanggapan, kemudian mengevaluasi proses proyek dan merefleksikan bagaimana kemampuan ${a} ${c} berkembang selama pengerjaan.`},
      'Discovery Learning':{
        memahami:`Peserta didik memperoleh stimulus tentang ${topic}, merumuskan pertanyaan atau masalah, lalu mencari data yang membantu mereka ${a} ${c}. Informasi dibandingkan dan diolah untuk menemukan pola atau konsep.`,
        mengaplikasi:`Peserta didik mengolah dan memverifikasi temuan melalui contoh, percobaan, latihan, atau situasi baru, kemudian ${a} ${c} untuk membuktikan hasil temuannya.`,
        merefleksi:`Peserta didik membandingkan temuan dengan data dan konsep yang dipelajari, menjelaskan alasan kesimpulan, kemudian merefleksikan proses penemuan dan kemampuan ${a} ${c}.`},
      'Cooperative Learning':{
        memahami:`Peserta didik mengamati stimulus ${topic}, menerima tujuan belajar, kemudian bekerja dalam kelompok untuk ${a} ${c}. Setiap anggota berbagi informasi dan saling menjelaskan agar pemahaman kelompok terbentuk.`,
        mengaplikasi:`Peserta didik menjalankan tugas kolaboratif dengan pembagian peran yang jelas untuk ${a} ${c}. Kelompok menyusun hasil kerja, saling memeriksa, dan menyajikan bukti belajar dengan bimbingan guru.`,
        merefleksi:`Kelompok menilai hasil kerja dan kontribusi anggota, menerima umpan balik, lalu peserta didik merefleksikan pengalaman kolaborasi serta ketercapaian kemampuan ${a} ${c}.`},
      'Inkuiri':{
        memahami:`Peserta didik mengamati fenomena ${topic}, merumuskan masalah dan dugaan awal, lalu menentukan informasi yang diperlukan untuk ${a} ${c}. Guru memfasilitasi pertanyaan agar penyelidikan tetap terarah.`,
        mengaplikasi:`Peserta didik mengumpulkan dan menganalisis data, menguji dugaan dengan bukti, kemudian ${a} ${c} berdasarkan hasil penyelidikan. Temuan dicatat dan dikomunikasikan secara runtut.`,
        merefleksi:`Peserta didik menarik kesimpulan berdasarkan bukti, membandingkannya dengan dugaan awal, dan merefleksikan proses penyelidikan serta kemampuan ${a} ${c}.`},
      'Pembelajaran langsung':{
        memahami:`Guru memodelkan langkah atau contoh yang berkaitan dengan ${topic}. Peserta didik mengamati, mengajukan pertanyaan, dan mengikuti contoh untuk memahami cara ${a} ${c}.`,
        mengaplikasi:`Peserta didik melakukan latihan terbimbing, menerima koreksi dan umpan balik, kemudian berlatih secara mandiri untuk ${a} ${c}. Guru memastikan setiap langkah dilakukan dengan benar sebelum peserta didik menyelesaikan tugas secara mandiri.`,
        merefleksi:`Peserta didik memeriksa hasil latihan, menjelaskan langkah yang digunakan, menerima umpan balik, lalu merefleksikan bagian yang sudah dikuasai dan yang masih memerlukan latihan untuk ${a} ${c}.`}
    };
    return plans[model]||plans['Problem Based Learning'];
  };
  const run=()=>{
    const r=document.getElementById('sgRResult'); if(!r||r.dataset.rpmQualityV1)return;
    let s=null;try{s=JSON.parse(sessionStorage.getItem('siapguru_rpm_generated')||'null')}catch(_){s=null}
    if(!s?.selectedTP?.length)return;
    const topic=s.topic||'topik pembelajaran',model=s.model||'Problem Based Learning';
    const ps=s.selectedTP.map(x=>profile(x.text,topic));
    const primary=ps[0], actions=[...new Set(ps.map(x=>x.action))];
    const plan=modelPlan(model,primary,topic);
    const extra=ps.slice(1).map((p,i)=>`Kemampuan lanjutan ${i+1} diterapkan melalui kegiatan yang sama secara bertahap untuk ${p.action} ${p.content}.`).join(' ');
    const goal=`Peserta didik mampu ${actions.length===1?actions[0]:'mengembangkan kemampuan yang mencakup '+actions.join(', ')} pada ${topic}, dengan menunjukkan bukti belajar yang sesuai dengan tujuan.`;
    const assessment=`Asesmen awal memeriksa pengetahuan atau pengalaman awal yang diperlukan. Selama proses, guru mengamati cara peserta didik ${actions.join(', ')} melalui pertanyaan, diskusi, latihan, penyelidikan, atau hasil kerja. Asesmen akhir menggunakan bukti yang paling sesuai dengan ${model}, seperti solusi, produk, unjuk kerja, presentasi, atau kesimpulan. Kriteria mencakup ketepatan isi, penerapan kemampuan, kualitas bukti, dan refleksi.`;
    const replace=(prefix,text)=>{const a=[...r.querySelectorAll('article')].find(x=>(x.querySelector('h3')?.textContent||'').startsWith(prefix));if(a){const p=a.querySelector('p');if(p)p.textContent=text;}};
    replace('Tujuan Pembelajaran dalam Narasi',goal);
    replace('D. PENGALAMAN BELAJAR — Kegiatan Inti: Memahami',plan.memahami+(extra?' '+extra:''));
    replace('D. PENGALAMAN BELAJAR — Kegiatan Inti: Mengaplikasi',plan.mengaplikasi);
    replace('D. PENGALAMAN BELAJAR — Kegiatan Inti: Merefleksi',plan.merefleksi);
    replace('F. ASESMEN',assessment);
    r.dataset.rpmQualityV1='1';
    try{sessionStorage.setItem('siapguru_rpm_generated',JSON.stringify({...s,rpmQuality:{goal,model,primary,actions,understanding:plan.memahami,applying:plan.mengaplikasi,reflecting:plan.merefleksi,assessment},version:'RPM-SUPER-QUALITY-1'}))}catch(_){ }
  };
  document.addEventListener('click',e=>{if(e.target?.id==='sgRBuild')queueMicrotask(()=>queueMicrotask(()=>queueMicrotask(()=>queueMicrotask(run))))},false);
})();
