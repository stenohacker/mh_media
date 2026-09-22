import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const folder=path.resolve(import.meta.dirname,'..');
const html=fs.readFileSync(path.join(folder,'tutorial-demo-builder-v2.html'),'utf8');
const runtime=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).find(x=>x.includes('function deleteSelected()'));
new vm.Script(runtime);
new vm.Script(fs.readFileSync(path.join(folder,'scripts/tutorial-reading-export.js'),'utf8'));
assert(runtime.includes('await buildExportHtml(previewMode)'), 'Preview uses the same HTML generator as export');
assert(runtime.includes('body.dataset.readingExport = "true"'), 'Reading layout is restricted to the snapshot frame');
assert(!runtime.includes('objectStyle(pngLayout)'), 'PNG/PDF do not reposition locked markers');
const exportJob=runtime.slice(runtime.indexOf('async function exportReadingGuide('),runtime.indexOf('async function copyPublicUrl('));
assert(!/state\.ui\s*=|multiSelection\s*=|\brender\(\)/.test(exportJob), 'Export never navigates or redraws the live editor');
assert(exportJob.includes('pdf.embedPng('), 'PDF uses the same lossless PNG artwork');
assert.equal(html.match(/<script id="project-state"[^>]*>([\s\S]*?)<\/script>/)[1],fs.readFileSync(path.join(folder,'backups/2026-09-21-before-reading-exports/tutorial-demo-builder-v2.html'),'utf8').match(/<script id="project-state"[^>]*>([\s\S]*?)<\/script>/)[1], 'Embedded user project is unchanged');
console.log('PASS runtime syntax, shared preview generator, isolated PNG/PDF rendering, authored marker positions, lossless PDF route, and untouched embedded draft.');

if(process.argv.includes('--fixtures')) {
  const projects=JSON.parse(fs.readFileSync(path.join(folder,'.tutorial-demo-projects.json'),'utf8')).projects;
  const project=projects.find(p=>p.id==='project-20260921045818-16f79c6a');
  assert(project, 'Known active tutorial draft exists');
  const state=structuredClone(project.state);
  state.meta.tutorialSlug='qa-tutorial-output';
  state.ui={...state.ui,slideIndex:0,activeHotspotId:null,selectedKind:null,selectedId:null,contentsOpen:false,videoModalId:null};
  const fixture=(state)=>html.replace('<head>','<head><base href="/">')
    .replace(/(<script id="project-state"[^>]*>)[\s\S]*?(<\/script>)/,(_,open,close)=>open+JSON.stringify(state).replace(/<\/script/gi,'<\\/script')+close);
  fs.writeFileSync(path.join(folder,'audits/qa-tutorial-output.html'),fixture(state));
  const synthetic=structuredClone(state);
  synthetic.tutorial.title='Reading Guide QA';
  synthetic.meta.tutorialSlug='reading-guide-qa';
  const short=structuredClone(state.tutorial.slides[1]);
  short.id='reading-short'; short.kind='image'; short.title='A clear guide, without moving your markers'; short.description=''; short.annotations=[];
  const hotspot=(id,index,title,body)=>({id,title,body,x:22+index*27,y:28+index*18,w:8,h:13.333,z:10+index,locked:index!==1,rotation:0,richText:{},textLineHeight:1.4,textLetterSpacing:.5});
  short.hotspots=[hotspot('reading-one',0,'Start with the first marker','5. Find the pink marker.\n6. Keep its placed position.\n\n| Read the matching card.\n| Preserve colors and spacing.'),hotspot('reading-two',1,'Read the next step','This unlocked marker also appears in the static reading guide. The interactive tutorial is not changed.'),hotspot('reading-three',2,'An empty card stays tidy','')];
  short.hotspots[0].richText.body={text:short.hotspots[0].body,lines:['Find the <span style="color:#b23386;font-weight:700">pink marker.</span>','Keep its placed position.','','Read the <span style="font-style:italic">matching card.</span>','Preserve colors and spacing.']};
  const arrow=state.tutorial.slides[0].annotations.find(a=>a.type==='markup' && a.lineLabelEnabled);
  if(arrow) short.annotations.push({...structuredClone(arrow),id:'reading-arrow',x:52,y:74,w:36,h:22,lineLabel:'Along the line',richText:{},lineLabelLetterSpacing:2,hotspotGroupId:'reading-two',locked:false});
  const textCard=state.tutorial.slides[0].annotations.find(a=>a.type==='callout');
  short.annotations.push({...structuredClone(textCard),id:'reading-soft-lines',x:28,y:70,w:31,h:35,calloutTitle:'Formatting stays',calloutBody:'1. Alpha\nBeta\n2. Gamma',richText:{calloutBody:{text:'1. Alpha\nBeta\n2. Gamma',lines:['<b>Alpha</b>\n<span style="color:#b23386">Beta</span>','Gamma']}},hotspotGroupId:'',locked:false});
  const long=structuredClone(short); long.id='reading-long'; long.title='Long cards continue at a readable size'; long.annotations=[];
  const paragraph=Array.from({length:30},(_,i)=>`Part ${i+1}: these words must appear once, in order, with no missing text. 🟣`).join(' ');
  long.hotspots=[hotspot('reading-long-one',0,'A long styled paragraph',paragraph),hotspot('reading-long-two',1,'Numbered lines continue correctly',Array.from({length:22},(_,i)=>`${i+7}. This is list item ${i+7}; preserve its number and its words.`).join('\n'))];
  long.hotspots[0].richText.body={text:paragraph,lines:[`<span style="color:#b23386;font-weight:700">${paragraph}</span>`]};
  const empty=structuredClone(short); empty.id='reading-empty'; empty.title='Image-only pages use the available width'; empty.annotations=[]; empty.hotspots=[];
  synthetic.tutorial.slides=[short,long,empty];
  synthetic.ui={...state.ui,activeHotspotId:short.hotspots[0].id};
  const qaChecks=`
    const originalReadingQa=JSON.stringify(state.tutorial.slides.map(s=>({hotspots:s.hotspots.map(h=>[h.id,h.title,h.body,h.x,h.y,h.w,h.h,h.locked]),annotations:s.annotations.map(a=>[a.id,a.calloutBody,a.lineLabel,a.x,a.y,a.w,a.h])})));
    const qaButton=document.createElement('button'); qaButton.textContent='Check export draft invariants'; qaButton.style.cssText='position:fixed;bottom:8px;right:8px;z-index:99999';
    qaButton.onclick=()=>{const current=JSON.stringify(state.tutorial.slides.map(s=>({hotspots:s.hotspots.map(h=>[h.id,h.title,h.body,h.x,h.y,h.w,h.h,h.locked]),annotations:s.annotations.map(a=>[a.id,a.calloutBody,a.lineLabel,a.x,a.y,a.w,a.h])}))); qaButton.textContent=current===originalReadingQa?'PASS: text and geometry unchanged':'FAIL: draft content changed';};
    document.body.append(qaButton);
  `;
  fs.writeFileSync(path.join(folder,'audits/qa-reading-guide-builder.html'),fixture(synthetic).replace('    } else initializeApp();','    } else { initializeApp();'+qaChecks+' }'));
  const readingFixture=fixture(synthetic).replace('<body data-mode="builder">','<body data-mode="player" data-reading-export="true" data-reading-media-origin="http://127.0.0.1:8765">');
  fs.writeFileSync(path.join(folder,'audits/qa-reading-guide-pages.html'),readingFixture);
  fs.writeFileSync(path.join(folder,'audits/qa-reading-guide-expected.json'),JSON.stringify(synthetic.tutorial.slides,null,2));
  const edges=structuredClone(synthetic);
  edges.tutorial.title='Reading edge cases'; edges.meta.tutorialSlug='reading-edge-cases';
  const effects=structuredClone(short); effects.id='reading-effects'; effects.title='Magnifier and blur remain visible';
  effects.annotations.push({id:'reading-magnifier',type:'magnifier',x:76,y:64,w:16,h:26,z:200,magnification:2,magnifierShape:'circle'}, {id:'reading-blur',type:'blur',x:22,y:28,w:10,h:18,z:201,blurStrength:12});
  const scroll=structuredClone(empty); scroll.id='reading-scroll'; scroll.kind='scroll'; scroll.title='Long scrolling image - every section included'; scroll.backgroundLayout='';
  const scrollSvg='<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="3600"><rect width="1500" height="1200" fill="#f9d1ee"/><rect y="1200" width="1500" height="1200" fill="#cef3ed"/><rect y="2400" width="1500" height="1200" fill="#fff29a"/><g font-family="sans-serif" font-size="90"><text x="100" y="240">TOP OF LONG IMAGE</text><text x="100" y="1750">MIDDLE OF LONG IMAGE</text><text x="100" y="3450">BOTTOM OF LONG IMAGE</text></g></svg>';
  scroll.media={url:'data:image/svg+xml,'+encodeURIComponent(scrollSvg),type:'image',fit:'contain',matte:'#ffffff',x:0,y:0,scale:1,naturalWidth:1500,naturalHeight:3600};
  scroll.hotspots=[{...hotspot('reading-scroll-one',0,'Top marker','The whole long page is divided into readable image sections.'),x:60,y:35},{...hotspot('reading-scroll-two',1,'Bottom marker','This marker must remain near the bottom of the long image.'),x:60,y:370}];
  edges.tutorial.slides=[effects,scroll];
  fs.writeFileSync(path.join(folder,'audits/qa-reading-edge-builder.html'),fixture(edges));
  fs.writeFileSync(path.join(folder,'audits/qa-reading-edge-pages.html'),fixture(edges).replace('<body data-mode="builder">','<body data-mode="player" data-reading-export="true" data-reading-media-origin="http://127.0.0.1:8765">'));
  const missing=structuredClone(synthetic); missing.tutorial.slides=[short]; missing.tutorial.title='Missing image QA'; missing.meta.tutorialSlug='missing-image-qa';
  missing.tutorial.slides[0].annotations.push({id:'missing-image',type:'image',src:'http://127.0.0.1:8765/qa-intentionally-missing-image.png',x:10,y:10,w:10,h:10});
  fs.writeFileSync(path.join(folder,'audits/qa-reading-missing-image.html'),fixture(missing));
  if(process.argv.includes('--native-png')) {
    const native=fixture(state)
      .replace('          useCORS: true,','          useCORS: true,\n          x: -rect.left, y: -rect.top,\n          foreignObjectRendering: true,')
      .replace('          onclone: (clonedDocument) => {','          onclone: async (clonedDocument) => {')
      .replace('            cloneRoot?.querySelector(".reader-nav")?.remove();',`            cloneRoot?.querySelector(".reader-nav")?.remove();
            const fonts=clonedDocument.createElement('style');
            fonts.textContent=[...document.querySelectorAll('style')].map(s=>(s.textContent.match(/@font-face\\s*\\{[^}]*\\}/g)||[]).join('\\n')).join('\\n');
            cloneTarget.prepend(fonts);
            cloneTarget.querySelectorAll('[data-builder-only],.card-top-drag-handle').forEach(n=>n.remove());
            await inlinePngExportImages(element,cloneTarget);`);
    fs.writeFileSync(path.join(folder,'audits/qa-tutorial-native-png.html'),native);
  }
  console.log('Generated isolated snapshot of the current saved tutorial. Named project data was read only.');
}
