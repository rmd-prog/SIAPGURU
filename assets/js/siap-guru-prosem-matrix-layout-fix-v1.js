(()=>{
'use strict';
const run=()=>{
 const room=document.querySelector('.sg-prosem-matrix-room'); if(!room)return;
 const table=room.querySelector('.sg-pm2-table'); if(!table)return;
 const tbody=table.tBodies[0]; if(!tbody)return;
 // Minggu cukup angka: 1,2,3,4,5
 table.querySelectorAll('thead .sg-pm2-week').forEach((th,i)=>{th.textContent=String((i%5)+1)});
 // Kembalikan sel kalender yang sebelumnya ditempel ke setiap TP menjadi bersih.
 const calendar={};
 [...tbody.rows].forEach(tr=>{
   if(tr.classList.contains('sg-pm2-event'))return;
   [...tr.cells].forEach(td=>{
     const title=td.getAttribute('title');
     if(!title)return;
     title.split(' • ').forEach(label=>{
       label=label.trim(); if(!label)return;
       calendar[label]??=new Set();
       const idx=td.cellIndex;
       calendar[label].add(idx);
     });
     td.removeAttribute('title');
     td.className='sg-pm2-cell';
     td.innerHTML='';
   });
 });
 // Pindahkan SUMATIF AKHIR BAB tepat setelah TP terakhir dari BAB terkait.
 const rows=[...tbody.rows];
 const sumRows=rows.filter(r=>/^SUMATIF AKHIR BAB/i.test(r.cells[1]?.textContent.trim()||''));
 sumRows.forEach(sr=>{
   const label=sr.cells[1]?.textContent.replace(/^SUMATIF AKHIR BAB\s*[—-]\s*/i,'').trim();
   let target=null;
   [...tbody.rows].forEach(r=>{
     if(r===sr||r.classList.contains('sg-pm2-event'))return;
     const bab=r.cells[1]?.textContent.trim();
     if(bab===label)target=r;
   });
   if(target)tbody.insertBefore(sr,target.nextSibling);
 });
 // Buat satu baris kalender untuk setiap event; nama hanya sekali, sel minggu cukup tanda.
 const oldCal=[...tbody.querySelectorAll('.sg-pm2-calendar-section,.sg-pm2-calendar-row')]; oldCal.forEach(r=>r.remove());
 const kok= [...tbody.rows].find(r=>/KOKURIKULER/i.test(r.cells[1]?.textContent||''));
 const entries=Object.entries(calendar);
 if(entries.length){
   const sec=document.createElement('tr'); sec.className='sg-pm2-event sg-pm2-calendar-section';
   sec.innerHTML='<td></td><td colspan="2" class="sg-pm2-event-label">KALENDER PENDIDIKAN / KETERANGAN</td><td></td>';
   const total=table.tHead.rows[1]?.cells.length||0;
   for(let i=4;i<total;i++)sec.insertCell().className='sg-pm2-cell';
   if(kok)tbody.insertBefore(sec,kok); else tbody.appendChild(sec);
   entries.forEach(([label,set])=>{
     const tr=document.createElement('tr'); tr.className='sg-pm2-event sg-pm2-calendar-row';
     tr.innerHTML='<td></td><td colspan="2" class="sg-pm2-event-label sg-pm2-vertical-label">'+label.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</td><td></td>';
     const weekCount=table.querySelectorAll('thead tr:last-child .sg-pm2-week').length;
     for(let i=0;i<weekCount;i++){
       const td=tr.insertCell(); td.className='sg-pm2-cell sg-pm2-calendar-mark';
       if(set.has(i+4)){td.textContent='●';td.title=label;}
     }
     if(kok)tbody.insertBefore(tr,kok); else tbody.appendChild(tr);
   });
 }
 // Gaya tulisan keterangan kalender dibuat naik/vertikal dan hemat lebar.
 if(!document.getElementById('sgProsemMatrixLayoutFixCss')){
   const s=document.createElement('style'); s.id='sgProsemMatrixLayoutFixCss';
   s.textContent='.sg-pm2-calendar-row .sg-pm2-event-label{width:140px}.sg-pm2-vertical-label{writing-mode:vertical-rl;transform:rotate(180deg);text-align:center!important;vertical-align:middle!important;white-space:nowrap;min-height:90px;padding:8px!important}.sg-pm2-calendar-mark{font-size:13px!important;font-weight:900}.sg-pm2-calendar-row td{vertical-align:middle!important}.sg-pm2-calendar-section td{background:#eef2f7!important}.sg-pm2-calendar-section .sg-pm2-event-label{writing-mode:horizontal-tb;transform:none;min-height:0}@media print{.sg-pm2-vertical-label{min-height:70px}}';
   document.head.appendChild(s);
 }
};
const boot=()=>{if(window.__sgProsemMatrixLayoutFix)return;window.__sgProsemMatrixLayoutFix=1;setTimeout(run,30);};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.__sgFixProsemMatrixLayout=run;
})();