(()=>{
  const KEY='siapguru_tp_draft';
  const norm=v=>String(v??'').toLowerCase().replace(/[^a-z0-9\u00C0-\u024F]+/g,' ').trim().replace(/\s+/g,' ');
  const parse=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){return null}};
  const text=v=>String(v??'').trim();
  const sameTopic=(a,b)=>{a=norm(a);b=norm(b);if(!a||!b)return true;return a===b||a.includes(b)||b.includes(a)};
  const syncFields=(room,p)=>{
    const set=(id,v)=>{const el=room.querySelector(id);if(el&&v!=null&&String(v).trim())el.value=String(v)};
    set('#sgRSubject',p.subject);set('#sgRPhase',p.phase);set('#sgRClass',p.class);set('#sgRSemester',p.semester||'1');set('#sgRTopic',p.topic);set('#sgRJP',p.jp||p.totalJp||2);
  };
  const importTP=(room,announce=true)=>{
    const p=parse();
    const list=room.querySelector('#sgRTpList');
    if(!p||!Array.isArray(p.items)||!p.items.length){announce&&alertNotice(room,'Belum ada TP tersimpan. Buat dan simpan TP terlebih dahulu.');return false}
    const current=text(room.querySelector('#sgRTopic')?.value);
    const saved=text(p.topic);
    if(current&&saved&&!sameTopic(current,saved)){
      alertNotice(room,`TP tersimpan untuk BAB “${saved}”, bukan BAB “${current}”.`);return false;
    }
    syncFields(room,p);
    const items=p.items.map((x,i)=>({text:text(x?.text??x?.tp),element:text(x?.element)||'-',jp:Number(x?.jp)||2})).filter(x=>x.text);
    if(!items.length){announce&&alertNotice(room,'Data TP tersimpan tidak berisi tujuan pembelajaran yang valid.');return false}
    list.innerHTML=items.map((x,i)=>`<label class="sg-rpm-tp"><input type="checkbox" checked data-tp="${i}"><div><strong>TP ${i+1}. ${escapeHtml(x.text)}</strong><small>Elemen CP: ${escapeHtml(x.element)} • ${x.jp} JP</small></div></label>`).join('');
    room.__sgRpmFixItems=items;
    room.querySelector('#sgRConscious')?.dispatchEvent(new Event('input',{bubbles:true}));
    announce&&alertNotice(room,`${items.length} TP berhasil diambil dari TP.`);
    return true;
  };
  const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const alertNotice=(room,msg)=>{
    const n=room.querySelector('#sgRNotice');if(!n)return;
    n.textContent=msg;n.hidden=false;clearTimeout(room.__sgRpmFixTimer);room.__sgRpmFixTimer=setTimeout(()=>n.hidden=true,3000);
  };
  const patch=room=>{
    if(!room||room.dataset.sgRpmFix==='1')return;
    room.dataset.sgRpmFix='1';
    const btn=room.querySelector('#sgRLoad');
    if(btn){
      btn.onclick=e=>{e?.preventDefault();e?.stopPropagation();importTP(room,true)};
    }
    const topic=room.querySelector('#sgRTopic');
    topic?.addEventListener('change',()=>{if(text(topic.value))importTP(room,false)});
    topic?.addEventListener('blur',()=>{if(text(topic.value))importTP(room,false)});
    if(text(topic?.value))importTP(room,false);
  };
  const scan=()=>document.querySelectorAll('.sg-rpm-room').forEach(patch);
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('siapguru:topic-selected',()=>setTimeout(scan,30));
  document.addEventListener('click',e=>{
    const b=e.target.closest('#sgRLoad');
    if(b){const room=b.closest('.sg-rpm-room');if(room){e.preventDefault();e.stopImmediatePropagation();importTP(room,true)}}
  },true);
  scan();
})();