(()=>{
  const RELIGION=['Pendidikan Agama Islam dan Budi Pekerti','Pendidikan Agama Kristen dan Budi Pekerti','Pendidikan Agama Katolik dan Budi Pekerti','Pendidikan Agama Hindu dan Budi Pekerti','Pendidikan Agama Buddha dan Budi Pekerti','Pendidikan Agama Khonghucu dan Budi Pekerti'];
  const extractObject=async(url,marker)=>{try{const text=await fetch(url,{cache:'no-store'}).then(r=>r.text());const start=text.indexOf(marker);if(start<0)return{};let i=start+marker.length;while(/\s/.test(text[i]||''))i++;if(text[i]!=='{')return{};const begin=i;let depth=0,quote='',esc=false;for(;i<text.length;i++){const c=text[i];if(quote){if(esc)esc=false;else if(c==='\\')esc=true;else if(c===quote)quote='';continue}if(c==='"'||c==="'"){quote=c;continue}if(c==='{')depth++;else if(c==='}'&&--depth===0)return Function('return '+text.slice(begin,i+1))()}return{}}catch(_){return{}}};
  const phaseFromRoom=room=>{const raw=room?.querySelector('#sgRPhaseClass')?.value||'';const m=raw.match(/(?:Fase\s*)?([ABC])/i);if(m)return m[1].toUpperCase();const c=Number((raw.match(/\d+/)||[])[0]||0);return c<=2?'A':c<=4?'B':'C'};
  const resolveCP=async(room,state)=>{
    const subject=String(state?.subject||room?.querySelector('#sgRSubject')?.value||'').trim();
    const phase=phaseFromRoom(room);
    const selected=(state?.selectedTP||[]).map(x=>String(x?.cp||x?.cpText||'').trim()).filter(Boolean);
    if(selected.length)return [...new Set(selected)].join('\n\n');
    try{
      const source=RELIGION.includes(subject)?await extractObject('assets/js/siap-guru-cp.js','const CP='):await extractObject('assets/js/siap-guru-cp-general.js','const D=');
      const rows=source?.[subject]?.[phase]||[];
      if(Array.isArray(rows)&&rows.length)return rows.map(r=>Array.isArray(r)?`${r[0]}: ${r[1]}`:String(r||'')).filter(Boolean).join('\n\n');
    }catch(_){}
    try{
      const p=JSON.parse(localStorage.getItem('siapguru_atp_draft')||'null');
      if(p&&p.subject===subject&&String(p.phase||'')===phase){const cp=(p.items||[]).map(x=>String(x.cp||x.cpText||'').trim()).filter(Boolean);if(cp.length)return [...new Set(cp)].join('\n\n')}
    }catch(_){}
    return '';
  };
  const boot=()=>{if(window.__sgRpmCpFinal)return;window.__sgRpmCpFinal=1;document.addEventListener('click',async e=>{if(e.target?.id!=='sgRBuild')return;e.preventDefault();e.stopImmediatePropagation();const room=document.querySelector('.sg-rpm-room');if(!room)return;let state=null;try{state=JSON.parse(sessionStorage.getItem('siapguru_rpm_generated')||'null')}catch(_){}if(!state)return;const cp=await resolveCP(room,state);if(cp){const field=room.querySelector('#sgRCP');if(field)field.value=cp;state.cp=cp;try{sessionStorage.setItem('siapguru_rpm_generated',JSON.stringify(state))}catch(_){}}if(window.SiapGuruRPMFinal?.run)window.SiapGuruRPMFinal.run();},true)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();