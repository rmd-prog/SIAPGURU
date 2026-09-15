(()=>{
'use strict';
const CUTI=[
 ['2026-12-24','2026-12-24','CUTI BERSAMA • Natal'],
 ['2027-02-05','2027-02-05','CUTI BERSAMA • Imlek'],
 ['2027-03-09','2027-03-09','CUTI BERSAMA • Idulfitri'],
 ['2027-03-12','2027-03-12','CUTI BERSAMA • Idulfitri'],
 ['2027-03-15','2027-03-15','CUTI BERSAMA • Idulfitri'],
 ['2027-03-25','2027-03-25','CUTI BERSAMA • Wafat Yesus Kristus'],
 ['2027-05-18','2027-05-18','CUTI BERSAMA • Iduladha'],
 ['2027-05-19','2027-05-19','CUTI BERSAMA • Waisak'],
 ['2027-12-24','2027-12-24','CUTI BERSAMA • Natal']
].map(x=>({a:x[0],b:x[1],label:x[2]}));
const date=(y,m,d)=>new Date(y,m-1,d,12),iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const hit=(s,e)=>CUTI.filter(x=>iso(e)>=x.a&&iso(s)<=x.b);
const patch=()=>document.querySelectorAll('.sg-pm2-table').forEach(table=>{const head=table.tHead;if(!head||head.rows.length<2)return;const months=[...head.rows[0].querySelectorAll('.sg-pm2-month')];const body=[...table.tBodies].find(Boolean);if(!body)return;const rows=[...body.rows].filter(r=>!r.classList.contains('sg-pm2-event'));if(!rows.length)return;let col=4;months.forEach(mth=>{const text=mth.textContent.trim(),parts=text.match(/(\d{4})$/);if(!parts)return;const y=Number(parts[1]),name=text.replace(/\s+\d{4}$/,'').toLowerCase();const names=['januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember'];const m=names.indexOf(name)+1,n=Math.max(1,Number(mth.getAttribute('colspan'))||1),last=new Date(y,m,0).getDate();for(let i=0;i<n;i++){const start=date(y,m,1+i*7),end=date(y,m,Math.min(last,1+i*7+6)),events=hit(start,end);if(events.length){rows.forEach(r=>{const cell=r.cells[col+i];if(!cell)return;cell.className='sg-pm2-cell event holiday';cell.textContent='CUTI BERSAMA';cell.title=events.map(e=>e.label).join(' • ')})}}col+=n})});
const run=()=>{patch();const root=document.querySelector('.sg-prosem-matrix-room');if(root){const mo=new MutationObserver(patch);mo.observe(root,{childList:true,subtree:true});setTimeout(()=>mo.disconnect(),1800)}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
