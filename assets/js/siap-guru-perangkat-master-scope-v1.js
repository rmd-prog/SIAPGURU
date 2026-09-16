/* SIAP GURU — Master BAB scope bridge v2
   Scope dropdown + repair active BAB context without replacing Auto V2 logic.
   TP/Materi tetap memakai logika Auto V2; bridge hanya memastikan TP/JP dan
   field pelengkap tidak jatuh kembali ke data global.
*/
(()=>{
  const ROOM='.sg-perangkat-room',KEY='siapguru_selected_topic';
  const text=v=>String(v??'').trim();
  const esc=s=>text(s).replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const roman={i:1,ii:2,iii:3,iv:4,v:5,vi:6};
  const kelas=v=>{const s=text(v).toLowerCase().replace(/^kelas\s*/,'').replace(/[^iv0-9]/g,'');return roman[s]||Number(s)||0};
  const norm=v=>text(v).toLowerCase().replace(/\s+/g,' ');
  const selected=()=>{try{return JSON.parse(sessionStorage.getItem(KEY)||'null')||{}}catch(_){return {}}};
  const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(_){return null}};
  const scopeRows=(room)=>{
    const rows=window.SiapGuruMasterBab?.getAll?.();
    if(!Array.isArray(rows)||!rows.length)return [];
    const s=selected(), cls=kelas(room.querySelector('#sgPaClass')?.value)||kelas(s?.kelas), mapel=norm(room.querySelector('#sgPaSubject')?.value)||norm(s?.mapel||s?.mapelName);
    let out=rows.filter(r=>r?.bab&&(!cls||kelas(r.kelas)===cls)&&(!mapel||norm(r.mapel)===mapel));
    if(!out.length&&mapel)out=rows.filter(r=>r?.bab&&(!cls||kelas(r.kelas)===cls)&&norm(r.mapel).includes(mapel));
    return out.filter((r,i,a)=>{const b=text(r.bab);return b&&!a.slice(0,i).some(x=>text(x.bab)===b)});
  };
  const activeRow=(room)=>{const value=text(room.querySelector('#sgPaTopic')?.value),rows=scopeRows(room);return rows.find(r=>text(r.bab)===value)||null};
  const rowIndex=(row,rows)=>{const m=String(row?.id||'').match(/-(\d+)$/);if(m)return Number(m[1]);const i=rows.findIndex(x=>String(x.id||'')===String(row?.id||''));return i>=0?i+1:0};
  const collectRecords=()=>{
    const out=[];
    const pick=(x,...keys)=>{for(const k of keys){if(x&&x[k]!=null&&text(x[k]))return x[k]}return ''};
    const add=(x,parent={},inheritedTopic='',inheritedSemester='')=>{
      if(!x||typeof x!=='object')return {topic:inheritedTopic,semester:inheritedSemester,mapel:parent.mapel||'',kelas:parent.kelas||''};
      const topic=text(pick(x,'topic','topik','bab','babTopik','bab_topik','judulBab','judulTopik','chapter','unit'))||inheritedTopic;
      const tp=text(pick(x,'text','tp','tujuan','tujuanPembelajaran'));
      const semester=text(pick(x,'semester','sem'))||inheritedSemester;
      const mapel=text(pick(x,'mapel','mataPelajaran','subject'))||parent.mapel||'';
      const kelasValue=pick(x,'kelas','class','tingkat')||parent.kelas||'';
      if(topic||tp)out.push({topic,tp,jp:Number(pick(x,'jp','alokasiJp','alokasi','hours')||0)||0,element:text(pick(x,'element','elemen','cpElement')),period:text(pick(x,'period','waktu','minggu')),semester,mapel,kelas:kelasValue});
      return {topic,semester,mapel,kelas:kelasValue};
    };
    const walk=(x,d=0,parent={},parentTopic='',parentSemester='')=>{
      if(!x||d>12)return;
      if(Array.isArray(x)){x.forEach(v=>walk(v,d+1,parent,parentTopic,parentSemester));return}
      if(typeof x!=='object')return;
      const meta=add(x,parent,parentTopic,parentSemester),next={mapel:meta.mapel||parent.mapel||'',kelas:meta.kelas||parent.kelas||''};
      const nextTopic=meta.topic||parentTopic,nextSemester=meta.semester||parentSemester;
      ['items','rows','data','tp','lessons','chapters','topics','records'].forEach(k=>{if(x[k])walk(x[k],d+1,next,nextTopic,nextSemester)});
    };
    ['siapguru_tp_draft','siapguru_prota_draft','siapguru_prosem_draft','siapguru_atp_draft'].forEach(k=>walk(read(k)));
    return out;
  };
  const activeRecords=(room,row)=>{
    const all=collectRecords(),s=selected(),cls=kelas(room.querySelector('#sgPaClass')?.value)||kelas(s?.kelas),mapel=norm(room.querySelector('#sgPaSubject')?.value)||norm(s?.mapel||s?.mapelName),rows=scopeRows(room),idx=rowIndex(row,rows),title=norm(row?.bab);
    const scoped=all.filter(r=>(!cls||!r.kelas||kelas(r.kelas)===cls)&&(!mapel||!r.mapel||norm(r.mapel)===mapel));
    return scoped.filter(r=>{const t=norm(r.topic);if(!t)return false;if(t===title)return true;if(idx&&new RegExp(`^bab\\s*${idx}(?:\\b|\\s*[-—:])`,'i').test(t))return true;return title&&t.includes(title)});
  };
  const manualContext=(topic)=>{const db=read('siapguru_perangkat_bab_context_v1')||{},v=db[text(topic)]||{},bad=/SEMUA BAB \/ 1 TAHUN|peserta didik mampu/i;return v.manual===true&&!Object.values(v).some(x=>bad.test(text(x)))?v:{}};
  const repairContext=()=>{
    const room=document.querySelector(ROOM),row=room&&activeRow(room);if(!room||!row)return;
    const records=activeRecords(room,row),saved=manualContext(row.bab),tp=records.filter(r=>r.tp),masterJp=Number(row.jp||0)||8,totalTpJp=tp.reduce((n,r)=>n+(Number(r.jp)||0),0),jp=saved.jp?Number(saved.jp):totalTpJp||masterJp;
    const set=(id,v)=>{const e=room.querySelector('#'+id);if(e)e.value=v};set('sgPaJP',jp);
    const list=room.querySelector('#sgPaTpList');if(list)list.innerHTML=tp.length?tp.map((r,i)=>`<div class="sg-pa-item"><div><strong>TP ${i+1}. ${esc(r.tp)}</strong><small>Elemen: ${esc(r.element||'-')} · ${r.jp||0} JP${r.period?' · '+esc(r.period):''}</small></div></div>`).join(''):'<div class="sg-pa-note">Belum ada TP khusus untuk BAB ini.</div>';
    const topic=text(row.bab),setIfNoManual=(id,value)=>{if(!saved[id])set(id,value)};
    setIfNoManual('sgPaMedia',`Buku teks/SIBI, contoh teks, media visual/audio, kartu kosakata, dan LKPD untuk topik ${topic}.`);
    setIfNoManual('sgPaSource',`Buku teks Bahasa Indonesia/SIBI, contoh teks, lingkungan sekitar, dan sumber belajar digital yang relevan dengan ${topic}.`);
    setIfNoManual('sgPaLkpd',`LKPD ${topic}: kegiatan memahami materi, latihan terarah, penerapan, dan refleksi peserta didik.`);
    setIfNoManual('sgPaAssessment',`Asesmen ${topic}: asesmen awal melalui pertanyaan pemantik; asesmen proses melalui observasi, latihan, produk, atau diskusi; asesmen akhir melalui bukti kinerja/produk sesuai tujuan pembelajaran dengan rubrik ketercapaian.`);
    setIfNoManual('sgPaDifferentiation',`Diferensiasi ${topic}: dukungan bertahap bagi peserta didik yang memerlukan bantuan serta pengayaan bagi peserta didik yang sudah mencapai tujuan.`);
    setIfNoManual('sgPaFollowup',`Remedial dan pengayaan ${topic} berdasarkan hasil asesmen dan kebutuhan peserta didik.`);
    try{window.__sgPerangkatActiveTopic=topic}catch(_){}
  };
  const rebuild=()=>{
    const room=document.querySelector(ROOM),sel=room?.querySelector('#sgPaTopic');if(!room||!sel||sel.tagName!=='SELECT')return;
    const rows=scopeRows(room);if(!rows.length)return;const current=text(sel.value)||text(selected()?.bab||selected()?.topic),html='<option value="">Pilih BAB / Topik...</option>'+rows.map(r=>`<option value="${esc(r.bab)}">${esc(r.bab)}</option>`).join(''),signature=rows.map(r=>`${r.id||''}:${r.bab}`).join('|');
    if(sel.dataset.sgMasterScope!==signature){sel.innerHTML=html;sel.dataset.sgMasterScope=signature;if(current&&rows.some(r=>text(r.bab)===current))sel.value=current;else if(rows.length)sel.value=rows[0].bab}repairContext();
  };
  let timer=0;const run=()=>{clearTimeout(timer);timer=setTimeout(rebuild,80)};
  const boot=()=>{run();if(!window.__sgPerangkatMasterScopeWatch){window.__sgPerangkatMasterScopeWatch=1;new MutationObserver(run).observe(document.body,{childList:true,subtree:true});document.addEventListener('change',e=>{if(e.target?.id==='sgPaClass'||e.target?.id==='sgPaSubject'||e.target?.id==='sgPaTopic')run()},true)}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
