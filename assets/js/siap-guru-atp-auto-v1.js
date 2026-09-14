/* SIAP GURU — ATP AUTO bridge v1
   Keeps the existing ATP UI. Adds one-click automatic ATP generation from all CP elements.
   No D1, Worker, login, Dashboard, or RPM changes. */
(()=>{
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const build=()=>{
    const room=document.querySelector('.sg-atp-room');
    if(!room||room.dataset.autoReady==='1')return;
    room.dataset.autoReady='1';
    const footer=room.querySelector('.sg-atp-footer');
    const add=room.querySelector('#sgAtpAdd');
    const subject=room.querySelector('#sgAtpSubject');
    const phase=room.querySelector('#sgAtpPhase');
    const klass=room.querySelector('#sgAtpClass');
    const element=room.querySelector('#sgAtpElement');
    const list=room.querySelector('#sgAtpList');
    const name=room.querySelector('#sgAtpName');
    const notice=room.querySelector('#sgAtpNotice');
    if(!footer||!add||!subject||!phase||!klass||!element||!list)return;
    const btn=document.createElement('button');
    btn.id='sgAtpAuto';btn.type='button';btn.className='sg-atp-primary';btn.textContent='⚡ Buat ATP Otomatis';
    footer.insertBefore(btn,footer.firstChild);
    const show=m=>{if(notice){notice.textContent=m;notice.classList.add('is-show');clearTimeout(show.t);show.t=setTimeout(()=>notice.classList.remove('is-show'),2500)}};
    const make=()=>{
      const opts=[...element.options];
      if(!opts.length){show('CP belum tersedia untuk pilihan ini.');return}
      list.innerHTML='';
      const verbs=['mengidentifikasi','menjelaskan','menerapkan','menganalisis','mengomunikasikan','merefleksikan'];
      opts.forEach((opt,i)=>{
        element.value=opt.value;
        add.click();
        const item=list.lastElementChild;
        if(!item)return;
        const text=item.querySelector('.sg-atp-text');
        const cp=item.dataset.cp||'';
        const title=opt.textContent.trim();
        const prefix=`Peserta didik mampu ${verbs[i%verbs.length]}`;
        const generated=cp?`${prefix} konsep, informasi, atau keterampilan pada elemen ${title} berdasarkan capaian pembelajaran yang ditetapkan.`:`${prefix} kompetensi pada elemen ${title} sesuai karakteristik pembelajaran Fase ${phase.value}.`;
        if(text)text.textContent=generated;
        item.dataset.element=title;
        item.dataset.cp=cp;
      });
      if(name&&!name.value.trim())name.value=`ATP ${subject.value} Kelas ${klass.value} Fase ${phase.value}`;
      const total=room.querySelector('#sgAtpTotalJp');
      if(total&&!total.value)total.value=opts.length*2;
      show(`${opts.length} tujuan pembelajaran otomatis tersusun dari CP.`);
    };
    btn.addEventListener('click',make);
    const auto=()=>{if(list.querySelector('.sg-atp-item'))return;setTimeout(make,80)};
    auto();
  };
  const watch=()=>{build();if(!document.querySelector('.sg-atp-room'))setTimeout(watch,100)};
  document.addEventListener('click',e=>{const l=e.target.closest('.sg-topnav-link');if(l&&l.textContent.trim()==='ATP')setTimeout(build,120)},true);
  watch();
})();
