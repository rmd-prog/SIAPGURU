/* SIAP GURU — TP AUTO adaptive bridge v2
   Loaded only when TP is opened. Resolves Master BAB IDs to real topic titles.
   Does not touch ATP, RPM, Dashboard, Login, D1/Worker, or student data.
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
  const resolveTopic=(raw,obj={})=>{
    const candidate=esc(raw)||esc(obj.bab);
    const bank=window.SiapGuruMasterBab?.getAll?.()||[];
    const hit=bank.find(x=>String(x.id)===candidate);
    if(hit?.bab)return esc(hit.bab);
    if(/^seed-[a-z0-9-]+$/i.test(candidate)){
      const fallback=bank.find(x=>String(x.id)===String(obj.id));
      if(fallback?.bab)return esc(fallback.bab);
    }
    return candidate;
  };
  const topicContext=(topic,subject)=>{
    const t=topic.toLowerCase();
    if(subject==='IPAS'&&/harmoni|ekosistem|ekosistem/.test(t))return {
      focus:'keseimbangan ekosistem, hubungan antarmakhluk hidup, serta keterkaitan komponen biotik dan abiotik',
      verbs:['mengidentifikasi komponen biotik dan abiotik yang terdapat dalam ekosistem','menjelaskan hubungan antara makhluk hidup dan lingkungannya dalam menjaga keseimbangan ekosistem','menganalisis contoh hubungan antarmakhluk hidup seperti rantai atau jaring-jaring makanan','menerapkan pemahaman tentang keseimbangan ekosistem melalui analisis situasi di lingkungan sekitar','menyajikan hasil pengamatan tentang hubungan antarkomponen ekosistem dan menjelaskan dampaknya']
    };
    return {focus:`konsep utama, hubungan, dan penerapan pada topik ${topic}`,verbs:[
      `mengidentifikasi konsep, unsur, atau informasi penting pada ${topic}`,
      `menjelaskan hubungan antarkonsep pada ${topic} dengan contoh yang relevan`,
      `menerapkan pemahaman tentang ${topic} melalui latihan atau situasi nyata yang sesuai`,
      `menganalisis informasi atau hasil kegiatan pada ${topic} dan memberikan alasan berdasarkan bukti`,
      `mengomunikasikan hasil pemahaman tentang ${topic} melalui lisan, tulisan, visual, atau unjuk kerja`,
      `merefleksikan proses belajar pada ${topic} dan menentukan tindak lanjut`
    ]};
  };
  const build=()=>{
    const room=document.querySelector('.sg-tp-room');
    if(!room)return;
    const selectedTopic=selected();
    const topic=resolveTopic(room.querySelector('#sgTpTopic')?.value||selectedTopic.bab||saved().topic,selectedTopic)||'Topik pembelajaran';
    const subject=esc(room.querySelector('#sgTpSubject')?.value)||esc(selectedTopic.mapel)||esc(saved().subject)||esc(atp().subject)||'mata pelajaran';
    const phase=esc(room.querySelector('#sgTpPhase')?.value)||esc(selectedTopic.fase)||esc(saved().phase);
    const klass=esc(room.querySelector('#sgTpClass')?.value)||esc(selectedTopic.kelas)||esc(saved().class);
    const semester=String(room.querySelector('#sgTpSemester')?.value||selectedTopic.semester||saved().semester||'1');
    const a=atp();
    const atpItems=Array.isArray(a.items)?a.items.filter(x=>esc(x.text||x.tp)):[];
    const totalJp=Number(selectedTopic.jp)||Number(saved().totalJp)||Number(a.totalJp)||atpItems.reduce((sum,x)=>sum+(Number(x.jp)||0),0)||4;
    const count=countForJp(totalJp);
    const jp=distribute(totalJp,count);
    const els=getEls(subject);
    const context=topicContext(topic,subject);
    const source=atpItems.length?atpItems:[];
    const items=context.verbs.slice(0,count).map((verb,i)=>({
      id:`tp-auto-${Date.now()}-${i}`,
      text:`Peserta didik mampu ${verb} dalam pembelajaran ${subject}${phase?` Fase ${phase}`:''}${klass?` Kelas ${klass}`:''}.`,
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
    if(!b||!document.querySelector('.sg-tp-room'))return;
    e.preventDefault();e.stopImmediatePropagation();build();
  },true);
})();
