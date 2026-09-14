(()=>{
  let busy=false;
  async function openRPM(){
    if(busy)return;
    busy=true;
    try{
      if(typeof window.__openSiapGuruRPM==='function'){
        window.__sgRpmBoot=0;
        window.__openSiapGuruRPM();
        return;
      }
      const res=await fetch('assets/js/siap-guru-rpm.js?direct='+Date.now(),{cache:'no-store'});
      if(!res.ok)throw new Error('RPM source '+res.status);
      let code=await res.text();
      const marker='window.__openSiapGuruRPM=boot;';
      const pos=code.lastIndexOf('})();');
      if(pos<0)throw new Error('RPM wrapper tidak ditemukan');
      code=code.slice(0,pos)+';window.__openSiapGuruRPM=boot;'+code.slice(pos);
      (0,eval)(code);
      window.__sgRpmBoot=0;
      if(typeof window.__openSiapGuruRPM==='function')window.__openSiapGuruRPM();
      else throw new Error('boot RPM tidak terekspos');
    }catch(err){
      console.error('RPM direct bootstrap:',err);
      const room=document.querySelector('.sg-room-view');
      if(room)room.remove();
    }finally{busy=false}
  }
  document.addEventListener('click',e=>{
    const link=e.target.closest?.('.sg-topnav-link');
    if(!link||link.textContent.trim()!=='RPM Deep Learning')return;
    setTimeout(openRPM,0);
  },true);
  window.__forceOpenSiapGuruRPM=openRPM;
})();
