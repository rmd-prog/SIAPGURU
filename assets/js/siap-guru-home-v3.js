/* SIAP GURU HOME V3 — converts the existing dynamic menu into the approved portal layout. */
(function(){
  'use strict';
  const boot=()=>{
    const home=document.getElementById('homeView');
    const source=document.querySelector('.main-menu-grid');
    if(!home||!source||home.dataset.sghV3==='1') return;
    const cards=[...source.querySelectorAll('.menu-card')];
    const find=(name)=>cards.find(c=>(c.querySelector('h3')?.textContent||'').trim().toLowerCase()===name.toLowerCase());
    const open=(name)=>{const c=find(name);if(c){c.click();return true}return false};
    const data=[
      ['Beranda','Ringkasan ruang kerja guru.','B',()=>{}],
      ['Pembelajaran','Perencanaan, perangkat, materi, dan AI.','P',()=>open('Pembelajaran')],
      ['Asesmen','Penilaian, ulangan, rekap, dan analisis.','A',()=>open('Asesmen')],
      ['Peserta Didik','Data siswa dan perkembangan peserta didik.','S',()=>open('Peserta Didik')],
      ['Dokumen','Draft, selesai, template, dan riwayat dokumen.','D',()=>open('Dokumen')],
      ['Satuan Pendidikan','Profil dan identitas satuan pendidikan.','SP',()=>open('Peserta Didik')]
    ];
    home.innerHTML='';
    const wrap=document.createElement('div');wrap.className='sg-home-v3';
    const header=document.createElement('header');header.className='sg-home-v3-header';
    const logo=document.createElement('div');logo.className='sg-home-v3-logo';logo.textContent='SIAP GURU';
    const nav=document.createElement('nav');nav.className='sg-home-v3-nav';nav.setAttribute('aria-label','Navigasi utama');
    data.forEach((d,i)=>{const b=document.createElement('button');b.type='button';b.textContent=d[0];if(i===0)b.className='active';b.addEventListener('click',()=>{if(i===0)return;d[3]()});nav.appendChild(b)});
    header.append(logo,nav);
    const hero=document.createElement('section');hero.className='sg-home-v3-hero';
    const eyebrow=document.createElement('div');eyebrow.className='eyebrow';eyebrow.textContent='PORTAL ADMINISTRASI GURU SD';
    const h1=document.createElement('h1');h1.textContent='Selamat Datang di SIAP GURU';
    const p=document.createElement('p');p.textContent='Sistem Informasi & Administrasi Pembelajaran Terpadu untuk membantu guru mengelola pembelajaran, asesmen, peserta didik, dan dokumen dalam satu ruang kerja.';
    const cta=document.createElement('button');cta.type='button';cta.className='cta';cta.textContent='Mulai Ruang Kerja';cta.addEventListener('click',()=>document.querySelector('.sg-home-v3-grid')?.scrollIntoView({behavior:'smooth',block:'start'}));
    hero.append(eyebrow,h1,p,cta);
    const section=document.createElement('section');
    const title=document.createElement('div');title.className='sg-home-v3-section-title';
    const sh=document.createElement('h2');sh.textContent='Ruang Kerja Utama';const ss=document.createElement('span');ss.textContent='Pilih area kerja';title.append(sh,ss);
    const grid=document.createElement('div');grid.className='sg-home-v3-grid';
    data.forEach(d=>{const card=document.createElement('article');card.className='sg-home-v3-card';card.tabIndex=0;const icon=document.createElement('div');icon.className='sg-home-v3-icon';icon.textContent=d[2];const h=document.createElement('h3');h.textContent=d[0];const pp=document.createElement('p');pp.textContent=d[1];card.append(icon,h,pp);card.addEventListener('click',d[3]);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();d[3]()}});grid.appendChild(card)});
    section.append(title,grid);
    const footer=document.createElement('footer');footer.className='sg-home-v3-footer';footer.textContent='SIAP GURU • Administrasi Guru SD • 2026/2027';
    wrap.append(header,hero,section,footer);home.appendChild(wrap);home.dataset.sghV3='1';
  };
  const wait=()=>{let n=0;const t=setInterval(()=>{boot();if(document.getElementById('homeView')?.dataset.sghV3==='1'||++n>80)clearInterval(t)},100)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
