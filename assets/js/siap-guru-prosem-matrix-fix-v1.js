(()=>{
'use strict';
const fix=()=>document.querySelectorAll('.sg-pm2-table').forEach(table=>{const head=table.tHead;if(!head||head.rows.length<2)return;const months=[...head.rows[0].querySelectorAll('.sg-pm2-month')],row=head.rows[1];if(!months.length)return;row.innerHTML='';months.forEach(m=>{const n=Math.max(1,Number(m.getAttribute('colspan'))||1);for(let i=1;i<=n;i++){const th=document.createElement('th');th.className='sg-pm2-week';th.textContent='M'+i;row.appendChild(th)}})});
const run=()=>{fix();const root=document.querySelector('.sg-prosem-matrix-room');if(root){const mo=new MutationObserver(()=>fix());mo.observe(root,{childList:true,subtree:true});setTimeout(()=>mo.disconnect(),1500)}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
