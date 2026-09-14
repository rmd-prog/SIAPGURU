/* SIAP GURU — navigation stability
   Feature bridges are lazy-loaded only when their menu is opened.
*/
(()=>{
  const resetRpmGuard=(event)=>{const target=event.target instanceof Element?event.target:null;const link=target?.closest('.sg-topnav-link');if(link&&link.textContent.trim()==='RPM Deep Learning')window.__sgRpmBoot=0};
  document.addEventListener('pointerdown',resetRpmGuard,true);
  document.addEventListener('click',resetRpmGuard,true);
  const loadScript=(src,marker,done)=>{
    const existing=document.querySelector(`script[data-${marker}]`);
    if(existing){if(existing.dataset.ready==='1'){done?.();return}existing.addEventListener('load',()=>{existing.dataset.ready='1';done?.()},{once:true});existing.addEventListener('error',()=>done?.(),{once:true});return}
    const s=document.createElement('script');s.src=src;s.dataset[marker]='1';s.onload=()=>{s.dataset.ready='1';done?.()};s.onerror=()=>done?.();document.head.appendChild(s);
  };
  const loadAtpBridges=()=>{
    loadScript('assets/js/siap-guru-atp-auto-v1.js?v=5','atpAutoFinal');
    loadScript('assets/js/siap-guru-atp-preview.js?v=5','atpPreview');
    loadScript('assets/js/siap-guru-atp-document-preview-sync-v2.js?v=5','atpDocumentPreviewSync');
    loadScript('assets/js/siap-guru-atp-actions-v1.js?v=1','atpActionsV1');
  };
  const loadTpBridges=done=>{
    loadScript('assets/js/siap-guru-tp-auto-v1.js?v=2','tpAutoV4',()=>{
      loadScript('assets/js/siap-guru-tp-master-bridge-v1.js?v=1','tpMasterBridgeV1');
      loadScript('assets/js/siap-guru-tp-master-select-bridge-v1.js?v=1','tpMasterSelectBridgeV1');
      loadScript('assets/js/siap-guru-tp-topic-dropdown-v1.js?v=1','tpTopicDropdownV1');
      loadScript('assets/js/siap-guru-tp-topic-smart-v2.js?v=2','tpTopicSmartV2');
      loadScript('assets/js/siap-guru-tp-atp-import-sync-v1.js?v=1','tpAtpImportSyncV1');
      done?.();
    });
  };
  document.addEventListener('click',e=>{
    const target=e.target instanceof Element?e.target:null;
    const link=target?.closest('.sg-topnav-link');
    if(!link)return;
    const label=link.textContent.trim();
    if(label==='ATP'){loadAtpBridges();return}
    if(label!=='TP'||e.__sgTpReplay)return;
    e.preventDefault();e.stopImmediatePropagation();
    loadTpBridges(()=>{
      const ev=new MouseEvent('click',{bubbles:true,cancelable:true,view:window});
      Object.defineProperty(ev,'__sgTpReplay',{value:true});
      link.dispatchEvent(ev);
    });
  },true);
})();
