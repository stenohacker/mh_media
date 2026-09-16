import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { Window } from '/private/tmp/mh-toolbar-audit/dom-tests/node_modules/happy-dom/lib/index.js';
const root='/Users/tamchap/Dev/mh_media';
const html=fs.readFileSync(root+'/tutorial-demo-builder-v2.html','utf8');
const script=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].find(m=>m[2].includes('function deleteSelected()'))[2];
new vm.Script(script);
const code=script.replace('    initializeApp();','').replace('  })();',`window.audit={HOTSPOT_HEADER_COLORS,hotspotStyle,normalizeState,normalizeAnnotation,normalizeHotspot,safeWordHtml,createSlide,syncSlideTitle,ensureSlideTitleCard,toggleSlideIntroTitleOnly,assignCalloutHeaderColors,renderAnnotation,renderToolbar,duplicateSelectedItems,get state(){return state},set state(v){state=v},quiet(){commit=()=>assignCalloutHeaderColors();stopAudio=()=>{};showToast=()=>{};}};})();`);
const win=new Window({url:'http://127.0.0.1:8765/card-unit.html',settings:{disableJavaScriptEvaluation:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
win.document.write(html);win.eval(code);const a=win.audit;a.normalizeState();a.quiet();
a.state.tutorial.slides=[a.createSlide('image')];a.state.ui.slideIndex=0;let slide=a.state.tutorial.slides[0];
a.syncSlideTitle(slide,'Named slide',{createCard:true});const intro=slide.annotations[0];
assert.equal(intro.type,'slide-intro');assert.equal(intro.introTitle,'Named slide');assert.equal(intro.persistentSlideTitle,true);
const id=intro.id;a.syncSlideTitle(slide,'Renamed slide',{createCard:true});assert.equal(slide.annotations.length,1);assert.equal(slide.annotations[0].id,id);assert.equal(intro.introTitle,slide.title);
intro.introBody='One\n| Two\n1. Three';intro.introAlign='center';intro.introBodyAlign='left';intro.richText.introBody='<b>One</b>';
a.toggleSlideIntroTitleOnly(id);assert.equal(intro.introTitleOnly,true);let card=a.renderAnnotation(intro);assert(card.includes('Header only'));assert(!card.includes('aria-label="Slide intro body"'));assert(card.includes('toggle-intro-title-only'));
a.toggleSlideIntroTitleOnly(id);assert.equal(intro.introBody,'One\n| Two\n1. Three');assert.equal(intro.introBodyAlign,'left');assert.equal(intro.richText.introBody,'<b>One</b>');assert(a.renderAnnotation(intro).includes('aria-label="Slide intro body"'));
a.state=JSON.parse(JSON.stringify(a.state));a.normalizeState();slide=a.state.tutorial.slides[0];assert.equal(slide.annotations[0].introTitle,'Renamed slide');assert.equal(slide.annotations[0].introBody,'One\n| Two\n1. Three');
assert.equal(a.HOTSPOT_HEADER_COLORS.length,8);
assert.deepEqual([...a.HOTSPOT_HEADER_COLORS].sort(),fs.readdirSync(root+'/images/tutorial-annotations/hotspots').filter(n=>/-[0-9a-f]{6}\.png$/i.test(n)).map(n=>'#'+n.match(/-([0-9a-f]{6})\.png$/i)[1].toLowerCase()).sort());
const colorCount=a.HOTSPOT_HEADER_COLORS.length;for(let i=0;i<colorCount*2;i++)slide.annotations.push(a.normalizeAnnotation({type:'callout',id:'color-'+i},i));a.assignCalloutHeaderColors();
const colors=slide.annotations.filter(x=>x.type==='callout').map(x=>x.calloutHeaderColor);assert.equal(new Set(colors.slice(0,colorCount)).size,colorCount);assert.equal(new Set(colors.slice(colorCount)).size,colorCount);for(let i=1;i<colorCount*2;i++)assert.notEqual(colors[i],colors[i-1]);
a.normalizeState();slide=a.state.tutorial.slides[0];assert.deepEqual(Array.from(slide.annotations.filter(x=>x.type==='callout'),x=>x.calloutHeaderColor),colors);
a.state.ui.selectedKind='annotation';a.state.ui.selectedId='color-'+(colorCount*2-1);a.duplicateSelectedItems();assert.equal(slide.annotations.length,colorCount*2+2);assert.notEqual(slide.annotations.at(-1).calloutHeaderColor,colors.at(-1));
const toolbar=a.renderToolbar(slide,null);assert(toolbar.includes('Open draft image folders'));assert(!toolbar.includes('id="toolbar-A1"'));assert(toolbar.includes('D1'));assert(toolbar.includes('D5'));assert(toolbar.includes('New draft'));assert(toolbar.includes('Add/select slide title card'));
// Existing title annotations are reused, and legacy title labels retain their placement.
slide.annotations=[a.normalizeAnnotation({id:'legacy-title',type:'text',persistentSlideTitle:true,text:'Old title',x:7,y:15,w:30,h:9},0)];
const before={...slide.annotations[0]};a.syncSlideTitle(slide,'Converted',{createCard:true});const converted=slide.annotations[0];assert.equal(slide.annotations.length,1);assert.equal(converted.type,'slide-intro');for(const k of ['id','x','y','w','h'])assert.equal(converted[k],before[k]);assert.equal(converted.introTitleOnly,true);
// Retired cream text migrates to gray; automatic headers use only the eight asset colors.
const oldCard=a.normalizeAnnotation({type:'callout',calloutHeaderColor:'#FFF7C8',textColor:'#fff7c8',appearanceColor:'#fff7c8',outerOutlineColor:'#fff7c8',x:17,y:25,w:34,h:22,z:4},0);
assert.equal(oldCard.calloutHeaderColor,null);
for (const key of ['textColor','appearanceColor','outerOutlineColor']) assert.equal(oldCard[key],'#e1e2e7');
assert.equal(oldCard.x,17); assert.equal(oldCard.z,4);
assert.equal(a.normalizeHotspot({headerColor:'#fff7c8'},0).headerColor,a.hotspotStyle(0).color);
for (const property of ['color','background-color','text-decoration-color']) {
 const rich=a.safeWordHtml('<span style="'+property+':#fff7c8">Keep this text</span>');
 assert(rich.includes('Keep this text')); assert(!rich.includes('255, 247, 200')); assert(!rich.includes('#fff7c8'));
 assert(/e1e2e7|225, 226, 231/.test(rich));
}
console.log('PASS title creation, rename, reuse, saved content, Header only restore, body alignment, legacy geometry, two complete callout palette cycles, reload stability, duplicate color and direct five-folder toolbar.');
await win.happyDOM.close();
// Real media controls: repeated timeline updates cannot replace a pointer target mid-click.
for(const path of [root+'/tutorial-demo-builder-v2.html',root+'/exports/2026-09-14/appearance-pages-demo.html',root+'/exports/2026-09-14/appearance-pages-slides.html','/Users/tamchap/Dev/website/learn/Appearance/appearance-pages-demo.html']){
 const text=fs.readFileSync(path,'utf8');const runtime=[...text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].find(m=>m[2].includes('function deleteSelected()'))[2];new vm.Script(runtime);
 const names=['updateDirectVideoControls','toggleVideo','restartVideo'];const fns=names.map(n=>runtime.match(new RegExp('    (?:async )?function '+n+'\\([^\\n]*\\) \\{[\\s\\S]*?(?=\\n    (?:async )?function )'))[0]).join('\n');
 let writes=0;const button={dataset:{},set innerHTML(v){writes++},setAttribute(){}};
 const video={paused:false,currentTime:8,duration:78,pause(){this.paused=true},play(){this.paused=false;return Promise.resolve()}};
 const c=vm.createContext({document:{getElementById:id=>id==='videoModalMedia'?video:null,querySelector:()=>button},icon:x=>x,formatVideoTime:String,showToast(){}});vm.runInContext(fns,c);c.updateDirectVideoControls();for(let i=0;i<25;i++)c.updateDirectVideoControls();assert.equal(writes,1);
 await c.toggleVideo();assert.equal(video.paused,true);assert.equal(video.currentTime,8);for(let i=0;i<25;i++)c.updateDirectVideoControls();assert.equal(writes,2);await c.toggleVideo();assert.equal(video.paused,false);assert.equal(video.currentTime,8);await c.restartVideo();assert.equal(video.currentTime,0);assert.equal(video.paused,false);
 console.log('PASS popup pause, resume, replay, stable target and JavaScript parse:',path);
}
