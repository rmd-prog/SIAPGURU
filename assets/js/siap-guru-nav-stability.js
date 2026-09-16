/* SIAP GURU — navigation stability */
(()=>{
  const getLink=e=>{const t=e.target instanceof Element?e.target:null;const x=t?.closest('.sg-topnav-link,.sub-menu span');if(!x)return null;const label=x.textContent.trim();return ['ATP','TP','PROSEM','RPM Deep Learning'].includes(label)?x:null};
  const resetRpmGuard=e=>{const l=getLink(e);if(l&&l.textContent.trim()==='RPM Deep Learning')window.__sgRpmBoot=0};
  document.addEventListener('pointerdown',resetRpmGuard,true);document.addEventListener('click',resetRpmGuard,true);

  const findText=selector=>name=>[...document.querySelectorAll(selector)].find(x=>(x.textContent||'').trim().toLowerCase()===String(name).trim().toLowerCase());
  const originalSub=findText('.sub-menu span,.sub-menu-button');
  const topLink=findText('.sg-topnav-link');
  const fire=el=>{if(!el)return false;el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));return true};
  const originalView=name=>fire(topLink(name))||fire(originalSub(name));
  const home=()=>{document.querySelector('.sg-room-view')?.remove();const h=document.getElementById('homeView'),s=document.getElementById('studentsView'),p=document.getElementById('profileView');if(h)h.hidden=false;if(s)s.hidden=true;if(p)p.hidden=true;window.scrollTo({top:0,behavior:'smooth'});};
  const route=name=>{
    if(name==='Beranda'){home();return true}
    if(name==='Satuan Pendidikan'){if(typeof window.SiapGuruSchoolInfo?.open==='function'){window.SiapGuruSchoolInfo.open();return true}return false}
    const map={'Pembelajaran':'CP','Asesmen':'Penilaian','Peserta Didik':'Data Siswa','Dokumen':'Draft'};
    return originalView(map[name]||name);
  };
  const bridgeHomeV3=e=>{
    const t=e.target instanceof Element?e.target:null;if(!t)return;
    const nav=t.closest('.sg-home-v3-nav button');
    const card=t.closest('.sg-home-v3-card');
    if(!nav&&!card)return;
    const label=(nav||card).textContent.trim();
    if(!['Beranda','Pembelajaran','Asesmen','Peserta Didik','Dokumen','Satuan Pendidikan'].includes(label))return;
    e.preventDefault();e.stopImmediatePropagation();route(label);
  };
  document.addEventListener('click',bridgeHomeV3,true);

  const bridgeHomeV4=e=>{
    const t=e.target instanceof Element?t=e.target:null;
    if(!t)return;
    const item=t.closest('.sg-home-v4-item');
    if(!item)return;
    const name=(item.dataset.sghItem||item.textContent||'').trim();
    e.preventDefault();e.stopImmediatePropagation();
    if(name==='Profil Satuan Pendidikan'){if(typeof window.SiapGuruSchoolInfo?.open==='function')window.SiapGuruSchoolInfo.open();return}
    originalView(name);
  };
  document.addEventListener('click',bridgeHomeV4,true);

  const loadScript=(src,marker,onload)=>{if(document.querySelector(`script[data-${marker}]`)){if(typeof onload==='function')onload();return}const s=document.createElement('script');s.src=src;s.dataset[marker]='1';s.onload=()=>typeof onload==='function'&&onload();s.onerror=()=>console.error('[SIAP GURU] gagal memuat',src);document.head.appendChild(s)};
  const loadHomeV4=()=>{
    if(!document.querySelector('link[data-sg-home-v4]')){const l=document.createElement('link');l.rel='stylesheet';l.dataset.sgHomeV4='1';l.href='assets/css/siap-guru-home-v4.css?v=1';document.head.appendChild(l)}
    loadScript('assets/js/siap-guru-home-v4.js?v=1','homeV4');
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(loadHomeV4,180));else setTimeout(loadHomeV4,180);

  const openProsem=()=>loadScript('assets/js/siap-guru-prosem-matrix-v4.js?v=6','prosemMatrixFinalV6',()=>{loadScript('assets/js/siap-guru-prosem-signing-v1.js?v=1','prosemSigningV1',()=>{if(typeof window.__openSiapGuruProsem==='function')window.__openSiapGuruProsem()})});
  const replay=(link,marker)=>{link.classList.add('sg-topnav-link');const ev=new MouseEvent('click',{bubbles:true,cancelable:true,view:window});Object.defineProperty(ev,'__sg'+marker+'Replay',{value:true});link.dispatchEvent(ev)};
  document.addEventListener('click',e=>{
    const link=getLink(e);if(!link)return;const label=link.textContent.trim();
    if(label==='PROSEM'){e.preventDefault();e.stopImmediatePropagation();openProsem();return}
    if(label==='ATP'){if(e.__sgAtpReplay)return;e.preventDefault();e.stopImmediatePropagation();loadScript('assets/js/siap-guru-atp-auto-v1.js?v=5','atpAutoFinal');loadScript('assets/js/siap-guru-atp-preview.js?v=5','atpPreview');loadScript('assets/js/siap-guru-atp-document-preview-sync-v2.js?v=6','atpDocumentPreviewSync');loadScript('assets/js/siap-guru-atp-actions-v1.js?v=1','atpActionsV1');loadScript('assets/js/siap-guru-atp-ui-fix-v1.js?v=1','atpUiFixV1');loadScript('assets/js/siap-guru-atp-topic-v1.js?v=2','atpTopicV1');replay(link,'Atp');return}
    if(label!=='TP'||e.__sgTpReplay)return;e.preventDefault();e.stopImmediatePropagation();loadScript('assets/js/siap-guru-tp-auto-v1.js?v=2','tpAutoV4');loadScript('assets/js/siap-guru-tp-master-bridge-v1.js?v=1','tpMasterBridgeV1');loadScript('assets/js/siap-guru-tp-master-select-bridge-v1.js?v=1','tpMasterSelectBridgeV1');loadScript('assets/js/siap-guru-tp-topic-dropdown-v1.js?v=1','tpTopicDropdownV1');loadScript('assets/js/siap-guru-tp-topic-smart-v2.js?v=2','tpTopicSmartV2');loadScript('assets/js/siap-guru-tp-atp-import-sync-v1.js?v=1','tpAtpImportSyncV1');replay(link,'Tp');
  },true);
})();