(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_CONTEXT_AUTO_V1__)return;window.__SIAP_GURU_RPM_CONTEXT_AUTO_V1__=true;
const clean=s=>String(s??'').replace(/\s+/g,' ').trim(),$=(id)=>document.querySelector('.sg-rpm-room #'+id);
const set=(id,v,force=true)=>{const e=$(id);if(!e)return;if(force||!clean(e.value))e.value=v||''};
const tpText=detail=>{const a=detail?.context?.tp||detail?.topic?.tp||[];return a.map(x=>clean(typeof x==='string'?x:x?.text)).filter(Boolean)};
const build=d=>{const t=clean(d?.topic?.bab),sub=(d?.context?.sub||d?.topic?.subtopik||[]).map(clean).filter(Boolean),tp=tpText(d);if(!t)return null;const fokus=sub.length?`Subtopik yang dipelajari: ${sub.join(', ')}.`:'';const tujuan=tp.length?tp.map((x,i)=>`TP ${i+1}: ${x}`).join(' '):`Peserta didik memahami dan menunjukkan pemahaman terhadap ${t}.`;return{
readiness:`Kesiapan belajar diarahkan pada pengetahuan awal peserta didik yang berkaitan dengan ${t}, pengalaman sehari-hari, serta kemampuan mengikuti aktivitas pengamatan, diskusi, dan praktik.`,
material:`${t}. ${fokus}`,
content:`${t}${sub.length?' — '+sub.join('; '):''}`,
start:`Guru mengaitkan pengalaman peserta didik dengan ${t}, mengajak mengamati contoh yang dekat dengan kehidupan mereka, lalu menyampaikan pertanyaan pemantik sebelum kegiatan dimulai.`,
understand:`Peserta didik mengamati, membaca atau menyimak sumber belajar tentang ${t}. Peserta didik menemukan informasi penting, membandingkan contoh, dan mendiskusikan makna konsep yang dipelajari. ${fokus}`,
apply:`Peserta didik menggunakan pemahaman tentang ${t} untuk menyelesaikan tugas atau praktik pada situasi yang relevan. Kegiatan diarahkan agar peserta didik menghasilkan bukti belajar yang dapat diamati.`,
reflect:`Peserta didik meninjau hasil kegiatan pada ${t}, menyampaikan hal yang sudah dipahami, menemukan bagian yang masih sulit, dan menentukan perbaikan berdasarkan umpan balik guru.`,
end:`Guru dan peserta didik menyimpulkan pembelajaran ${t}, memberikan apresiasi terhadap proses belajar, dan menyepakati tindak lanjut.`,
assessStart:`Pertanyaan pemantik dan percakapan singkat untuk mengetahui pengetahuan awal peserta didik tentang ${t}.`,
assessProcess:`Observasi proses saat peserta didik mengeksplorasi ${t}, berdiskusi, mengerjakan tugas, dan menunjukkan bukti pemahaman.`,
assessEnd:`Bukti akhir berupa hasil tugas, produk, praktik, atau respons peserta didik yang menunjukkan ketercapaian tujuan pembelajaran tentang ${t}.`,
criteria:`Ketercapaian ditinjau dari ketepatan pemahaman tentang ${t}, kemampuan menerapkan konsep pada tugas yang diberikan, kualitas bukti belajar, serta kemampuan menjelaskan hasil dan melakukan refleksi.`,
source:d?.topic?.source||`Sumber belajar yang digunakan untuk ${t} disesuaikan dengan buku teks, LKPD, media pembelajaran, dan lingkungan belajar yang relevan.`,
lkpd:`LKPD kontekstual: eksplorasi ${t}, pengolahan informasi, tugas penerapan, dan refleksi hasil belajar.`,
tujuan
};};
const apply=d=>{const x=build(d);if(!x)return;set('sgRReadiness',x.readiness);set('sgRMaterial',x.material);set('sgRContent',x.content);set('sgRStart',x.start);set('sgRUnderstand',x.understand);set('sgRApply',x.apply);set('sgRReflect',x.reflect);set('sgREnd',x.end);set('sgRAssessStart',x.assessStart);set('sgRAssessProcess',x.assessProcess);set('sgRAssessEnd',x.assessEnd);set('sgRCriteria',x.criteria);set('sgRSource',x.source);set('sgRLKPD',x.lkpd);window.dispatchEvent(new CustomEvent('sg:rpm-context-auto',{detail:{topic:d.topic,generated:x}}));};
window.addEventListener('sg:rpm-topic-changed',e=>apply(e.detail||{}));
const boot=()=>{const raw=sessionStorage.getItem('siapguru_selected_topic');if(raw){try{apply({topic:JSON.parse(raw),context:{tp:[]}})}catch(_){}}};
let n=0;const timer=setInterval(()=>{if(document.querySelector('.sg-rpm-room')){boot();clearInterval(timer)}else if(++n>80)clearInterval(timer)},250);
})();
