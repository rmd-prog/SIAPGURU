(()=>{
  let busy=false;
  let loaded=false;
  const runCanonical=(link)=>{
    if(!link)return;
    window.__sgRpmBoot=0;
    window.__sgRpmRouteBypass=true;
    try{
      link.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
    }finally{
      setTimeout(()=>{window.__sgRpmRouteBypass=false},0);
    }
  };
  const loadCanonical=()=>new Promise((resolve,reject)=>{
    if(loaded){resolve();return}
    const s=document.createElement('script');
    s.src='assets/js/siap-guru-rpm.js?force='+Date.now();
    s.onload=()=>{loaded=true;resolve()};
    s.onerror=()=>reject(new Error('RPM canonical source gagal dimuat'));
    document.head.appendChild(s);
  });
  async function openRPM(link){
    if(busy)return;
    busy=true;
    try{
      await loadCanonical();
      runCanonical(link);
    }catch(err){console.error('RPM navigation:',err)}
    finally{busy=false}
  }
  window.__forceOpenSiapGuruRPM=()=>openRPM(document.querySelector('.sg-topnav-link')?.textContent.trim()==='RPM Deep Learning'?document.querySelector('.sg-topnav-link'):null);
  document.addEventListener('click',e=>{
    const link=e.target.closest?.('.sg-topnav-link');
    if(!link||link.textContent.trim()!=='RPM Deep Learning')return;
    if(window.__sgRpmRouteBypass)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openRPM(link);
  },true);
})();
