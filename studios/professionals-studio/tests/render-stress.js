import { composeAsset, DESIGNS, COLORS, BAND_CHOICES, SOFT_UPSCALE, preloadFonts } from '../ad-engine.js';
import { fidelityReasons, countOutcome, healthyCoverageReasons, SHORT_COPY } from './design-fidelity.js';

const ids = ['fullbleed-negative-space','fullbleed-impact','editorial-vertical','editorial-angle-left','editorial-angle-right','poster-angle-photo-first','poster-angle-type-first','statement-impact','editorial-horizontal','fullbleed-lower-caption','statement-centred','statement-underline'];
const placements = [
  {platform:'Meta',placement:'Carousel',w:1080,h:1080},
  {platform:'Meta',placement:'Facebook Feed',w:1440,h:1800},
  {platform:'Meta',placement:'Stories',w:1080,h:1920},
  {platform:'TikTok',placement:'In-Feed (Auction)',w:1080,h:1920},
  {platform:'Google Display',placement:'Responsive Display, landscape',w:1200,h:628},
  {platform:'Google Display',placement:'Leaderboard',w:728,h:90},
  {platform:'Google Display',placement:'Mobile banner',w:320,h:50},
  {platform:'Taboola',placement:'Native thumbnail (primary)',w:1200,h:674,text_in_image:'forbidden'},
];
const fixtureSpecs = [
  ['healthy',2400,3000],['landscape',1600,1000],['small',720,480],['panorama',2400,360],['tall',360,2400],['tiny',80,60],
];
const status = document.querySelector('#status');
const output = document.querySelector('#results');
let latest = null;

// Synthetic test inputs exercise source geometry and contrast. They are never campaign assets.
function fixture(name,w,h) {
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext('2d');ctx.fillStyle=COLORS.sand;ctx.fillRect(0,0,w,h);
  ctx.fillStyle=COLORS.charcoal;ctx.fillRect(w*.63,h*.13,w*.25,h*.82);
  ctx.fillStyle=COLORS.teal;ctx.fillRect(w*.67,h*.17,w*.17,h*.19);
  for(let n=0;n<12;n++){ctx.fillStyle=n%2?COLORS.white:COLORS.charcoal;ctx.fillRect(w*n/12,h*.91,w/24,h*.03);}
  return {name,src:canvas.toDataURL('image/png')};
}
function thumbnail(canvas,width=360){
  const out=document.createElement('canvas');const scale=Math.min(1,width/canvas.width);
  out.width=Math.round(canvas.width*scale);out.height=Math.round(canvas.height*scale);
  out.getContext('2d').drawImage(canvas,0,0,out.width,out.height);return out.toDataURL('image/jpeg',.85);
}
function sample(result,label){
  const fig=document.createElement('figure');const img=document.createElement('img');img.src=thumbnail(result.canvas);img.alt=label;
  const cap=document.createElement('figcaption');cap.textContent=label+(result.blocked?' · held':'');fig.append(img,cap);document.querySelector('#gallery').append(fig);
}
async function run(stress){
  document.querySelectorAll('button').forEach(b=>b.disabled=true);output.textContent='';document.querySelector('#gallery').replaceChildren();
  const report={startedAt:new Date().toISOString(),mode:stress?'stress':'visual',total:0,passed:0,exported:0,held:0,adapted:0,failures:[],holds:[],healthy:[],warnings:{},times:[],designs:ids.length};
  const began=performance.now();
  try{
    await preloadFonts();
    const sources=stress?fixtureSpecs.map(s=>fixture(...s)):[{name:'provided',src:'assets/imagery-guidelines/6557344.jpg'}];
    const matrix=stress?placements:[placements[1],placements[2]];
    for(const id of ids){
      if(!DESIGNS.some(d=>d.id===id)) throw new Error('Unknown design '+id);
      for(const pl of matrix){
        for(const source of sources){
          const band=BAND_CHOICES.find(b=>b.id==='sand');
          const variant=pl.text_in_image==='forbidden'?'clean':'full';
          const label=`${id} · ${pl.platform} ${pl.placement} · ${source.name}`;
          const start=performance.now();
          try{
            const copy=source.name==='healthy'?SHORT_COPY:{headline:'Mehr Möglichkeiten. Mehr Erfolg. Mehr für Sie.',subline:'Präsentieren Sie Ihre Immobilien professionell.',cta:'Beratung anfragen'};
            const r=await composeAsset({...pl,placement:pl,variant,design:id,band,photo:source.src,logoKey:'logo-professionals',...copy,ctaBg:COLORS.charcoal,ctaFg:COLORS.white});
            report.times.push(performance.now()-start);
            const reasons=fidelityReasons(r,{design:id,placement:pl,variant,requiredCopy:copy});
            if(r.canvas.width!==pl.w||r.canvas.height!==pl.h)reasons.push('wrong dimensions');
            for(const k of r.ink){
              if(![k.x,k.y,k.w,k.h].every(Number.isFinite))reasons.push('nonfinite essential bounds');
              if(!r.blocked&&(k.x<r.safe.left-1.5||k.y<r.safe.top-1.5||k.x+k.w>pl.w-r.safe.right+1.5||k.y+k.h>pl.h-r.safe.bottom+1.5))reasons.push('exportable mark outside safe zone');
            }
            if(!r.blocked&&r.metrics.hasPhoto&&r.metrics.upscale>SOFT_UPSCALE+0.001)reasons.push('exportable soft enlargement');
            if(!r.blocked&&r.metrics.hasPhoto&&r.metrics.cropZoom<.249)reasons.push('exportable destructive crop');
            if(!r.blocked&&variant==='full'&&r.metrics.logoDrawn===false)reasons.push('missing required logo');
            if(!r.blocked&&variant==='clean'&&r.ink.length)reasons.push('baked marks in clean image');
            if(r.blocked&&!r.blockedReason)reasons.push('held with no reason');
            countOutcome(report,r,label,[...new Set(reasons)]);
            if(source.name==='healthy'&&pl.platform==='Meta')report.healthy.push({design:id,placement:pl.placement,usable:!r.blocked&&!reasons.length});
            for(const n of r.notes.filter(n=>n.level==='warn'))report.warnings[n.text]=(report.warnings[n.text]||0)+1;
            if(!stress)sample(r,label);
            r.canvas.width=1;r.canvas.height=1;
          }catch(error){report.total++;report.failures.push({label,reasons:[error.message]});}
          status.textContent=`${report.total} rendered · ${report.exported} exported · ${report.failures.length} failures · ${report.held} held`;
          if(report.total%8===0)await new Promise(resolve=>setTimeout(resolve,0));
        }
      }
    }
    // Additional variants, long German words, empty copy, no source and hostile focal input.
    if(stress)for(const id of ids)for(const variant of ['full','copy','logo','clean']){
      const pl=placements[2];const label=`${id} · adversarial · ${variant}`;
      try{
        const copy={headline:'Immobilienfinanzierungsmöglichkeiten für Ihre Geschäftsentwicklung',subline:'Ein sehr langer Text '.repeat(24),cta:'Jetzt Beratung anfragen'};
        const r=await composeAsset({...pl,placement:pl,design:id,variant,band:BAND_CHOICES[2],photo:null,...copy,logoKey:'logo-professionals',focal:{x:Infinity,y:NaN},ctaBg:COLORS.blue});
        countOutcome(report,r,label,fidelityReasons(r,{design:id,placement:pl,variant,requiredCopy:copy}));
        r.canvas.width=1;r.canvas.height=1;
      }catch(error){report.total++;report.failures.push({label,reasons:[error.message]});}
      status.textContent=`${report.total} rendered · ${report.exported} exported · ${report.failures.length} failures · ${report.held} held`;
      await new Promise(resolve=>setTimeout(resolve,0));
    }
    // Every exposed palette and button combination uses the same renderer.
    if(stress)for(const id of ids)for(const band of BAND_CHOICES)for(const ctaBg of Object.values(COLORS)){
      const pl=placements[1];const label=`${id} · colour · ${band.id} · ${ctaBg}`;
      try{
        const r=await composeAsset({...pl,placement:pl,design:id,variant:'full',band,photo:sources[0].src,headline:'Mehr Erfolg für Sie.',subline:'Präsentieren Sie Ihre Immobilien professionell.',cta:'Beratung anfragen',logoKey:'logo-professionals',ctaBg,ctaFg:COLORS.white});
        const reasons=fidelityReasons(r,{design:id,placement:pl,variant:'full'});
        if(!r.blocked&&r.metrics.safeViolations)reasons.push('unblocked colour variation overflow');
        if(!r.blocked&&!r.metrics.wcagAA)reasons.push('low measured contrast');
        if(!r.blocked&&r.metrics.upscale>SOFT_UPSCALE+0.001)reasons.push('soft colour variation');
        countOutcome(report,r,label,[...new Set(reasons)]);
        r.canvas.width=1;r.canvas.height=1;
      }catch(error){report.total++;report.failures.push({label,reasons:[error.message]});}
      status.textContent=`${report.total} rendered · ${report.exported} exported · ${report.failures.length} failures · ${report.held} held`;
      if(report.total%8===0)await new Promise(resolve=>setTimeout(resolve,0));
    }
    if(stress)for(const reason of healthyCoverageReasons(report.healthy))report.failures.push({label:'Healthy export coverage',reasons:[reason]});
    report.durationMs=Math.round(performance.now()-began);report.times.sort((a,b)=>a-b);
    report.medianMs=Math.round(report.times[Math.floor(report.times.length/2)]||0);
    report.p95Ms=Math.round(report.times[Math.floor(report.times.length*.95)]||0);delete report.times;
    report.finishedAt=new Date().toISOString();
  }catch(error){report.fatal=error.message;}
  latest=report;output.textContent=JSON.stringify(report,null,2);status.textContent=`Complete · ${report.total} renders · ${report.exported} exported · ${report.failures.length} failures · ${report.held} held`;
  document.querySelectorAll('button').forEach(b=>b.disabled=false);
}
document.querySelector('#smoke').addEventListener('click',()=>run(false));
document.querySelector('#stress').addEventListener('click',()=>run(true));
document.querySelector('#download').addEventListener('click',()=>{const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([JSON.stringify(latest,null,2)],{type:'application/json'}));link.download='professionals-render-results.json';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);});
