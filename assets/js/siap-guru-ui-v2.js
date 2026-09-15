(()=>{
const ID='sg-ui-v2-sidebar',MOBILE='sg-ui-v2-mobile',OVER='sg-ui-v2-overlay';
const groups=[
 {icon:'⌂',name:'Beranda'},
 {icon:'▱',name:'Pembelajaran',items:['CP','ATP','TP','PROTA','PROSEM','Perangkat','RPM Deep Learning','LKPD','Materi','AI Generate']},
 {icon:'▤',name:'Asesmen',items:['Penilaian','Penilaian per Bab','Ulangan Semester','Akhir Semester','Rekap Nilai','Analisis']},
 {icon:'♙',name:'Peserta Didik',items:['Data Siswa','Rombel','Profil','Perkembangan']},
 {icon:'▧',name:'Dokumen',items:['Draft','Selesai','Template','Riwayat']}
];
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function originalCard(name){return [...document.querySelectorAll('.menu-card')].find(x=>(x.querySelector('h3')?.textContent||'').trim()===name)}
function originalSub(name){return [...document.querySelectorAll('.sub-menu span,.sub-menu-button')].find(x=>(x.textContent||'').trim()===name)}
function clickOriginal(name){const el=originalSub(name);if(el){el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));return true}const card=originalCard(name);if(card){card.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));return true}return false}
function build(){if(document.getElementById(ID))return;
 const side=document.createElement('aside');side.id=ID;side.setAttribute('aria-label','Navigasi SIAP GURU');
 side.innerHTML=`<div class="sgv2-brand"><div class="sgv2-mark">SG</div><div class="sgv2-brand-name">SIAP GURU</div><div class="sgv2-brand-sub">Sistem Informasi Administrasi &amp; Pembelajaran GURU</div></div><nav class="sgv2-nav"><div class="sgv2-nav-label">MENU UTAMA</div>${groups.map(g=>g.items?`<div class="sgv2-group"><button class="sgv2-nav-btn" type="button" data-group="${esc(g.name)}"><span class="sgv2-nav-icon">${g.icon}</span><span>${esc(g.name)}</span><span class="sgv2-chevron">⌄</span></button><div class="sgv2-sub" data-sub="${esc(g.name)}">${g.items.map(x=>`<button type="button" data-subitem="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>`:`<button class="sgv2-nav-btn active" type="button" data-home="true"><span class="sgv2-nav-icon">${g.icon}</span><span>${esc(g.name)}</span></button>`).join('')}</nav><div class="sgv2-side-foot"><strong>GURU</strong><span>Tahun Pelajaran 2026/2027</span><div id="sgv2-user-slot"></div></div>`;
 document.body.appendChild(side);
 const overlay=document.createElement('div');overlay.className='sgv2-mobile-overlay';overlay.id=OVER;document.body.appendChild(overlay);
 const mob=document.createElement('button');mob.id=MOBILE;mob.type='button';mob.setAttribute('aria-label','Buka menu SIAP GURU');mob.textContent='☰';document.body.appendChild(mob);
 /* Move the original user/logout controls; never clone them, so existing handlers remain intact. */
 const actions=document.querySelector('.top-actions');if(actions){actions.classList.add('sgv2-userbox');document.getElementById('sgv2-user-slot').appendChild(actions)}
 side.querySelectorAll('[data-group]').forEach(btn=>btn.addEventListener('click',()=>{const name=btn.dataset.group;const sub=side.querySelector(`[data-sub="${CSS.escape(name)}"]`);const was=sub.classList.contains('open');side.querySelectorAll('.sgv2-sub').forEach(x=>x.classList.remove('open'));side.querySelectorAll('[data-group]').forEach(x=>x.classList.remove('open'));if(!was){sub.classList.add('open');btn.classList.add('open')}clickOriginal(name)}));
 side.querySelectorAll('[data-subitem]').forEach(btn=>btn.addEventListener('click',()=>{clickOriginal(btn.dataset.subitem);side.classList.remove('sgv2-mobile-open');overlay.classList.remove('open');setTimeout(sync,80)}));
 side.querySelector('[data-home]')?.addEventListener('click',()=>{clickOriginal('Beranda');side.classList.remove('sgv2-mobile-open');overlay.classList.remove('open');setTimeout(sync,80)});
 mob.addEventListener('click',()=>{side.classList.toggle('sgv2-mobile-open');overlay.classList.toggle('open')});overlay.addEventListener('click',()=>{side.classList.remove('sgv2-mobile-open');overlay.classList.remove('open')});
}
function sync(){const homeVisible=document.getElementById('homeView')&&!document.getElementById('homeView').hidden;if(homeVisible)document.querySelector('[data-home]')?.classList.add('active');else document.querySelector('[data-home]')?.classList.remove('active')}
function boot(){document.body.classList.add('sg-ui-v2');build();sync()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
const mo=new MutationObserver(()=>{if(!document.getElementById(ID))build();sync()});mo.observe(document.body,{childList:true,subtree:true});
})();
