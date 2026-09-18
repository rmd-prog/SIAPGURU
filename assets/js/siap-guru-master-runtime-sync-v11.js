/* SIAP GURU — MASTER RUNTIME SYNC V11
   Keeps legacy MasterBab API intact while routing read operations to Master Chapter Bank V11.
   V11 is authoritative even when the legacy MasterBab script is injected later by app.js.
*/
(()=>{'use strict';
if(window.__SG_MASTER_RUNTIME_SYNC_V11__)return;window.__SG_MASTER_RUNTIME_SYNC_V11__=1;
const generic=(s)=>{const x=String(s??'').replace(/\s+/g,' ').trim().toLowerCase();return /^(konsep utama(?:\s+.+)?|ciri dan unsur penting|contoh dalam kehidupan sehari-hari|penerapan melalui aktivitas belajar|refleksi dan penguatan pemahaman|informasi pokok dalam teks|kosakata dan makna kata|ciri dan struktur teks|penggunaan bahasa sesuai konteks|menyusun tanggapan atau tulisan|mempresentasikan hasil belajar)$/.test(x)};
const scrubLegacyDraft=()=>{try{const raw=localStorage.getItem('siapguru_master_bab_v1');if(!raw)return;const rows=JSON.parse(raw);if(!Array.isArray(rows))return;let changed=false;rows.forEach(r=>{if(!r||!Array.isArray(r.subtopik))return;const next=r.subtopik.map(x=>String(x??'').trim()).filter(Boolean).filter(x=>!generic(x));if(next.length!==r.subtopik.length){r.subtopik=next;changed=true}});if(changed)localStorage.setItem('siapguru_master_bab_v1',JSON.stringify(rows))}catch(_){}};
const load=(src,marker,next)=>{if(document.querySelector(`script[data-${marker}]`)){next();return}const s=document.createElement('script');s.src=src;s.dataset[marker]='1';s.onload=()=>next();s.onerror=()=>{console.error('[SIAP GURU] gagal memuat chapter source',src);next()};document.head.appendChild(s)};
const loadChapterSources=done=>{
 load('assets/js/siap-guru-rpm-chapter-bank-v1.js?v=2','sgChapterBankBase',()=>
   load('assets/js/siap-guru-rpm-chapter-bank-ipas-v1.js?v=1','sgChapterBankIpas',()=>
     load('assets/js/siap-guru-rpm-chapter-bank-extension-v2.js?v=1','sgChapterBankExt1',done)));
};
const boot=()=>{
 const M=window.SiapGuruMasterChapterBankV11;
 if(!M)return false;
 const legacy=window.SiapGuruMasterBab;
 if(!legacy)return false;
 if(legacy.__sgMasterV11Wrapped){scrubLegacyDraft();return true}
 legacy.__legacyGetAll=typeof legacy.getAll==='function'?legacy.getAll.bind(legacy):null;
 legacy.__legacyGet=typeof legacy.get==='function'?legacy.get.bind(legacy):null;
 legacy.getAll=()=>M.all().map(r=>r.chapters.map((bab,i)=>({
   id:`master-${r.kelas}-${M.subjectKey(r.mapel)}-${i+1}`,
   mapel:r.mapel,kelas:Number(r.kelas),fase:Number(r.kelas)<=2?'A':Number(r.kelas)<=4?'B':'C',
   semester:i<Math.ceil(r.chapters.length/2)?1:2,bab,jp:(window.SiapGuruMasterJPV1?.getChapterJp?.(r.kelas,r.mapel,i+1)?.configured?Number(window.SiapGuruMasterJPV1.getChapterJp(r.kelas,r.mapel,i+1).jp):null),
   source:r.sourceType||r.source||'MASTER_CHAPTER_BANK_V11',sourceUrl:r.sourceUrl||'',
   status:r.status||'VERIFIED',locked:!!r.locked,active:r.active!==false,
   bookId:r.bookId||'',edition:r.edition||'',structureType:r.structureType||'BAB'
 }))).flat();
 legacy.get=(q={})=>M.getStructure(q.kelas,q.mapel);
 legacy.version='MASTER_CHAPTER_BANK_V11';
 legacy.source='SiapGuruMasterChapterBankV11';
 legacy.__sgMasterV11Wrapped=true;
 scrubLegacyDraft();
 window.dispatchEvent(new CustomEvent('sg:master-runtime-v11-ready',{detail:M.audit()}));
 return true;
};
const ensure=()=>{
 if(boot())return true;
 if(window.__sgMasterRuntimeTimer)return false;
 let tries=0;
 window.__sgMasterRuntimeTimer=window.setInterval(()=>{
   if(boot()||++tries>80){window.clearInterval(window.__sgMasterRuntimeTimer);window.__sgMasterRuntimeTimer=null}
 },250);
 return false;
};
loadChapterSources(ensure);
document.addEventListener('sg:master-chapter-bank-v11-ready',ensure,{once:true});
window.setInterval(scrubLegacyDraft,1000);
})();