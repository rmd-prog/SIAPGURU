/* SIAP GURU — navigation stability
   ATP bridges are lazy-loaded only when ATP is opened.
   This keeps the Beranda lightweight and avoids background ATP observers/polling.
*/
(()=>{
  const resetRpmGuard=(event)=>{
    const target=event.target instanceof Element?event.target:null;
    const link=target?.closest('.sg-topnav-link');
    if(link&&link.textContent.trim()==='RPM Deep Learning')window.__sgRpmBoot=0;
  };
  document.addEventListener('pointerdown',resetRpmGuard,true);
  document.addEventListener('click',resetRpmGuard,true);

  const loadScript=(src,marker)=>{
    if(document.querySelector(`script[data-${marker}]`))return;
    const s=document.createElement('script');
    s.src=src;
    s.dataset[marker]='1';
    document.head.appendChild(s);
  };

  // RPM CP bridge is safe to load globally; ATP-specific bridges are lazy.
  loadScript('assets/js/siap-guru-rpm-cp-final-v1.js?v=1','rpmCpFinal');

  const loadAtpBridges=()=>{
    loadScript('assets/js/siap-guru-atp-auto-v1.js?v=4','atpAutoFinal');
    loadScript('assets/js/siap-guru-atp-preview.js?v=4','atpPreview');
    loadScript('assets/js/siap-guru-atp-document-preview-sync-v2.js?v=4','atpDocumentPreviewSync');
  };

  // Capture before the ATP room is created. The ATP core then creates the room,
  // and the lazy-loaded scripts attach to that room afterward.
  document.addEventListener('click',e=>{
    const target=e.target instanceof Element?e.target:null;
    const link=target?.closest('.sg-topnav-link');
    if(link&&link.textContent.trim()==='ATP')loadAtpBridges();
  },true);
})();
