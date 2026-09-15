(()=>{
  const KEY='siapguru_visual_layout_v1';
  const themes={
    compact:{name:'Compact',desc:'Padat, rapat, maksimal untuk laptop.'},
    clean:{name:'Clean',desc:'Putih bersih, ringan, fokus isi.'},
    workspace:{name:'Workspace',desc:'Ruang kerja profesional seimbang.'},
    modern:{name:'Modern',desc:'Card modern dengan hierarki tegas.'},
    table:{name:'Table Focus',desc:'Form dan tabel menjadi pusat kerja.'}
  };
  let active=localStorage.getItem(KEY)||'workspace';
  if(!themes[active])active='workspace';
  const styleId='sg-visual-engine-style-v1',panelId='sg-visual-engine-panel-v1',buttonId='sg-visual-engine-button-v1',toastId='sg-visual-engine-toast-v1';

  const common=`
body.sg-visual-engine-active .sg-room-view{width:100%!important;max-width:1200px!important;margin:0 auto!important;padding:0 0 30px!important;transition:max-width .25s ease,background .25s ease}
body.sg-visual-engine-active .sg-room-view .sg-room-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;margin:0 0 14px!important;padding:16px 19px!important;border:1px solid #dfe5eb!important;border-radius:12px!important;background:#fff!important;box-shadow:0 5px 18px rgba(31,48,66,.055)!important;transition:.25s ease}
body.sg-visual-engine-active .sg-room-view .sg-room-title-row{gap:10px!important;margin-top:4px!important}
body.sg-visual-engine-active .sg-room-view .sg-room-icon{width:34px!important;height:34px!important;flex:0 0 34px!important;border-radius:8px!important;background:#f3f6f9!important;font-size:9px!important}
body.sg-visual-engine-active .sg-room-view .sg-room-title-row h1{font-size:20px!important;letter-spacing:-.02em!important}
body.sg-visual-engine-active .sg-room-view .sg-room-title-row p{font-size:10.5px!important}
body.sg-visual-engine-active .sg-room-view input:not([type=checkbox]):not([type=radio]),body.sg-visual-engine-active .sg-room-view select,body.sg-visual-engine-active .sg-room-view textarea{border-radius:7px!important;min-height:34px!important}
body.sg-visual-engine-active .sg-room-view button{border-radius:7px!important}
body.sg-visual-engine-active .sg-room-view [class*="-card"],body.sg-visual-engine-active .sg-room-view .card,body.sg-visual-engine-active .sg-room-view .panel,body.sg-visual-engine-active .sg-room-view [class*="-panel"]{border-radius:10px!important;box-shadow:0 3px 14px rgba(31,48,66,.035)!important;transition:.25s ease}
body.sg-visual-engine-active .sg-room-view .sg-atp-grid{display:flex!important;flex-direction:column!important;grid-template-columns:1fr!important;width:100%!important;gap:12px!important}
body.sg-visual-engine-active .sg-room-view .sg-atp-grid>.sg-atp-panel{width:100%!important;max-width:none!important;position:static!important;grid-column:auto!important;grid-row:auto!important}
body.sg-visual-engine-active .sg-room-view .sg-atp-fields{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:8px!important}
body.sg-visual-engine-active .sg-room-view .sg-atp-list{max-height:none!important;width:100%!important}
body.sg-visual-engine-active .sg-room-view table{font-size:10.5px!important;width:100%!important}
body.sg-visual-engine-active .sg-room-view th{font-size:9px!important;padding:7px 8px!important}
body.sg-visual-engine-active .sg-room-view td{padding:7px 8px!important}
@media(max-width:1100px){body.sg-visual-engine-active .sg-room-view .sg-atp-fields{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
@media(max-width:700px){body.sg-visual-engine-active .sg-room-view{padding:0 0 20px!important}body.sg-visual-engine-active .sg-room-view .sg-room-head{display:block!important;padding:13px!important}body.sg-visual-engine-active .sg-room-view .sg-room-title-row h1{font-size:18px!important}body.sg-visual-engine-active .sg-room-view .sg-atp-fields{grid-template-columns:1fr!important}body.sg-visual-engine-active .sg-room-view .sg-atp-grid{gap:10px!important}}
`;
  const themeCSS={
    compact:`body.sg-visual-engine-active{background:#f4f6f8!important}body.sg-visual-engine-active .sg-room-view{max-width:1280px!important}body.sg-visual-engine-active .sg-room-view .sg-room-head{padding:10px 14px!important;margin-bottom:9px!important;border-radius:7px!important;box-shadow:none!important;border-left:4px solid #365f86!important}body.sg-visual-engine-active .sg-room-view .sg-room-title-row h1{font-size:17px!important}body.sg-visual-engine-active .sg-room-view .sg-room-title-row p{display:none!important}body.sg-visual-engine-active .sg-room-view [class*="-card"],body.sg-visual-engine-active .sg-room-view .card,body.sg-visual-engine-active .sg-room-view .panel,body.sg-visual-engine-active .sg-room-view [class*="-panel"]{border-radius:6px!important;box-shadow:none!important}body.sg-visual-engine-active .sg-room-view table th,body.sg-visual-engine-active .sg-room-view table td{padding:5px 7px!important}`,
    clean:`body.sg-visual-engine-active{background:#fff!important}body.sg-visual-engine-active .sg-room-view{max-width:1120px!important}body.sg-visual-engine-active .sg-room-view .sg-room-head{box-shadow:none!important;border-radius:8px!important;border-color:#e7eaee!important}body.sg-visual-engine-active .sg-room-view [class*="-card"],body.sg-visual-engine-active .sg-room-view .card,body.sg-visual-engine-active .sg-room-view .panel,body.sg-visual-engine-active .sg-room-view [class*="-panel"]{box-shadow:none!important;border-radius:8px!important;background:#fff!important}body.sg-visual-engine-active .sg-room-view table th{background:#fafbfc!important}`,
    workspace:`body.sg-visual-engine-active{background:#f6f8fa!important}body.sg-visual-engine-active .sg-room-view{max-width:1200px!important}body.sg-visual-engine-active .sg-room-view .sg-room-head{box-shadow:0 5px 18px rgba(31,48,66,.055)!important}`,
    modern:`body.sg-visual-engine-active{background:#eef2f6!important}body.sg-visual-engine-active .sg-room-view{max-width:1260px!important}body.sg-visual-engine-active .sg-room-view .sg-room-head{padding:18px 21px!important;border-radius:16px!important;box-shadow:0 10px 28px rgba(31,48,66,.075)!important;border:1px solid #d5dde6!important}body.sg-visual-engine-active .sg-room-view .sg-room-icon{width:40px!important;height:40px!important;flex-basis:40px!important;border-radius:11px!important}body.sg-visual-engine-active .sg-room-view .sg-room-title-row h1{font-size:22px!important}body.sg-visual-engine-active .sg-room-view [class*="-card"],body.sg-visual-engine-active .sg-room-view .card,body.sg-visual-engine-active .sg-room-view .panel,body.sg-visual-engine-active .sg-room-view [class*="-panel"]{border-radius:14px!important;box-shadow:0 7px 22px rgba(31,48,66,.06)!important}body.sg-visual-engine-active .sg-room-view button{border-radius:9px!important}`,
    table:`body.sg-visual-engine-active{background:#f2f4f6!important}body.sg-visual-engine-active .sg-room-view{max-width:1320px!important}body.sg-visual-engine-active .sg-room-view .sg-room-head{margin-bottom:8px!important;padding:12px 16px!important;border-radius:8px!important;box-shadow:none!important;border-bottom:3px solid #345b78!important}body.sg-visual-engine-active .sg-room-view .sg-room-title-row h1{font-size:18px!important}body.sg-visual-engine-active .sg-room-view [class*="-card"],body.sg-visual-engine-active .sg-room-view .card,body.sg-visual-engine-active .sg-room-view .panel,body.sg-visual-engine-active .sg-room-view [class*="-panel"]{border-radius:5px!important;box-shadow:none!important}body.sg-visual-engine-active .sg-room-view table{border-collapse:collapse!important}body.sg-visual-engine-active .sg-room-view table th{background:#e7edf2!important;font-size:9.5px!important}body.sg-visual-engine-active .sg-room-view table td,body.sg-visual-engine-active .sg-room-view table th{border:1px solid #d2dbe3!important;padding:6px 7px!important}`
  };

  const ensureStyle=()=>{
    let s=document.getElementById(styleId);
    if(!s){s=document.createElement('style');s.id=styleId;document.head.appendChild(s)}
    s.textContent=common+(themeCSS[active]||themeCSS.workspace);
    document.body.classList.add('sg-visual-engine-active');
    document.body.dataset.sgVisualTheme=active;
  };

  const toast=(message,ok=false)=>{
    let t=document.getElementById(toastId);
    if(!t){t=document.createElement('div');t.id=toastId;document.body.appendChild(t)}
    t.textContent=message;
    t.style.cssText='position:fixed;left:50%;bottom:22px;transform:translate(-50%,20px);opacity:0;z-index:10001;max-width:calc(100vw - 30px);padding:10px 15px;border:1px solid #d6dee7;border-radius:10px;background:#fff;color:#34495d;font:700 12px system-ui,sans-serif;box-shadow:0 10px 28px rgba(20,35,50,.16);transition:.2s ease;pointer-events:none;text-align:center;white-space:nowrap';
    if(ok)t.style.borderColor='#9db6c9';
    requestAnimationFrame(()=>{t.style.opacity='1';t.style.transform='translate(-50%,0)'});
    clearTimeout(t._timer);t._timer=setTimeout(()=>{t.style.opacity='0';t.style.transform='translate(-50%,20px)'},ok?1300:1800);
  };

  const ensureUI=()=>{
    if(!document.body)return;
    let b=document.getElementById(buttonId);
    if(!b){
      b=document.createElement('button');b.id=buttonId;b.type='button';b.textContent='🎨 Visual Layout';b.title='Pilih tampilan kamar SIAP GURU';
      Object.assign(b.style,{position:'fixed',right:'14px',bottom:'14px',zIndex:'9998',border:'1px solid #d8e0e8',borderRadius:'9px',padding:'8px 11px',background:'#fff',color:'#33485d',font:'700 11px system-ui,sans-serif',boxShadow:'0 5px 18px rgba(20,35,50,.10)',cursor:'pointer'});
      b.onclick=()=>{const p=document.getElementById(panelId);if(p)p.hidden=!p.hidden};document.body.appendChild(b);
    }
    let p=document.getElementById(panelId);
    if(!p){
      p=document.createElement('aside');p.id=panelId;p.hidden=true;
      Object.assign(p.style,{position:'fixed',right:'14px',bottom:'58px',zIndex:'9999',width:'290px',maxWidth:'calc(100vw - 28px)',padding:'12px',border:'1px solid #dbe3ea',borderRadius:'12px',background:'#fff',boxShadow:'0 12px 35px rgba(20,35,50,.14)',font:'12px system-ui,sans-serif',color:'#2f4052'});
      p.innerHTML='<strong style="display:block;font-size:13px;margin-bottom:3px">Visual Layout</strong><span style="display:block;color:#788899;font-size:10px;margin-bottom:10px">Pilih gaya kamar untuk mengubah layout visual.</span><div id="sg-visual-options" style="display:grid;gap:6px"></div>';
      document.body.appendChild(p);
      const box=p.querySelector('#sg-visual-options');
      Object.entries(themes).forEach(([key,t])=>{
        const x=document.createElement('button');x.type='button';x.dataset.theme=key;x.style.cssText='text-align:left;border:1px solid #e0e6ec;border-radius:8px;background:#fff;padding:8px 9px;cursor:pointer;color:#34495d';
        x.innerHTML='<strong style="display:block;font-size:11px">'+t.name+'</strong><span style="display:block;color:#7a8998;font-size:9px;margin-top:2px">'+t.desc+'</span>';
        x.onclick=()=>{
          active=key;localStorage.setItem(KEY,key);
          toast('⏳ Tema '+t.name+' sedang diproses...');
          p.hidden=true;
          setTimeout(()=>{ensureStyle();refresh();toast('✓ Tema '+t.name+' sudah diterapkan',true)},350);
        };
        box.appendChild(x);
      });
      const refresh=()=>box.querySelectorAll('button').forEach(x=>{x.style.borderColor=x.dataset.theme===active?'#365f86':'#e0e6ec';x.style.background=x.dataset.theme===active?'#f5f8fb':'#fff'});
      p._refresh=refresh;refresh();
      document.addEventListener('click',e=>{if(p.hidden)return;if(!p.contains(e.target)&&e.target!==b)p.hidden=true});
    }else if(p._refresh)p._refresh();
  };

  const boot=()=>{ensureStyle();ensureUI()};
  boot();
  new MutationObserver(()=>ensureUI()).observe(document.body,{childList:true,subtree:true});
})();
