(()=>{
  const SRC='assets/js/siap-guru-rpm.js';
  let busy=false;
  const forceOpen=async()=>{
    if(document.querySelector('.sg-rpm-room')||busy)return;
    busy=true;
    try{
      const res=await fetch(SRC+'?route='+Date.now(),{cache:'no-store'});
      if(!res.ok)throw new Error('RPM source gagal dimuat');
      let code=await res.text();
      code=code.replace(/\}\)\(\);\s*$/,';window.__openSiapGuruRPM=()=>{window.__sgRpmBoot=0;boot()};})();');
      (0,eval)(code);
      window.__sgRpmBoot=0;
      if(typeof window.__openSiapGuruRPM==='function')window.__openSiapGuruRPM();
    }catch(err){console.error('RPM route:',err)}finally{busy=false}
  };
  document.addEventListener('click',e=>{
    const link=e.target.closest?.('.sg-topnav-link');
    if(!link||link.textContent.trim()!=='RPM Deep Learning')return;
    e.preventDefault();
    e.stopImmediatePropagation();
    forceOpen();
  },true);
})();
