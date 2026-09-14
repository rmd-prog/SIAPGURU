(()=>{
  const esc=(s)=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const clean=(s)=>String(s||'').replace(/^\s*(?:TP\s*)?\d+[.)\-:]?\s*/i,'').replace(/\s+/g,' ').trim();
  const plan=()=>{
    const r=document.getElementById('sgRResult');
    if(!r||r.dataset.rpmScopePlannerV1)return;
    let saved=null;try{saved=JSON.parse(sessionStorage.getItem('siapguru_rpm_generated')||'null')}catch(_){saved=null}
    if(!saved||!Array.isArray(saved.selectedTP)||!saved.selectedTP.length)return;
    const scope=saved.scope||'single';
    const count=Math.max(1,Math.min(20,Number(saved.meetingCount||1)));
    if(scope==='single'||count<2){r.dataset.rpmScopePlannerV1='1';return;}
    const items=saved.selectedTP.map((x,i)=>({n:i+1,text:clean(x.text)})).filter(x=>x.text);
    const chunks=Array.from({length:count},()=>[]);
    items.forEach((item,i)=>chunks[i%count].push(item));
    const topic=saved.topic||document.getElementById('sgRTopic')?.value||'topik pembelajaran';
    const title=scope==='chapter'?'Peta Pertemuan Satu BAB':'Peta Pembagian Beberapa Pertemuan';
    const intro=scope==='chapter'?`BAB “${topic}” dipetakan menjadi ${count} pertemuan. Pembagian ini menjadi rencana kerja; setiap pertemuan tetap dapat diterbitkan sebagai RPM tersendiri.`:`Sumber TP dipetakan menjadi ${count} pertemuan. Pembagian ini tidak mengganti generator RPM utama dan tidak mengubah data TP.`;
    const rows=chunks.map((chunk,i)=>{
      const focus=chunk.length?chunk.map(x=>`TP ${x.n}: ${x.text}`).join(' • '):'Penguatan, latihan, refleksi, dan tindak lanjut dari TP pertemuan sebelumnya.';
      const phase=i===0?'membangun pemahaman dan konteks awal':i===count-1?'mengaplikasikan, menunjukkan bukti belajar, dan merefleksi': 'memperdalam pemahaman dan mengaplikasikan kemampuan secara bertahap';
      return `<tr><th>Pertemuan ${i+1}</th><td><strong>Fokus:</strong> ${esc(focus)}<br><span class="sg-rpm-muted">Arah kegiatan: ${esc(phase)}.</span></td></tr>`;
    }).join('');
    const article=document.createElement('article');
    article.dataset.rpmScopePlanner='1';
    article.innerHTML=`<h3>E. PETA PERTEMUAN</h3><p>${esc(intro)}</p><div class="sg-rpm-table-wrap"><table class="sg-rpm-table"><tbody>${rows}</tbody></table></div>`;
    r.appendChild(article);
    r.dataset.rpmScopePlannerV1='1';
  };
  document.addEventListener('click',e=>{if(e.target?.id==='sgRBuild')queueMicrotask(plan)},false);
})();