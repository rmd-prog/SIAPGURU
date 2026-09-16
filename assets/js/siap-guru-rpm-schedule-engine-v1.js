(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_SCHEDULE_ENGINE_V1__)return;
window.__SIAP_GURU_RPM_SCHEDULE_ENGINE_V1__=true;
const KEY='siapguru_rpm_schedule_v1';
const DEFAULT={
  '5':{
    'Pendidikan Pancasila':[1],
    'PJOK':[1],
    'Matematika':[2,3],
    'Bahasa Indonesia':[2,3],
    'Bahasa Inggris':[2],
    'IPAS':[3,4],
    'Seni Rupa':[4],
    'Koding & KA':[4],
    'Agama':[5],
    'Bahasa Sunda':[5]
  }
};
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_){return{}}};
const write=x=>{try{localStorage.setItem(KEY,JSON.stringify(x));return true}catch(_){return false}};
const norm=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,' ');
const dayIndex=x=>{const n=norm(x);if(/^(senin|monday)$/.test(n))return 1;if(/^(selasa|tuesday)$/.test(n))return 2;if(/^(rabu|wednesday)$/.test(n))return 3;if(/^(kamis|thursday)$/.test(n))return 4;if(/^(jumat|jum'at|friday)$/.test(n))return 5;return 0};
const schedules=()=>{const db=read();for(const [k,v] of Object.entries(DEFAULT))if(!db[k])db[k]=v;return db};
function getDays(cls,mapel){const db=schedules();const row=db[String(cls)]||{};const found=Object.entries(row).find(([k])=>norm(k)===norm(mapel));return found?.[1]?.filter(n=>n>=1&&n<=5)||[]}
function nextDates(cls,mapel,start,limit=20,holidays=[]){const days=getDays(cls,mapel),out=[];if(!days.length)return out;let d=new Date(start||new Date());d.setHours(12,0,0,0);const off=new Set((holidays||[]).map(x=>String(x).slice(0,10)));while(out.length<Math.max(1,Math.min(100,limit))){const iso=d.toISOString().slice(0,10);if(days.includes(d.getDay())&&!off.has(iso))out.push({date:iso,day:['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][d.getDay()]});d.setDate(d.getDate()+1)}return out}
function setSchedule(cls,mapel,days){const db=schedules();db[String(cls)]??={};db[String(cls)][String(mapel).trim()]=[...new Set((days||[]).map(Number).filter(n=>n>=1&&n<=5))].sort();return write(db)}
window.SiapGuruRPMSchedule={version:'RPM-SCHEDULE-V1',getDays,nextDates,setSchedule,getAll:schedules,storageKey:KEY};
})();