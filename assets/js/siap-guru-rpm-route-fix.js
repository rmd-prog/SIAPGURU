(()=>{
  let busy=false;
  document.addEventListener('click',e=>{
    const link=e.target.closest?.('.sg-topnav-link');
    if(!link || link.textContent.trim()!=='RPM Deep Learning' || busy) return;
    setTimeout(()=>{
      if(document.querySelector('.sg-rpm-room')) return;
      busy=true;
      window.__sgRpmBoot=0;
      const s=document.createElement('script');
      s.src='assets/js/siap-guru-rpm.js?route='+Date.now();
      s.onload=()=>{
        window.__sgRpmBoot=0;
        busy=false;
        const rpmLink=[...document.querySelectorAll('.sg-topnav-link')].find(x=>x.textContent.trim()==='RPM Deep Learning');
        if(rpmLink) rpmLink.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));
      };
      s.onerror=()=>{busy=false;console.error('RPM bootstrap gagal dimuat')};
      document.head.appendChild(s);
    },0);
  });
})();
