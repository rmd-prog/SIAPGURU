(()=>{
  'use strict';
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const readJson=(storage,key)=>{try{return JSON.parse(storage.getItem(key)||'null')||{}}catch{return {}}};
  const getUser=()=>readJson(sessionStorage,'siapguru_user');
  const getSchool=()=>{const d=readJson(localStorage,'siapguru_school_info_v1');return {
    namaSekolah:d.namaSekolah||'',
    kepalaNama:d.kepalaNama||'',
    kepalaNip:d.kepalaNip||'',
    kepalaJabatan:d.kepalaJabatan||'Kepala Sekolah'
  }};
  const getTeacher=()=>{
    try{
      if(window.SiapGuruSchoolInfo&&typeof window.SiapGuruSchoolInfo.getTeacher==='function'){
        const t=window.SiapGuruSchoolInfo.getTeacher()||{};
        if(t.nama||t.nip)return t;
      }
    }catch{}
    const u=getUser();
    return {nama:u.nama||u.name||u.namaGuru||u.fullName||'',nip:u.nip||u.username||u.nipGuru||''};
  };
  const render=room=>{
    if(!room)return;
    const root=room.querySelector('.sg-v4');
    if(!root)return;
    const p=readJson(localStorage,'siapguru_prota_draft');
    const school=getSchool();
    const teacher=getTeacher();
    const schoolName=school.namaSekolah||p.school||'SDN Muarasari 1';
    const headName=school.kepalaNama||'—';
    const headNip=school.kepalaNip||'—';
    const headTitle=school.kepalaJabatan||'Kepala Sekolah';
    const teacherName=teacher.nama||'—';
    const teacherNip=teacher.nip||'—';
    let box=root.querySelector('.sg-v4-sign');
    if(!box){box=document.createElement('div');box.className='sg-v4-sign';root.appendChild(box)}
    box.innerHTML=`<div class="sg-v4-sign-col"><div>Mengetahui,<br>${esc(headTitle)}</div><div class="sg-v4-sign-space"></div><strong>${esc(headName)}</strong><div>NIP. ${esc(headNip)}</div></div><div class="sg-v4-sign-col"><div>Guru / Pendidik</div><div class="sg-v4-sign-space"></div><strong>${esc(teacherName)}</strong><div>NIP. ${esc(teacherNip)}</div></div><div class="sg-v4-sign-school">${esc(schoolName)}</div>`;
    if(!document.getElementById('sg-v4-signing-css')){
      const s=document.createElement('style');s.id='sg-v4-signing-css';
      s.textContent=`.sg-v4-sign{display:grid;grid-template-columns:1fr 1fr;gap:80px;margin:28px 8px 8px;font-size:10px;line-height:1.45;page-break-inside:avoid;break-inside:avoid}.sg-v4-sign-col{text-align:center;min-height:120px}.sg-v4-sign-space{height:54px}.sg-v4-sign-col strong{display:block;font-weight:800}.sg-v4-sign-col>div:last-child{margin-top:2px}.sg-v4-sign-school{grid-column:1/-1;text-align:center;font-size:9px;opacity:.7;margin-top:-18px}@media(max-width:700px){.sg-v4-sign{gap:24px}}@media print{.sg-v4-sign{margin-top:22px;font-size:9px;gap:60px}.sg-v4-sign-space{height:48px}}`;
      document.head.appendChild(s);
    }
  };
  const scan=()=>{const room=document.querySelector('.sg-prosem-matrix-room');if(room)render(room)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();
  const obs=new MutationObserver(scan);obs.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('siapguru:school-info-updated',scan);
})();
