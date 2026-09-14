(()=>{
  const init=()=>{
    const room=document.querySelector('.sg-rpm-room');
    if(!room||room.dataset.rpmScopeV1)return;
    room.dataset.rpmScopeV1='1';
    const source=room.querySelector('.sg-rpm-card');
    if(!source)return;
    const card=document.createElement('section');
    card.className='sg-rpm-card sg-rpm-scope-card';
    card.innerHTML=`<div class="sg-rpm-section"><div><span class="sg-rpm-label">CAKUPAN RPM</span><h2>Mode Penyusunan</h2></div><span class="sg-rpm-muted">Default sekolah: 1 RPM = 1 pertemuan</span></div><div class="sg-rpm-grid"><label class="sg-rpm-field"><span>Cakupan</span><select id="sgRScope"><option value="single">1 Kali Pertemuan</option><option value="multi">Beberapa Pertemuan</option><option value="chapter">Satu BAB</option></select></label><label class="sg-rpm-field" id="sgRMeetingWrap" hidden><span>Jumlah Pertemuan</span><input id="sgRMeetings" type="number" min="2" max="20" value="3"></label></div><div id="sgRScopeHelp" class="sg-rpm-muted">Satu dokumen RPM untuk satu kali pertemuan.</div>`;
    source.after(card);
    const scope=room.querySelector('#sgRScope'),wrap=room.querySelector('#sgRMeetingWrap'),help=room.querySelector('#sgRScopeHelp');
    const refresh=()=>{
      const multi=scope.value!=='single';
      wrap.hidden=!multi;
      help.textContent=scope.value==='single'?'Satu dokumen RPM untuk satu kali pertemuan.':scope.value==='multi'?'Beberapa pertemuan digunakan sebagai pembagian sumber TP; hasil akhirnya tetap RPM per pertemuan.':'Satu BAB digunakan sebagai sumber pembagian; hasil akhirnya tetap RPM per pertemuan.';
    };
    scope.addEventListener('change',refresh);
    refresh();
    room.addEventListener('change',e=>{
      if(e.target?.id==='sgRScope')refresh();
    });
  };
  document.addEventListener('click',e=>{
    const link=e.target.closest?.('.sg-topnav-link');
    if(link&&link.textContent.trim()==='RPM Deep Learning')setTimeout(init,0);
  },false);
  document.addEventListener('siapguru:topic-selected',()=>setTimeout(init,0));
  setTimeout(init,300);
})();