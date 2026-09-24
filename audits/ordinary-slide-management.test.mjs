import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync(process.argv[2] || path.resolve(import.meta.dirname,'../tutorial-demo-builder-v2.html'),'utf8');
const runtime=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).find(s=>s.includes('function deleteSlide('));
new vm.Script(runtime);
const fn=name=>{const start=runtime.indexOf(`    function ${name}(`);assert(start>=0,name);return runtime.slice(start,runtime.indexOf('\n    }',start)+6);};
const copy=x=>JSON.parse(JSON.stringify(x));
const background={url:'https://example.test/background.png',type:'image',fit:'contain',matte:'#ffffff',x:0,y:0,scale:1};
const first={id:'cover',kind:'cover',title:'My first page',description:'Keep this',media:{...background,url:'https://example.test/authored.png',x:7,y:2,scale:1.4},annotations:[{id:'image',type:'image',locked:true,browserFrame:true,x:50,y:50,w:40,h:60,cropWindow:{left:-3,top:4,width:98,height:95},objectGroupId:'group'},{id:'line',type:'markup',locked:true,x:20,y:20,w:2,h:1}],hotspots:[{id:'hotspot',locked:true,globalLocked:true,x:20,y:30}],customData:{preserve:'yes'}};
const second={id:'second',kind:'image',title:'Second',media:copy(background),annotations:[{id:'other',type:'text',text:'Other page text',locked:true}],hotspots:[]};
const third={id:'third',kind:'image',title:'Third',media:copy(background),annotations:[],hotspots:[]};
let template={tutorial:{slides:[copy(first),copy(second),copy(third)]},ui:{}},id=0,commits=0,confirmed=true,question='';
const ctx=vm.createContext({MODE:'builder',state:copy(template),projects:[{}],SHARED_STORAGE_KEY:'unused',multiSelection:[],rememberWordSelection:{saved:null},
 DEMO_MIN_DURATION:1,DEMO_MAX_DURATION:3600,DEMO_DEFAULT_DURATION:5,MEDIA_MIN_SCALE:.1,MEDIA_MAX_SCALE:10,TEXT_LINE_HEIGHT_MIN:.5,TEXT_LINE_HEIGHT_MAX:4,
 clone:copy,uid:k=>`${k}-${++id}`,clamp:(v,min,max)=>Math.min(max,Math.max(min,Number(v)||0)),normalizeSiteColor:(v,f)=>v||f,detectMediaType:()=> 'image',
 defaultSlideBackground:()=>copy(background),isDefaultSlideBackgroundUrl:u=>u===background.url,normalizeMixedBodyValue:x=>x,normalizeAnnotation:copy,normalizeHotspot:copy,
 embeddedProjectState:()=>copy(template),localStorage:{getItem:()=>null},readJson:(v,f)=>v?JSON.parse(v):f,
 stopAudio(){},stopSlideNarrationPreview(){},slideNarrationPanelSlideId:'',showToast(){},commit(){commits++;},slideIntroCard:()=>null,
 icon:()=>'',escapeHtml:v=>String(v??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),renderContentsSlidePreview:()=>'',contentsNumberStyle:()=>'',
 document:{activeElement:{blur(){}}},syncLiveEditableBeforeRender(){},window:{confirm:q=>{question=q;return confirmed;}}
});
const functions=['normalizeSlide','createSlide','newProjectTemplate','slidePageNumber','slidePositionLabel','currentSlide','duplicateSlide','deleteSlide','moveSlide','manageContentsSlide','renderContentsModal'];
if(runtime.includes('function hasDedicatedCover('))functions.push('hasDedicatedCover');
vm.runInContext(functions.map(fn).join('\n'),ctx);
assert.equal(ctx.slidePageNumber(0),1,'first page must be page 1 even when an old draft stores kind=cover');
const normalized=ctx.normalizeSlide(first,0);assert.equal(normalized.kind,'image','legacy cover must be an ordinary image slide');
for(const key of ['id','title','description','annotations','hotspots','customData'])assert.deepEqual(copy(normalized[key]),first[key],`legacy ${key} preserved`);
for(const key of ['url','x','y','scale'])assert.equal(normalized.media[key],first.media[key],`authored background ${key} preserved`);
assert.equal(ctx.createSlide('cover').kind,'image');assert.equal(ctx.createSlide('image').kind,'image');
for(const slides of [[copy(first),copy(second)], [copy(second),copy(first)], [copy(second)]]){
 template={tutorial:{slides:copy(slides)},ui:{}};
 const made=copy(ctx.newProjectTemplate().tutorial.slides);
 assert.deepEqual(made,slides.map(s=>({...s,kind:s.kind==='cover'?'image':s.kind})),'new draft must not insert, move, or replace a first page');
}
const reset=()=>{ctx.state={tutorial:{title:'Ordinary pages',slides:copy([first,second,third])},ui:{slideIndex:0}};ctx.multiSelection=[];};
reset();
const menu=ctx.renderContentsModal();
assert(menu.includes('Manage page 1'));assert(!menu.includes('Manage cover'));
for(const action of ['duplicate','delete'])assert(!menu.match(new RegExp(`data-action="contents-${action}-slide" data-index="0"[^>]*disabled`)),`${action} enabled on first page`);
assert(!menu.match(/data-action="contents-move-slide" data-index="0" data-direction="1"[^>]*disabled/));
ctx.manageContentsSlide(0,'move',1);assert.deepEqual(copy(ctx.state.tutorial.slides.map(s=>s.id)),['second','cover','third']);
ctx.manageContentsSlide(1,'move',-1);assert.deepEqual(copy(ctx.state.tutorial.slides.map(s=>s.id)),['cover','second','third']);
ctx.manageContentsSlide(1,'move',-1);assert.deepEqual(copy(ctx.state.tutorial.slides.map(s=>s.id)),['second','cover','third'],'any page can become first');
reset();ctx.manageContentsSlide(0,'duplicate');
assert.equal(ctx.state.tutorial.slides.length,4);assert.deepEqual(copy(ctx.state.tutorial.slides[0]),first);
const duplicate=ctx.state.tutorial.slides[1];assert.notEqual(duplicate.id,first.id);assert.equal(duplicate.annotations[0].locked,true);assert.deepEqual(copy(duplicate.annotations[0].cropWindow),first.annotations[0].cropWindow);assert.notEqual(duplicate.annotations[0].id,first.annotations[0].id);
reset();ctx.manageContentsSlide(0,'delete');assert.match(question,/Delete page 1:/);assert.deepEqual(copy(ctx.state.tutorial.slides),[second,third]);assert.equal(ctx.state.ui.slideIndex,0);
reset();confirmed=false;ctx.manageContentsSlide(0,'delete');assert.deepEqual(copy(ctx.state.tutorial.slides),[first,second,third]);confirmed=true;
ctx.state.tutorial.slides=[copy(first)];ctx.deleteSlide();assert.equal(ctx.state.tutorial.slides.length,1,'same last-page safeguard applies to every slide');
reset();vm.runInContext(fn('unlockAllSlideObjects'),ctx);
ctx.unlockAllSlideObjects();
const expected=copy(first);expected.annotations.forEach(a=>a.locked=false);expected.hotspots.forEach(h=>{h.locked=false;h.globalLocked=false;});
assert.deepEqual(copy(ctx.state.tutorial.slides),[expected,second,third],'unlock all affects only current slide lock flags, including covered/tiny objects');
assert.deepEqual(Array.from(ctx.multiSelection),[],'unlock all needs no selection and does not select everything');
const afterCommit=commits;ctx.unlockAllSlideObjects();assert.equal(commits,afterCommit,'no-op unlock should not create extra undo entries');
console.log('PASS: ordinary first page; legacy import preserves content; no template cover insertion/reordering; menu deletion, duplication and movement; any page can become first; last-page safeguard; unlock all preserves geometry/content and other slides; full runtime parses.');
