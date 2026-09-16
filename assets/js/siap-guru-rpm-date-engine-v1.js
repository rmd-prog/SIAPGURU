(()=>{
'use strict';
if(window.__SIAP_GURU_RPM_DATE_ENGINE_V1__)return;
window.__SIAP_GURU_RPM_DATE_ENGINE_V1__=true;
const S=()=>window.SiapGuruRPMSchedule,C=()=>window.SiapGuruRPMCalendar;
const norm=s=>String(s||'').trim();
const iso=x=>String(x||'').slice(0,10);
const yearOf=d=>{const y=Number(String(d||'').slice(0,4));return Number.isFinite(y)?y:2026};
function next(cls,mapel,start,limit=1,year='2026/2027'){
 const schedule=S?.(),cal=C?.(); if(!schedule||!cal)return [];
 const days=schedule.getDays(cls,mapel);if(!days.length)return [];
 const out=[];let d=new Date(start||new Date());d.setHours(12,0,0,0);
 const max=Math.max(1,Math.min(366,Number(limit)||1));
 for(let guard=0;guard<8000&&out.length<max;guard++){
  const date=iso(d.toISOString());
  if(days.includes(d.getDay())&&cal.isEffective(year,date))out.push({date,day:['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][d.getDay()],class:String(cls),mapel:norm(mapel),effective:true});
  d.setDate(d.getDate()+1);
 }
 return out;
}
function plan(cls,mapel,start,count=1,year='2026/2027'){return next(cls,mapel,start,count,year).map((x,i)=>({...x,meeting:i+1}));}
function fromRoom(room,start,count=1){room=room||document.querySelector('.sg-rpm-room');if(!room)return[];const subject=norm(room.querySelector('#sgRSubject')?.value),cls=norm(room.querySelector('#sgRPhaseClass')?.value).match(/\b([1-6])\b/)?.[1],year=norm(room.querySelector('#sgRYear')?.value)||'2026/2027';return cls&&subject?plan(cls,subject,start,count,year):[]}
window.SiapGuruRPMDate={version:'RPM-DATE-V1',next,plan,fromRoom};
})();