(()=>{
  const clean=(s)=>String(s||'').replace(/^\s*(?:TP\s*)?\d+[.)\-:]?\s*/i,'').replace(/\s+/g,' ').trim();
  const esc=(s)=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const cap=(s)=>{s=clean(s);return s?s.charAt(0).toLowerCase()+s.slice(1):''};
  const splitClauses=(s)=>clean(s).split(/[,;]|\s+dan\s+|\s+serta\s+/i).map(x=>clean(x)).filter(Boolean);
  const tpNarrative=(items,topic)=>{
    const parts=(items||[]).map(x=>cap(x.text)).filter(Boolean);
    if(!parts.length)return `Peserta didik membangun pemahaman tentang ${topic||'topik pembelajaran'} dan menunjukkan ketercapaian tujuan melalui proses belajar yang aktif.`;
    if(parts.length===1)return `Peserta didik diarahkan untuk ${parts[0].replace(/[.!?]+$/,'')}.`;
    const clauses=parts.flatMap(splitClauses).slice(0,4);
    if(clauses.length===1)return `Peserta didik diarahkan untuk ${clauses[0].replace(/[.!?]+$/,'')}.`;
    return `Peserta didik diarahkan untuk ${clauses.slice(0,-1).join(', ').replace(/[.!?]+$/,'')}, serta ${clauses[clauses.length-1].replace(/[.!?]+$/,'')}.`;
  };
  const syntaxSteps=()=>{const r=document.getElementById('sgRResult');const a=[...r.querySelectorAll('article')].find(x=>/^Sintaks\s/i.test(x.querySelector('h3')?.textContent||''));return a?[...a.querySelectorAll('li')].map(x=>clean(x.textContent)).filter(Boolean):[]};
  const integrate=()=>{
    const r=document.getElementById('sgRResult');
    if(!r||r.dataset.rpmNarrativeV1)return;
    let saved=null;try{saved=JSON.parse(sessionStorage.getItem('siapguru_rpm_generated')||'null')}catch(_){saved=null}
    if(!saved||!Array.isArray(saved.selectedTP)||!saved.selectedTP.length)return;
    const topic=saved.topic||document.getElementById('sgRTopic')?.value||'topik pembelajaran';
    const model=saved.model||document.getElementById('sgRModel')?.value||'model pembelajaran';
    const mode=saved.mode||document.getElementById('sgRMode')?.value||'Tatap muka';
    const jp=Number(saved.jp||document.getElementById('sgRJP')?.value||2);
    const goal=tpNarrative(saved.selectedTP,topic),steps=syntaxSteps();
    const s1=steps[0]||'mengaktivasi pengetahuan awal dan mengidentifikasi fokus pembelajaran';
    const s2=steps[1]||'mengorganisasi peserta didik untuk belajar';
    const s3=steps[2]||'membimbing penyelidikan atau praktik';
    const s4=steps[3]||'mengembangkan dan menyajikan hasil belajar';
    const s5=steps[4]||'menganalisis dan mengevaluasi proses pembelajaran';
    const rest=steps.slice(5);
    const awal=`Guru membuka pembelajaran dengan salam, apersepsi, dan pengecekan kesiapan belajar. Guru mengaitkan ${topic} dengan pengalaman atau situasi yang dekat dengan peserta didik, lalu menyampaikan tujuan dan kriteria keberhasilan. Stimulus atau pertanyaan pemantik digunakan agar peserta didik siap belajar selama ${jp} JP.`;
    const memahami=`Peserta didik ${cap(s1)} melalui stimulus, pengamatan, membaca, menyimak, atau diskusi terarah. Selanjutnya peserta didik ${cap(s2)} untuk menelaah informasi penting dan membangun pemahaman yang diperlukan. Fokus pemahaman diarahkan pada kemampuan: ${goal}`;
    const mengaplikasi=`Dalam kegiatan ${mode}, peserta didik ${cap(s3)} untuk menggunakan pemahaman pada tugas, masalah, proyek, praktik, atau konteks nyata yang sesuai dengan ${topic}. Peserta didik kemudian ${cap(s4)} sehingga bukti belajar menunjukkan kemampuan yang menjadi tujuan. Guru memberikan umpan balik dan bantuan sesuai kebutuhan.`;
    const refleksi=`Peserta didik ${cap(s5)}. ${rest.length?rest.map(x=>`Peserta didik ${cap(x)}.`).join(' '):'Peserta didik menjelaskan hasil dan strategi, membandingkan proses dengan tujuan, menerima umpan balik, lalu menyampaikan hal yang sudah dikuasai dan bagian yang masih perlu diperbaiki.'}`;
    const penutup=`Guru bersama peserta didik menyimpulkan inti pembelajaran dan mengaitkan hasil belajar dengan kehidupan nyata. Peserta didik menyampaikan refleksi singkat, kemudian guru menetapkan tindak lanjut berupa penguatan, remedial, atau pengayaan berdasarkan bukti belajar dan menutup pembelajaran.`;
    const dpl=saved.dpl?.length?saved.dpl.join(' • '):'Belum dipilih';
    const assessment=saved.principles?.assessment||`Asesmen awal memeriksa kesiapan dan pengetahuan awal; asesmen proses mengumpulkan bukti saat peserta didik memahami dan mengaplikasi; asesmen akhir menilai bukti yang paling sesuai dengan tujuan. Umpan balik diberikan selama proses agar peserta didik dapat memperbaiki hasil belajar.`;
    const tpSource=saved.selectedTP.map((x,i)=>`${i+1}. ${clean(x.text)}${x.element&&x.element!=='-'?` (Elemen: ${clean(x.element)})`:''}`).join(' ');
    const cards=[
      ['A. IDENTIFIKASI',`Mata Pelajaran: ${saved.subject||'-'} • Fase: ${saved.phase||'-'} • Kelas: ${saved.class||'-'} • Semester: ${saved.semester==='2'?'2':'1'} • Topik/BAB: ${topic} • Alokasi waktu: ${jp} JP • Moda: ${mode}.`],
      ['B. DESAIN PEMBELAJARAN',`Topik pembelajaran: ${topic}. Model pembelajaran: ${model}. TP digunakan sebagai sumber perancangan dan diolah menjadi narasi kemampuan yang diterapkan pada pengalaman belajar dan asesmen.`],
      ['Tujuan Pembelajaran dalam Narasi',goal],
      ['Sumber TP Terpilih',tpSource],
      ['C. PRINSIP PEMBELAJARAN — Berkesadaran',saved.principles?.conscious||'Peserta didik memahami tujuan, kriteria keberhasilan, dan memantau proses belajarnya.'],
      ['C. PRINSIP PEMBELAJARAN — Bermakna',saved.principles?.meaning||`Pembelajaran ${topic} dikaitkan dengan pengalaman dan konteks nyata peserta didik.`],
      ['C. PRINSIP PEMBELAJARAN — Menggembirakan',saved.principles?.joy||'Pembelajaran berlangsung aktif, aman, interaktif, dan memberi ruang kolaborasi serta pilihan yang sesuai.'],
      ['D. PENGALAMAN BELAJAR — Kegiatan Awal',awal],
      ['D. PENGALAMAN BELAJAR — Kegiatan Inti: Memahami',memahami],
      ['D. PENGALAMAN BELAJAR — Kegiatan Inti: Mengaplikasi',mengaplikasi],
      ['D. PENGALAMAN BELAJAR — Kegiatan Inti: Merefleksi',refleksi],
      ['D. PENGALAMAN BELAJAR — Kegiatan Penutup',penutup],
      ['E. KERANGKA PEMBELAJARAN',`Praktik pedagogis menggunakan ${model}. Kemitraan pembelajaran dikembangkan melalui interaksi guru-peserta didik dan kolaborasi sesuai kebutuhan. Lingkungan pembelajaran diarahkan aman, nyaman, inklusif, dan kontekstual. Pemanfaatan digital digunakan bila relevan dengan tujuan dan moda ${mode}.`],
      ['Profil Lulusan',dpl],['F. ASESMEN',assessment],
      ['G. DIFERENSIASI, REFLEKSI & TINDAK LANJUT',`Guru menggunakan bukti belajar untuk memberi umpan balik. Peserta didik yang telah mencapai tujuan memperoleh pengayaan atau tantangan lanjutan, sedangkan yang belum mencapai tujuan memperoleh pendampingan, pembelajaran ulang, dan kesempatan memperbaiki bukti belajar.`]
    ];
    r.innerHTML=cards.map(([h,p])=>`<article data-rpm-narrative="1"><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('');
    r.dataset.rpmNarrativeV1='1';
    sessionStorage.setItem('siapguru_rpm_generated',JSON.stringify({...saved,rpmNarrative:{goal,awal,memahami,mengaplikasi,refleksi,penutup,model,syntax:steps,structure:'IDENTIFIKASI-DESAIN-PRINSIP-PENGALAMAN-KERANGKA-ASESMEN-TINDAKLANJUT'},version:'RPM-SUPER-NARRATIVE-3'}));
  };
  document.addEventListener('click',e=>{if(e.target?.id==='sgRBuild')queueMicrotask(integrate)});
})();
