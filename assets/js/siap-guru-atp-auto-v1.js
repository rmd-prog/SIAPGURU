/* SIAP GURU — ATP AUTO: TP 1 TAHUN + JP OTOMATIS */
(()=>{
  const build=()=>{
    const room=document.querySelector('.sg-atp-room');
    if(!room||room.dataset.autoFinal==='1')return;
    room.dataset.autoFinal='1';
    const footer=room.querySelector('.sg-atp-footer'),btnHost=room.querySelector('#sgAtpAdd');
    const subject=room.querySelector('#sgAtpSubject'),phase=room.querySelector('#sgAtpPhase'),klass=room.querySelector('#sgAtpClass');
    const element=room.querySelector('#sgAtpElement'),list=room.querySelector('#sgAtpList'),name=room.querySelector('#sgAtpName'),total=room.querySelector('#sgAtpTotalJp'),notice=room.querySelector('#sgAtpNotice');
    if(!footer||!btnHost||!subject||!phase||!klass||!element||!list)return;
    const btn=document.createElement('button');btn.id='sgAtpAuto';btn.type='button';btn.className='sg-atp-primary';btn.textContent='⚡ Isi ATP Otomatis';footer.insertBefore(btn,footer.firstChild);
    const show=m=>{if(notice){notice.textContent=m;notice.classList.add('is-show');clearTimeout(show.t);show.t=setTimeout(()=>notice.classList.remove('is-show'),4200)}};
    const JP={'Pendidikan Agama Islam dan Budi Pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},'Pendidikan Agama Kristen dan Budi Pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},'Pendidikan Agama Katolik dan Budi Pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},'Pendidikan Agama Hindu dan Budi Pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},'Pendidikan Agama Buddha dan Budi Pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},'Pendidikan Agama Khonghucu dan Budi Pekerti':{1:108,2:108,3:108,4:108,5:108,6:96},'Pendidikan Pancasila':{1:144,2:144,3:144,4:144,5:144,6:128},'Bahasa Indonesia':{1:252,2:288,3:216,4:216,5:216,6:192},'Matematika':{1:144,2:180,3:180,4:180,5:180,6:160},'IPAS':{1:0,2:0,3:180,4:180,5:180,6:160},'Ilmu Pengetahuan Alam dan Sosial':{1:0,2:0,3:180,4:180,5:180,6:160},'Pendidikan Jasmani Olahraga dan Kesehatan':{1:108,2:108,3:108,4:108,5:108,6:96},'PJOK':{1:108,2:108,3:108,4:108,5:108,6:96},'Seni Musik':{1:108,2:108,3:108,4:108,5:108,6:96},'Seni Rupa':{1:108,2:108,3:108,4:108,5:108,6:96},'Seni Tari':{1:108,2:108,3:108,4:108,5:108,6:96},'Seni Teater':{1:108,2:108,3:108,4:108,5:108,6:96},'Seni dan Budaya':{1:108,2:108,3:108,4:108,5:108,6:96},'Bahasa Inggris':{1:0,2:0,3:72,4:72,5:72,6:64},'Koding dan Kecerdasan Artifisial':{1:0,2:0,3:0,4:0,5:72,6:64},'Informatika':{1:0,2:0,3:0,4:0,5:0,6:0}};
    const refAnnual=()=>Number(JP[subject.value]?.[klass.value]||0);
    const weeks=()=>klass.value==='6'?32:36;
    const semesterWeeks=()=>room.querySelector('#sgAtpSemester')?.value==='2'?(klass.value==='6'?14:18):18;
    const refSemester=()=>{const annual=refAnnual();return annual?Math.round(annual/weeks()*semesterWeeks()):0};
    const getJSON=key=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch(_){return null}};
    const clean=s=>String(s??'').replace(/\s+/g,' ').trim();
    const tpDraft=()=>getJSON('siapguru_tp_draft')||{};
    const atpDraft=()=>getJSON('siapguru_atp_draft')||{};
    const getTPYear=()=>{
      for(const key of ['siapguru_tp_year_draft','siapguru_tp_1tahun','siapguru_tp_year','siapguru_tp_master']){
        const v=getJSON(key);if(v&&((Array.isArray(v)&&v.length)||(Array.isArray(v.items)&&v.items.length)))return Array.isArray(v)?{items:v}:v;
      }
      return tpDraft();
    };
    const match=p=>{if(!p)return false;const s=clean(p.subject||p.mapel),c=clean(p.class||p.kelas),f=clean(p.phase||p.fase);return (!s||s===clean(subject.value))&&(!c||c===clean(klass.value))&&(!f||f===clean(phase.value))};
    const distribute=(n,target)=>{if(!n)return[];const t=Math.max(n,Math.round(Number(target)||n)),base=Math.floor(t/n),rem=t%n;return Array.from({length:n},(_,i)=>Math.max(1,base+(i<rem?1:0)))};
    const save=()=>{const items=[...list.querySelectorAll('.sg-atp-item')].map(item=>({text:item.querySelector('.sg-atp-text')?.textContent.trim()||'',element:item.dataset.element||'',cp:item.dataset.cp||'',jp:item.querySelector('.sg-atp-jp')?.value||1}));localStorage.setItem('siapguru_atp_draft',JSON.stringify({name:name?.value.trim()||`ATP ${subject.value} Kelas ${klass.value} Fase ${phase.value}`,semester:room.querySelector('#sgAtpSemester')?.value||'1',totalJp:total?.value||'',group:room.querySelector('#sgAtpGroup')?.value||'umum',subject:subject.value,phase:phase.value,class:klass.value,items}))};
    const make=()=>{
      const addItem=window.__sgAtpAddItem;if(typeof addItem!=='function'){show('ATP belum siap. Tunggu sebentar lalu coba lagi.');return}
      const source=getTPYear();let items=Array.isArray(source.items)?source.items.filter(it=>clean(it.text||it.tp)):[];
      if(source.subject&&!match(source))items=[];
      if(!items.length){const current=tpDraft();if(match(current)&&Array.isArray(current.items))items=current.items.filter(it=>clean(it.text||it.tp));}
      if(!items.length){show('TP 1 tahun belum ditemukan. Buat dan simpan TP terlebih dahulu.');return}
      const annual=refAnnual();const semester=room.querySelector('#sgAtpSemester')?.value||'1';
      const semesterTarget=annual?refSemester():Math.max(1,Math.round((items.reduce((sum,it)=>sum+(Number(it.jp)||0),0)||2)/2));
      const jps=distribute(items.length,semesterTarget);
      list.innerHTML='';
      items.forEach((it,i)=>{element.value=element.value;addItem();const item=list.lastElementChild;if(!item)return;const text=item.querySelector('.sg-atp-text'),inp=item.querySelector('.sg-atp-jp');if(text)text.textContent=clean(it.text||it.tp);if(inp)inp.value=jps[i];item.dataset.element=clean(it.element||it.elemen)||'Elemen CP';item.dataset.cp=clean(it.cp||it.cpText)});
      if(name&&!name.value.trim())name.value=`ATP ${subject.value} Kelas ${klass.value} Fase ${phase.value}`;
      if(total)total.value=jps.reduce((a,b)=>a+b,0);
      save();window.dispatchEvent(new CustomEvent('sg:atp-updated'));
      show(`${items.length} TP terbaca dari TP 1 tahun • ${jps.reduce((a,b)=>a+b,0)} JP semester ${semester} • referensi ${annual||'berdasarkan TP'} JP/tahun.`);
    };
    btn.addEventListener('click',make);
    [subject,phase,klass,room.querySelector('#sgAtpSemester')].filter(Boolean).forEach(el=>el.addEventListener('change',()=>show('Pilihan berubah. Klik “Isi ATP Otomatis” untuk membaca TP dan menghitung JP ulang.')));
  };
  window.addEventListener('sg:atp-room-ready',build,{once:false});
  document.addEventListener('click',e=>{const l=e.target.closest?.('.sg-topnav-link');if(l&&l.textContent.trim()==='ATP')setTimeout(build,50)},true);
  if(document.querySelector('.sg-atp-room'))build();
})();
