(()=>{
const splitAnnualSemesters=()=>{
 const room=document.querySelector('.sg-prota-room');
 if(!room)return false;
 const rows=[...room.querySelectorAll('#sgProtaList select[data-field="semester"]')];
 if(rows.length<2)return false;
 const values=rows.map(x=>String(x.value||'1'));
 if(values.some(v=>v==='2'))return false;
 const jp=[...room.querySelectorAll('#sgProtaList input[data-field="jp"]')].map(x=>Math.max(1,Number(x.value)||1));
 const total=jp.reduce((a,b)=>a+b,0);
 if(total<=0)return false;
 const target=total/2;
 let acc=0,cut=0;
 for(let i=0;i<jp.length;i++){
  if(i>0 && Math.abs(acc+jp[i]-target)>Math.abs(acc-target))break;
  acc+=jp[i];cut=i+1;
 }
 cut=Math.max(1,Math.min(rows.length-1,cut));
 rows.forEach((el,i)=>{el.value=i<cut?'1':'2'});
 rows[rows.length-1].dispatchEvent(new Event('change',{bubbles:true}));
 return true;
};
const watch=()=>{
 const room=document.querySelector('.sg-prota-room');
 if(room){setTimeout(splitAnnualSemesters,0);return}
 requestAnimationFrame(watch);
};
watch();
})();