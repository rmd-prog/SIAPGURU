(()=>{
  'use strict';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const inject=room=>{
    if(!room||room.dataset.prosemSigningV1)return;
    const root=room.querySelector('.sg-v4');
    if(!root)return;
    room.dataset.prosemSigningV1='1';
    const p=(()=>{try{return JSON.parse(localStorage.getItem('siapguru_prota_draft')||'null')||{}}catch{return {}}})();
    const school=p.school||'SDN Muarasari 1';
    const year=p.year||'2026/2027';
    const box=document.createElement('div');
    box.className='sg-v4-sign';
    box.innerHTML=`<div class="sg-v4-sign-col"><div>Mengetahui,<br>Kepala Sekolah</div><div class="sg-v4-sign-space"></div><strong>(........................................)</strong><div>NIP. ................................</div></div><div class="sg-v4-sign-col"><div>Guru / Pendidik</div><div class="sg-v4-sign-space"></div><strong>(........................................)</strong><div>NIP. ................................</div></div>`;
    root.appendChild(box);
    if(!document.getElementById('sg-v4-signing-css')){
      const s=document.createElement('style');s.id='sg-v4-signing-css';
      s.textContent=`.sg-v4-sign{display:grid;grid-template-columns:1fr 1fr;gap:80px;margin:28px 8px 8px;font-size:10px;line-height:1.45;page-break-inside:avoid}.sg-v4-sign-col{text-align:center;min-height:120px}.sg-v4-sign-space{height:54px}.sg-v4-sign-col strong{display:block;font-weight:800}.sg-v4-sign-col>div:last-child{margin-top:2px}@media(max-width:700px){.sg-v4-sign{gap:24px}}@media print{.sg-v4-sign{margin-top:22px;font-size:9px;gap:60px}.sg-v4-sign-space{height:48px}}`;
      document.head.appendChild(s);
    }
  };
  const scan=()=>{const room=document.querySelector('.sg-prosem-matrix-room');if(room)inject(room)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();
  const obs=new MutationObserver(scan);obs.observe(document.body,{childList:true,subtree:true});
})();
