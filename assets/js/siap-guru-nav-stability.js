/* SIAP GURU navigation stability */
(()=>{
  const resetRpmGuard=(event)=>{const target=event.target instanceof Element?event.target:null;const link=target?.closest('.sg-topnav-link');if(link&&link.textContent.trim()==='RPM Deep Learning')window.__sgRpmBoot=0};
  document.addEventListener('pointerdown',resetRpmGuard,true);
  document.addEventListener('click',resetRpmGuard,true);
  const loadScript=(src,marker)=>{if(document.querySelector(`script[data-${marker}]`))return;const s=document.createElement('script');s.src=src;s.dataset[marker]='1';document.head.appendChild(s)};
  const loadBridges=()=>{
    loadScript('assets/js/siap-guru-rpm-cp-final-v1.js?v=1','rpmCpFinal');
    loadScript('assets/js/siap-guru-atp-auto-v1.js?v=3','atpAutoFinal');
    loadScript('assets/js/siap-guru-atp-preview.js?v=3','atpPreview');
    loadScript('assets/js/siap-guru-atp-document-preview-sync-v2.js?v=3','atpDocumentPreviewSync');
  };
  const boot=()=>{loadBridges();setTimeout(loadBridges,300)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();