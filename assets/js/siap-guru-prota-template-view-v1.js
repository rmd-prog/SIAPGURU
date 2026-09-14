(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const read=room=>[...room.querySelectorAll('#sgProtaList tr')].filter(r=>r.querySelector('[data-field="text"]')).map(r=>({text:r.querySelector('[data-field="text"]')?.value||'',element:r.querySelector('[data-field="element"]')?.value||'-',semester:r.querySelector('[data-field="semester"]')?.value==='2'?'2':'1',jp:Number(r.querySelector('[data-field="jp"]')?.value)||0,period:r.querySelector('[data-field="period"]')?.value||''}));
  const subject=()=>String(document.querySelector('#sgProtaSubject')?.value||document.querySelector('[data-prota-subject]')?.textContent||'').toLowerCase();
  const pick=(text,element)=>`${text} ${element}`.toLowerCase();
  const assessment=(x,i,total,sem)=>{
    const t=pick(x.text,x.element);
    if(/sumatif|asesmen akhir|ujian|sas|akhir semester/.test(t))return 'Sumatif — tes tertulis/praktik sesuai tujuan';
    if(/proyek|projek|produk|karya/.test(t))return 'Sumatif proyek — produk & presentasi';
    if(/presentasi|menyajikan|poster|infografis/.test(t))return 'Formatif — presentasi/produk & rubrik';
    if(/praktik|simulasi|unjuk kerja|gerak|percobaan|eksperimen/.test(t))return 'Formatif — observasi & unjuk kerja';
    if(/menulis|membaca|menyimak|berbicara|teks|cerita/.test(t))return 'Formatif — tanya jawab, LKPD & produk';
    if(/bilangan|pecahan|operasi|aljabar|pengukuran|geometri|data|diagram|matematika/.test(t))return 'Formatif — latihan soal & pemecahan masalah';
    if(i===0)return 'Diagnostik awal + formatif — tanya jawab/LKPD';
    if(i>=Math.max(0,total-2))return sem==='Semester 2'?'Sumatif/penguatan — tes atau unjuk kerja':'Sumatif lingkup materi — tes tertulis/praktik';
    return 'Formatif — observasi, tanya jawab & LKPD';
  };
  const activity=(x,i,total,sem)=>{
    const t=pick(x.text,x.element),s=subject();
    let a='Mengamati konteks, mengeksplorasi konsep, berdiskusi, berlatih, dan melakukan refleksi.';
    if(/matematika|bilangan|aljabar|pengukuran|geometri|data|diagram|pecahan|operasi/.test(t)||/matematika/.test(s))a='Eksplorasi contoh/konteks, pemodelan terbimbing, latihan bertahap, pemecahan masalah, dan refleksi.';
    else if(/bahasa indonesia|menyimak|membaca|berbicara|menulis|teks|cerita/.test(t)||/bahasa indonesia/.test(s))a='Menyimak/membaca contoh, menemukan informasi penting, berdiskusi, berlatih, mempresentasikan hasil, dan refleksi.';
    else if(/ip|ipas|makhluk|energi|lingkungan|benda|data pengamatan|percobaan/.test(t)||/ipas/.test(s))a='Mengamati fenomena, merumuskan pertanyaan, melakukan penyelidikan sederhana, mengolah temuan, menyimpulkan, dan refleksi.';
    else if(/pancasila|uud|norma|hak|kewajiban|bhinneka|nkri|musyawarah/.test(t)||/pancasila/.test(s))a='Mengamati kasus/konteks, berdiskusi, menghubungkan dengan kehidupan nyata, simulasi/penerapan, presentasi, dan refleksi.';
    else if(/pjok|gerak|olahraga|kebugaran|permainan/.test(t)||/pjok/.test(s))a='Pemanasan, demonstrasi gerak, latihan bertahap, praktik berpasangan/kelompok, umpan balik, dan refleksi.';
    else if(/seni|musik|rupa|tari|teater|karya/.test(t)||/seni/.test(s))a='Mengamati karya, mengeksplorasi teknik, mencoba dan mencipta karya, memberi apresiasi, mempresentasikan, dan refleksi.';
    else if(/bahasa inggris|english|speaking|reading|listening|writing/.test(t)||/bahasa inggris/.test(s))a='Mengamati contoh bahasa, latihan terpandu, praktik berpasangan/kelompok, penggunaan dalam konteks nyata, dan refleksi.';
    if(/penguatan|review|latihan soal|remedial|pengayaan/.test(t))a='Meninjau kembali konsep/TP, latihan terarah, pendampingan sesuai kebutuhan, umpan balik, dan refleksi.';
    if(/proyek|projek/.test(t))a='Menentukan masalah/tema, merancang langkah kerja, berkolaborasi menghasilkan produk, mempresentasikan hasil, dan refleksi.';
    if(/sumatif|sas|akhir semester|ujian/.test(t))a='Review terarah, pelaksanaan asesmen terjadwal, pembahasan hasil, tindak lanjut, dan refleksi.';
    return a;
  };
  const table=(rows,title,sem)=>{
    const s=document.createElement('section');s.className='sg-prota-template-semester';
    const totalJp=rows.reduce((n,x)=>n+x.jp,0);
    s.innerHTML=`<div class="sg-prota-template-title"><span>${title}</span><strong>${totalJp} JP</strong></div><div class="sg-prota-template-scroll"><table class="sg-prota-template-table"><thead><tr><th>Minggu</th><th>Materi / Pokok Bahasan</th><th>Tujuan Pembelajaran</th><th>Alokasi Waktu</th><th>Asesmen</th><th>Kegiatan Pembelajaran</th></tr></thead><tbody></tbody><tfoot><tr><th colspan="3">Jumlah Alokasi Waktu ${sem}</th><th>${totalJp} JP</th><th colspan="2"></th></tr></tfoot></table></div>`;
    const b=s.querySelector('tbody');
    if(!rows.length){b.innerHTML='<tr><td colspan="6">Belum ada TP pada semester ini.</td></tr>';return s}
    rows.forEach((x,i)=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${esc(x.period||`Minggu ke-${i+1}`)}</td><td>${esc(x.element||'-')}</td><td>${esc(x.text||'-')}</td><td>${x.jp} JP</td><td>${esc(assessment(x,i,rows.length,sem))}</td><td>${esc(activity(x,i,rows.length,sem))}</td>`;b.appendChild(tr)});
    return s
  };
  const build=room=>{
    const items=read(room);if(!items.length)return;
    const wrap=room.querySelector('.sg-prota-table-wrap');if(!wrap)return;
    wrap.style.setProperty('display','none','important');
    const card=wrap.closest('.sg-prota-card');
    const old=card?.querySelector('[data-prota-template-v5]');if(old)old.remove();
    const h2=card?.querySelector('.sg-prota-section h2');if(h2)h2.textContent='Rincian Program Tahunan';
    const help=card?.querySelector('.sg-prota-help');if(help)help.textContent='Program tahunan disajikan terpisah berdasarkan Semester 1 dan Semester 2. Asesmen dan kegiatan pembelajaran dibuat lebih kontekstual berdasarkan materi/TP.';
    const v=document.createElement('div');v.dataset.protaTemplateV5='1';v.className='sg-prota-template-main';
    v.append(table(items.filter(x=>x.semester==='1'),'D. RINCIAN PROGRAM TAHUNAN — SEMESTER 1','Semester 1'),table(items.filter(x=>x.semester==='2'),'E. RINCIAN PROGRAM TAHUNAN — SEMESTER 2','Semester 2'));
    wrap.parentNode.insertBefore(v,wrap)
  };
  const style=()=>{if(document.getElementById('sg-prota-template-v5-css'))return;const s=document.createElement('style');s.id='sg-prota-template-v5-css';s.textContent=`.sg-prota-template-main{margin-top:18px}.sg-prota-template-semester{margin:0 0 24px;border:1px solid #dfe5ec;border-radius:12px;background:#fff;overflow:hidden}.sg-prota-template-title{display:flex;justify-content:space-between;gap:12px;padding:12px 14px;background:#f7f9fc;border-bottom:1px solid #dfe5ec;font-weight:700}.sg-prota-template-title strong{font-size:12px}.sg-prota-template-scroll{overflow-x:auto}.sg-prota-template-table{width:100%;min-width:900px;border-collapse:collapse;table-layout:fixed}.sg-prota-template-table th,.sg-prota-template-table td{border:1px solid #d8dee6;padding:9px 10px;vertical-align:top;font-size:12px;line-height:1.45}.sg-prota-template-table th{background:#f1f4f8}.sg-prota-template-table th:nth-child(1){width:14%}.sg-prota-template-table th:nth-child(2){width:18%}.sg-prota-template-table th:nth-child(3){width:28%}.sg-prota-template-table th:nth-child(4){width:11%}.sg-prota-template-table th:nth-child(5){width:15%}.sg-prota-template-table th:nth-child(6){width:19%}.sg-prota-template-table tfoot th{background:#f7f9fc}`;document.head.appendChild(s)};
  const boot=room=>{if(room.dataset.protaTemplateV5Boot)return;room.dataset.protaTemplateV5Boot='1';style();setTimeout(()=>build(room),250);room.addEventListener('input',()=>setTimeout(()=>build(room),80),true);room.addEventListener('change',()=>setTimeout(()=>build(room),80),true)};
  const scan=()=>{const room=document.querySelector('.sg-prota-room');if(room){boot(room);return true}return false};
  if(!scan()){const obs=new MutationObserver(()=>{if(scan())obs.disconnect()});obs.observe(document.body,{childList:true,subtree:true})}
})();