(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const clean=s=>String(s||'').replace(/^\s*(?:TP\s*)?\d+[.)\-:]?\s*/i,'').replace(/\s+/g,' ').trim();
  const cap=s=>{s=clean(s);return s?s.charAt(0).toLowerCase()+s.slice(1):''};
  const buildAssessment=()=>{
    const r=document.getElementById('sgRResult');
    if(!r||r.dataset.rpmAssessmentV1)return;
    let saved=null;try{saved=JSON.parse(sessionStorage.getItem('siapguru_rpm_generated')||'null')}catch(_){saved=null}
    if(!saved||!Array.isArray(saved.selectedTP)||!saved.selectedTP.length)return;
    const topic=saved.topic||'topik pembelajaran';
    const goal=(saved.rpmNarrative?.goal)||`Peserta didik menunjukkan kemampuan sesuai tujuan pembelajaran pada ${topic}.`;
    const evidence=saved.selectedTP.map((x,i)=>`bukti ${i+1}: ${cap(x.text)}`).join('; ');
    const awal=`Guru melakukan asesmen awal melalui pertanyaan pemantik, percakapan singkat, pengamatan, atau tugas diagnostik sederhana untuk mengetahui pengetahuan awal, pengalaman, dan kesiapan peserta didik terkait ${topic}. Hasilnya digunakan untuk menyesuaikan bantuan dan titik awal pembelajaran.`;
    const proses=`Selama kegiatan memahami, mengaplikasi, dan merefleksi, guru mengumpulkan bukti melalui observasi, pertanyaan, diskusi, cek pemahaman, hasil kerja, unjuk kerja, atau jurnal/refleksi. Bukti diarahkan pada kemampuan yang dinyatakan dalam tujuan, yaitu ${goal}`;
    const akhir=`Pada akhir pembelajaran, peserta didik menunjukkan bukti ketercapaian melalui tugas/produk/unjuk kerja atau respons yang sesuai dengan tujuan. Bukti yang diperhatikan meliputi ${evidence}. Hasil digunakan untuk menentukan ketercapaian, umpan balik, remedial, atau pengayaan.`;
    const criteria=`Kriteria ketercapaian berfokus pada ketepatan pemahaman, kemampuan menerapkan pengetahuan/keterampilan, kualitas proses atau produk, kemampuan menjelaskan alasan/strategi, serta kemampuan merefleksikan hasil belajar. Kriteria disesuaikan dengan karakteristik TP dan topik, bukan sekadar jumlah tugas yang selesai.`;
    const rubric=`Rubrik ringkas: 4 = mampu menunjukkan kemampuan secara tepat, mandiri, dan dapat menjelaskan alasan; 3 = mampu mencapai tujuan dengan sedikit bantuan; 2 = sebagian kemampuan sudah tampak tetapi masih memerlukan bimbingan; 1 = kemampuan belum tampak dan memerlukan pendampingan serta pembelajaran ulang.`;
    const html=[
      ['F. ASESMEN AWAL',awal],
      ['F. ASESMEN PROSES / FORMATIF',proses],
      ['F. ASESMEN AKHIR',akhir],
      ['Kriteria Ketercapaian',criteria],
      ['Rubrik Ringkas',rubric]
    ].map(([h,p])=>`<article data-rpm-assessment="1"><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('');
    const existing=[...r.querySelectorAll('article')].filter(a=>/^F\. ASESMEN|^Asesmen$/i.test(a.querySelector('h3')?.textContent||''));
    existing.forEach(a=>a.remove());
    r.insertAdjacentHTML('beforeend',html);
    r.dataset.rpmAssessmentV1='1';
    const next={...saved,rpmAssessment:{awal,proses,akhir,criteria,rubric,evidence},version:'RPM-SUPER-ASSESSMENT-1'};
    sessionStorage.setItem('siapguru_rpm_generated',JSON.stringify(next));
  };
  document.addEventListener('click',e=>{
    if(e.target?.id!=='sgRBuild')return;
    queueMicrotask(()=>queueMicrotask(buildAssessment));
  });
})();
