/* SIAP GURU — ATP AUTO FINAL v6
   Sumber ATP: TP 1 tahun yang tersimpan.
   Urutan: BAB/Materi -> TP -> ATP. JP mengikuti TP pada semester aktif.
*/
(()=>{
  if(window.__sgAtpAutoV6)return;
  window.__sgAtpAutoV6=1;
  const read=(key,store=localStorage)=>{try{return JSON.parse(store.getItem(key)||'null')}catch(_){return null}};
  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
  const build=()=>{
    const room=document.querySelector('.sg-atp-room');
    if(!room)return;
    const footer=room.querySelector('.sg-atp-footer');
    const btnHost=room.querySelector('#sgAtpAdd');
    const subject=room.querySelector('#sgAtpSubject');
    const phase=room.querySelector('#sgAtpPhase');
    const klass=room.querySelector('#sgAtpClass');
    const element=room.querySelector('#sgAtpElement');
    const list=room.querySelector('#sgAtpList');
    const name=room.querySelector('#sgAtpName');
    const total=room.querySelector('#sgAtpTotalJp');
    const semester=room.querySelector('#sgAtpSemester');
    const notice=room.querySelector('#sgAtpNotice');
    if(!footer||!btnHost||!subject||!phase||!klass||!element||!list)return;
    if(room.querySelector('#sgAtpAuto'))return;
    const btn=document.createElement('button');
    btn.id='sgAtpAuto';btn.type='button';btn.className='sg-atp-primary';btn.textContent='⚡ Isi ATP Otomatis';
    footer.insertBefore(btn,footer.firstChild);
    const show=m=>{if(!notice)return;notice.textContent=m;notice.classList.add('is-show');clearTimeout(show.t);show.t=setTimeout(()=>notice.classList.remove('is-show'),3500)};
    const tp=()=>read('siapguru_tp_draft')||{};
    const getItems=()=>{const d=tp();let items=Array.isArray(d.items)?d.items:[];const wanted=String(semester?.value||'1');const same=items.filter(x=>String(x.semester||wanted)===wanted&&clean(x.text||x.tp));return same.length?same:items.filter(x=>clean(x.text||x.tp));};
    const save=items=>{localStorage.setItem('siapguru_atp_draft',JSON.stringify({name:clean(name?.value)||`ATP ${clean(subject.value)} Kelas ${clean(klass.value)} Fase ${clean(phase.value)}`,semester:String(semester?.value||'1'),subject:clean(subject.value),phase:clean(phase.value),class:clean(klass.value),totalJp:Number(total?.value)||items.reduce((n,x)=>n+Math.max(1,Number(x.jp)||1),0),items:items.map(x=>({text:clean(x.text||x.tp),element:clean(x.element),cp:clean(x.cp||x.cpText),jp:Math.max(1,Number(x.jp)||1),semester:String(x.semester||semester?.value||'1'),topic:clean(x.topic||x.bab)}))}))};
    const make=()=>{
      const source=getItems();
      if(!source.length){show('TP 1 tahun belum tersedia. Generate TP dari BAB/Materi terlebih dahulu.');return;}
      const addItem=window.__sgAtpAddItem;
      if(typeof addItem!=='function'){show('ATP belum siap. Buka ulang menu ATP lalu coba lagi.');return;}
      list.innerHTML='';
      const opts=[...element.options];
      source.forEach((x,i)=>{
        const el=clean(x.element)||clean(opts[i%Math.max(1,opts.length)]?.textContent)||'Elemen CP';
        if(opts.length){const hit=opts.find(o=>clean(o.textContent)===el)||opts[i%opts.length];if(hit)element.value=hit.value;}
        addItem();
        const item=list.lastElementChild;if(!item)return;
        const text=item.querySelector('.sg-atp-text');if(text)text.textContent=clean(x.text||x.tp);
        item.dataset.element=el;item.dataset.cp=clean(x.cp||x.cpText);item.dataset.topic=clean(x.topic||x.bab);
        const jp=item.querySelector('.sg-atp-jp');if(jp)jp.value=Math.max(1,Number(x.jp)||1);
      });
      const sum=[...list.querySelectorAll('.sg-atp-item .sg-atp-jp')].reduce((n,x)=>n+Math.max(1,Number(x.value)||1),0);
      if(total)total.value=sum;
      if(name&&!clean(name.value))name.value=`ATP ${clean(subject.value)} Kelas ${clean(klass.value)} Fase ${clean(phase.value)}`;
      const finalItems=source.map(x=>({...x,semester:String(x.semester||semester?.value||'1'),text:clean(x.text||x.tp),jp:Math.max(1,Number(x.jp)||1)}));
      save(finalItems);window.dispatchEvent(new CustomEvent('sg:atp-updated'));
      show(`${source.length} ATP mengikuti TP • ${sum} JP semester ${semester?.value||'1'} • sumber: TP 1 tahun.`);
    };
    btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();make()});
    semester?.addEventListener('change',()=>show('Semester berubah. Klik “Isi ATP Otomatis” untuk mengambil TP semester yang sesuai.'));
  };
  const watch=()=>setTimeout(build,80);
  window.addEventListener('sg:atp-room-ready',watch);
  document.addEventListener('click',e=>{const l=e.target.closest?.('.sg-topnav-link');if(l&&clean(l.textContent)==='ATP')watch()},true);
  if(document.querySelector('.sg-atp-room'))build();
})();