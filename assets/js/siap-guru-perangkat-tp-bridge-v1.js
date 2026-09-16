/* SIAP GURU — Perangkat TP bridge v1
   Menampilkan TP per BAB di kamar Perangkat.
   Prioritas: TP tersimpan yang cocok dengan BAB -> TP fallback berbasis BAB/Mapel.
   Tidak mengubah modul TP; hanya mengisi daftar TP di Perangkat saat data TP belum ada.
*/
(()=>{
  const ROOM='.sg-perangkat-room';
  const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
  const text=v=>String(v??'').trim();
  const norm=v=>text(v).toLowerCase().replace(/\s+/g,' ');
  const esc=s=>text(s).replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const selected=()=>{try{return JSON.parse(sessionStorage.getItem('siapguru_selected_topic')||'null')||{}}catch(_){return {}}};
  const master=()=>window.SiapGuruMasterBab?.getAll?.()||[];
  const currentTopic=room=>text(room?.querySelector('#sgPaTopic')?.value);
  const currentRow=room=>{const t=currentTopic(room),rows=master();return rows.find(r=>norm(r.bab)===norm(t))||null};
  const collect=()=>{
    const out=[];
    const pick=(x,...keys)=>{for(const k of keys){if(x&&x[k]!=null&&text(x[k]))return x[k]}return ''};
    const walk=(x,parentTopic='',d=0)=>{
      if(!x||d>12)return;
      if(Array.isArray(x)){x.forEach(v=>walk(v,parentTopic,d+1));return}
      if(typeof x!=='object')return;
      const topic=text(pick(x,'topic','topik','bab','babTopik','bab_topik','judulBab','judulTopik','chapter','unit'))||parentTopic;
      const tp=text(pick(x,'text','tp','tujuan','tujuanPembelajaran'));
      if(tp)out.push({topic,tp,jp:Number(pick(x,'jp','alokasiJp','alokasi','hours')||0)||0,element:text(pick(x,'element','elemen','cpElement')),period:text(pick(x,'period','waktu','minggu'))});
      ['items','rows','data','tp','lessons','chapters','topics','records'].forEach(k=>{if(x[k])walk(x[k],topic,d+1)});
    };
    ['siapguru_tp_draft','siapguru_atp_draft'].forEach(k=>walk(read(k)));
    return out;
  };
  const storedFor=(room,topic)=>{
    const t=norm(topic),all=collect(),sel=selected(),row=currentRow(room),idx=master().findIndex(r=>String(r.id)===String(row?.id))+1;
    const mapel=norm(room?.querySelector('#sgPaSubject')?.value||sel.mapel||sel.mapelName);
    return all.filter(r=>{
      const rt=norm(r.topic);if(!rt)return false;
      if(rt===t)return true;
      if(idx&&new RegExp(`^bab\\s*${idx}(?:\\b|\\s*[-—:])`,'i').test(rt))return true;
      return t&&rt.includes(t);
    }).filter(r=>!mapel||!r.mapel||norm(r.mapel)===mapel);
  };
  const fallback=(topic,mapel,row)=>{
    const t=text(topic),x=t.toLowerCase(),m=text(mapel).toLowerCase();
    if(m.includes('bahasa indonesia')){
      if(/hobi|ekspresi diri/.test(x))return [
        `mengidentifikasi informasi, kosakata, dan kata sifat yang berkaitan dengan hobi pada ${t}`,
        `menjelaskan cara mendeskripsikan hobi dengan pilihan kata, kata sifat, dan sinonim yang sesuai`,
        `menyusun teks deskripsi tentang hobi secara runtut dengan kosakata dan struktur kalimat yang tepat`,
        `mempresentasikan deskripsi tentang hobi secara lisan dengan jelas, runtut, dan percaya diri`,
        `menyunting teks deskripsi tentang hobi berdasarkan ketepatan isi, pilihan kata, struktur, dan penggunaan bahasa`,
        `merefleksikan penggunaan kosakata dan strategi komunikasi setelah menyusun serta mempresentasikan deskripsi hobi`
      ];
      if(/buku|membaca|literasi/.test(x))return [
        `mengidentifikasi informasi penting dari teks yang dibaca pada ${t}`,
        `menentukan ide pokok dan informasi pendukung berdasarkan teks`,
        `menyimpulkan isi bacaan dengan menggunakan bukti dari teks`,
        `menyampaikan tanggapan terhadap bacaan secara lisan atau tulisan dengan alasan yang sesuai`,
        `menulis respons atau rangkuman bacaan secara runtut dan menggunakan bahasa yang sesuai`,
        `merefleksikan strategi membaca yang membantu memahami isi teks`
      ];
      if(/cinta indonesia|indonesia|budaya|nusantara/.test(x))return [
        `mengidentifikasi informasi penting dan kosakata dalam teks tentang ${t}`,
        `menjelaskan makna kata dan informasi pendukung berdasarkan konteks bacaan`,
        `menemukan gagasan utama dan informasi rinci dari teks yang dipelajari`,
        `menyusun tanggapan atau tulisan tentang ${t} dengan struktur yang runtut`,
        `mempresentasikan hasil pemahaman tentang ${t} dengan bahasa yang jelas`,
        `merefleksikan strategi memahami dan menyampaikan informasi dari teks`
      ];
      if(/wirausaha|berwirausaha|usaha/.test(x))return [
        `mengidentifikasi informasi, kosakata, dan gagasan penting dalam teks tentang ${t}`,
        `menjelaskan langkah atau informasi utama berdasarkan teks yang dipelajari`,
        `menyusun ide atau teks sederhana yang berkaitan dengan ${t} secara runtut`,
        `menyampaikan gagasan tentang ${t} secara lisan atau tulisan dengan pilihan kata yang sesuai`,
        `menyunting hasil tulisan berdasarkan isi, struktur, dan penggunaan bahasa`,
        `merefleksikan penggunaan bahasa dan strategi komunikasi dalam kegiatan belajar`
      ];
      if(/bumi|sayangi/.test(x))return [
        `mengidentifikasi informasi dan kosakata penting dalam teks tentang ${t}`,
        `menjelaskan hubungan informasi utama dan informasi pendukung dari teks`,
        `menyimpulkan pesan atau gagasan utama berdasarkan bukti dalam teks`,
        `menyusun tanggapan atau ajakan terkait ${t} dengan bahasa yang sesuai`,
        `mempresentasikan hasil pemahaman atau produk bahasa tentang ${t}`,
        `merefleksikan strategi berbahasa yang digunakan untuk menyampaikan pesan secara efektif`
      ];
    }
    if(m.includes('matematika')){
      if(/pecahan|desimal/.test(x))return ['mengidentifikasi bentuk dan nilai pecahan atau desimal pada '+t,'membandingkan dan mengurutkan pecahan atau desimal menggunakan representasi yang sesuai','melakukan operasi atau konversi pecahan dan desimal sesuai situasi yang diberikan','menyelesaikan masalah sehari-hari yang melibatkan pecahan atau desimal','menjelaskan strategi dan hasil penyelesaian masalah pecahan atau desimal','merefleksikan cara yang efektif untuk memeriksa kebenaran hasil'];
      if(/kpk|fpb/.test(x))return ['mengidentifikasi faktor dan kelipatan dari bilangan pada '+t,'menentukan KPK atau FPB dari bilangan yang diberikan','menggunakan KPK atau FPB untuk menyelesaikan masalah kontekstual','menganalisis strategi penyelesaian masalah yang melibatkan KPK atau FPB','menjelaskan langkah penyelesaian dengan representasi yang sesuai','merefleksikan ketepatan strategi dan hasil penyelesaian'];
    }
    if(m.includes('ipas')){
      if(/cahaya|bunyi/.test(x))return ['mengidentifikasi sumber dan sifat cahaya atau bunyi pada '+t,'menjelaskan hubungan antara sumber dan peristiwa yang diamati','melakukan percobaan sederhana untuk mengamati sifat cahaya atau bunyi','menganalisis hasil pengamatan berdasarkan bukti','menyajikan hasil percobaan secara lisan, tulisan, atau visual','merefleksikan manfaat pemahaman tentang cahaya atau bunyi dalam kehidupan'];
      if(/bumi|lingkungan|ekosistem|harmoni/.test(x))return ['mengidentifikasi proses atau komponen lingkungan pada '+t,'menjelaskan hubungan antarkomponen dalam lingkungan','mengamati atau menggunakan data sederhana tentang kondisi lingkungan','menganalisis penyebab dan dampak perubahan lingkungan','menyajikan hasil pengamatan atau analisis tentang lingkungan','merefleksikan tindakan nyata untuk menjaga lingkungan'];
    }
    return [
      `mengidentifikasi konsep, unsur, atau informasi penting pada ${t}`,
      `menjelaskan hubungan antarkonsep pada ${t} dengan contoh yang relevan`,
      `menerapkan pemahaman tentang ${t} melalui latihan atau situasi nyata yang sesuai`,
      `menganalisis informasi atau hasil kegiatan pada ${t} berdasarkan bukti`,
      `mengomunikasikan hasil pemahaman tentang ${t} melalui lisan, tulisan, visual, atau unjuk kerja`,
      `merefleksikan proses belajar pada ${t} dan menentukan tindak lanjut`
    ];
  };
  const render=()=>{
    const room=document.querySelector(ROOM);if(!room)return;
    const topic=currentTopic(room);if(!topic||topic==='SEMUA BAB / 1 TAHUN')return;
    const list=room.querySelector('#sgPaTpList');if(!list)return;
    const row=currentRow(room),sel=selected(),mapel=text(room.querySelector('#sgPaSubject')?.value||sel.mapel||sel.mapelName);
    const actual=storedFor(room,topic).filter(r=>r.tp);
    if(actual.length){
      list.innerHTML=actual.slice(0,8).map((r,i)=>`<div class="sg-pa-item"><div><strong>TP ${i+1}. ${esc(r.tp)}</strong><small>Elemen: ${esc(r.element||'-')} · ${r.jp||0} JP${r.period?' · '+esc(r.period):''}</small></div></div>`).join('');
      return;
    }
    const patterns=fallback(topic,mapel,row),total=Math.max(patterns.length,Number(row?.jp)||6),base=Math.floor(total/patterns.length),rem=total%patterns.length;
    const els=['Menyimak','Membaca dan Memirsa','Berbicara dan Mempresentasikan','Menulis'];
    list.innerHTML=patterns.map((p,i)=>`<div class="sg-pa-item"><div><strong>TP ${i+1}. Peserta didik mampu ${esc(p)}.</strong><small>Elemen: ${els[i%els.length]} · ${base+(i<rem?1:0)} JP</small></div></div>`).join('');
  };
  const boot=()=>{render();if(window.__sgPerangkatTpBridgeWatch)return;window.__sgPerangkatTpBridgeWatch=1;new MutationObserver(()=>render()).observe(document.body,{childList:true,subtree:true});document.addEventListener('change',e=>{if(e.target?.id==='sgPaTopic'||e.target?.id==='sgPaSubject')setTimeout(render,20)},true);document.addEventListener('input',e=>{if(e.target?.id==='sgPaTopic'||e.target?.id==='sgPaSubject')setTimeout(render,20)},true);setInterval(render,700)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();