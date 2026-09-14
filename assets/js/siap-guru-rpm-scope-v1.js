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
    const saveScope=()=>{
      const value=scope?.value||'single';
      const count=Math.max(2,Math.min(20,Number(room.querySelector('#sgRMeetings')?.value||3)));
      try{
        const raw=sessionStorage.getItem('siapguru_rpm_generated');
        const saved=raw?JSON.parse(raw):{};
        saved.scope=value;
        saved.meetingCount=value==='single'?1:count;
        sessionStorage.setItem('siapguru_rpm_generated',JSON.stringify(saved));
      }catch(_){ }
    };
    const refresh=()=>{
      const multi=scope.value!=='single';
      wrap.hidden=!multi;
      help.textContent=scope.value==='single'?'Satu dokumen RPM untuk satu kali pertemuan.':scope.value==='multi'?'Beberapa pertemuan digunakan untuk membagi sumber TP; peta pertemuan dibuat otomatis tanpa mengubah generator utama.':'Satu BAB digunakan sebagai sumber pembagian; peta pertemuan dibuat otomatis dan RPM tetap dapat disusun per pertemuan.';
      saveScope();
    };
    scope.addEventListener('change',refresh);
    room.querySelector('#sgRMeetings')?.addEventListener('change',saveScope);
    room.querySelector('#sgRMeetings')?.addEventListener('input',saveScope);
    refresh();
    room.addEventListener('change',e=>{
      if(e.target?.id==='sgRScope')refresh();
      if(e.target?.id==='sgRMeetings')saveScope();
    });
  };
  document.addEventListener('click',e=>{
    const link=e.target.closest?.('.sg-topnav-link');
    if(link&&link.textContent.trim()==='RPM Deep Learning')setTimeout(init,0);
    if(e.target?.id==='sgRBuild')setTimeout(()=>{try{
      const room=document.querySelector('.sg-rpm-room');
      const scope=room?.querySelector('#sgRScope')?.value||'single';
      const count=Math.max(2,Math.min(20,Number(room?.querySelector('#sgRMeetings')?.value||3)));
      const raw=sessionStorage.getItem('siapguru_rpm_generated');
      if(raw){const saved=JSON.parse(raw);saved.scope=scope;saved.meetingCount=scope==='single'?1:count;sessionStorage.setItem('siapguru_rpm_generated',JSON.stringify(saved));}
    }catch(_){ }},0);
  },false);
  document.addEventListener('siapguru:topic-selected',()=>setTimeout(init,0));
  setTimeout(init,300);
})();