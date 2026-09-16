import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { Window } from '/private/tmp/mh-toolbar-audit/dom-tests/node_modules/happy-dom/lib/index.js';
const root='/Users/tamchap/Dev/mh_media';
const html=fs.readFileSync(root+'/tutorial-demo-builder-v2.html','utf8');
const script=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].find(m=>m[1].includes('function deleteSelected()'))[1];new vm.Script(script);
const win=new Window({url:'http://127.0.0.1:8765/hotspot-palette-unit.html',settings:{disableJavaScriptEvaluation:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});win.document.write(html);
win.eval(script.replace('    initializeApp();','').replace('  })();',`window.audit={HOTSPOT_STYLES,SITE_COLOR_PRESETS,normalizeState,normalizeSiteColor,assignHotspotHeaderColors,normalizeHotspot,renderHotspot,renderHotspotRow,renderContentsPreviewHotspot,renumberHotspots,moveHotspot,buildExportHtml,currentSlide,get state(){return state},quiet(){commit=()=>{};showToast=()=>{};scheduleSave=()=>{};stopAudio=()=>{};waitForExportFonts=async()=>{};}};})();`));
const a=win.audit;a.normalizeState();a.quiet();const slide=a.currentSlide();slide.hotspots=[];slide.annotations=[];
const names=fs.readdirSync(root+'/images/tutorial-annotations/hotspots').filter(n=>/-[0-9a-f]{6}\.png$/i.test(n)).sort();assert.deepEqual([...a.HOTSPOT_STYLES].map(s=>s.filename).sort(),names);
for(const style of a.HOTSPOT_STYLES){assert(a.SITE_COLOR_PRESETS.some(([color])=>color===style.color));assert.equal(style.color,'#'+style.filename.match(/-([0-9a-f]{6})\.png$/i)[1].toLowerCase());assert.deepEqual(Buffer.from(style.image.split(',')[1],'base64'),fs.readFileSync(root+'/images/tutorial-annotations/hotspots/'+style.filename));assert.equal(style.ink,style.name==='mauve'?'#ffffff':'#000000');}
for(let i=0;i<a.HOTSPOT_STYLES.length*2;i++)slide.hotspots.push(a.normalizeHotspot({id:'slot-'+i,title:'Step '+i,autoTitle:false,body:'Details '+i,headerColor:'#fff7c8',x:10+i,y:30,w:8,h:13.333,z:20+i},i,slide));
a.assignHotspotHeaderColors();
for(const [i,item] of slide.hotspots.entries()){
 const style=a.HOTSPOT_STYLES[i%a.HOTSPOT_STYLES.length];assert.equal(item.color,style.color);assert.equal(item.headerColor,style.color);
 assert(a.renderHotspot(item,i).includes(style.image));assert(a.renderHotspotRow(item,i).includes('--hotspot-color:'+style.color));assert(a.renderHotspotRow(item,i).includes('--hotspot-ink:'+style.ink));assert(a.renderContentsPreviewHotspot(item,i).includes(style.image));
}
const before=JSON.stringify(slide.hotspots);a.normalizeState();assert.equal(JSON.stringify(a.currentSlide().hotspots),before,'Reload retains marker positions, text and matched colors');
const first=a.currentSlide().hotspots[0];a.moveHotspot(first.id,1);assert.equal(a.currentSlide().hotspots[0].x,10);assert.equal(a.currentSlide().hotspots[0].color,a.HOTSPOT_STYLES[0].color);assert.equal(a.currentSlide().hotspots[0].title,'Step 1');
a.currentSlide().hotspots.splice(1,1);a.renumberHotspots();a.currentSlide().hotspots.forEach((item,i)=>{assert.equal(item.color,a.HOTSPOT_STYLES[i%a.HOTSPOT_STYLES.length].color);assert.equal(item.headerColor,item.color)});
for(const mode of ['tutorial','demo']){const out=await a.buildExportHtml(mode);assert(out.html.includes(a.HOTSPOT_STYLES[0].image));assert(!out.html.includes('annotationAssetUrl("h-pink.png")'));if(process.argv.includes('--write-fixtures'))fs.writeFileSync(root+'/new-hotspot-'+mode+'-check-20260914.html',out.html);}
console.log('PASS: every named hotspot PNG embedded byte-identically, exact colors, matching headers/numbers/previews, preserved geometry, reorder/delete/reload, and both portable exports.');await win.happyDOM.close();
