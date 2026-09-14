(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const clean=s=>String(s||'').replace(/^\s*(?:TP\s*)?\d+[.)\-:]?\s*/i,'').replace(/\s+/g,' ').trim();
  const lower=s=>clean(s).toLowerCase();
  const verb=s=>{const m=lower(s).match(/\b(mengidentifikasi|menjelaskan|menyebutkan|menguraikan|membandingkan|mengelompokkan|menganalisis|menentukan|menggunakan|menerapkan|mempraktikkan|membuat|menyusun|merancang|menunjukkan|menyajikan|mengomunikasikan|menyimpulkan|mengevaluasi|merefleksikan)\b/);return m?m[0]:'menunjukkan'};
  const profile=(items)=>{const texts=items.map(x=>clean(x.text)).filter(Boolean);const verbs=[...new Set(texts.map(verb))];return {texts,verbs}};
  const activity=(model,topic,focus,steps,jp,mode,verbs)=>{
    const v=verbs.join(', ');
    const s=(i,f)=>steps[i]||f;
    const map={
      'Problem Based Learning':{
        memahami:`Peserta didik ${s(0,'mengamati dan memahami masalah')} melalui stimulus yang berkaitan dengan ${topic}. Guru membantu peserta didik ${s(1,'mengorganisasi diri untuk belajar')} dengan mengidentifikasi informasi yang sudah diketahui, hal yang perlu dicari, dan keterkaitannya dengan kemampuan yang dituju.`,
        mengaplikasi:`Peserta didik ${s(2,'melakukan penyelidikan')} untuk menemukan informasi dan alternatif pemecahan masalah. Dalam ${mode}, peserta didik mengolah temuan dan ${s(3,'mengembangkan serta menyajikan hasil karya')} yang menunjukkan kemampuan ${v} pada konteks ${topic}. Guru memberi bimbingan dan umpan balik selama proses.`,
        merefleksi:`Peserta didik ${s(4,'menganalisis dan mengevaluasi proses pemecahan masalah')}. Peserta didik membandingkan solusi atau hasil dengan tujuan, menjelaskan alasan pemilihan strategi, menerima umpan balik, dan menentukan perbaikan berikutnya.`
      },
      'Project Based Learning':{
        memahami:`Peserta didik ${s(0,'menentukan pertanyaan mendasar')} yang berkaitan dengan ${topic}. Guru memfasilitasi peserta didik ${s(1,'mendesain perencanaan proyek')} dengan menetapkan tujuan, produk yang akan dibuat, sumber informasi, dan kriteria keberhasilan.`,
        mengaplikasi:`Peserta didik ${s(2,'menyusun jadwal dan pembagian tugas')} lalu ${s(3,'memonitor proses dan perkembangan proyek')}. Peserta didik menerapkan kemampuan ${v} untuk menghasilkan produk atau karya yang relevan dengan ${topic}. Guru memberikan umpan balik pada proses dan hasil kerja.`,
        merefleksi:`Peserta didik ${s(4,'menguji dan mempresentasikan hasil proyek')}, kemudian ${s(5,'mengevaluasi pengalaman belajar')}. Peserta didik menjelaskan proses, menilai kualitas produk berdasarkan kriteria, dan menetapkan perbaikan atau pengembangan lanjutan.`
      },
      'Discovery Learning':{
        memahami:`Peserta didik melalui tahap ${s(0,'Stimulation')} mengamati stimulus tentang ${topic}, kemudian ${s(1,'Problem Statement')} merumuskan pertanyaan atau masalah yang perlu dijawab.`,
        mengaplikasi:`Peserta didik ${s(2,'Data Collection')} mengumpulkan informasi, kemudian ${s(3,'Data Processing')} mengolah dan menghubungkan data untuk menemukan pola atau konsep. Hasil pengolahan digunakan untuk menunjukkan kemampuan ${v}.`,
        merefleksi:`Peserta didik ${s(4,'Verification')} memeriksa kesesuaian temuan dengan informasi atau bukti yang tersedia, lalu ${s(5,'Generalization')} merumuskan kesimpulan dan menjelaskan bagaimana temuan tersebut dapat digunakan pada situasi lain.`
      },
      'Cooperative Learning':{
        memahami:`Peserta didik ${s(0,'menyimak tujuan dan motivasi pembelajaran')} lalu ${s(1,'mengamati stimulus atau informasi')} tentang ${topic}. Guru memastikan setiap peserta didik memahami tugas dan kriteria keberhasilan.`,
        mengaplikasi:`Peserta didik ${s(2,'bekerja dalam kelompok')} untuk menyelesaikan tugas yang menuntut kemampuan ${v}. Guru ${s(3,'membimbing kolaborasi dan kerja kelompok')} agar setiap anggota berkontribusi dan menghasilkan bukti belajar yang sesuai.`,
        merefleksi:`Peserta didik ${s(4,'mengevaluasi hasil belajar')} bersama kelompok dan ${s(5,'memberikan atau menerima penguatan')}. Kelompok menjelaskan hasil, proses kerja sama, kontribusi anggota, serta perbaikan yang diperlukan.`
      },
      'Inkuiri':{
        memahami:`Peserta didik ${s(0,'melakukan orientasi')} terhadap ${topic}, kemudian ${s(1,'merumuskan masalah')} berdasarkan fenomena atau informasi yang diamati. Peserta didik ${s(2,'merumuskan hipotesis')} sebagai dugaan awal yang akan diuji.`,
        mengaplikasi:`Peserta didik ${s(3,'mengumpulkan data')} melalui pengamatan, percobaan, bacaan, atau sumber yang relevan, lalu menggunakan data tersebut untuk menunjukkan kemampuan ${v}. Guru membimbing proses pengumpulan dan pengolahan bukti.`,
        merefleksi:`Peserta didik ${s(4,'menguji hipotesis')} dengan membandingkan dugaan dan bukti, kemudian ${s(5,'menarik kesimpulan')}. Peserta didik menjelaskan temuan, keterbatasan proses, dan penerapan hasil pada situasi yang relevan.`
      },
      'Pembelajaran langsung':{
        memahami:`Guru ${s(0,'menyampaikan tujuan pembelajaran')} dan kriteria keberhasilan pada ${topic}, kemudian ${s(1,'melakukan demonstrasi atau pemodelan')} langkah atau konsep yang diperlukan. Peserta didik mengamati, bertanya, dan mengidentifikasi hal penting.`,
        mengaplikasi:`Peserta didik ${s(2,'melakukan latihan terbimbing')} untuk menerapkan kemampuan ${v}. Guru ${s(3,'melakukan cek pemahaman dan memberikan umpan balik')} sebelum peserta didik melanjutkan latihan pada konteks ${topic}.`,
        merefleksi:`Peserta didik ${s(4,'melakukan latihan mandiri')} untuk menunjukkan ketercapaian tujuan, kemudian ${s(5,'melakukan evaluasi dan tindak lanjut')}. Peserta didik menjelaskan kesulitan, strategi yang berhasil, dan bagian yang masih perlu diperbaiki.`
      }
    };
    return map[model]||map['Problem Based Learning'];
  };
  const run=()=>{
    const r=document.getElementById('sgRResult');if(!r||r.dataset.rpmAlignmentV1)return;
    let saved=null;try{saved=JSON.parse(sessionStorage.getItem('siapguru_rpm_generated')||'null')}catch(_){saved=null}
    if(!saved||!Array.isArray(saved.selectedTP)||!saved.selectedTP.length)return;
    const topic=saved.topic||'topik pembelajaran',model=saved.model||'Problem Based Learning',mode=saved.mode||'Tatap muka',jp=Number(saved.jp||2);
    const p=profile(saved.selectedTP),focus=p.texts.slice(0,4).join(', '),steps=saved.syntax?.steps||[];
    const narrative=`Peserta didik mengembangkan kemampuan ${p.verbs.length===1?p.verbs[0]:'yang dirumuskan dari TP terpilih'} melalui konteks ${topic}. Kemampuan tersebut diwujudkan melalui rangkaian pengalaman belajar yang menuntun peserta didik memahami, mengaplikasi, dan merefleksi dengan model ${model}.`;
    const a=activity(model,topic,focus,steps,jp,mode,p.verbs);
    const assessment=`Asesmen awal memeriksa pengetahuan dan kesiapan terkait ${topic}. Asesmen proses mengamati bukti saat peserta didik ${p.verbs.join(', ')}. Asesmen akhir menilai bukti paling sesuai dengan tujuan, seperti respons, produk, unjuk kerja, pemecahan masalah, atau presentasi. Kriteria menilai ketepatan pemahaman, penerapan kemampuan, kualitas bukti, alasan/strategi, dan refleksi.`;
    const elements=[...new Set(saved.selectedTP.map(x=>clean(x.element||'-')).filter(x=>x&&x!=='-'))];
    const mapping=`TP terpilih menjadi sumber kemampuan yang dirancang ke dalam kegiatan dan asesmen. Fokus kemampuan: ${focus}. ${elements.length?`Elemen CP yang tercatat: ${elements.join(', ')}.`:'Elemen CP tidak tersedia pada data TP yang diterima.'}`;
    const cards=[...r.querySelectorAll('article')],replace=(prefix,text)=>{const ar=cards.find(x=>(x.querySelector('h3')?.textContent||'').startsWith(prefix));if(ar){const q=ar.querySelector('p');if(q)q.textContent=text}};
    replace('Tujuan Pembelajaran dalam Narasi',narrative);replace('D. PENGALAMAN BELAJAR — Kegiatan Inti: Memahami',a.memahami);replace('D. PENGALAMAN BELAJAR — Kegiatan Inti: Mengaplikasi',a.mengaplikasi);replace('D. PENGALAMAN BELAJAR — Kegiatan Inti: Merefleksi',a.merefleksi);replace('F. ASESMEN',assessment);
    const design=cards.find(x=>(x.querySelector('h3')?.textContent||'').startsWith('B. DESAIN PEMBELAJARAN'));if(design){const q=design.querySelector('p');if(q)q.textContent=`Topik: ${topic}. Model: ${model}. Alokasi: ${jp} JP. TP digunakan sebagai sumber kemampuan dan diolah ke dalam pengalaman belajar.`}
    r.querySelector('[data-rpm-alignment-map]')?.remove();
    const article=document.createElement('article');article.dataset.rpmAlignmentMap='1';article.innerHTML=`<h3>B. KETERKAITAN TP → KEGIATAN → ASESMEN</h3><p>${esc(mapping)}</p>`;(design||r.firstElementChild)?.after(article);
    r.querySelector('[data-rpm-syntax-v2]')?.remove();
    r.dataset.rpmAlignmentV1='1';
    try{sessionStorage.setItem('siapguru_rpm_generated',JSON.stringify({...saved,rpmAlignment:{narrative,understanding:a.memahami,applying:a.mengaplikasi,reflecting:a.merefleksi,assessment,mapping,verbs:p.verbs,elements},version:'RPM-SUPER-ALIGNMENT-2'}))}catch(_){ }
  };
  document.addEventListener('click',e=>{if(e.target?.id==='sgRBuild')queueMicrotask(()=>queueMicrotask(()=>queueMicrotask(run)))},false);
})();
