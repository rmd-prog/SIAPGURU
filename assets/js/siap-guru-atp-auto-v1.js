/* SIAP GURU — ATP AUTO FINAL
   CP -> ATP otomatis -> TP siap dipakai -> RPM.
   JP memakai alokasi intrakurikuler resmi Permendikdasmen 13/2025.
   Tidak menyentuh D1, Worker, login, Dashboard, atau RPM FINAL.
*/
(()=>{
  const build=()=>{
    const room=document.querySelector('.sg-atp-room');
    if(!room||room.dataset.autoFinal==='1')return;
    room.dataset.autoFinal='1';
    const footer=room.querySelector('.sg-atp-footer'),add=room.querySelector('#sgAtpAdd');
    const subject=room.querySelector('#sgAtpSubject'),phase=room.querySelector('#sgAtpPhase'),klass=room.querySelector('#sgAtpClass');
    const element=room.querySelector('#sgAtpElement'),list=room.querySelector('#sgAtpList'),name=room.querySelector('#sgAtpName'),total=room.querySelector('#sgAtpTotalJp'),notice=room.querySelector('#sgAtpNotice');
    if(!footer||!add||!subject||!phase||!klass||!element||!list)return;
    const btn=document.createElement('button');
    btn.id='sgAtpAuto';btn.type='button';btn.className='sg-atp-primary';btn.textContent='⚡ Isi ATP Otomatis';
    footer.insertBefore(btn,footer.firstChild);
    const show=m=>{if(notice){notice.textContent=m;notice.classList.add('is-show');clearTimeout(show.t);show.t=setTimeout(()=>notice.classList.remove('is-show'),3000)}};

    // Alokasi intrakurikuler per tahun dari struktur kurikulum nasional.
    // Kelas 1-2: 36 minggu; kelas 3-5: 36 minggu; kelas 6: 32 minggu.
    const JP={
      'Pendidikan Agama Islam dan Budi Pekerti':{a:108,b:108,c:96},
      'Pendidikan Agama Kristen dan Budi Pekerti':{a:108,b:108,c:96},
      'Pendidikan Agama Katolik dan Budi Pekerti':{a:108,b:108,c:96},
      'Pendidikan Agama Hindu dan Budi Pekerti':{a:108,b:108,c:96},
      'Pendidikan Agama Buddha dan Budi Pekerti':{a:108,b:108,c:96},
      'Pendidikan Agama Khonghucu dan Budi Pekerti':{a:108,b:108,c:96},
      'Pendidikan Pancasila':{a:144,b:144,c:128},
      'Bahasa Indonesia':{a:216,b:216,c:192},
      'Matematika':{a:144,b:180,c:160},
      'IPAS':{a:0,b:180,c:160},
      'Ilmu Pengetahuan Alam dan Sosial':{a:0,b:180,c:160},
      'Pendidikan Jasmani Olahraga dan Kesehatan':{a:108,b:108,c:96},
      'PJOK':{a:108,b:108,c:96},
      'Seni Musik':{a:108,b:108,c:96},
      'Seni Rupa':{a:108,b:108,c:96},
      'Seni Tari':{a:108,b:108,c:96},
      'Seni Teater':{a:108,b:108,c:96},
      'Seni dan Budaya':{a:108,b:108,c:96},
      'Bahasa Inggris':{a:0,b:72,c:64},
      'Koding dan Kecerdasan Artifisial':{a:0,b:72,c:64},
      'Informatika':{a:0,b:0,c:0}
    };
    const phaseKey=()=>klass.value==='6'?'c':(['3','4','5'].includes(klass.value)?'b':'a');
    const refJP=()=>JP[subject.value]?.[phaseKey()]||0;
    const weeks=()=>klass.value==='6'?32:36;

    const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
    const sentence=s=>{s=clean(s);return s?s.charAt(0).toLowerCase()+s.slice(1):''};
    const verbFor=i=>['mengidentifikasi','menjelaskan','menerapkan','menganalisis','mengevaluasi','mengomunikasikan'][Math.min(i,5)];
    const makeText=(cp,el,i)=>{
      const c=sentence(cp),e=clean(el),v=verbFor(i);
      if(c)return `Peserta didik mampu ${v} ${c} melalui pembelajaran yang kontekstual dan bermakna pada elemen ${e}.`;
      return `Peserta didik mampu ${v} konsep dan keterampilan pada elemen ${e} sesuai karakteristik Fase ${phase.value}.`;
    };
    const distribute=(n,target)=>{
      if(!n||!target)return Array(n).fill(0);
      const base=2;
      if(target<base*n){const a=Array(n).fill(0);for(let i=0;i<n;i++)a[i]=Math.max(1,Math.floor(target/n));let r=target-a.reduce((x,y)=>x+y,0);for(let i=0;r>0;i=(i+1)%n,r--)a[i]++;return a}
      const remain=target-base*n,weights=Array.from({length:n},(_,i)=>i+1),sum=weights.reduce((a,b)=>a+b,0);
      const a=weights.map(w=>base+Math.floor(remain*w/sum));
      let r=target-a.reduce((x,y)=>x+y,0),i=n-1;while(r>0){a[i%n]++;i--;r--}return a;
    };
    const save=()=>{
      const items=[...list.querySelectorAll('.sg-atp-item')].map(item=>({text:item.querySelector('.sg-atp-text')?.textContent.trim()||'',element:item.dataset.element||'',cp:item.dataset.cp||'',jp:item.querySelector('.sg-atp-jp')?.value||2}));
      const payload={name:name?.value.trim()||`ATP ${subject.value} Kelas ${klass.value} Fase ${phase.value}`,semester:room.querySelector('#sgAtpSemester')?.value||'1',totalJp:total?.value||'',group:room.querySelector('#sgAtpGroup')?.value||'umum',subject:subject.value,phase:phase.value,class:klass.value,items};
      localStorage.setItem('siapguru_atp_draft',JSON.stringify(payload));
    };
    const make=()=>{
      const opts=[...element.options];
      const annual=refJP();
      if(!opts.length){show('CP belum tersedia untuk pilihan ini.');return}
      if(!annual){show(`Referensi JP resmi belum tersedia untuk ${subject.value} kelas ${klass.value}; ATP tidak dipaksakan. Pemetaan dapat ditambahkan nanti.`);return}
      list.innerHTML='';
      const target=Math.round(annual/2),jps=distribute(opts.length,target);
      opts.forEach((opt,i)=>{
        element.value=opt.value;add.click();
        const item=list.lastElementChild;if(!item)return;
        const text=item.querySelector('.sg-atp-text'),cp=item.dataset.cp||'',title=opt.textContent.trim();
        if(text)text.textContent=makeText(cp,title,i);
        item.dataset.element=title;item.dataset.cp=cp;
        const inp=item.querySelector('.sg-atp-jp');if(inp)inp.value=jps[i];
      });
      if(name&&!name.value.trim())name.value=`ATP ${subject.value} Kelas ${klass.value} Fase ${phase.value}`;
      if(total)total.value=target;
      save();
      show(`${opts.length} TP otomatis dibuat • ${target} JP/semester (${annual} JP/tahun intrakurikuler, ${weeks()} minggu).`);
    };
    btn.addEventListener('click',make);
    // Bila pilihan kelas/mapel/fase berubah, beri tahu bahwa ATP harus dibuat ulang.
    [subject,phase,klass].forEach(el=>el.addEventListener('change',()=>show('Pilihan berubah. Klik “Isi ATP Otomatis” untuk menyusun ulang CP, TP, dan JP.')));
  };
  const watch=()=>{build();if(!document.querySelector('.sg-atp-room'))setTimeout(watch,150)};
  document.addEventListener('click',e=>{const l=e.target.closest('.sg-topnav-link');if(l&&l.textContent.trim()==='ATP')setTimeout(build,120)},true);
  watch();
})();
