(()=>{
  const SYNTAX={
    'Problem Based Learning':['Orientasi peserta didik pada masalah','Mengorganisasi peserta didik untuk belajar','Membimbing penyelidikan individu/kelompok','Mengembangkan dan menyajikan hasil karya','Menganalisis dan mengevaluasi proses pemecahan masalah'],
    'Project Based Learning':['Menentukan pertanyaan mendasar','Mendesain perencanaan proyek','Menyusun jadwal dan pembagian tugas','Memonitor proses dan perkembangan proyek','Menguji dan mempresentasikan hasil proyek','Mengevaluasi pengalaman belajar'],
    'Discovery Learning':['Stimulation','Problem Statement','Data Collection','Data Processing','Verification','Generalization'],
    'Cooperative Learning':['Menyampaikan tujuan dan memotivasi','Menyajikan informasi atau stimulus','Mengorganisasi peserta didik dalam kelompok','Membimbing kolaborasi dan kerja kelompok','Evaluasi hasil belajar','Memberikan penghargaan'],
    'Inkuiri':['Orientasi','Merumuskan masalah','Merumuskan hipotesis','Mengumpulkan data','Menguji hipotesis','Menarik kesimpulan'],
    'Pembelajaran langsung':['Menyampaikan tujuan pembelajaran','Demonstrasi atau pemodelan','Latihan terbimbing','Cek pemahaman dan umpan balik','Latihan mandiri','Evaluasi dan tindak lanjut']
  };
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const getModel=room=>room?.querySelector('#sgRModel')?.value||'Problem Based Learning';
  const addSyntax=room=>{
    if(!room||room.dataset.sgRpmSyntaxV2==='1')return;
    const result=room.querySelector('#sgRResult');
    if(!result||!result.children.length)return;
    const model=getModel(room);
    const steps=SYNTAX[model]||[];
    if(!steps.length)return;
    const old=result.querySelector('[data-rpm-syntax-v2]');
    if(old)old.remove();
    const article=document.createElement('article');
    article.dataset.rpmSyntaxV2='1';
    article.innerHTML=`<h3>Sintaks ${esc(model)}</h3><ol>${steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`;
    result.appendChild(article);
    room.dataset.sgRpmSyntaxV2='1';
    try{
      const saved=JSON.parse(sessionStorage.getItem('siapguru_rpm_generated')||'null');
      if(saved){saved.syntax={model,steps};sessionStorage.setItem('siapguru_rpm_generated',JSON.stringify(saved));}
    }catch(_){ }
  };
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('#sgRBuild');
    if(!b)return;
    const room=b.closest('.sg-rpm-room');
    if(!room)return;
    queueMicrotask(()=>addSyntax(room));
  },false);
  document.addEventListener('change',e=>{
    if(e.target?.id!=='sgRModel')return;
    const room=e.target.closest('.sg-rpm-room');
    if(room){room.dataset.sgRpmSyntaxV2='';}
  },false);
})();