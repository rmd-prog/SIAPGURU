(()=>{
  'use strict';
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const readJson=(storage,key)=>{try{return JSON.parse(storage.getItem(key)||'null')||{}}catch{return {}}};
  const getIdentity=()=>{
    try{
      const api=window.SiapGuruSchoolInfo;
      const d=api?.get?.()||{};
      const t=api?.getTeacher?.()||{};
      const u=readJson(sessionStorage,'siapguru_user');
      const domName=document.getElementById('teacherName')?.textContent?.trim()||document.getElementById('userNameTop')?.textContent?.trim()||'';
      return {
        school:d.namaSekolah||'',
        headName:d.kepalaNama||'',
        headNip:d.kepalaNip||'',
        headTitle:d.kepalaJabatan||'Kepala Sekolah',
        teacherName:t.nama||u.nama||u.name||domName||'',
        teacherNip:t.nip||u.username||u.nip||''
      };
    }catch{return {school:'',headName:'',headNip:'',headTitle:'Kepala Sekolah',teacherName:'',teacherNip:''}}
  };
  const render=room=>{
    if(!room)return;
    const root=room.querySelector('.sg-v4');
    if(!root)return;
    const id=getIdentity();
    let box=root.querySelector('.sg-v4-sign');
    if(!box){box=document.createElement('div');box.className='sg-v4-sign';root.appendChild(box)}
    box.innerHTML=`<div class="sg-v4-sign-col"><p>Mengetahui,</p><strong>${esc(id.headTitle||'Kepala Sekolah')}</strong><div class="sg-v4-sign-space"></div><strong>${esc(id.headName||'—')}</strong><span>NIP. ${esc(id.headNip||'—')}</span></div><div class="sg-v4-sign-col"><p>Guru / Pendidik</p><div class="sg-v4-sign-space"></div><strong>${esc(id.teacherName||'—')}</strong><span>NIP. ${esc(id.teacherNip||'—')}</span></div><div class="sg-v4-sign-school">${esc(id.school||'')}</div>`;
    if(!document.getElementById('sg-v4-signing-css')){
      const s=document.createElement('style');s.id='sg-v4-signing-css';
      s.textContent=`.sg-v4-sign{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:80px;margin:34px 10px 10px;page-break-inside:avoid;break-inside:avoid}.sg-v4-sign-col{text-align:center;min-height:170px}.sg-v4-sign-col p{margin:0 0 8px}.sg-v4-sign-col strong,.sg-v4-sign-col span{display:block}.sg-v4-sign-space{height:64px}.sg-v4-sign-col span{font-size:12px}.sg-v4-sign-school{grid-column:1/-1;text-align:center;font-size:9px;opacity:.7;margin-top:-18px}@media print{.sg-v4-sign{grid-template-columns:1fr 1fr!important;gap:70px!important;margin-top:34px!important}.sg-v4-sign-col{min-height:170px!important}}@media(max-width:700px){.sg-v4-sign{gap:24px}}`;
      document.head.appendChild(s);
    }
  };
  const scan=room=>{const target=room||document.querySelector('.sg-prosem-matrix-room');if(target)render(target)};
  window.__sgRenderProsemSigning=scan;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();
  const obs=new MutationObserver(()=>scan());obs.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('siapguru:school-info-updated',()=>scan());
})();
