/* SIAP GURU — navigation stability */
(()=>{
  const resetRpmGuard=e=>{const t=e.target instanceof Element?e.target:null,l=t?.closest('.sg-topnav-link');if(l&&l.textContent.trim()==='RPM Deep Learning')window.__sgRpmBoot=0};
  document.addEventListener('pointerdown',resetRpmGuard,true);
  document.addEventListener('click',resetRpmGuard,true);
  const loadScript=(src,marker)=>{if(document.querySelector(`script[data-${marker}]`))return;const s=document.createElement('script');s.src=src;s.dataset[marker]='1';s.defer=true;document.head.appendChild(s)};
  const replay=(link,marker,after)=>{if(link.dataset.sgReplay==='1')return;link.dataset.sgReplay='1';const ev=new MouseEvent('click',{bubbles:true,cancelable:true,view:window});Object.defineProperty(ev,'__sg'+marker+'Replay',{value:true});link.dispatchEvent(ev)};
  document.addEventListener('click',e=>{
    const t=e.target instanceof Element?e.target:null,link=t?.closest('.sg-topnav-link');
    if(!link)return;
    const label=link.textContent.trim();
    if(label==='PROSEM'){
      if(e.__sgProsemReplay)return;
      e.preventDefault();e.stopImmediatePropagation();
      /* PROSEM itself owns its room-opening handler. Do not gate that click
         behind an optional bridge; otherwise a bridge failure can make PROSEM
         appear dead. Load the scope enhancer independently. */
      loadScript('assets/js/siap-guru-prosem-scope-v1.js?v=2','prosemScopeV2');
      replay(link,'Prosem');
      return;
    }
    if(label==='ATP'){
      if(e.__sgAtpReplay)return;
      e.preventDefault();e.stopImmediatePropagation();
      loadScript('assets/js/siap-guru-atp-auto-v1.js?v=5','atpAutoFinal');
      loadScript('assets/js/siap-guru-atp-preview.js?v=5','atpPreview');
      loadScript('assets/js/siap-guru-atp-document-preview-sync-v2.js?v=6','atpDocumentPreviewSync');
      loadScript('assets/js/siap-guru-atp-actions-v1.js?v=1','atpActionsV1');
      loadScript('assets/js/siap-guru-atp-ui-fix-v1.js?v=1','atpUiFixV1');
      loadScript('assets/js/siap-guru-atp-topic-v1.js?v=2','atpTopicV1');
      replay(link,'Atp');
      return;
    }
    if(label!=='TP'||e.__sgTpReplay)return;
    e.preventDefault();e.stopImmediatePropagation();
    loadScript('assets/js/siap-guru-tp-auto-v1.js?v=2','tpAutoV4');
    loadScript('assets/js/siap-guru-tp-master-bridge-v1.js?v=1','tpMasterBridgeV1');
    loadScript('assets/js/siap-guru-tp-master-select-bridge-v1.js?v=1','tpMasterSelectBridgeV1');
    loadScript('assets/js/siap-guru-tp-topic-dropdown-v1.js?v=1','tpTopicDropdownV1');
    loadScript('assets/js/siap-guru-tp-topic-smart-v2.js?v=2','tpTopicSmartV2');
    loadScript('assets/js/siap-guru-tp-atp-import-sync-v1.js?v=1','tpAtpImportSyncV1');
    replay(link,'Tp');
  },true);
})();
