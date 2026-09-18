(()=>{
const KEY='siapguru_unified_document_v1';
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const key=x=>String(x.chapterId||x.id||((x.mapel||x.subject||'')+'-'+x.kelas+'-'+x.no));
const match=(v,x)=>{if(!v)return null;const cid=v.chapterId||v.context?.chapterId||v.chapter?.chapterId;if(cid&&String(cid)!==key(x))return null;return v};
const saved=(keys,x)=>{for(const k of keys){const v=match(read(k),x);if(v!=null)return v}return null};
const tp=x=>{const v=saved(['siapguru_tp_draft'],x);if(Array.isArray(v?.items)&&v.items.length)return v.items;return [
{chapterId:key(x),text:'Peserta didik mampu mengidentifikasi konsep utama pada '+x.bab+'.',element:'Memahami'},
{chapterId:key(x),text:'Peserta didik mampu menjelaskan konsep dan informasi penting dalam '+x.bab+' berdasarkan contoh yang dipelajari.',element:'Memahami'},
{chapterId:key(x),text:'Peserta didik mampu menerapkan pemahaman tentang '+x.bab+' melalui aktivitas kontekstual.',element:'Mengaplikasi'}]};
const build=x=>{if(!x||!x.kelas||!(x.mapel||x.subject)||!(x.bab||x.title))throw Error('Konteks BAB tidak lengkap.');
const cid=key(x),mapel=x.mapel||x.subject,bab=x.bab||x.title,kelas=Number(x.kelas),fase=x.fase||(kelas<=2?'A':kelas<=4?'B':'C'),semester=Number(x.semester)||1,jp=Number(x.jp)||8,T=tp(x);
const b={version:'UNIFIED-CANONICAL-V1',chapterId:cid,kelas,mapel,fase,semester,bab,no:x.no,jp,source:'Master Chapter Bank V11',generatedAt:new Date().toISOString(),sections:{}};
b.sections.CP=saved(['siapguru_cp_draft','siapguru_cp'],x)||{chapterId:cid,mapel,kelas,fase,statement:'CP fase '+fase+' untuk '+mapel+' dengan konteks BAB '+bab+'.'};
b.sections.TP=T;
b.sections.ATP=saved(['siapguru_atp_draft'],x)||{chapterId:cid,mapel,kelas,semester,bab,items:T.map((q,i)=>({order:i+1,chapterId:cid,tp:q.text||q}))};
b.sections.PROTA=saved(['siapguru_prota_draft'],x)||{chapterId:cid,mapel,kelas,semester,bab,jp};
b.sections.PROSEM=saved(['siapguru_prosem_draft'],x)||{chapterId:cid,mapel,kelas,semester,bab,jp};
b.sections.Materi=saved(['siapguru_materi_draft'],x)||{chapterId:cid,mapel,kelas,bab,summary:'Materi pembelajaran: '+bab+'.',concepts:['Konsep inti '+bab],examples:['Contoh kontekstual '+bab]};
b.sections.Perangkat=saved(['siapguru_perangkat_draft'],x)||{chapterId:cid,mapel,kelas,bab,model:'Problem Based Learning',method:'Diskusi, tanya jawab, latihan dan presentasi',steps:['Pendahuluan','Eksplorasi konsep '+bab,'Aktivitas berdasarkan TP','Diskusi/presentasi','Refleksi']};
b.sections.LKPD=saved(['siapguru_lkpd_draft'],x)||{chapterId:cid,mapel,kelas,bab,instructions:'Kerjakan aktivitas tentang '+bab+'.',activity:'Amati, diskusikan, kerjakan tugas, dan tunjukkan bukti hasil belajar.',questions:T.map(q=>q.text||q),reflection:'Apa yang sudah dipahami dan apa yang perlu diperbaiki?'};
b.sections.Asesmen=saved(['siapguru_asesmen_draft'],x)||{chapterId:cid,mapel,kelas,bab,formative:'Observasi proses dan pemahaman berdasarkan TP.',summative:'Penilaian akhir BAB berdasarkan ketercapaian TP.',evidence:'Jawaban, produk/unjuk kerja, komunikasi, dan refleksi.'};
b.sections.RPM=saved(['siapguru_rpm_deep_learning_v11','siapguru_rpm_draft'],x)||{chapterId:cid,mapel,kelas,bab,semester,jp,understand:'Eksplorasi dan pemahaman awal '+bab+'.',apply:'Penerapan '+bab+' melalui aktivitas kontekstual.',reflect:'Refleksi proses dan hasil belajar.',tp:T};
b.sections.AI=saved(['siapguru_ai_super_draft'],x)||{chapterId:cid,mapel,kelas,bab,source:'Unified canonical bundle',status:'Siap diproses AI SUPER'};
save(KEY,b);return b};
const get=x=>{const b=read(KEY);return b&&String(b.chapterId)===key(x)?b:null};
window.SiapGuruUnifiedEngine={build,get,key};
})();