(()=>{
const attach=()=>{const rooms=document.querySelectorAll('.sg-room-view:not([data-sg-export-ready="1"]),.inner-view:not([data-sg-export-ready="1"])');rooms.forEach(room=>{if(window.SiapGuruExport)window.SiapGuruExport.attach(room)})};
document.addEventListener('click',()=>setTimeout(attach,120),false);
document.addEventListener('DOMContentLoaded',()=>{setTimeout(attach,120);const root=document.querySelector('.main-content')||document.body;if(root)new MutationObserver(()=>attach()).observe(root,{childList:true,subtree:true})});
})();