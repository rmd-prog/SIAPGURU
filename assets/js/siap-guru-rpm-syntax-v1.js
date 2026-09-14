/* SIAP GURU — RPM Sintaks Pembelajaran v1
   Overlay aman: tidak mengubah RPM core/preview flattening.
*/
(()=>{
  const SYNTAX={
    'Problem Based Learning':['Orientasi peserta didik pada masalah','Mengorganisasi peserta didik untuk belajar','Membimbing penyelidikan individu/kelompok','Mengembangkan dan menyajikan hasil karya','Menganalisis dan mengevaluasi proses pemecahan masalah'],
    'Project Based Learning':['Menentukan pertanyaan mendasar','Mendesain perencanaan proyek','Menyusun jadwal dan pembagian tugas','Memonitor proses dan perkembangan proyek','Menguji dan mempresentasikan hasil proyek','Mengevaluasi pengalaman belajar'],
    'Discovery Learning':['Stimulation — pemberian rangsangan','Problem Statement — identifikasi/perumusan masalah','Data Collection — pengumpulan data','Data Processing — pengolahan data','Verification — pembuktian','Generalization — menarik kesimpulan'],
    'Cooperative Learning':['Menyampaikan tujuan dan memotivasi peserta didik','Menyajikan informasi atau stimulus','Mengorganisasi peserta didik dalam kelompok belajar','Membimbing kerja dan kolaborasi kelompok','Evaluasi hasil belajar','Memberikan penghargaan/penguatan'],
    'Inkuiri':['Orientasi dan penyajian masalah','Merumuskan masalah','Merumuskan hipotesis/dugaan','Mengumpulkan data atau bukti','Menguji hipotesis','Merumuskan kesimpulan'],
    'Pembelajaran langsung':['Menyampaikan tujuan dan menyiapkan peserta didik','Mendemonstrasikan atau menjelaskan konsep/keterampilan','Latihan terbimbing','Mengecek pemahaman dan memberi umpan balik','Latihan mandiri','Evaluasi dan tindak lanjut']
  };
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const getSteps=model=>SYNTAX[model]||SYNTAX['Problem Based Learning'];
  const buildText=(model,topic,mode)=>getSteps(model).map((x,i)=>`${i+1}. ${x}${topic?` — konteks: ${topic}.`:'.'}${mode?` Moda: ${mode}.`:''}`).join('\n');
  const inject=room=>{
    if(!room||!room.classList.contains('sg-rpm-room'))return;
    const model=room.querySelector('#sgRModel')?.value||'Problem Based Learning';
    const topic=room.querySelector('#sgRTopic')?.value?.trim()||'topik pembelajaran';
    const mode=room.querySelector('#sgRMode')?.value||'Tatap muka';
    let card=room.querySelector('#sgRSyntaxCard');
    if(!card){
      card=document.createElement('section');card.id='sgRSyntaxCard';card.className='sg-rpm-card';
      card.innerHTML='<div class="sg-rpm-section"><div><span class="sg-rpm-label">SINTAKS PEMBELAJARAN</span><h2 id="sgRSyntaxTitle">Langkah Model Pembelajaran</h2></div><span class="sg-rpm-muted">Disesuaikan otomatis dengan model</span></div><ol id="sgRSyntaxList" class="sg-rpm-syntax-list"></ol>';
      const result=room.querySelector('#sgRResult')?.closest('.sg-rpm-card');
      if(result)result.before(card);else room.querySelector('.sg-rpm-shell')?.appendChild(card);
    }
    card.querySelector('#sgRSyntaxTitle').textContent=`Sintaks ${model}`;
    card.querySelector('#sgRSyntaxList').innerHTML=getSteps(model).map((x,i)=>`<li><strong>Tahap ${i+1}</strong><span>${esc(x)}</span></li>`).join('');
    const result=room.querySelector('#sgRResult');
    if(result&&!result.dataset.sgSyntaxPatched){
      const observer=new MutationObserver(()=>patchResult(room));observer.observe(result,{childList:true,subtree:true});result.dataset.sgSyntaxPatched='1';
    }
    patchResult(room);
  };
  const patchResult=room=>{
    const result=room.querySelector('#sgRResult');if(!result)return;
    const model=room.querySelector('#sgRModel')?.value||'Problem Based Learning';
    const topic=room.querySelector('#sgRTopic')?.value?.trim()||'topik pembelajaran';
    const mode=room.querySelector('#sgRMode')?.value||'Tatap muka';
    if(!result.querySelector('[data-sg-rpm-syntax-result]')){
      const article=document.createElement('article');article.dataset.sgRpmSyntaxResult='1';article.innerHTML=`<h3>Sintaks Pembelajaran — ${esc(model)}</h3><p><strong>Konteks:</strong> ${esc(topic)} • <strong>Moda:</strong> ${esc(mode)}</p><ol>${getSteps(model).map((x,i)=>`<li><strong>Tahap ${i+1}.</strong> ${esc(x)}</li>`).join('')}</ol>`;result.prepend(article);
    }
  };
  const boot=()=>{
    const observer=new MutationObserver(()=>{const room=document.querySelector('.sg-rpm-room');if(room)inject(room)});
    observer.observe(document.body,{childList:true,subtree:true});
    const room=document.querySelector('.sg-rpm-room');if(room)inject(room);
    document.addEventListener('change',e=>{if(e.target?.id==='sgRModel'||e.target?.id==='sgRTopic'||e.target?.id==='sgRMode'){const room=e.target.closest('.sg-rpm-room');if(room)inject(room)}});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
