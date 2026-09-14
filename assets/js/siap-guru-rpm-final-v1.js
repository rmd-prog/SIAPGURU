(()=>{
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=x=>String(x||'').replace(/^\s*(?:TP\s*)?\d+[.)\-:]?\s*/i,'').replace(/\s+/g,' ').trim().replace(/[.!?]+$/,'');
  const verbs=['mengidentifikasi','menjelaskan','menyebutkan','menguraikan','membandingkan','mengelompokkan','menganalisis','menentukan','menggunakan','menerapkan','mempraktikkan','membuat','menyusun','merancang','menunjukkan','menyajikan','mengomunikasikan','menyimpulkan','mengevaluasi','merefleksikan'];

  const syncPreview=(room,s)=>{
    const preview=room?.querySelector('.sg-doc-preview');
    const paper=preview?.querySelector('.sg-doc-preview-paper');
    const result=document.getElementById('sgRResult');
    if(!paper||!result)return;
    const val=id=>room.querySelector(id)?.value?.trim()||'-';
    const topic=s.topic||val('#sgRTopic');
    const subject=val('#sgRSubject');
    const phase=val('#sgRPhase');
    const kelas=val('#sgRClass');
    const semester=val('#sgRSemester');
    const jp=s.jp||val('#sgRJP')||'-';
    const model=s.model||val('#sgRModel');
    const mode=s.mode||val('#sgRMode');
    const year='2026/2027';
    const articles=[...result.querySelectorAll('article')];
    const findText=prefix=>articles.find(a=>(a.querySelector('h3')?.textContent||'').trim().startsWith(prefix))?.querySelector('p')?.textContent?.trim()||'';
    const tpText=findText('Tujuan & Kriteria Ketercapaian');
    const understand=findText('Memahami');
    const apply=findText('Mengaplikasi');
    const reflect=findText('Merefleksi');
    const assessment=findText('Asesmen Formatif');
    const follow=findText('Diferensiasi & Tindak Lanjut');
    const profile=(s.dpl||[]).join(' • ')||findText('Profil Lulusan')||'Dipilih sesuai kebutuhan pembelajaran.';
    const conscious=s?.principles?.conscious||'Peserta didik menyiapkan diri, memahami arah kegiatan, dan memantau proses belajarnya.';
    const meaningful=s?.principles?.meaning||`Kegiatan dikaitkan dengan pengalaman dan konteks yang dekat dengan peserta didik pada topik ${topic}.`;
    const joyful=s?.principles?.joy||'Kegiatan berlangsung aktif, aman, interaktif, dan memberi ruang bagi peserta didik untuk menunjukkan usaha serta hasil belajarnya.';
    const metaRows=[
      ['Satuan Pendidikan','SD'],['Mata Pelajaran/Tema',subject],['Fase/Kelas',`${phase} / ${kelas}`],
      ['Semester',semester],['Alokasi Waktu',`${jp} JP`],['Penyusun','Guru'],['Tahun Ajaran',year]
    ].map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');
    const checkRows=(s.dpl||[]).length?(s.dpl||[]).map(x=>`<li>✓ ${esc(x)}</li>`).join(''):'<li>✓ Dipilih sesuai kebutuhan pembelajaran</li>';
    const section=(title,body)=>`<section class="sg-rpm-preview-block"><div class="sg-rpm-preview-block-title">${esc(title)}</div>${body}</section>`;
    const textBlock=(title,text)=>text?`<div class="sg-rpm-preview-subsection"><h4>${esc(title)}</h4><p>${esc(text)}</p></div>`:'';
    const bulletBlock=(title,items)=>`<div class="sg-rpm-preview-subsection"><h4>${esc(title)}</h4><ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`;
    const tpItems=(s.selectedTP||[]).map((x,i)=>`TP ${i+1}. ${clean(x.text)}`).filter(Boolean);
    const cp=(s.selectedTP||[]).map(x=>x.element).filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i).join('; ')||'CP yang menjadi dasar TP pada BAB terpilih.';
    const kesiapan=`Kesiapan peserta didik dipetakan melalui pertanyaan diagnostik, pengamatan awal, dan respons terhadap stimulus yang berkaitan dengan ${topic}. Hasilnya digunakan untuk menyesuaikan pendampingan dan tingkat tantangan.`;
    const karakter=`Materi ${topic} dikembangkan sesuai karakter pengetahuan dan keterampilan yang diperlukan dalam tujuan pembelajaran. Kegiatan bergerak dari pemahaman konsep menuju penerapan dan refleksi.`;
    const partnership=`Kemitraan dapat melibatkan teman sebaya, guru, dan lingkungan sekitar sesuai kebutuhan kegiatan ${topic}.`;
    const environment=`Pembelajaran berlangsung di ruang kelas dan/atau lingkungan sekitar yang aman, nyaman, serta mendukung interaksi dan eksplorasi.`;
    const digital=`Media digital digunakan secara selektif sebagai sumber informasi, visualisasi, dokumentasi, atau presentasi hasil belajar sesuai ketersediaan sarana.`;
    const awal=`Guru membuka pembelajaran dengan mengaitkan ${topic} dengan pengalaman peserta didik, menyampaikan arah kegiatan, serta melakukan pengecekan kesiapan melalui pertanyaan atau stimulus singkat.`;
    const penutup=`Guru dan peserta didik menyimpulkan hasil kegiatan, memberikan apresiasi dan penguatan, lalu menetapkan tindak lanjut sesuai hasil belajar.`;
    const asesmenAwal=`Dilakukan sebelum kegiatan inti untuk memetakan pengetahuan awal, kesiapan, dan kebutuhan pendampingan terkait ${topic}.`;
    const asesmenProses=`Dilakukan selama kegiatan melalui observasi, pertanyaan, diskusi, latihan, hasil kerja, dan umpan balik.`;
    const asesmenAkhir=`Dilakukan melalui bukti belajar yang sesuai dengan karakter tujuan dan model ${model}, sehingga kemampuan yang dituju dapat diamati secara nyata.`;
    const rubrik=`Kriteria mencakup ketepatan pemahaman, kemampuan menerapkan, kualitas hasil kerja, komunikasi/kolaborasi bila relevan, dan kemampuan memperbaiki hasil berdasarkan umpan balik.`;
    paper.innerHTML=`
      <h3 class="sg-rpm-preview-title">RENCANA PEMBELAJARAN MENDALAM (RPM)</h3>
      <p class="sg-rpm-preview-subtitle">Berbasis Pendekatan Pembelajaran Mendalam — Mindful, Meaningful, Joyful</p>
      ${section('A. IDENTITAS',`<table class="sg-rpm-identity-table"><tbody>${metaRows}</tbody></table>`)}
      ${section('B. IDENTIFIKASI',textBlock('1. Kesiapan Peserta Didik (Hasil Asesmen Awal)',kesiapan)+textBlock('2. Karakteristik Materi',karakter)+`<div class="sg-rpm-preview-subsection"><h4>3. Dimensi Profil Lulusan yang Disasar</h4><ul>${checkRows}</ul></div>`)}
      ${section('C. DESAIN PEMBELAJARAN',textBlock('1. Capaian Pembelajaran',cp)+bulletBlock('2. Tujuan Pembelajaran',tpItems.length?tpItems:['Tujuan pembelajaran belum tersedia.'])+textBlock('3. Topik/Konten Pembelajaran',topic)+textBlock('4. Praktik Pedagogis (Model/Pendekatan Pembelajaran)',`${model} dengan moda ${mode}.`)+textBlock('5. Kemitraan Pembelajaran',partnership)+textBlock('6. Lingkungan Pembelajaran',environment)+textBlock('7. Pemanfaatan Digital',digital))}
      ${section('D. PENGALAMAN BELAJAR',textBlock('1. Kegiatan Awal — Mindful (Berkesadaran)',awal)+`<div class="sg-rpm-preview-subsection"><h4>2. Kegiatan Inti — Meaningful (Bermakna)</h4>${textBlock('Memahami',understand)}${textBlock('Mengaplikasi',apply)}${textBlock('Merefleksi',reflect)}</div>`+textBlock('3. Kegiatan Penutup — Joyful (Menggembirakan)',penutup)+textBlock('Penguatan Prinsip Berkesadaran',conscious)+textBlock('Penguatan Makna',meaningful)+textBlock('Suasana Menggembirakan',joyful))}
      ${section('E. ASESMEN',textBlock('1. Asesmen Awal (Diagnostik)',asesmenAwal)+textBlock('2. Asesmen Proses (Formatif)',asesmenProses)+textBlock('3. Asesmen Akhir (Sumatif)',asesmenAkhir)+textBlock('4. Kriteria Ketercapaian/Rubrik Penilaian',rubrik)+textBlock('Tindak Lanjut',follow))}
      ${section('F. REFLEKSI',textBlock('1. Refleksi Guru','Guru meninjau keterlibatan peserta didik, kecukupan strategi, bukti ketercapaian, serta bagian kegiatan yang perlu diperbaiki pada pembelajaran berikutnya.')+textBlock('2. Refleksi Peserta Didik','Peserta didik meninjau hal yang dipahami, pengalaman yang membantu, kesulitan yang ditemui, dan langkah yang akan dilakukan setelah pembelajaran.'))}
      ${section('G. LAMPIRAN',textBlock('Dokumen Pendukung','LKPD, bahan ajar, media, instrumen asesmen, rubrik, dan dokumentasi pembelajaran disertakan sesuai kebutuhan.'))}
      <div class="sg-rpm-signature"><div>Mengetahui,<br>Kepala Sekolah<br><br><br>( ................................ )<br>NIP. ........................</div><div>........................, ........................<br>Guru Kelas/Mata Pelajaran<br><br><br>( ................................ )<br>NIP. ........................</div></div>`;
    preview.dataset.sgRpmGeneratedSync='4';
  };

  const run=()=>{
    const r=document.getElementById('sgRResult'); if(!r)return;
    let s=null;try{s=JSON.parse(sessionStorage.getItem('siapguru_rpm_generated')||'null')}catch(_){s=null}
    if(!s?.selectedTP?.length)return;
    const topic=s.topic||'topik pembelajaran', model=s.model||'Problem Based Learning';
    const ps=s.selectedTP.map((x,i)=>{const raw=clean(x.text);const m=raw.match(new RegExp('\\b('+verbs.join('|')+')\\b','i'));const action=(m?m[1]:'menunjukkan').toLowerCase();const content=clean(m?raw.slice(m.index+m[0].length).replace(/^\s*(tentang|mengenai|terhadap|untuk)?\s*/i,''):raw)||topic;return {no:i+1,action,content};});
    const join=arr=>arr.length===1?arr[0]:arr.length===2?arr.join(' dan '):arr.slice(0,-1).join(', ')+', dan '+arr[arr.length-1];
    const abilities=[...new Set(ps.map(x=>x.action+' '+x.content))];
    const goal=`Peserta didik mampu ${join(ps.map(x=>x.action+' '+x.content))} melalui pengalaman belajar yang kontekstual pada ${topic}, serta menunjukkan bukti belajar yang dapat diamati.`;
    const opening=`Guru membuka pembelajaran dengan mengaitkan ${topic} dengan pengalaman atau situasi yang dekat dengan peserta didik. Guru menyampaikan tujuan belajar dan pertanyaan pemantik, kemudian memeriksa kesiapan awal melalui respons singkat, pengamatan, atau pertanyaan diagnostik.`;
    const understand=`Peserta didik mengamati stimulus dan mengkaji informasi penting tentang ${topic}. Dengan menggunakan tahapan ${model}, peserta didik bekerja secara individu atau kolaboratif untuk membangun pemahaman, memilih informasi yang relevan, dan menghubungkannya dengan kemampuan yang dituju. Guru memberikan pertanyaan penuntun dan umpan balik agar pemahaman berkembang berdasarkan bukti.`;
    const apply=`Peserta didik menerapkan pemahamannya pada tugas atau situasi yang sesuai dengan ${topic}. Mereka mengolah informasi, melakukan latihan, penyelidikan, atau proyek sesuai karakter ${model}, menghasilkan bukti belajar, dan memperbaiki hasil berdasarkan umpan balik.`;
    const reflect=`Peserta didik menelaah hasil kerja dan proses yang telah dilakukan, menjelaskan bagian yang sudah dikuasai serta bagian yang masih perlu diperbaiki. Peserta didik merefleksikan ketercapaian kemampuan dan menetapkan langkah perbaikan berikutnya.`;
    const closing=`Guru bersama peserta didik menyimpulkan inti pembelajaran berdasarkan hasil kegiatan dan bukti belajar. Guru memberikan penguatan, menyampaikan tindak lanjut berupa remedial atau pengayaan sesuai kebutuhan, dan mengarahkan peserta didik untuk menerapkan pemahaman pada konteks berikutnya.`;
    const assessment=`Asesmen awal digunakan untuk mengetahui kesiapan yang berkaitan dengan ${topic}. Asesmen proses dilakukan melalui pengamatan, pertanyaan, diskusi, latihan, penyelidikan, atau hasil kerja. Asesmen akhir menggunakan bukti yang sesuai dengan ${model}, dengan kriteria ketepatan pemahaman, penerapan kemampuan, kualitas bukti, dan refleksi.`;
    const replace=(prefix,text)=>{[...r.querySelectorAll('article')].filter(a=>(a.querySelector('h3')?.textContent||'').startsWith(prefix)).forEach(a=>{const p=a.querySelector('p');if(p)p.textContent=text;});};
    replace('Tujuan & Kriteria Ketercapaian',goal);
    replace('Memahami',understand); replace('Mengaplikasi',apply); replace('Merefleksi',reflect);
    replace('Berkesadaran',s?.principles?.conscious||''); replace('Bermakna',s?.principles?.meaning||''); replace('Menggembirakan',s?.principles?.joy||'');
    replace('Asesmen Formatif',assessment);
    replace('Diferensiasi & Tindak Lanjut',`Peserta didik yang sudah mencapai tujuan mendapat pengayaan atau tantangan lanjutan. Peserta didik yang belum mencapai tujuan mendapat umpan balik, pendampingan, pembelajaran ulang, dan kesempatan memperbaiki bukti belajar.`);
    r.dataset.rpmFinalV1='4';
    const saved={...s,rpmFinal:{goal,opening,understand,apply,reflect,closing,assessment,abilities,model,topic},version:'RPM-SUPER-FINAL-4'};
    try{sessionStorage.setItem('siapguru_rpm_generated',JSON.stringify(saved))}catch(_){ }
    syncPreview(document.querySelector('.sg-rpm-room'),saved);
  };
  document.addEventListener('click',e=>{if(e.target?.id==='sgRBuild')setTimeout(run,0)},false);
})();