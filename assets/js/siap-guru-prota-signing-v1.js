(()=>{
 const KEY='siapguru_prota_signing_v1';
 const months=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
 const read=()=>{try{return localStorage.getItem(KEY)||''}catch{return ''}};
 const write=v=>{try{localStorage.setItem(KEY,v||'')}catch{}};
 const place=()=>{try{const d=window.SiapGuruSchoolInfo?.get?.()||{};return d.kabupaten||d.kecamatan||d.provinsi||''}catch{return ''}};
 const format=v=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(v||''))return 'Tanggal pengesahan belum diatur';const [y,m,d]=v.split('-').map(Number);return `${place()?place()+', ':''}${d} ${months[m-1]} ${y}`};
 const update=()=>{document.querySelectorAll('.sg-school-sign-right [data-prota-sign-date]').forEach(el=>el.textContent=format(read()))};
 const inject=room=>{
  if(!room||room.dataset.protaSigningV1)return;
  const command=room.querySelector('.sg-prota-command');if(!command)return;
  room.dataset.protaSigningV1='1';
  const box=document.createElement('div');box.className='sg-prota-signing-setting';box.innerHTML=`<div><span class="sg-prota-command-label">PENGESAHAN PROTA</span><strong>Tanggal Pengesahan</strong><small>Pilih manual. Tidak mengikuti tanggal hari ini dan tidak tampil sebagai menu di hasil Generate.</small></div><label><span>Tanggal</span><input type="date" id="sgProtaSigningDate" value="${read()}"></label><button type="button" id="sgProtaSigningClear">Kosongkan</button>`;
  command.after(box);
  box.querySelector('#sgProtaSigningDate')?.addEventListener('change',e=>{write(e.target.value);update()});
  box.querySelector('#sgProtaSigningClear')?.addEventListener('click',()=>{write('');const i=box.querySelector('#sgProtaSigningDate');if(i)i.value='';update()});
  update();
 };
 const scan=()=>{const room=document.querySelector('.sg-prota-room');if(room)inject(room);update()};
 const style=()=>{if(document.getElementById('sg-prota-signing-v1-style'))return;const s=document.createElement('style');s.id='sg-prota-signing-v1-style';s.textContent='.sg-prota-signing-setting{display:grid;grid-template-columns:minmax(0,1fr) 190px auto;gap:12px;align-items:end;margin:14px 0 18px;padding:14px 16px;border:1px solid rgba(15,23,42,.09);border-radius:14px;background:rgba(15,23,42,.025)}.sg-prota-signing-setting>div{display:flex;flex-direction:column;gap:4px}.sg-prota-signing-setting strong{font-size:14px}.sg-prota-signing-setting small{font-size:11px;opacity:.62}.sg-prota-signing-setting label{display:flex;flex-direction:column;gap:5px;font-size:11px;font-weight:700}.sg-prota-signing-setting input{box-sizing:border-box;width:100%;border:1px solid #d8dee6;border-radius:9px;padding:9px 10px;background:#fff;color:inherit}.sg-prota-signing-setting button{border:1px solid #d8dee6;border-radius:9px;padding:9px 12px;background:#fff;color:inherit;cursor:pointer}.sg-school-prota-sign{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}.sg-school-prota-sign .sg-school-sign-right p[data-prota-sign-date]{min-height:18px}@media(max-width:760px){.sg-prota-signing-setting{grid-template-columns:1fr}.sg-prota-signing-setting button{justify-self:start}}';document.head.appendChild(s)};
 const init=()=>{style();scan();const root=document.querySelector('.main-content')||document.body;const obs=new MutationObserver(()=>{clearTimeout(obs.t);obs.t=setTimeout(scan,80)});obs.observe(root,{childList:true,subtree:true});window.addEventListener('siapguru:school-info-updated',()=>{scan()})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.SiapGuruProtaSigning={getDate:read,setDate:v=>{write(v);update()},format};
})();