(()=>{
  const RPM_SRC='assets/js/siap-guru-rpm.js';
  let retrying=false;
  const open=()=>{
    window.__sgRpmBoot=0;
    if(document.querySelector('.sg-rpm-room')) return;
    const retry=()=>{
      if(document.querySelector('.sg-rpm-room')) return;
      const links=[...document.querySelectorAll('.sg-topnav-link')].filter(x=>x.textContent.trim()==='RPM Deep Learning');
      const link=links[0];
      if(!link) return;
      if(retrying) return;
      retrying=true;
      const s=document.createElement('script');
      s.src=RPM_SRC+'?v=7&retry='+Date.now();
      s.onload=()=>{
        retrying=false;
        window.__sgRpmBoot=0;
        link.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
      };
      s.onerror=()=>{retrying=false};
      document.head.appendChild(s);
    };
    setTimeout(retry,0);
  };
  document.addEventListener('click',e=>{
    const link=e.target.closest?.('.sg-topnav-link');
    if(!link || link.textContent.trim()!=='RPM Deep Learning') return;
    open();
  },true);
})();
