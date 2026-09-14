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
    const meta=[
      ['Satuan Pendidikan','SD'],['Mata Pelajaran',val('#sgRSubject')],['Fase',val('#sgRPhase')],
      ['Kelas',val('#sgRClass')],['Semester',val('#sgRSemester')],['Topik / BAB',s.topic||val('#sgRTopic')],
      ['Alokasi Waktu',`${s.jp||val('#sgRJP')||'-'} JP`],['Model Pembelajaran',s.model||val('#sgRModel')],
      ['Moda',s.mode||val('#sgRMode')],['Tahun Pelajaran','2026/2027']
    ];
    const metaRows=meta.map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('');
    const articles=[...result.querySelectorAll('article')];
    const findText=prefix=>articles.find(a=>(a.querySelector('h3')?.textContent||'').trim().startsWith(prefix))?.querySelector('p')?.textContent?.trim()||'';
    const tpText=findText('Tujuan & Kriteria Ketercapaian');
    const principles=['Berkesadaran','Bermakna','Menggembirakan'].map(h=>[h,findText(h)]).filter(x=>x[1]);
    const stages=[['Memahami',findText('Memahami')],['Mengaplikasi',findText('Mengaplikasi')],['Merefleksi',findText('Merefleksi')]].filter(x=>x[1]);
    const profile=findText('Profil Lulusan');
    const assessment=findText('Asesmen');
    const follow=findText('Diferensiasi & Tindak Lanjut');
    const section=(title,body)=>`<section class="sg-rpm-preview-block"><div class="sg-rpm-preview-block-title">${esc(title)}</div>${body}</section>`;
    const textBlock=(title,text)=>text?`<div class="sg-rpm-preview-subsection"><h4>${esc(title)}</h4><p>${esc(text)}</p></div>`:'';
    const principleBlocks=principles.map(([h,p])=>textBlock(h,p)).join('');
    const stageBlocks=stages.map(([h,p])=>textBlock(h,p)).join('');
    paper.innerHTML=`
      <h3 class="sg-rpm-preview-title">RPM Deep Learning — Hasil Generate</h3>
      ${section('A. IDENTIFIKASI',`<table class="sg-rpm-identity-table"><tbody>${metaRows}</tbody></table>`)}
      ${section('B. DESAIN',`${textBlock('Tujuan Pembelajaran',tpText)}${textBlock('Profil Lulusan',profile)}${principleBlocks}`)}
      ${section('C. PENGALAMAN BELAJAR',stageBlocks)}
      ${section('D. ASESMEN',textBlock('Asesmen',assessment)+textBlock('Diferensiasi dan Tindak Lanjut',follow))}`;
    preview.dataset.sgRpmGeneratedSync='3';
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
    r.dataset.rpmFinalV1='3';
    const saved={...s,rpmFinal:{goal,opening,understand,apply,reflect,closing,assessment,abilities,model,topic},version:'RPM-SUPER-FINAL-3'};
    try{sessionStorage.setItem('siapguru_rpm_generated',JSON.stringify(saved))}catch(_){ }
    syncPreview(document.querySelector('.sg-rpm-room'),saved);
  };
  document.addEventListener('click',e=>{if(e.target?.id==='sgRBuild')setTimeout(run,0)},false);
})();