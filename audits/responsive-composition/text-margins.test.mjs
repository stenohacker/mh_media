import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { Window } from '/private/tmp/mh-toolbar-audit/dom-tests/node_modules/happy-dom/lib/index.js';
const base='/Users/tamchap/Dev/mh_media';
const html=fs.readFileSync(base+'/tutorial-demo-builder-v2.html','utf8');
const runtime=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].find(m=>m[1].includes('function deleteSelected()'))[1];
new vm.Script(runtime);
const win=new Window({url:'http://127.0.0.1:8765/margin-unit.html',settings:{disableJavaScriptEvaluation:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
win.document.write(html);
win.eval(runtime.replace('    initializeApp();','').replace('  })();',`window.audit={normalizeState,normalizeAnnotation,fitStageObjectBounds,playerCompositionBounds,buildExportHtml,currentSlide,get state(){return state},set state(v){state=v},quiet(){scheduleSave=()=>{};showToast=()=>{};waitForExportFonts=async()=>{};}};})();`));
const a=win.audit;a.normalizeState();a.quiet();
a.state.tutorial.title='Text at every margin';a.state.ui.slideIndex=0;
a.state.tutorial.slides=[{...a.currentSlide(),kind:'image',backgroundLayout:'background-v1',hotspots:[],annotations:[],media:{url:'https://iridescent-wisp-57bcb1.netlify.app/images/tutorial-annotations/slide-backgrounds/0913background.png',type:'image',fit:'contain',x:0,y:0,scale:1,naturalWidth:6806,naturalHeight:3522,matte:'#ffffff'}}];
const slide=a.currentSlide();
const positions=[['Left margin',5,50],['Right margin',95,50],['Top margin',50,5],['Bottom margin',50,95]];
for(const [i,[text,x,y]] of positions.entries()){
 const item=a.normalizeAnnotation({id:'margin-'+i,type:'text',text,textAlign:'center',textFontSize:28,x,y,w:60,h:40,z:i+1},i);
 a.fitStageObjectBounds(item,slide);assert.equal(item.x,x,text);assert.equal(item.y,y,text);assert.equal(item.w,60);assert.equal(item.h,40);assert.equal(item.textFontSize,28);
 slide.annotations.push(item);
}
const before=JSON.stringify(slide.annotations);a.normalizeState();assert.equal(JSON.stringify(a.currentSlide().annotations),before,'Save/reload must retain margin placement and dimensions');
const bounds=a.playerCompositionBounds(a.currentSlide());
assert(bounds.left<0 && bounds.right>1500 && bounds.top<0 && bounds.bottom>1500*3522/6806,'All four overflowing text frames must be reserved by the player');
// Existing in-frame placement and non-text boundaries must not change.
for(const type of ['image','blur','callout','slide-intro']) {
 const inside={type,x:50,y:50,w:60,h:40};a.fitStageObjectBounds(inside,slide);assert.equal(inside.x,50);assert.equal(inside.y,50);
 const edge={type,x:95,y:95,w:60,h:40};a.fitStageObjectBounds(edge,slide);assert.equal(edge.x,82.5);assert.equal(edge.y,80);
}
for(const mode of ['tutorial','demo']) {
 const {html:out}=await a.buildExportHtml(mode);const state=JSON.parse(out.match(/<script[^>]*id="project-state"[^>]*>([\s\S]*?)<\/script>/)[1]);
 const saved=state.tutorial.slides[0].annotations;
 assert.deepEqual(saved.map(({x,y})=>[x,y]),positions.map(([,x,y])=>[x,y]));
 assert(saved.every(i=>i.w===60 && i.h===40 && i.textFontSize===28));
 if(process.argv.includes('--write-fixtures'))fs.writeFileSync(base+'/text-margin-'+mode+'-check-20260914.html',out);
}
console.log('PASS: all four text margins, large frame dimensions, font preservation, save/reload, composition bounds, unchanged non-text limits, and both export serializers.');
await win.happyDOM.close();
