(()=>{
'use strict';
const KEY='siapguru_tp_v11_draft';
const engine=()=>window.SiapGuruChapterEngineV11||null;
const master=()=>window.SiapGuruMasterChapterBankV11||null;
const masterJP=()=>window.SiapGuruMasterJPV1||window.SiapGuruMasterJPV2||null;
const norm=v=>String(v??'').trim();
const resolve=(selection={})=>{const e=engine();if(e&&typeof e.resolve==='function'){const r=e.resolve(selection);if(r)return r}const m=master();return m&&typeof m.getChapter==='function'?m.getChapter(selection.kelas,selection.mapel,selection.no):null};
const context=(selection={})=>{const c=resolve(selection);if(!c)return {chapterId:'',kelas:selection.kelas||'',mapel:selection.mapel||'',subjectId:'',no:Number(selection.no||0),semester:'',bab:'',title:'',structureType:'',edition:'',source:'',status:'PENDING',locked:false};const no=Number(c.no||selection.no||0);const j=masterJP()?.getChapterJp?.(selection.kelas,c.mapel||selection.mapel,no)||null;const semester=j?.semester!=null?String(j.semester):'';return {chapterId:c.chapterId||c.id||'',kelas:c.kelas||selection.kelas||'',mapel:c.mapel||c.subjectName||selection.mapel||'',subjectId:c.subjectId||'',no,semester,bab:c.title||c.bab||'',title:c.title||c.bab||'',structureType:c.structureType||'BAB',edition:c.edition||'',source:c.source||'',status:c.status||'PENDING',locked:c.locked===true}};
const build=(selection={},opts={})=>{
 const c=context(selection);
 if(!c.chapterId||!c.bab)return {ok:false,error:'BAB canonical belum dipilih.',context:c,items:[]};
 /* TP ENGINE STRICT: never invent generic TP. Reuse the unified canonical bundle when available. */
 const U=window.SiapGuruUnifiedEngine;
 if(U&&typeof U.build==='function'){
   try{
     const b=U.build(c);
     const items=Array.isArray(b?.sections?.TP)?b.sections.TP:[];
     return {ok:items.length>0,context:c,items,error:items.length?'':'TP canonical belum tersedia untuk BAB ini.'};
   }catch(_){}
 }
 return {ok:false,context:c,items:[],error:'TP canonical belum tersedia untuk BAB ini.'};
};
const save=payload=>{try{if(!payload?.chapterId)return false;const canonical=context({kelas:payload.kelas,mapel:payload.mapel,no:payload.chapterNo||payload.no});if(!canonical.chapterId||canonical.chapterId!==payload.chapterId)return false;const safe={...payload,chapterId:canonical.chapterId,chapterNo:canonical.no,semester:String(payload.semester||canonical.semester||''),topic:canonical.title,bab:canonical.title};localStorage.setItem(KEY,JSON.stringify(safe));localStorage.setItem('siapguru_tp_draft',JSON.stringify(safe));return true}catch(_){return false}};
const load=()=>{try{const p=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('siapguru_tp_draft')||'null');if(!p?.chapterId)return null;const c=context({kelas:p.kelas,mapel:p.mapel,no:p.chapterNo||p.no});return c.chapterId===p.chapterId?{...p,semester:String(p.semester||c.semester||'')}:null}catch(_){return null}};
window.SiapGuruTPEngineV11={version:'TP-ENGINE-V12-STRICT',context,resolve,build,save,load};window.dispatchEvent(new CustomEvent('sg:tp-engine-v11-ready',{detail:window.SiapGuruTPEngineV11}));
})();