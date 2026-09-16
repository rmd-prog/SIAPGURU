/* SIAP GURU — navigation stability */
(()=>{
  const resetRpmGuard=e=>{const l=(e.target instanceof Element)?e.target.closest('.sg-topnav-link'):null;if(l&&l.textContent.trim()==='RPM Deep Learning')window.__sgRpmBoot=0};
  document.addEventListener('pointerdown',resetRpmGuard,true);document.addEventListener('click',resetRpmGuard,true);
  const load=(src,marker)=>{if(document.querySelector(`script[data-${marker}]`))return;const s=document.createElement('script');s.src=src;s.dataset[marker]='1';document.head.appendChild(s)};
  document.addEventListener('click',e=>{
    const l=(e.target instanceof Element)?e.target.closest('.sg-topnav-link'):null;if(!l)return;
    const label=l.textContent.trim();
    if(label==='ATP'){
      load('assets/js/siap-guru-atp-auto-v1.js?v=6','atpAutoFinalV6');
      load('assets/js/siap-guru-atp-preview.js?v=5','atpPreview');
      load('assets/js/siap-guru-atp-document-preview-sync-v2.js?v=5','atpDocumentPreviewSync');
    }
    if(label==='TP'){
      load('assets/js/siap-guru-tp-auto-v1.js?v=4','tpAutoV4');
      load('assets/js/siap-guru-tp-master-bridge-v1.js?v=1','tpMasterBridgeV1');
      load('assets/js/siap-guru-tp-master-select-bridge-v1.js?v=1','tpMasterSelectBridgeV1');
      load('assets/js/siap-guru-tp-topic-dropdown-v1.js?v=1','tpTopicDropdownV1');
      load('assets/js/siap-guru-tp-topic-smart-v2.js?v=2','tpTopicSmartV2');
      load('assets/js/siap-guru-tp-atp-import-sync-v1.js?v=1','tpAtpImportSyncV1');
      load('assets/js/siap-guru-tp-annual-v1.js?v=1','tpAnnualV1');
    }
  },true);
})();