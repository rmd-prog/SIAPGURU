(()=>{
const NAV_ID='sg-top-navigation';
const groups=[
 {name:'Beranda'},
 {name:'Pembelajaran',items:['CP','ATP','TP','PROTA','PROSEM','Perangkat','RPM Deep Learning','LKPD','Materi','AI Generate']},
 {name:'Asesmen',items:['Penilaian','Penilaian per Bab','Ulangan Semester','Akhir Semester','Rekap Nilai','Analisis']},
 {name:'Peserta Didik',items:['Data Siswa','Rombel','Profil','Perkembangan']},
 {name:'Dokumen',items:['Draft','Selesai','Template','Riwayat']}
];
const icons={Beranda:'⌂',Pembelajaran:'▱',Asesmen:'▤','Peserta Didik':'♙',Dokumen:'▧'};
function originalSub(name){return [...document.querySelectorAll('.sub-menu span,.sub-menu-button')].find(x=>(x.textContent||'').trim()===name)}
function originalCard(name){return [...document.querySelectorAll('.menu-card')].find(x=>(x.querySelector('h3')?.textContent||'').trim()===name)}
function clickOriginal(name){const el=originalSub(name);if(el){el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));return true}const card=originalCard(name);if(card){card.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));return true}return false}
function openSchool(){if(window.SiapGuruSchoolInfo&&typeof window.SiapGuruSchoolInfo.open==='function'){window.SiapGuruSchoolInfo.open();return true}return false}
function build(){if(document.getElementById(NAV_ID))return;const top=document.querySelector('.topbar');if(!top)return;const nav=document.createElement('nav');nav.id=NAV_ID;nav.setAttribute('aria-label','Menu utama SIAP GURU');nav.innerHTML=groups.map(g=>g.items?`<div class="sg-top-item"><button type="button" class="sg-top-btn" data-group="${g.name}"><span class="sg-top-icon">${icons[g.name]||'•'}</span><span>${g.name}</span><span class="sg-top-chevron">⌄</span></button><div class="sg-top-dropdown">${g.items.map(x=>`<button type="button" data-route="${x}">${x}</button>`).join('')}</div></div>`:`<button type="button" class="sg-top-btn sg-top-home" data-home="true"><span class="sg-top-icon">⌂</span><span>${g.name}</span></button>`).join('')+`<button type="button" class="sg-top-btn sg-top-school" data-school="true"><span class="sg-top-icon">⚙</span><span>Satuan Pendidikan</span></button>`;top.appendChild(nav);
nav.querySelectorAll('[data-group]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const item=btn.parentElement;nav.querySelectorAll('.sg-top-item.open').forEach(x=>{if(x!==item)x.classList.remove('open')});item.classList.toggle('open')}));
nav.querySelectorAll('[data-route]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();clickOriginal(btn.dataset.route);nav.querySelectorAll('.sg-top-item').forEach(x=>x.classList.remove('open'))}));
nav.querySelector('[data-home]')?.addEventListener('click',()=>{clickOriginal('Beranda');nav.querySelectorAll('.sg-top-item').forEach(x=>x.classList.remove('open'))});
nav.querySelector('[data-school]')?.addEventListener('click',()=>openSchool());
document.addEventListener('click',()=>nav.querySelectorAll('.sg-top-item').forEach(x=>x.classList.remove('open')),true)}
function loadRoomVisual(){let l=document.querySelector('link[data-sg-room-visual]');if(!l){l=document.createElement('link');l.rel='stylesheet';l.dataset.sgRoomVisual='1';document.head.appendChild(l)}l.href='assets/css/siap-guru-room-visual-v1.css?v=4'}
function roomIsOpen(){const home=document.getElementById('homeView');if(home&&!home.hidden)return false;const main=document.querySelector('.main-content');return !!main&&[...main.children].some(el=>!el.hidden&&el.id!=='homeView')}
function sync(){const room=roomIsOpen();document.body.classList.toggle('sg-room-mode',room);document.querySelector('.main-content')?.classList.toggle('sg-room-mode',room);document.querySelectorAll('.sg-top-btn').forEach(b=>b.classList.remove('active'));const home=document.getElementById('homeView');if(home&&!home.hidden)document.querySelector('[data-home]')?.classList.add('active')}
function boot(){document.body.classList.add('sg-ui-v2');loadRoomVisual();build();sync()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();new MutationObserver(()=>{build();sync()}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});
})();
