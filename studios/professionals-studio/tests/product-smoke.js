const pages=['index.html','brand.html','concept-studio.html','template-social.html','template-landing.html','template-email.html'];
const sizes=[390,768,1280];
const status=document.querySelector('#status');
document.querySelector('#run').addEventListener('click',async event=>{
  event.target.disabled=true;const report={startedAt:new Date().toISOString(),cases:[],failures:[]};
  try{for(const page of pages)for(const width of sizes){
    const frame=document.createElement('iframe');frame.width=width;frame.title=`${page} at ${width}`;
    document.querySelector('#stage').replaceChildren(frame);
    const loaded=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Page load timed out')),15000);frame.onload=()=>{clearTimeout(timer);resolve();};});
    frame.src='../'+page;await loaded;
    const doc=frame.contentDocument;await doc.fonts.ready;
    for(const img of doc.images){img.loading='eager';try{await img.decode();}catch{}}
    await new Promise(resolve=>setTimeout(resolve,150));
    const view=frame.contentWindow;
    const visible=Array.from(doc.querySelectorAll('body *')).filter(el=>el.getClientRects().length&&Array.from(el.childNodes).some(n=>n.nodeType===3&&n.textContent.trim()));
    const badFonts=visible.filter(el=>!view.getComputedStyle(el).fontFamily.includes('Make It Better')).map(el=>({tag:el.tagName,text:el.textContent.slice(0,60),font:view.getComputedStyle(el).fontFamily}));
    const result={page,width,title:doc.title,overflow:doc.documentElement.scrollWidth>width+1,brokenImages:Array.from(doc.images).filter(img=>img.getClientRects().length&&img.naturalWidth===0).map(img=>img.getAttribute('src')),badFonts};
    if(result.overflow||result.brokenImages.length||badFonts.length)report.failures.push(result);
    report.cases.push(result);status.textContent=`${report.cases.length} pages checked · ${report.failures.length} findings`;
  }}catch(error){report.fatal=error.message;}
  report.finishedAt=new Date().toISOString();document.querySelector('#results').textContent=JSON.stringify(report,null,2);status.textContent=`Complete · ${report.cases.length} page checks · ${report.failures.length} findings`;event.target.disabled=false;
});
