(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const clean=s=>String(s||'').replace(/^\s*(?:TP\s*)?\d+[.)\-:]?\s*/i,'').replace(/\s+/g,' ').trim();
  const lower=s=>clean(s).toLowerCase();
  const verb=s=>{
    const x=clean(s).replace(/[.!?]+$/,'');
    const m=x.match(/\b(mengidentifikasi|menjelaskan|menyebutkan|menguraikan|membandingkan|mengelompokkan|menganalisis|menentukan|menggunakan|menerapkan|mempraktikkan|membuat|menyusun|merancang|menunjukkan|menyajikan|mengomunikasikan|menyimpulkan|mengevaluasi|merefleksikan)\b/i);
    return m?m[0].toLowerCase():'menunjukkan';
  };
  const run=()=>{
    const r=document.getElementById('sgRResult');
    if(!r||r.dataset.rpmAlignmentV1)return;
    let saved=null;try{saved=JSON.parse(sessionStorage.getItem('siapguru_rpm_generated')||'null')}catch(_){saved=null}
    if(!saved||!Array.isArray(saved.selectedTP)||!saved.selectedTP.length)return;
    const topic=saved.topic||'topik pembelajaran';
    const tps=saved.selectedTP.map((x,i)=>({n:i+1,text:clean(x.text),element:clean(x.element||'-')})).filter(x=>x.text);
    if(!tps.length)return;
    const focus=tps.map(x=>x.text.replace(/[.!?]+$/,'')).join('; ');
    const elements=[...new Set(tps.map(x=>x.element).filter(x=>x&&x!=='-'))];
    const verbs=[...new Set(tps.map(x=>verb(x.text)))];
    const narrative=`Peserta didik diarahkan untuk ${verbs.length===1?verbs[0]:'mengembangkan kemampuan melalui'} konteks ${topic} dengan fokus pada ${focus}. Rangkaian kegiatan dipilih untuk membantu peserta didik memahami konsep, menerapkan kemampuan, menunjukkan bukti belajar, dan merefleksikan hasil sesuai tujuan yang bersumber dari TP terpilih.`;
    const understanding=`Peserta didik membangun pemahaman terhadap ${topic} melalui pengamatan, membaca, menyimak, pertanyaan, dan diskusi terarah. Guru menuntun peserta didik menemukan informasi dan konsep yang diperlukan untuk mencapai kemampuan: ${focus}.`;
    const applying=`Peserta didik menggunakan pemahaman tersebut pada tugas, masalah, praktik, proyek, atau konteks nyata yang sesuai. Bukti yang dihasilkan diarahkan untuk menunjukkan kemampuan ${verbs.join(', ')} berdasarkan tujuan yang telah diolah dari TP, dengan bimbingan dan umpan balik sesuai kebutuhan.`;
    const reflecting=`Peserta didik menelaah hasil dan proses yang telah dilakukan, menjelaskan alasan atau strategi, membandingkan hasil dengan tujuan, menerima umpan balik, lalu menentukan bagian yang sudah dikuasai dan perbaikan berikutnya.`;
    const assessment=`Asesmen awal memeriksa pengetahuan dan kesiapan terkait ${topic}. Asesmen proses mengamati bukti ketika peserta didik ${verbs.join(', ')} melalui kegiatan memahami dan mengaplikasi. Asesmen akhir menggunakan bukti yang paling sesuai untuk menunjukkan ketercapaian tujuan, seperti respons, produk, unjuk kerja, atau presentasi. Kriteria menilai ketepatan pemahaman, penerapan, kualitas bukti, penjelasan strategi, dan refleksi.`;
    const mapping=`Sumber TP: ${tps.map(x=>`TP ${x.n}`).join(', ')}. ${elements.length?`Elemen CP yang tercatat pada TP: ${elements.join(', ')}.`:'Elemen CP tidak tersedia pada data TP yang diterima.'} TP dipakai sebagai sumber perancangan; yang ditampilkan pada kegiatan utama adalah narasi kemampuan, bukan daftar TP mentah.`;
    const cards=[...r.querySelectorAll('article')];
    const replace=(prefix,text)=>{const a=cards.find(x=>(x.querySelector('h3')?.textContent||'').startsWith(prefix));if(a){const p=a.querySelector('p');if(p)p.textContent=text;}};
    replace('Tujuan Pembelajaran dalam Narasi',narrative);
    replace('D. PENGALAMAN BELAJAR — Kegiatan Inti: Memahami',understanding);
    replace('D. PENGALAMAN BELAJAR — Kegiatan Inti: Mengaplikasi',applying);
    replace('D. PENGALAMAN BELAJAR — Kegiatan Inti: Merefleksi',reflecting);
    replace('F. ASESMEN',assessment);
    const design=cards.find(x=>(x.querySelector('h3')?.textContent||'').startsWith('B. DESAIN PEMBELAJARAN'));
    if(design){const p=design.querySelector('p');if(p)p.textContent=`Topik pembelajaran: ${topic}. Model pembelajaran: ${saved.model||'-'}. ${mapping}`;}
    const old=r.querySelector('[data-rpm-alignment-map]');old?.remove();
    const article=document.createElement('article');article.dataset.rpmAlignmentMap='1';article.innerHTML=`<h3>B. KETERKAITAN TP → KEGIATAN → ASESMEN</h3><p>${esc(mapping)}</p>`;
    const target=design||r.firstElementChild;target?.after(article);
    r.dataset.rpmAlignmentV1='1';
    try{sessionStorage.setItem('siapguru_rpm_generated',JSON.stringify({...saved,rpmAlignment:{narrative,understanding,applying,reflecting,assessment,mapping,verbs,elements},version:'RPM-SUPER-ALIGNMENT-1'}))}catch(_){ }
  };
  document.addEventListener('click',e=>{if(e.target?.id==='sgRBuild')queueMicrotask(()=>queueMicrotask(()=>queueMicrotask(run)))},false);
})();
