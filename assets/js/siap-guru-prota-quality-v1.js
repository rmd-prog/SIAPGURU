(()=>{
/* SIAP GURU — PROTA quality bridge v2
   Mengisi CP/Elemen dan Keterangan pada PROTA dari konteks BAB/TP.
   Guarded: tidak membuat MutationObserver global tanpa batas.
   Tidak menyentuh Login, Dashboard, D1/Worker, Data Siswa, atau RPM FINAL. */
const norm=s=>String(s||'').toLowerCase();
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
 'Bahasa Inggris':['Menyimak-Berbicara','Membaca-Memirsa','Menulis-Mempresentasikan']
};
const pick=(subject,text,i)=>{const s=norm(subject),t=norm(text),a=elements[subject]||[];if(!a.length)return 'CP terintegrasi';if(s==='matematika'){if(/kpk|fpb|bilangan|pecahan|desimal|persen|operasi|uang/.test(t))return 'Bilangan';if(/pola|persamaan|nilai yang belum|aljabar/.test(t))return 'Aljabar';if(/ukur|pengukuran|keliling|luas|volume|berat|panjang|sudut/.test(t))return 'Pengukuran';if(/bangun|geometri|segitiga|segiempat|lingkaran|simetri|koordinat/.test(t))return 'Geometri';if(/data|diagram|tabel|peluang|statistik/.test(t))return 'Analisis Data dan Peluang'}
if(s==='pendidikan pancasila'){if(/aturan|norma|hak|kewajiban|uud|musyawarah/.test(t))return 'UUD NRI 1945';if(/keberagaman|budaya|suku|bahasa|agama|bhinneka/.test(t))return 'Bhinneka Tunggal Ika';if(/wilayah|provinsi|kabupaten|nkri|persatuan/.test(t))return 'NKRI';return 'Pancasila'}
if(s==='bahasa indonesia'){if(/menyimak|aural|mendengar/.test(t))return 'Menyimak';if(/membaca|bacaan|teks|informasi|memirsa|diagram/.test(t))return 'Membaca dan Memirsa';if(/berbicara|presentasi|berpendapat|menceritakan|komunikasi/.test(t))return 'Berbicara dan Mempresentasikan';if(/menulis|tulisan|teks tulis/.test(t))return 'Menulis'}
if(s==='ipas'){if(/mengamati|menyelidiki|data|bukti|memprediksi|mengomunikasikan|refleksi/.test(t))return 'Keterampilan Proses';return 'Pemahaman IPAS'}
if(/seni/.test(s)){if(/refleksi|apresiasi|menilai/.test(t))return 'Merefleksikan';if(/alat|bahan|teknik|eksplorasi|prosedur/.test(t))return 'Berpikir dan Bekerja Artistik';if(/membuat|menciptakan|karya|merancang/.test(t))return 'Menciptakan';if(/dampak|percaya diri|lingkungan|manfaat/.test(t))return 'Berdampak';return 'Mengalami'}
if(s==='pjok'){if(/gerak|olahraga|permainan|lari|lompat|lempar|senam/.test(t))return 'Terampil Bergerak';if(/fair|tim|strategi|kerja sama|kolaborasi/.test(t))return 'Belajar Melalui Gerak';if(/aktif|aktivitas jasmani|kebugaran/.test(t))return 'Bergaya Hidup Aktif';if(/sehat|gizi|cedera|keselamatan/.test(t))return 'Memilih Hidup yang Menyehatkan'}
if(s==='bahasa inggris'){if(/menyimak|berbicara|dialog|percakapan|lisan/.test(t))return 'Menyimak-Berbicara';if(/membaca|teks|bacaan|memirsa/.test(t))return 'Membaca-Memirsa';if(/menulis|presentasi|menyajikan/.test(t))return 'Menulis-Mempresentasikan'}
return a[i%a.length]||a[0]||'CP terintegrasi'};
const keterangan=(i,total,semester)=>{if(i>=Math.max(0,total-2))return 'Asesmen dan penguatan';return semester==='2'?'Pembelajaran reguler — penguatan/penerapan':'Pembelajaran reguler'};
const apply=()=>{const room=document.querySelector('.sg-prota-room');if(!room)return;const subject=room.querySelector('#sgProtaSubject')?.value?.trim()||'';const rows=[...room.querySelectorAll('#sgProtaList tr')].filter(r=>r.querySelector('[data-field="text"]'));rows.forEach((r,i)=>{const text=r.querySelector('[data-field="text"]')?.value||r.textContent||'',el=r.querySelector('[data-field="element"]');const sem=r.querySelector('[data-field="semester"]')?.value||'1';const value=pick(subject,text,i);if(el&&(!el.value||el.value==='-')){el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}))}});const docs=[...room.querySelectorAll('#sgProtaDocRows tr')];docs.forEach((r,i)=>{const cells=r.querySelectorAll('td');if(cells.length<7)return;const text=cells[1]?.textContent||'',sem=cells[3]?.textContent?.trim()||'1';if(cells[2]&&(cells[2].textContent.trim()==='-'||!cells[2].textContent.trim()))cells[2].textContent=pick(subject,text,i);if(cells[6])cells[6].textContent=keterangan(i,docs.length,sem)})};
let timer=0;const watch=()=>{clearTimeout(timer);timer=setTimeout(()=>{timer=0;apply()},100)};
const boot=room=>{if(!room||room.dataset.protaQualityV2)return;room.dataset.protaQualityV2='1';watch();const stability=window.SiapGuruStability;if(stability?.guardObserver){stability.guardObserver('PROTA quality observer',watch,{target:room,maxCallbacks:80,windowMs:3000,observe:{subtree:true,childList:true,characterData:true}})}else{const obs=new MutationObserver(()=>watch());obs.observe(room,{subtree:true,childList:true,characterData:true})}room.addEventListener('input',watch,true);room.addEventListener('change',watch,true);room.addEventListener('click',e=>{if(e.target.closest('#sgProtaLoad,#sgProtaSave,#sgProtaPrint,#sgProtaWord,#sgProtaExcel'))setTimeout(apply,150)},true)};
const scan=()=>{const room=document.querySelector('.sg-prota-room');if(room){boot(room);return true}return false};
if(!scan()){const obs=new MutationObserver(()=>{if(scan())obs.disconnect()});obs.observe(document.body,{childList:true,subtree:true})}
})();
