(()=>{
/* SIAP GURU — PROTA Template View V1
   Presentational layer only: formats the existing PROTA data into the uploaded
   template structure and separates Semester 1 / Semester 2 tables. */
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const weekNo=(period,semIndex)=>{const m=String(period||'').match(/Minggu ke-(\d+)/i);return m?m[1]:String(semIndex+1)};
const activity=x=>x.semester==='2'?'Pembelajaran reguler — penguatan/penerapan':'Pembelajaran reguler';
const assessment=(x,i,total)=>i>=Math.max(0,total-2)?'Asesmen & penguatan':'Formatif';
const apply=()=>{
 const room=document.querySelector('.sg-prota-room');if(!room)return;
 const doc=room.querySelector('#sgProtaDocument');if(!doc)return;
 if(!document.querySelector('link[data-prota-template-view-v1]')){const l=document.createElement('link');l.rel='stylesheet';l.href='assets/css/siap-guru-prota-template-view-v1.css?v=1';l.dataset.protaTemplateViewV1='1';document.head.appendChild(l)}
 const source=[...room.querySelectorAll('#sgProtaList tr')].filter(r=>r.querySelector('[data-field="text"]'));if(!source.length)return;
 const items=source.map(r=>({text:r.querySelector('[data-field="text"]')?.value||'',element:r.querySelector('[data-field="element"]')?.value||'-',semester:r.querySelector('[data-field="semester"]')?.value==='2'?'2':'1',jp:Number(r.querySelector('[data-field="jp"]')?.value)||0,period:r.querySelector('[data-field="period"]')?.value||''}));
 const old=doc.querySelector('[data-prota-template-tables]');if(old)old.remove();
 const wrap=document.createElement('div');wrap.dataset.protaTemplateTables='1';
 const make=(sem,label)=>{const rows=items.filter(x=>x.semester===sem),section=document.createElement('section');section.className='sg-prota-template-semester';const title=document.createElement('h3');title.textContent=label;section.appendChild(title);const table=document.createElement('table');table.className='sg-prota-doc-table sg-prota-template-table';table.innerHTML='<thead><tr><th>Minggu Ke</th><th>Materi / Pokok Bahasan</th><th>Tujuan Pembelajaran</th><th>Alokasi Waktu</th><th>Asesmen</th><th>Kegiatan Pembelajaran</th></tr></thead>';const body=document.createElement('tbody');if(!rows.length)body.innerHTML='<tr><td colspan="6" class="sg-prota-doc-empty">Belum ada TP pada semester ini.</td></tr>';else rows.forEach((x,i)=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${esc(weekNo(x.period,i))}<br><small>${esc(x.period||'')}</small></td><td><strong>${esc(x.element||'-')}</strong></td><td>${esc(x.text||'-')}</td><td>${x.jp} JP</td><td>${assessment(x,i,rows.length)}</td><td>${activity(x)}</td>`;body.appendChild(tr)});table.appendChild(body);const total=rows.reduce((n,x)=>n+x.jp,0),foot=document.createElement('tfoot');foot.innerHTML=`<tr><th colspan="3">Jumlah Alokasi Waktu ${label}</th><th>${total} JP</th><th colspan="2"></th></tr>`;table.appendChild(foot);section.appendChild(table);return section};
 wrap.appendChild(make('1','D. RINCIAN PROGRAM TAHUNAN — SEMESTER 1'));wrap.appendChild(make('2','E. RINCIAN PROGRAM TAHUNAN — SEMESTER 2'));
 const oldWrap=doc.querySelector('.sg-prota-doc-table-wrap');if(oldWrap)oldWrap.replaceWith(wrap);else doc.appendChild(wrap);
};
let timer=0;const schedule=()=>{clearTimeout(timer);timer=setTimeout(()=>{timer=0;apply()},120)};
const boot=room=>{if(!room||room.dataset.protaTemplateViewV1)return;room.dataset.protaTemplateViewV1='1';schedule();const stability=window.SiapGuruStability;if(stability?.guardObserver)stability.guardObserver('PROTA template view',schedule,{target:room,maxCallbacks:80,windowMs:3000,observe:{subtree:true,childList:true,characterData:true}});else{const obs=new MutationObserver(schedule);obs.observe(room,{subtree:true,childList:true,characterData:true})}room.addEventListener('input',schedule,true);room.addEventListener('change',schedule,true)};
const scan=()=>{const room=document.querySelector('.sg-prota-room');if(room){boot(room);return true}return false};if(!scan()){const obs=new MutationObserver(()=>{if(scan())obs.disconnect()});obs.observe(document.body,{childList:true,subtree:true})}
})();
