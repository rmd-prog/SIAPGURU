(()=>{
  const clean=(s)=>String(s||'').replace(/^\s*(?:TP\s*)?\d+[.)\-:]?\s*/i,'').replace(/\s+/g,' ').trim();
  const esc=(s)=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const cap=(s)=>{s=clean(s);return s?s.charAt(0).toLowerCase()+s.slice(1):''};
  const tpNarrative=(items,topic)=>{
    const parts=(items||[]).map(x=>cap(x.text)).filter(Boolean);
    if(!parts.length)return `Peserta didik membangun pemahaman tentang ${topic||'topik pembelajaran'} dan menunjukkan ketercapaian tujuan melalui proses belajar yang aktif.`;
    if(parts.length===1)return `Peserta didik diarahkan untuk ${parts[0].replace(/[.!?]+$/,'')}.`;
    if(parts.length===2)return `Peserta didik diarahkan untuk ${parts[0].replace(/[.!?]+$/,'')} serta ${parts[1].replace(/[.!?]+$/,'')}.`;
    return `Peserta didik diarahkan untuk ${parts.slice(0,-1).join(', ').replace(/[.!?]+$/,'')}, serta ${parts[parts.length-1].replace(/[.!?]+$/,'')}.`;
  };
  const syntaxSteps=()=>{
    const r=document.getElementById('sgRResult');
    const a=[...r.querySelectorAll('article')].find(x=>/^Sintaks\s/i.test(x.querySelector('h3')?.textContent||''));
    return a?[...a.querySelectorAll('li')].map(x=>clean(x.textContent)).filter(Boolean):[];
  };
  const integrate=()=>{
    const r=document.getElementById('sgRResult');
    if(!r||r.dataset.rpmNarrativeV1)return;
    let saved=null;try{saved=JSON.parse(sessionStorage.getItem('siapguru_rpm_generated')||'null')}catch(_){saved=null}
    if(!saved||!Array.isArray(saved.selectedTP)||!saved.selectedTP.length)return;
    const topic=saved.topic||document.getElementById('sgRTopic')?.value||'topik pembelajaran';
    const model=saved.model||document.getElementById('sgRModel')?.value||'model pembelajaran';
    const mode=(saved.mode||document.getElementById('sgRMode')?.value||'Tatap muka').toLowerCase();
    const jp=Number(saved.jp||document.getElementById('sgRJP')?.value||2);
    const goal=tpNarrative(saved.selectedTP,topic);
    const steps=syntaxSteps();
    const s1=steps[0]||'mengaktivasi pengetahuan awal dan mengidentifikasi fokus pembelajaran';
    const s2=steps[1]||'mengorganisasi peserta didik untuk belajar';
    const s3=steps[2]||'membimbing penyelidikan atau praktik';
    const s4=steps[3]||'mengembangkan dan menyajikan hasil belajar';
    const s5=steps[4]||'menganalisis dan mengevaluasi proses pembelajaran';
    const rest=steps.slice(5);
    const awal=`Guru membuka pembelajaran dengan salam, apersepsi, dan pengecekan kesiapan belajar. Guru menyampaikan tujuan dan kriteria keberhasilan dengan mengaitkan ${topic} pada pengalaman atau situasi yang dekat dengan peserta didik. Guru memberikan stimulus atau pertanyaan pemantik agar peserta didik siap mengikuti kegiatan selama ${jp} JP.`;
    const memahami=`Peserta didik ${cap(s1)} melalui stimulus, pengamatan, membaca, menyimak, atau diskusi terarah. Selanjutnya peserta didik ${cap(s2)} untuk menelaah informasi penting dan menghubungkannya dengan tujuan pembelajaran. Proses memahami diarahkan pada inti kemampuan berikut: ${goal}`;
    const mengaplikasi=`Dalam kegiatan ${mode}, peserta didik ${cap(s3)} untuk menggunakan pengetahuan yang telah dipahami pada tugas, masalah, proyek, praktik, atau konteks nyata yang sesuai dengan ${topic}. Peserta didik kemudian ${cap(s4)}. Guru memberikan pertanyaan pengarah, umpan balik, dan bantuan sesuai kebutuhan agar bukti belajar menunjukkan ketercapaian tujuan.`;
    const refleksi=`Peserta didik ${cap(s5)}. ${rest.length?rest.map(x=>`Peserta didik ${cap(x)}.`).join(' '):'Peserta didik menjelaskan hasil, membandingkan proses dengan tujuan, menerima umpan balik, dan menyampaikan hal yang sudah dikuasai serta bagian yang masih perlu diperbaiki.'}`;
    const penutup=`Guru bersama peserta didik menyimpulkan inti pembelajaran, menegaskan keterkaitan hasil belajar dengan kehidupan nyata, dan melakukan refleksi singkat. Guru menyampaikan tindak lanjut berupa penguatan, remedial, atau pengayaan sesuai bukti belajar, kemudian menutup pembelajaran.`;
    const dpl=saved.dpl?.length?saved.dpl.join(' • '):'Belum dipilih';
    const assessment=saved.principles?.assessment||'Asesmen awal, proses, hasil kerja, dan refleksi digunakan untuk memperoleh bukti ketercapaian tujuan serta memberikan umpan balik.';
    const cards=[
      ['Tujuan Pembelajaran dalam Narasi',goal],
      ['Kegiatan Awal',awal],
      ['Kegiatan Inti — Memahami',memahami],
      ['Kegiatan Inti — Mengaplikasi',mengaplikasi],
      ['Kegiatan Inti — Merefleksi',refleksi],
      ['Kegiatan Penutup',penutup],
      ['Prinsip Berkesadaran',saved.principles?.conscious||'Peserta didik memahami tujuan, kriteria keberhasilan, dan memantau proses belajarnya.'],
      ['Prinsip Bermakna',saved.principles?.meaning||`Pembelajaran ${topic} dikaitkan dengan pengalaman dan konteks nyata peserta didik.`],
      ['Prinsip Menggembirakan',saved.principles?.joy||'Pembelajaran berlangsung aktif, aman, interaktif, dan memberi ruang kolaborasi serta pilihan yang sesuai.'],
      ['Profil Lulusan',dpl],
      ['Asesmen',assessment],
      ['Diferensiasi & Tindak Lanjut',`Peserta didik yang telah mencapai tujuan memperoleh pengayaan atau tantangan lanjutan, sedangkan peserta didik yang belum mencapai tujuan memperoleh umpan balik, pendampingan, pembelajaran ulang, dan kesempatan memperbaiki bukti belajar.`]
    ];
    r.innerHTML=cards.map(([h,p])=>`<article data-rpm-narrative="1"><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('');
    r.dataset.rpmNarrativeV1='1';
    const next={...saved,rpmNarrative:{goal,awal,memahami,mengaplikasi,refleksi,penutup,model,syntax:steps},version:'RPM-SUPER-NARRATIVE-1'};
    sessionStorage.setItem('siapguru_rpm_generated',JSON.stringify(next));
  };
  document.addEventListener('click',e=>{
    if(e.target?.id!=='sgRBuild')return;
    queueMicrotask(integrate);
  });
})();
