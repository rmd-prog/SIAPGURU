(()=>{
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=x=>String(x||'').replace(/^\s*(?:TP\s*)?\d+[.)\-:]?\s*/i,'').replace(/\s+/g,' ').trim().replace(/[.!?]+$/,'');
  const verbs=['mengidentifikasi','menjelaskan','menyebutkan','menguraikan','membandingkan','mengelompokkan','menganalisis','menentukan','menggunakan','menerapkan','mempraktikkan','membuat','menyusun','merancang','menunjukkan','menyajikan','mengomunikasikan','menyimpulkan','mengevaluasi','merefleksikan'];
  const syncPreview=(room,s)=>{
    const preview=room.querySelector('.sg-doc-preview');
    const paper=preview?.querySelector('.sg-doc-preview-paper');
    if(!paper)return;
    const val=id=>room.querySelector(id)?.value?.trim()||'-';
    const sections=[...document.getElementById('sgRResult').querySelectorAll('article')];
    const rows=sections.map(a=>{
      const h=(a.querySelector('h3')?.textContent||'').trim();
      const p=(a.querySelector('p')?.textContent||'').trim();
      if(!h||!p)return '';
      return `<tr><th>${esc(h)}</th><td>${esc(p)}</td></tr>`;
    }).filter(Boolean).join('');
    const ident=`<div class="sg-doc-ident"><div><b>Satuan Pendidikan</b><span>SD</span></div><div><b>Mata Pelajaran</b><span>${esc(val('#sgRSubject'))}</span></div><div><b>Fase / Kelas</b><span>${esc(val('#sgRPhase'))} / ${esc(val('#sgRClass'))}</span></div><div><b>Tahun Pelajaran</b><span>2026/2027</span></div><div><b>Semester</b><span>${esc(val('#sgRSemester'))}</span></div></div>`;
    paper.innerHTML=ident+`<h3>RPM Deep Learning — Hasil Generate</h3><table class="sg-rpm-flat-table"><tbody>${rows}</tbody></table>`;
    preview.dataset.sgRpmGeneratedSync='1';
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
    const understand=`Peserta didik mengamati stimulus dan mengkaji informasi penting tentang ${topic}. Dengan menggunakan tahapan ${model}, peserta didik bekerja secara individu atau kolaboratif untuk membangun pemahaman, memilih informasi yang relevan, dan menghubungkannya dengan kemampuan yang dituju: ${join(ps.map(x=>x.action+' '+x.content))}. Guru memberikan pertanyaan penuntun dan umpan balik agar pemahaman berkembang berdasarkan bukti.`;
    const apply=`Peserta didik menerapkan pemahamannya pada tugas atau situasi yang sesuai dengan ${topic}. Mereka mengolah informasi, melakukan latihan/penyelidikan/proyek sesuai karakter ${model}, menghasilkan bukti belajar, dan memperbaiki hasil berdasarkan umpan balik. Bukti tersebut menunjukkan perkembangan kemampuan ${join(ps.map(x=>x.action+' '+x.content))}.`;
    const reflect=`Peserta didik menelaah hasil kerja dan proses yang telah dilakukan, menjelaskan bagian yang sudah dikuasai serta bagian yang masih perlu diperbaiki. Peserta didik merefleksikan ketercapaian kemampuan ${join(ps.map(x=>x.action+' '+x.content))} dan menetapkan langkah perbaikan berikutnya.`;
    const closing=`Guru bersama peserta didik menyimpulkan inti pembelajaran berdasarkan hasil kegiatan dan bukti belajar. Guru memberikan penguatan, menyampaikan tindak lanjut berupa remedial atau pengayaan sesuai kebutuhan, dan mengarahkan peserta didik untuk menerapkan pemahaman pada konteks berikutnya.`;
    const assessment=`Asesmen awal digunakan untuk mengetahui kesiapan yang berkaitan dengan ${topic}. Asesmen proses dilakukan melalui pengamatan, pertanyaan, diskusi, latihan, penyelidikan, atau hasil kerja untuk melihat perkembangan kemampuan ${join(ps.map(x=>x.action+' '+x.content))}. Asesmen akhir menggunakan bukti yang sesuai dengan ${model}, dengan kriteria ketepatan pemahaman, penerapan kemampuan, kualitas bukti, dan refleksi.`;
    const replace=(prefix,text)=>{[...r.querySelectorAll('article')].filter(a=>(a.querySelector('h3')?.textContent||'').startsWith(prefix)).forEach(a=>{const p=a.querySelector('p');if(p)p.textContent=text;});};
    replace('Tujuan Pembelajaran dalam Narasi',goal);
    replace('D. PENGALAMAN BELAJAR — Kegiatan Awal',opening);
    replace('D. PENGALAMAN BELAJAR — Kegiatan Inti: Memahami',understand);
    replace('D. PENGALAMAN BELAJAR — Kegiatan Inti: Mengaplikasi',apply);
    replace('D. PENGALAMAN BELAJAR — Kegiatan Inti: Merefleksi',reflect);
    replace('D. PENGALAMAN BELAJAR — Kegiatan Penutup',closing);
    replace('F. ASESMEN',assessment);
    [...r.querySelectorAll('article')].filter(a=>(a.querySelector('h3')?.textContent||'').startsWith('Sintaks ')).forEach(a=>a.remove());
    r.dataset.rpmFinalV1='1';
    const saved={...s,rpmFinal:{goal,opening,understand,apply,reflect,closing,assessment,abilities,model,topic},version:'RPM-SUPER-FINAL-2'};
    try{sessionStorage.setItem('siapguru_rpm_generated',JSON.stringify(saved))}catch(_){ }
    syncPreview(document.querySelector('.sg-rpm-room'),saved);
  };
  document.addEventListener('click',e=>{if(e.target?.id==='sgRBuild')setTimeout(run,0)},false);
})();