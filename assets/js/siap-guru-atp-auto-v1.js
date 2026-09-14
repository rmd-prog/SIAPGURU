/* SIAP GURU — ATP AUTO FINAL
   CP -> ATP otomatis -> TP -> RPM.
   JP memakai alokasi intrakurikuler SD sesuai Permendikdasmen 13/2025.
   Tidak menyentuh D1, Worker, login, Dashboard, atau RPM FINAL.
*/
(()=>{
  const build=()=>{
    const room=document.querySelector('.sg-atp-room');
    if(!room||room.dataset.autoFinal==='1')return;
    room.dataset.autoFinal='1';
    const footer=room.querySelector('.sg-atp-footer'),btnHost=room.querySelector('#sgAtpAdd');
    const subject=room.querySelector('#sgAtpSubject'),phase=room.querySelector('#sgAtpPhase'),klass=room.querySelector('#sgAtpClass');
    const element=room.querySelector('#sgAtpElement'),list=room.querySelector('#sgAtpList'),name=room.querySelector('#sgAtpName'),total=room.querySelector('#sgAtpTotalJp'),notice=room.querySelector('#sgAtpNotice');
    if(!footer||!btnHost||!subject||!phase||!klass||!element||!list)return;
    const btn=document.createElement('button');
    btn.id='sgAtpAuto';btn.type='button';btn.className='sg-atp-primary';btn.textContent='⚡ Isi ATP Otomatis';
    footer.insertBefore(btn,footer.firstChild);
    const show=m=>{if(notice){notice.textContent=m;notice.classList.add('is-show');clearTimeout(show.t);show.t=setTimeout(()=>notice.classList.remove('is-show'),3200)}};
    const JP={'Pendidikan Agama Islam dan Budi Pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},'Pendidikan Agama Kristen dan Budi Pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},'Pendidikan Agama Katolik dan Budi Pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},'Pendidikan Agama Hindu dan Budi Pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},'Pendidikan Agama Buddha dan Budi Pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},'Pendidikan Agama Khonghucu dan Budi Pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},'Pendidikan Pancasila':{1:144,2:144,3:144,4:144,5:144,6:128},'Bahasa Indonesia':{1:252,2:288,3:216,4:216,5:216,6:192},'Matematika':{1:144,2:180,3:180,4:180,5:180,6:160},'IPAS':{1:0,2:0,3:180,4:180,5:180,6:160},'Ilmu Pengetahuan Alam dan Sosial':{1:0,2:0,3:180,4:180,5:180,6:160},'Pendidikan Jasmani Olahraga dan Kesehatan':{1:108,2:108,3:108,4:108,5:108,6:96},'PJOK':{1:108,2:108,3:108,4:108,5:108,6:96},'Seni Musik':{1:108,2:108,3:108,4:108,5:108,6:96},'Seni Rupa':{1:108,2:108,3:108,4:108,5:108,6:96},'Seni Tari':{1:108,2:108,3:108,4:108,5:108,6:96},'Seni Teater':{1:108,2:108,3:108,4:108,5:108,6:96},'Seni dan Budaya':{1:108,2:108,3:108,4:108,5:108,6:96},'Bahasa Inggris':{1:0,2:0,3:72,4:72,5:72,6:64},'Koding dan Kecerdasan Artifisial':{1:0,2:0,3:0,4:0,5:72,6:64},'Informatika':{1:0,2:0,3:0,4:0,5:0,6:0}};
    const refAnnual=()=>Number(JP[subject.value]?.[klass.value]||0),weeks=()=>klass.value==='6'?32:36,semesterWeeks=()=>room.querySelector('#sgAtpSemester')?.value==='2'?(klass.value==='6'?14:18):18,refSemester=()=>{const annual=refAnnual();return annual?Math.round(annual/weeks()*semesterWeeks()):0};
    const clean=s=>String(s||'').replace(/\s+/g,' ').trim(),sentence=s=>{s=clean(s);return s?s.charAt(0).toLowerCase()+s.slice(1):''},verbFor=i=>['mengidentifikasi','menjelaskan','menerapkan','menganalisis','mengevaluasi','mengomunikasikan'][Math.min(i,5)];
    const makeText=(cp,el,i)=>{const c=sentence(cp),e=clean(el),v=verbFor(i);return c?`Peserta didik mampu ${v} ${c} melalui pembelajaran yang kontekstual dan bermakna pada elemen ${e}.`:`Peserta didik mampu ${v} konsep dan keterampilan pada elemen ${e} sesuai karakteristik Fase ${phase.value}.`};
    const distribute=(n,target)=>{if(!n||!target)return Array(n).fill(0);const a=Array(n).fill(1);let remain=Math.max(0,target-n),weights=Array.from({length:n},(_,i)=>i+1),sum=weights.reduce((x,y)=>x+y,0);for(let i=0;i<n;i++)a[i]+=Math.floor(remain*weights[i]/sum);let used=a.reduce((x,y)=>x+y,0),i=n-1;while(used<target){a[(i%n+n)%n]++;used++;i--}return a};
    const save=()=>{const items=[...list.querySelectorAll('.sg-atp-item')].map(item=>({text:item.querySelector('.sg-atp-text')?.textContent.trim()||'',element:item.dataset.element||'',cp:item.dataset.cp||'',jp:item.querySelector('.sg-atp-jp')?.value||1}));localStorage.setItem('siapguru_atp_draft',JSON.stringify({name:name?.value.trim()||`ATP ${subject.value} Kelas ${klass.value} Fase ${phase.value}`,semester:room.querySelector('#sgAtpSemester')?.value||'1',totalJp:total?.value||'',group:room.querySelector('#sgAtpGroup')?.value||'umum',subject:subject.value,phase:phase.value,class:klass.value,items}))};
    const make=()=>{const opts=[...element.options],annual=refAnnual(),target=refSemester(),addItem=window.__sgAtpAddItem;if(!opts.length){show('CP belum tersedia untuk pilihan ini.');return}if(!annual){show(`Referensi JP resmi belum tersedia untuk ${subject.value} kelas ${klass.value}; ATP tidak dipaksakan.`);return}if(typeof addItem!=='function'){show('ATP belum siap. Silakan tunggu sebentar lalu coba lagi.');return}list.innerHTML='';const jps=distribute(opts.length,target);opts.forEach((opt,i)=>{element.value=opt.value;addItem();const item=list.lastElementChild;if(!item)return;const text=item.querySelector('.sg-atp-text'),cp=item.dataset.cp||'',title=opt.textContent.trim();if(text)text.textContent=makeText(cp,title,i);item.dataset.element=title;item.dataset.cp=cp;const inp=item.querySelector('.sg-atp-jp');if(inp)inp.value=jps[i]});if(name&&!name.value.trim())name.value=`ATP ${subject.value} Kelas ${klass.value} Fase ${phase.value}`;if(total)total.value=target;save();window.dispatchEvent(new CustomEvent('sg:atp-updated'));show(`${opts.length} TP otomatis • ${target} JP semester ${room.querySelector('#sgAtpSemester')?.value||'1'} • ${annual} JP/tahun intrakurikuler • ${weeks()} minggu efektif.`)};
    btn.addEventListener('click',make);
    [subject,phase,klass,room.querySelector('#sgAtpSemester')].filter(Boolean).forEach(el=>el.addEventListener('change',()=>show('Pilihan berubah. Klik “Isi ATP Otomatis” agar CP, TP, dan JP dihitung ulang.')));
  };
  const watch=()=>{build();if(!document.querySelector('.sg-atp-room'))setTimeout(watch,500)};
  document.addEventListener('click',e=>{const l=e.target.closest('.sg-topnav-link');if(l&&l.textContent.trim()==='ATP')setTimeout(build,120)},true);
  watch();
})();