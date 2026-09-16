(()=>{
function loadRoomVisual(){let l=document.querySelector('link[data-sg-room-visual]');if(!l){l=document.createElement('link');l.rel='stylesheet';l.dataset.sgRoomVisual='1';document.head.appendChild(l)}l.href='assets/css/siap-guru-room-visual-v1.css?v=4'}
function cleanDuplicateNav(){document.getElementById('sg-top-navigation')?.remove();document.querySelectorAll('.sg-top-item,.sg-top-dropdown,.sg-top-btn').forEach(el=>el.remove())}
function sync(){const home=document.getElementById('homeView');const room=!!home&&home.hidden;document.body.classList.toggle('sg-room-mode',room);document.querySelector('.main-content')?.classList.toggle('sg-room-mode',room)}
function boot(){document.body.classList.add('sg-ui-v2');cleanDuplicateNav();loadRoomVisual();sync()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
new MutationObserver(()=>{cleanDuplicateNav();sync()}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class']});
})();
