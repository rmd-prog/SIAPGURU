(()=>{
  const KEY='siapguru_visual_layout_v1';
  const themes={
    compact:{name:'Compact',desc:'Padat dan efisien untuk kerja desktop.',accent:'#365f86'},
    clean:{name:'Clean',desc:'Ringan, putih, dan fokus pada isi.',accent:'#52677b'},
    workspace:{name:'Workspace',desc:'Ruang kerja profesional dan seimbang.',accent:'#2f5f88'},
    modern:{name:'Modern',desc:'Card modern dengan ruang yang tetap ringkas.',accent:'#405f78'},
    table:{name:'Table Focus',desc:'Mengutamakan tabel, form, dan data kerja.',accent:'#345b78'}
  };
  let active=localStorage.getItem(KEY)||'workspace';
  if(!themes[active]) active='workspace';
  const styleId='sg-visual-engine-style-v1';
  const panelId='sg-visual-engine-panel-v1';
  const buttonId='sg-visual-engine-button-v1';
  const baseCSS=`
    body.sg-visual-engine-active .sg-room-view{width:100%!important;max-width:1180px!important;margin:0 auto!important;padding:0 0 28px!important}
    body.sg-visual-engine-active .sg-room-view .sg-room-head{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:16px!important;margin:0 0 12px!important;padding:15px 18px!important;border:1px solid #dfe5eb!important;border-radius:12px!important;background:#fff!important;box-shadow:0 4px 16px rgba(31,48,66,.045)!important}
    body.sg-visual-engine-active .sg-room-view .sg-room-title-row{gap:9px!important;margin-top:4px!important}
    body.sg-visual-engine-active .sg-room-view .sg-room-icon{width:32px!important;height:32px!important;flex-basis:32px!important;border-radius:8px!important;background:#f4f7fa!important;font-size:9px!important}
    body.sg-visual-engine-active .sg-room-view .sg-room-title-row h1{font-size:20px!important;letter-spacing:-.02em!important}
    body.sg-visual-engine-active .sg-room-view .sg-room-title-row p{font-size:10.5px!important;max-width:760px!important}
    body.sg-visual-engine-active .sg-room-view .sg-room-status{padding:5px 8px!important;font-size:8px!important}
    body.sg-visual-engine-active .sg-room-view input:not([type=checkbox]):not([type=radio]),body.sg-visual-engine-active .sg-room-view select,body.sg-visual-engine-active .sg-room-view textarea{border-radius:7px!important;min-height:34px!important}
    body.sg-visual-engine-active .sg-room-view button{border-radius:7px!important}
    body.sg-visual-engine-active .sg-room-view [class*="-card"],body.sg-visual-engine-active .sg-room-view .card,body.sg-visual-engine-active .sg-room-view .panel,body.sg-visual-engine-active .sg-room-view [class*="-panel"]{border-radius:10px!important;box-shadow:0 3px 14px rgba(31,48,66,.035)!important}
    body.sg-visual-engine-active .sg-room-view .sg-atp-grid{display:flex!important;flex-direction:column!important;grid-template-columns:1fr!important;width:100%!important;gap:12px!important}
    body.sg-visual-engine-active .sg-room-view .sg-atp-grid>.sg-atp-panel{width:100%!important;max-width:none!important;position:static!important;grid-column:auto!important;grid-row:auto!important}
    body.sg-visual-engine-active .sg-room-view .sg-atp-fields{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:8px!important}
    body.sg-visual-engine-active .sg-room-view .sg-atp-list{max-height:none!important;width:100%!important}
    body.sg-visual-engine-active .sg-room-view table{font-size:10.5px!important}
    body.sg-visual-engine-active .sg-room-view th{font-size:9px!important;padding:7px 8px!important}
    body.sg-visual-engine-active .sg-room-view td{padding:7px 8px!important}
    body.sg-visual-engine-active .sg-room-view .toolbar,body.sg-visual-engine-active .sg-room-view [class*="toolbar"],body.sg-visual-engine-active .sg-room-view [class*="actions"]{gap:6px!important}
    @media(max-width:1100px){body.sg-visual-engine-active .sg-room-view .sg-atp-fields{grid-template-columns:repeat(3,minmax(0,1fr))!important}}
    @media(max-width:700px){body.sg-visual-engine-active .sg-room-view{padding:0 0 20px!important}body.sg-visual-engine-active .sg-room-view .sg-room-head{display:block!important;padding:13px!important;border-radius:10px!important}body.sg-visual-engine-active .sg-room-view .sg-room-title-row h1{font-size:18px!important}body.sg-visual-engine-active .sg-room-view .sg-atp-fields{grid-template-columns:1fr!important}body.sg-visual-engine-active .sg-room-view .sg-atp-grid{gap:10px!important}}
  `;
  const themeCSS={
    compact:`body.sg-visual-engine-active .sg-room-view{max-width:1240px!important}body.sg-visual-engine-active .sg-room-view .sg-room-head{padding:11px 15px!important}body.sg-visual-engine-active .sg-room-view .sg-room-title-row h1{font-size:18px!important}body.sg-visual-engine-active .sg-room-view .sg-room-body{font-size:11px!important}`,
    clean:`body.sg-visual-engine-active .sg-room-view .sg-room-head{box-shadow:none!important;background:#fff!important}body.sg-visual-engine-active .sg-room-view [class*="-card"],body.sg-visual-engine-active .sg-room-view .card,body.sg-visual-engine-active .sg-room-view .panel,body.sg-visual-engine-active .sg-room-view [class*="-panel"]{box-shadow:none!important}`,
    workspace:`body.sg-visual-engine-active .sg-room-view{max-width:1180px!important}body.sg-visual-engine-active .sg-room-view .sg-room-head{box-shadow:0 5px 18px rgba(31,48,66,.055)!important}`,
    modern:`body.sg-visual-engine-active .sg-room-view .sg-room-head{border-radius:15px!important;padding:17px 20px!important}body.sg-visual-engine-active .sg-room-view [class*="-card"],body.sg-visual-engine-active .sg-room-view .card,body.sg-visual-engine-active .sg-room-view .panel,body.sg-visual-engine-active .sg-room-view [class*="-panel"]{border-radius:13px!important}`,
    table:`body.sg-visual-engine-active .sg-room-view .sg-room-head{margin-bottom:8px!important}body.sg-visual-engine-active .sg-room-view table{font-size:11px!important}body.sg-visual-engine-active .sg-room-view th{font-size:9.5px!important}`
  };
  const ensureStyle=()=>{
    let s=document.getElementById(styleId);
    if(!s){s=document.createElement('style');s.id=styleId;document.head.appendChild(s)}
    s.textContent=baseCSS+(themeCSS[active]||themeCSS.workspace);
    document.body.classList.add('sg-visual-engine-active');
    document.body.dataset.sgVisualTheme=active;
  };
  const ensureUI=()=>{
    if(!document.body||document.getElementById(buttonId))return;
    const b=document.createElement('button');b.id=buttonId;b.type='button';b.textContent='🎨 Visual Layout';b.title='Pilih tampilan kamar SIAP GURU';
    Object.assign(b.style,{position:'fixed',right:'14px',bottom:'14px',zIndex:'9998',border:'1px solid #d8e0e8',borderRadius:'9px',padding:'8px 11px',background:'#fff',color:'#33485d',font:'700 11px system-ui,sans-serif',boxShadow:'0 5px 18px rgba(20,35,50,.10)',cursor:'pointer'});
    b.onclick=()=>{const p=document.getElementById(panelId);if(p)p.hidden=!p.hidden};
    document.body.appendChild(b);
    const p=document.createElement('aside');p.id=panelId;p.hidden=true;
    Object.assign(p.style,{position:'fixed',right:'14px',bottom:'58px',zIndex:'9999',width:'290px',maxWidth:'calc(100vw - 28px)',padding:'12px',border:'1px solid #dbe3ea',borderRadius:'12px',background:'#fff',boxShadow:'0 12px 35px rgba(20,35,50,.14)',font:'12px system-ui,sans-serif',color:'#2f4052'});
    p.innerHTML='<strong style="display:block;font-size:13px;margin-bottom:3px">Visual Layout</strong><span style="display:block;color:#788899;font-size:10px;margin-bottom:10px">Satu tema untuk semua kamar. Tidak mengubah data atau fungsi.</span><div id="sg-visual-options" style="display:grid;gap:6px"></div>';
    document.body.appendChild(p);
    const box=p.querySelector('#sg-visual-options');
    Object.entries(themes).forEach(([key,t])=>{const x=document.createElement('button');x.type='button';x.dataset.theme=key;x.style.cssText='text-align:left;border:1px solid #e0e6ec;border-radius:8px;background:#fff;padding:8px 9px;cursor:pointer;color:#34495d';x.innerHTML='<strong style="display:block;font-size:11px">'+t.name+'</strong><span style="display:block;color:#7a8998;font-size:9px;margin-top:2px">'+t.desc+'</span>';x.onclick=()=>{active=key;localStorage.setItem(KEY,key);ensureStyle();refresh()};box.appendChild(x)});
    function refresh(){box.querySelectorAll('button').forEach(x=>{x.style.borderColor=x.dataset.theme===active?themes[active].accent:'#e0e6ec';x.style.background=x.dataset.theme===active?'#f5f8fb':'#fff'})}
    refresh();
    document.addEventListener('click',e=>{if(p.hidden)return;if(!p.contains(e.target)&&e.target!==b)p.hidden=true});
  };
  const boot=()=>{ensureStyle();ensureUI()};
  boot();
  const mo=new MutationObserver(()=>{ensureStyle();ensureUI()});
  mo.observe(document.body,{childList:true,subtree:true});
})();
