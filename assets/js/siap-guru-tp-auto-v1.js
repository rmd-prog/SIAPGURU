/* SIAP GURU — TP AUTO FINAL v4
   Generator TP berbasis substansi BAB/Topik.
   Scoped only to TP flow. Does not touch ATP, RPM, Dashboard, Login, D1/Worker, or student data.
*/
(()=>{
  if(window.__sgTpAutoV4)return;
  window.__sgTpAutoV4=1;
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
    let candidate=esc(raw)||esc(obj.bab);
    const bank=window.SiapGuruMasterBab?.getAll?.()||[];
    const hit=bank.find(x=>String(x.id)===candidate);
    if(hit?.bab)return esc(hit.bab);
    if(/^seed-[a-z0-9-]+$/i.test(candidate)){
      const fallback=bank.find(x=>String(x.id)===String(obj.id));
      if(fallback?.bab)return esc(fallback.bab);
      const byMeta=bank.find(x=>String(x.mapel)===String(obj.mapel)&&String(x.kelas)===String(obj.kelas)&&String(x.semester)===String(obj.semester)&&String(x.id)===candidate);
      if(byMeta?.bab)return esc(byMeta.bab);
    }
    return /^seed-/i.test(candidate)?'Topik pembelajaran':candidate;
  };

  const contextFor=(topic,subject)=>{
    const t=topic.toLowerCase();
    if(subject==='IPAS'){
      if(/harmoni|ekosistem|rantai makanan|jaring makanan/.test(t))return [
        'mengidentifikasi komponen biotik dan abiotik serta perannya dalam ekosistem',
        'menjelaskan hubungan antarmakhluk hidup dan lingkungannya dalam menjaga keseimbangan ekosistem',
        'menganalisis contoh rantai atau jaring-jaring makanan berdasarkan hubungan antarmakhluk hidup',
        'menganalisis perubahan pada salah satu komponen ekosistem dan memprediksi dampaknya terhadap keseimbangan ekosistem',
        'menyajikan hasil pengamatan tentang hubungan antarkomponen ekosistem serta upaya menjaga keseimbangannya',
        'merefleksikan tindakan yang dapat dilakukan untuk menjaga keseimbangan ekosistem di lingkungan sekitar'
      ];
      if(/cahaya|bunyi|mendengar/.test(t))return [
        `mengidentifikasi sumber dan sifat cahaya atau bunyi yang ditemukan pada ${topic}`,
        `menjelaskan hubungan antara sumber cahaya atau bunyi dengan peristiwa yang diamati`,
        `melakukan percobaan sederhana untuk mengamati sifat cahaya atau bunyi`,
        `menganalisis hasil pengamatan tentang cahaya atau bunyi berdasarkan bukti`,
        `menyajikan hasil percobaan tentang cahaya atau bunyi secara lisan, tulisan, atau visual`,
        `merefleksikan manfaat pemahaman tentang cahaya atau bunyi dalam kehidupan sehari-hari`
      ];
      if(/magnet|listrik|teknologi/.test(t))return [
        `mengidentifikasi sifat magnet, sumber listrik, atau teknologi yang berkaitan dengan ${topic}`,
        `menjelaskan cara kerja sederhana magnet atau rangkaian listrik berdasarkan hasil pengamatan`,
        `melakukan percobaan sederhana untuk menunjukkan gejala magnet atau listrik`,
        `menganalisis pemanfaatan magnet, listrik, atau teknologi dalam kehidupan sehari-hari`,
        `menyajikan hasil percobaan atau kajian tentang pemanfaatan magnet dan listrik`,
        `merefleksikan penggunaan teknologi secara aman, tepat, dan bertanggung jawab`
      ];
      if(/bumi|antariksa|iklim|lingkungan/.test(t))return [
        `mengidentifikasi bagian, proses, atau perubahan pada lingkungan Bumi yang dipelajari melalui ${topic}`,
        `menjelaskan hubungan antara proses alam dan kehidupan manusia`,
        `mengamati atau menggunakan data sederhana untuk mengenali perubahan lingkungan`,
        `menganalisis penyebab dan dampak perubahan lingkungan berdasarkan informasi yang tersedia`,
        `menyajikan hasil pengamatan atau analisis tentang kondisi lingkungan dan upaya menjaganya`,
        `merefleksikan tindakan nyata untuk menjaga lingkungan berdasarkan hasil belajar`
      ];
    }
    if(subject==='Matematika'){
      if(/kpk|fpb/.test(t))return [
        `mengidentifikasi faktor dan kelipatan dari bilangan pada ${topic}`,
        `menentukan faktor persekutuan terbesar dan kelipatan persekutuan terkecil dari bilangan yang diberikan`,
        `menggunakan KPK atau FPB untuk menyelesaikan masalah kontekstual sederhana`,
        `menganalisis strategi penyelesaian masalah yang melibatkan KPK atau FPB`,
        `menjelaskan langkah penyelesaian masalah KPK atau FPB dengan representasi yang sesuai`,
        `merefleksikan ketepatan strategi dan hasil penyelesaian masalah`
      ];
      if(/pecahan|desimal/.test(t))return [
        `mengidentifikasi bentuk dan nilai pecahan atau desimal pada ${topic}`,
        `membandingkan dan mengurutkan pecahan atau desimal menggunakan representasi yang sesuai`,
        `melakukan operasi atau konversi pecahan dan desimal sesuai situasi yang diberikan`,
        `menyelesaikan masalah sehari-hari yang melibatkan pecahan atau desimal`,
        `menjelaskan strategi dan hasil penyelesaian masalah pecahan atau desimal`,
        `merefleksikan cara yang paling efektif untuk memeriksa kebenaran hasil`
      ];
      if(/bangun|sudut|keliling|luas|volume|lingkaran/.test(t))return [
        `mengidentifikasi sifat atau unsur geometri yang terdapat pada ${topic}`,
        `menjelaskan hubungan antarunsur bangun atau pengukuran yang dipelajari`,
        `mengukur atau menghitung besaran geometri menggunakan cara yang tepat`,
        `menyelesaikan masalah kontekstual yang berkaitan dengan ${topic}`,
        `menyajikan langkah dan hasil penyelesaian masalah geometri dengan representasi yang sesuai`,
        `merefleksikan ketepatan strategi dan hasil pengukuran atau perhitungan`
      ];
    }
    if(subject==='Pendidikan Pancasila'&&/keragaman|budaya|berbeda/.test(t))return [
      `mengidentifikasi bentuk keragaman budaya di lingkungan sekitar melalui ${topic}`,
      `menjelaskan pentingnya menghargai perbedaan budaya sebagai bagian dari kehidupan bersama`,
      `menunjukkan sikap menghargai keragaman dalam kegiatan sehari-hari`,
      `menganalisis contoh perilaku yang memperkuat persatuan di tengah keragaman`,
      `menyajikan contoh tindakan yang mencerminkan penghargaan terhadap keragaman budaya`,
      `merefleksikan sikap yang perlu dipertahankan untuk hidup rukun dalam keberagaman`
    ];
    if(subject==='Bahasa Indonesia'){
      if(/buku|membaca|literasi/.test(t))return [
        `mengidentifikasi informasi penting dari teks yang dibaca pada ${topic}`,
        `menentukan ide pokok dan informasi pendukung berdasarkan teks`,
        `menyimpulkan isi bacaan dengan menggunakan bukti dari teks`,
        `menyampaikan tanggapan terhadap bacaan secara lisan atau tulisan dengan alasan yang sesuai`,
        `menulis respons atau rangkuman bacaan secara runtut dan menggunakan bahasa yang sesuai`,
        `merefleksikan strategi membaca yang membantu memahami isi teks`
      ];
    }
    return [
      `mengidentifikasi konsep, unsur, atau informasi penting pada ${topic}`,
      `menjelaskan hubungan antarkonsep pada ${topic} dengan contoh yang relevan`,
      `menerapkan pemahaman tentang ${topic} melalui latihan atau situasi nyata yang sesuai`,
      `menganalisis informasi atau hasil kegiatan pada ${topic} dan memberikan alasan berdasarkan bukti`,
      `mengomunikasikan hasil pemahaman tentang ${topic} melalui lisan, tulisan, visual, atau unjuk kerja`,
      `merefleksikan proses belajar pada ${topic} dan menentukan tindak lanjut`
    ];
  };

  const clean=(text,topic)=>{
    let s=esc(text).replace(/\s+/g,' ');
    if(/^seed-[a-z0-9-]+$/i.test(s))s='Topik pembelajaran';
    return s.replace(new RegExp(`\\bseed-[a-z0-9-]+\\b`,'ig'),topic);
  };
  const build=()=>{
    const room=document.querySelector('.sg-tp-room');
    if(!room)return;
    const sel=selected(), old=saved(), a=atp();
    /* Source priority is deliberate: current TP room/selected BAB first,
       explicit ATP topic second. Never resurrect an unrelated old TP draft topic. */
    const roomTopic=esc(room.querySelector('#sgTpTopic')?.value);
    const selectedTopic=resolveTopic(sel.bab,sel);
    const atpTopic=resolveTopic(a.topic,a);
    const topic=resolveTopic(roomTopic,sel)||selectedTopic||atpTopic||'Topik pembelajaran';
    const subject=esc(room.querySelector('#sgTpSubject')?.value)||esc(sel.mapel)||esc(old.subject)||esc(a.subject)||'mata pelajaran';
    const phase=esc(room.querySelector('#sgTpPhase')?.value)||esc(sel.fase)||esc(old.phase);
    const klass=esc(room.querySelector('#sgTpClass')?.value)||esc(sel.kelas)||esc(old.class);
    const semester=String(room.querySelector('#sgTpSemester')?.value||sel.semester||old.semester||'1');
    const atpItems=Array.isArray(a.items)?a.items.filter(x=>esc(x.text||x.tp)):[];
    const totalJp=Number(sel.jp)||Number(old.totalJp)||Number(a.totalJp)||atpItems.reduce((sum,x)=>sum+(Number(x.jp)||0),0)||4;
    const count=countForJp(totalJp), jp=distribute(totalJp,count), els=getEls(subject), patterns=contextFor(topic,subject);
    const items=patterns.slice(0,count).map((verb,i)=>({
      id:`tp-auto-${Date.now()}-${i}`,
      text:clean(`Peserta didik mampu ${verb}${phase?` dalam pembelajaran ${subject} Fase ${phase}`:` dalam pembelajaran ${subject}`}${klass?` Kelas ${klass}`:''}.`,topic),
      element:esc(atpItems[i]?.element)||els[i%els.length],
      cp:esc(atpItems[i]?.cp||atpItems[i]?.cpText),
      jp:jp[i],
      acdId:sel.id||a.acdId||a.id||old.acdId||''
    }));
    const draft={...old,name:old.name||a.name||'',subject,semester,phase,class:klass,topic,totalJp,acdId:sel.id||a.acdId||a.id||old.acdId||'',items};
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
