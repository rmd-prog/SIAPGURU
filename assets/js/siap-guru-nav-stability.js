/* SIAP GURU — navigation stability
   Feature bridges are lazy-loaded only when their menu is opened.
   The Beranda stays lightweight; feature work starts inside its own room.
*/
(()=>{
  const resetRpmGuard=(event)=>{const target=event.target instanceof Element?event.target:null;const link=target?.closest('.sg-topnav-link');if(link&&link.textContent.trim()==='RPM Deep Learning')window.__sgRpmBoot=0};
  document.addEventListener('pointerdown',resetRpmGuard,true);
  document.addEventListener('click',resetRpmGuard,true);
  const loadScript=(src,marker)=>{if(document.querySelector(`script[data-${marker}]`))return;const s=document.createElement('script');s.src=src;s.dataset[marker]='1';document.head.appendChild(s)};
  loadScript('assets/js/siap-guru-rpm-cp-final-v1.js?v=1','rpmCpFinal');
  const loadAtpBridges=()=>{
    loadScript('assets/js/siap-guru-atp-auto-v1.js?v=5','atpAutoFinal');
    loadScript('assets/js/siap-guru-atp-preview.js?v=5','atpPreview');
    loadScript('assets/js/siap-guru-atp-document-preview-sync-v2.js?v=5','atpDocumentPreviewSync');
  };
  const loadTpBridges=()=>{
    loadScript('assets/js/siap-guru-tp-auto-v1.js?v=1','tpAutoV1');
    loadScript('assets/js/siap-guru-tp-master-bridge-v1.js?v=1','tpMasterBridgeV1');
  };
  document.addEventListener('click',e=>{
    const target=e.target instanceof Element?e.target:null;
    const link=target?.closest('.sg-topnav-link');
    if(!link)return;
    const label=link.textContent.trim();
    if(label==='ATP')loadAtpBridges();
    if(label==='TP')loadTpBridges();
  },true);
})();
