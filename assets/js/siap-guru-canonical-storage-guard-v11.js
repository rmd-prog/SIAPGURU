(()=>{'use strict';
/* CANONICAL STORAGE GUARD V11 — strict chapter identity. */
if(window.__SG_CANONICAL_STORAGE_GUARD_V11__)return;window.__SG_CANONICAL_STORAGE_GUARD_V11__=1;
const KEYS=new Set(['siapguru_tp_draft','siapguru_materi_draft','siapguru_assessment_draft','siapguru_penilaian_bab_draft','siapguru_rpm_draft','siapguru_lkpd_draft']);
const LEGACY_TOPIC='siapguru_selected_topic';
const rawGet=Storage.prototype.getItem,rawSet=Storage.prototype.setItem;
const canonical=()=>{try{const c=JSON.parse(sessionStorage.getItem('siapguru_selected_chapter_v11')||'null'),M=window.SiapGuruMasterChapterBankV11;if(!c||!M)return null;const k=Number(c.kelas),n=Number(c.no),mapel=c.mapel;if(!Number.isInteger(k)||k<1||!Number.isInteger(n)||n<1||!mapel)return null;const s=M.getStructure?.(k,mapel),ch=M.getChapter?.(k,mapel,n);if(!s||!ch||s.status==='CONFLICT'||s.status==='PENDING'||s.active===false||Number(ch.no)!==n)return null;const chapterId=ch.chapterId||ch.id;if(!chapterId)return null;return{kelas:k,no:n,mapel:s.mapel,chapterId,title:ch.title,edition:s.edition||'',structureType:s.structureType||'BAB',status:s.status,locked:!!s.locked,phase:k<=2?'A':k<=4?'B':'C',semester:n<=Math.ceil(s.chapters.length/2)?1:2}}catch(_){return null}};
const matches=(d,c)=>{if(!d||!c)return false;const id=d.chapterId||d.chapterID;return !!id&&id===c.chapterId};
Storage.prototype.getItem=function(key){const value=rawGet.call(this,key);if(key===LEGACY_TOPIC)return null;if(this!==localStorage||!KEYS.has(key)||value==null)return value;const c=canonical();if(!c)return value;try{const d=JSON.parse(value);return matches(d,c)?value:null}catch(_){return null}};
Storage.prototype.setItem=function(key,value){if(key===LEGACY_TOPIC)return;return rawSet.call(this,key,value)};
window.SiapGuruCanonicalStorageGuardV11={version:'V11-STRICT',canonical,matches,rawGet:(key)=>rawGet.call(localStorage,key)};
})();