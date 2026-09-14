/* SIAP GURU — TP AUTO adaptive bridge
   Loaded only when TP is opened. Does not touch ATP, RPM, Dashboard, Login, D1/Worker, or student data.
*/
(()=>{
  if(window.__sgTpAutoV1)return;
  window.__sgTpAutoV1=1;
  const getJSON=(key,store=localStorage)=>{try{return JSON.parse(store.getItem(key)||'null')}catch(_){return null}};
  const esc=s=>String(s??'').trim();
  const selected=()=>getJSON('siapguru_selected_topic',sessionStorage)||{};
  const saved=()=>getJSON('siapguru_tp_draft')||{};
  const atp=()=>getJSON('siapguru_atp_draft')||{};
  const countForJp=jp=>{const n=Math.max(1,Math.round(Number(jp)||0));if(n<=2)return n;if(n<=4)return 3;if(n<=6)return 4;if(n<=9)return 5;return 6};
  const distribute=(total,count)=>{const t=Math.max(count,Math.round(Number(total)||count));const base=Math.floor(t/count),rem=t%count;return Array.from({length:count},(_,i)=>Math.max(1,base+(i<rem?1:0)))};
  const elements={
    'Pendidikan Pancasila':['Pancasila','UUD NRI 1945','Bhinneka Tunggal Ika','NKRI'],
    'Bahasa Indonesia':['Menyimak','Membaca dan Memirsa','Berbicara dan Mempresentasikan','Menulis'],
    'Matematika':['Bilangan','Aljabar','Pengukuran','Geometri','Analisis Data dan Peluang'],
    'IPAS':['Pemahaman IPAS','Keterampilan Proses'],
    'PJOK':['Terampil Bergerak','Belajar Melalui Gerak','Bergaya Hidup Aktif','Memilih Hidup yang Menyehatkan'],
    'Seni Musik':['Mengalami','Merefleksikan','Berpikir dan Bekerja Artistik','Menciptakan','Berdampak'],
    'Seni Rupa':['Mengalami','Merefleksikan','Berpikir dan Bekerja Artistik','Menciptakan','Berdampak'],
    'Seni Tari':['Mengalami','Merefleksikan','Berpikir dan Bekerja Artistik','Menciptakan','Berdampak'],
    'Seni Teater':['Mengalami','Merefleksikan','Berpikir dan Bekerja Artistik','Menciptakan','Berdampak'],
    'Bahasa Inggris':['Menyimak-Berbicara','Membaca-Memirsa','Menulis-Mempresentasikan'],
    'Informatika':['Berpikir Komputasional','Literasi Digital','Literasi dan Etika Kecerdasan Artifisial','Pemanfaatan dan Pengembangan Kecerdasan Artifisial']
  };
  const getEls=mapel=>elements[mapel]||['Elemen CP Agama dan Budi Pekerti'];
  const build=()=>{
    const room=document.querySelector('.sg-tp-room');
    if(!room)return;
    const topic=esc(room.querySelector('#sgTpTopic')?.value)||esc(selected().bab)||esc(saved().topic)||'Topik pembelajaran';
    const subject=esc(room.querySelector('#sgTpSubject')?.value)||esc(selected().mapel)||esc(saved().subject)||esc(atp().subject)||'mata pelajaran';
    const phase=esc(room.querySelector('#sgTpPhase')?.value)||esc(selected().fase)||esc(saved().phase);
    const klass=esc(room.querySelector('#sgTpClass')?.value)||esc(selected().kelas)||esc(saved().class);
    const semester=String(room.querySelector('#sgTpSemester')?.value||selected().semester||saved().semester||'1');
    const a=atp();
    const selectedTopic=selected();
    const atpItems=Array.isArray(a.items)?a.items.filter(x=>esc(x.text||x.tp)):[];
    const totalJp=Number(selectedTopic.jp)||Number(saved().totalJp)||Number(a.totalJp)||atpItems.reduce((sum,x)=>sum+(Number(x.jp)||0),0)||4;
    const count=countForJp(totalJp);
    const jp=distribute(totalJp,count);
    const els=getEls(subject);
    const source=atpItems.length?atpItems:[];
    const context=source.map(x=>esc(x.text||x.tp)).filter(Boolean).join(' ');
    const verbs=[
      'mengidentifikasi konsep atau informasi kunci',
      'menjelaskan hubungan antarkonsep berdasarkan contoh yang relevan',
      'menerapkan pemahaman melalui latihan atau situasi yang sesuai',
      'mengomunikasikan hasil pemahaman melalui lisan, tulisan, visual, atau unjuk kerja',
      'menganalisis hasil kerja dan memberikan alasan berdasarkan bukti yang ditemukan',
      'merefleksikan proses belajar dan menentukan perbaikan atau tindak lanjut'
    ];
    const items=verbs.slice(0,count).map((verb,i)=>({
      id:`tp-auto-${Date.now()}-${i}`,
      text:`Peserta didik mampu ${verb} pada ${topic} dalam pembelajaran ${subject}${phase?` Fase ${phase}`:''}${klass?` Kelas ${klass}`:''}.`,
      element:esc(source[i]?.element)||els[i%els.length],
      cp:esc(source[i]?.cp||source[i]?.cpText),
      jp:jp[i],
      acdId:selectedTopic.id||a.acdId||a.id||saved().acdId||''
    }));
    const draft={...saved(),name:saved().name||a.name||'',subject,semester,phase,class:klass,topic,totalJp,acdId:selectedTopic.id||a.acdId||a.id||saved().acdId||'',items};
    localStorage.setItem('siapguru_tp_draft',JSON.stringify(draft));
    const back=room.querySelector('.sg-room-back');
    const nav=[...document.querySelectorAll('.sg-topnav-link')].find(x=>x.textContent.trim()==='TP');
    if(back)back.click();
    setTimeout(()=>nav?.click(),40);
  };
  document.addEventListener('click',e=>{
    const b=e.target instanceof Element?e.target.closest('#sgTpGenerate'):null;
    if(!b)return;
    if(!document.querySelector('.sg-tp-room'))return;
    e.preventDefault();
    e.stopImmediatePropagation();
    build();
  },true);
})();