(()=>{
const makeActions=preview=>{
  if(!preview||preview.querySelector('.sg-preview-export-actions'))return;
  const room=preview.closest('.sg-room-view,.inner-view');
  if(!room)return;
  const box=document.createElement('div');
  box.className='sg-preview-export-actions';
  box.innerHTML='<button type="button" class="sg-export-primary" data-sg-preview-action="print">🖨 Cetak / PDF</button><button type="button" class="sg-export-secondary" data-sg-preview-action="word">↓ Word</button><button type="button" class="sg-export-secondary" data-sg-preview-action="excel">↓ Excel</button>';
  preview.insertBefore(box,preview.firstChild);
};
const add=()=>{
  document.querySelectorAll('.sg-doc-preview').forEach(makeActions);
  /* PROTA already owns its stable preview/action bar; normalize its buttons
     so the universal export system recognizes the same three actions. */
  document.querySelectorAll('.sg-prota-document-card').forEach(card=>{
    const map=[['#sgProtaPrint','print'],['#sgProtaWord','word'],['#sgProtaExcel','excel']];
    map.forEach(([sel,action])=>{const b=card.querySelector(sel);if(b)b.dataset.sgPreviewAction=action});
  });
};
const paperClone=room=>{const paper=room?.querySelector('.sg-doc-preview-paper')||room?.querySelector('#sgProtaDocument');if(!paper)return null;const c=paper.cloneNode(true);c.querySelectorAll('.sg-preview-export-actions,.sg-export-tools,.sg-export-settings,.sg-room-back,.sg-prota-doc-actions,button,input,select,textarea,[data-export-ignore],.no-print').forEach(el=>el.remove());return c};
const fallbackPrint=room=>{const paper=paperClone(room);if(!paper)return;const w=window.open('','_blank');if(!w){alert('Popup diblokir browser. Izinkan popup untuk mencetak.');return}w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>SIAP GURU</title><style>@page{size:A4 portrait;margin:16mm}body{font-family:Arial,sans-serif;font-size:11px;line-height:1.4;color:#111;margin:0}.sg-doc-ident{display:grid;grid-template-columns:1fr 1fr;border:1px solid #222;margin:0 0 14px}.sg-doc-ident>div{display:grid;grid-template-columns:145px 1fr;border-bottom:1px solid #222}.sg-doc-ident>div:nth-child(odd){border-right:1px solid #222}.sg-doc-ident>div:nth-last-child(-n+2){border-bottom:0}.sg-doc-ident b,.sg-doc-ident span{padding:7px 9px}.sg-doc-ident b{border-right:1px solid #222}table{width:100%;border-collapse:collapse}th,td{border:1px solid #222;padding:5px;vertical-align:top}button,input,select,textarea{display:none!important}.sg-doc-preview-head{display:none!important}</style></head><body>'+paper.innerHTML+'</body></html>');w.document.close();w.onload=()=>{w.focus();w.print()}};
document.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-sg-preview-action]');
  if(!b)return;
  const room=b.closest('.sg-room-view,.inner-view');
  if(window.SiapGuruExport?.direct){window.SiapGuruExport.direct(room,b.dataset.sgPreviewAction);return}
  if(b.dataset.sgPreviewAction==='print')fallbackPrint(room);
});
document.addEventListener('DOMContentLoaded',()=>{add();const root=document.querySelector('.main-content')||document.body;new MutationObserver(add).observe(root,{childList:true,subtree:true})});
})();
