/* SIAP GURU — ATP AUTO: TP 1 TAHUN + JP OTOMATIS */
(()=>{
  const build=()=>{
    const room=document.querySelector('.sg-atp-room');
    if(!room)return;
    if(room.querySelector('#sgAtpAuto'))return;
    const actions=room.querySelector('.sg-atp-actionbar');
    const subject=room.querySelector('#sgAtpSubject'),phase=room.querySelector('#sgAtpPhase'),klass=room.querySelector('#sgAtpClass');
    const list=room.querySelector('#sgAtpList'),name=room.querySelector('#sgAtpName'),total=room.querySelector('#sgAtpTotalJp'),notice=room.querySelector('#sgAtpNotice');
    if(!actions||!subject||!phase||!klass||!list)return;
    const btn=document.createElement('button');btn.id='sgAtpAuto';btn.type='button';btn.className='sg-atp-secondary sg-atp-auto';btn.textContent='Isi ATP Otomatis';actions.insertBefore(btn,actions.firstChild);
    const show=m=>{if(!notice)return;notice.textContent=m;notice.classList.add('is-show');clearTimeout(show.t);show.t=setTimeout(()=>notice.classList.remove('is-show'),4500)};
    const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
    const getJSON=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
    const current=()=>getJSON('siapguru_tp_draft');
    const sources=()=>{
      const out=[];
      for(const k of ['siapguru_tp_year_draft','siapguru_tp_1tahun','siapguru_tp_year','siapguru_tp_master','siapguru_tp_draft']){
        const v=getJSON(k); if(v) out.push(v);
      }
      return out;
    };
    const matches=(v)=>{
      if(!v||Array.isArray(v))return true;
      const s=clean(v.subject||v.mapel),c=clean(v.class||v.kelas),f=clean(v.phase||v.fase);
      return (!s||s===clean(subject.value))&&(!c||c===clean(klass.value))&&(!f||f===clean(phase.value));
    };
    const getItems=v=>{
      if(Array.isArray(v))return v;
      if(v&&Array.isArray(v.items))return v.items;
      if(v&&Array.isArray(v.data))return v.data;
      return [];
    };
    const findTP=()=>{
      for(const source of sources()){
        if(!matches(source))continue;
        const items=getItems(source).map(it=>({
          text:clean(it.text||it.tp||it.tujuan),
          element:clean(it.element||it.elemen||it.elementCp),
          cp:clean(it.cp||it.cpText||it.capaian),
          jp:Number(it.jp)||0,
          semester:String(it.semester||'')
        })).filter(it=>it.text);
        if(items.length)return items;
      }
      return [];
    };
    const curriculumAnnual={'Pendidikan Pancasila':{1:144,2:144,3:144,4:144,5:144,6:128},'Bahasa Indonesia':{1:252,2:288,3:216,4:216,5:216,6:192},'Matematika':{1:144,2:180,3:180,4:180,5:180,6:160},'IPAS':{3:180,4:180,5:180,6:160},'PJOK':{1:108,2:108,3:108,4:108,5:108,6:96},'Seni Musik':{1:108,2:108,3:108,4:108,5:108,6:96},'Seni Rupa':{1:108,2:108,3:108,4:108,5:108,6:96},'Seni Tari':{1:108,2:108,3:108,4:108,5:108,6:96},'Seni Teater':{1:108,2:108,3:108,4:108,5:108,6:96},'Bahasa Inggris':{3:72,4:72,5:72,6:64}};
    const autoTarget=(items)=>{
      const entered=Number(total?.value||0);
      if(entered>0)return Math.round(entered);
      const fromTP=items.reduce((n,x)=>n+(x.jp||0),0);
      if(fromTP>0)return Math.round(fromTP);
      const annual=curriculumAnnual[subject.value]?.[klass.value]||0;
      if(!annual)return Math.max(items.length,items.length*2);
      return Math.round(annual/2);
    };
    const distribute=(n,target)=>{
      if(!n)return[];
      const t=Math.max(n,Math.round(target));
      const base=Math.floor(t/n),rem=t%n;
      return Array.from({length:n},(_,i)=>base+(i<rem?1:0));
    };
    btn.onclick=()=>{
      const add=window.__sgAtpAddItem;
      if(typeof add!=='function'){show('ATP belum siap. Coba buka ulang ATP.');return}
      const items=findTP();
      if(!items.length){show(`TP 1 tahun untuk ${subject.value} • Fase ${phase.value} • Kelas ${klass.value} belum ditemukan. Simpan TP terlebih dahulu.`);return}
      const target=autoTarget(items),jps=distribute(items.length,target);
      list.innerHTML='';
      items.forEach((it,i)=>{
        add({text:it.text,row:[it.element||'Elemen CP',it.cp||''],jp:jps[i]});
        const row=list.lastElementChild;
        if(row){row.dataset.element=it.element||'Elemen CP';row.dataset.cp=it.cp||'';const inp=row.querySelector('.sg-atp-jp');if(inp)inp.value=jps[i];}
      });
      if(total)total.value=jps.reduce((a,b)=>a+b,0);
      if(name&&!name.value.trim())name.value=`ATP ${subject.value} Kelas ${klass.value} Fase ${phase.value}`;
      const payload={name:name?.value||'',subject:subject.value,phase:phase.value,class:klass.value,semester:room.querySelector('#sgAtpSemester')?.value||'1',totalJp:String(jps.reduce((a,b)=>a+b,0)),items:items.map((it,i)=>({text:it.text,element:it.element,cp:it.cp,jp:jps[i]}))};
      localStorage.setItem('siapguru_atp_draft',JSON.stringify(payload));
      show(`${items.length} TP dari TP 1 tahun terbaca • ${payload.totalJp} JP dibagi otomatis.`);
    };
  };
  window.addEventListener('sg:atp-room-ready',build);
  document.addEventListener('click',e=>{const l=e.target.closest?.('.sg-topnav-link');if(l&&l.textContent.trim()==='ATP')setTimeout(build,120)},true);
  if(document.querySelector('.sg-atp-room'))build();
})();
