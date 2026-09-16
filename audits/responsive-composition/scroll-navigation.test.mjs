import fs from 'node:fs';
import assert from 'node:assert/strict';
import { Window } from '/private/tmp/mh-toolbar-audit/dom-tests/node_modules/happy-dom/lib/index.js';
const base='/Users/tamchap/Dev/mh_media',html=fs.readFileSync(base+'/tutorial-demo-builder-v2.html','utf8');
const runtime=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].find(m=>m[2].includes('function deleteSelected()'))[2];
const win=new Window({url:'http://127.0.0.1:8765/scroll-test.html',settings:{disableJavaScriptEvaluation:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});win.document.write(html);
win.eval(runtime.replace('    initializeApp();','').replace('  })();',`window.audit={normalizeState,normalizeSlide,createSlide,normalizeHotspot,renderStage,readerNext,readerBack,buildExportHtml,scrollPageHeightUnits,linkMediaToSlide,get state(){return state},quiet(){commit=()=>{};scheduleSave=()=>{};showToast=()=>{};waitForExportFonts=async()=>{};},noAttention(){drawAttentionToHotspot=()=>{};}};})();`));
const a=win.audit;a.normalizeState();a.quiet();
const saved=JSON.parse(fs.readFileSync(base+'/.tutorial-demo-projects.json','utf8')).projects.find(p=>p.id==='project-20260914071422-29423184').state.tutorial.slides.find(s=>s.kind==='scroll');
const slide=a.normalizeSlide(saved,0);assert(slide.media.url.endsWith('0913background.png'));assert(slide.scrollImage.url.endsWith('ap-scroll.png'));assert.equal(slide.scrollImage.naturalHeight,14896);assert(a.scrollPageHeightUnits(slide)>1200);
const secondPass=a.normalizeSlide(JSON.parse(JSON.stringify(slide)),0);assert.deepEqual(JSON.parse(JSON.stringify(secondPass.scrollImage)),JSON.parse(JSON.stringify(slide.scrollImage)));
const render=a.renderStage(slide);assert(render.indexOf('0913background.png')<render.indexOf('scroll-slide-viewport'));assert(render.indexOf('ap-scroll.png')>render.indexOf('scroll-slide-viewport'));
a.state.tutorial.slides=[slide,a.createSlide('image')];a.state.ui.slideIndex=0;slide.hotspots=[38,250,800].map((y,i)=>a.normalizeHotspot({id:'scroll-hotspot-'+i,title:'Scroll stop '+(i+1),body:'Details for stop '+(i+1),x:50,y,w:10,h:8},i,slide));a.state.ui.activeHotspotId=slide.hotspots[0].id;
const before=JSON.stringify(slide.scrollImage);a.linkMediaToSlide(slide.id,{name:'replacement.png',type:'image/png'},['images','custom.png'],'background');assert.equal(JSON.stringify(slide.scrollImage),before);slide.media=a.createSlide('image').media;
a.noAttention();a.readerNext();assert.equal(a.state.ui.slideIndex,0);assert.equal(a.state.ui.activeHotspotId,'scroll-hotspot-1');a.readerNext();assert.equal(a.state.ui.activeHotspotId,'scroll-hotspot-2');a.readerBack();assert.equal(a.state.ui.activeHotspotId,'scroll-hotspot-1');a.state.ui.activeHotspotId='scroll-hotspot-0';
for(const mode of ['tutorial','demo']){const result=await a.buildExportHtml(mode);assert(result.html.includes('"scrollImage"'));assert(result.html.includes('ap-scroll.png'));if(process.argv.includes('--write-fixtures'))fs.writeFileSync(base+'/audits/responsive-composition/scroll-navigation-'+mode+'.html',result.html);}
console.log('PASS: recovered scrolling image and background; repeated reload; independent background replacement; Next/Back visits hotspots; both exports preserve scrolling content.');await win.happyDOM.close();
