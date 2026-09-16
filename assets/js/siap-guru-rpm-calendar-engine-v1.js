(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_CALENDAR_ENGINE_V1__)return;
window.__SIAP_GURU_RPM_CALENDAR_ENGINE_V1__=true;
const KEY='siapguru_rpm_calendar_v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_){return{}}};
const write=x=>{try{localStorage.setItem(KEY,JSON.stringify(x));return true}catch(_){return false}};
const normDate=x=>String(x||'').slice(0,10);
function get(year='2026/2027'){const db=read();return db[year]||{year,nonEffective:[],notes:{}}}
function set(year,data){const db=read();db[year]=Object.assign({year,nonEffective:[],notes:{}},data||{});return write(db)}
function add(year,date,note=''){const d=normDate(date);if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return false;const row=get(year);row.nonEffective=[...new Set([...(row.nonEffective||[]),d])].sort();if(note)row.notes=Object.assign({},row.notes||{},{[d]:String(note)});return set(year,row)}
function remove(year,date){const d=normDate(date),row=get(year);row.nonEffective=(row.nonEffective||[]).filter(x=>x!==d);if(row.notes)delete row.notes[d];return set(year,row)}
function isNonEffective(year,date,extra=[]){const d=normDate(date),row=get(year);return (row.nonEffective||[]).includes(d)||(extra||[]).map(normDate).includes(d)}
function isWeekday(date){const d=new Date(`${normDate(date)}T12:00:00`);const n=d.getDay();return n>=1&&n<=5}
function isEffective(year,date,extra=[]){return isWeekday(date)&&!isNonEffective(year,date,extra)}
window.SiapGuruRPMCalendar={version:'RPM-CALENDAR-V1',storageKey:KEY,get,set,add,remove,isNonEffective,isWeekday,isEffective};
})();