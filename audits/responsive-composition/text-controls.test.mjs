import fs from 'node:fs';
import assert from 'node:assert/strict';
import { Window } from '/private/tmp/mh-toolbar-audit/dom-tests/node_modules/happy-dom/lib/index.js';
const base='/Users/tamchap/Dev/mh_media';
const html=fs.readFileSync(base+'/tutorial-demo-builder-v2.html','utf8');
const runtime=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].find(m=>m[2].includes('function deleteSelected()'))[2];
const win=new Window({url:'http://127.0.0.1:8765/text-format-unit.html',settings:{disableJavaScriptEvaluation:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
win.document.write(html);
const art=win.document.createElement('script');art.id='link-annotation-art';art.type='application/json';art.textContent=JSON.stringify({src:'data:image/png;base64,'+fs.readFileSync(base+'/images/tutorial-annotations/link-annotation.png').toString('base64')});win.document.head.append(art);
win.eval(runtime.replace('    initializeApp();','').replace('  })();',`window.audit={normalizeState,normalizeAnnotation,normalizeHotspot,renderAnnotation,renderWordText,renderBody,renderHotspotDetail,wordColorTarget,rememberWordSelection,selectedWordEditor,applyWordStyles,handleToolbarColor,onFocusIn,onInput,onKeyDown,onPointerDown,onPointerMove,addText,addCallout,ensureSlideTitleCard,objectStyle,selectedObject,currentSlide,buildExportHtml,get state(){return state},quiet(){commit=()=>{};scheduleSave=()=>{};showToast=()=>{};waitForExportFonts=async()=>{};}};})();`));
const a=win.audit;a.normalizeState();a.quiet();const doc=win.document,root=doc.querySelector('#app'),slide=a.currentSlide();slide.annotations=[];slide.hotspots=[];
const items=[['text','text'],['callout','calloutTitle'],['callout','calloutBody'],['slide-intro','introTitle'],['slide-intro','introBody'],['link','linkText']].map(([type,field],i)=>{const item=a.normalizeAnnotation({id:'format-'+i,type,[field]:'one two three'},i);slide.annotations.push(item);return {item,field,kind:'annotation'};});
const hotspot=a.normalizeHotspot({id:'hotspot-check',title:'one two three',body:'one two three'},0);slide.hotspots.push(hotspot);items.push({item:hotspot,field:'title',kind:'hotspot'},{item:hotspot,field:'body',kind:'hotspot'});
root.innerHTML=items.map(({item,field,kind})=>`<div data-object data-id="${item.id}"><div contenteditable="true" data-bind="${kind}.${field}:${item.id}">${item[field]}</div></div>`).join('');
root.addEventListener('input',a.onInput);
function select(editor,start,end){const range=doc.createRange(),walk=doc.createTreeWalker(editor,win.NodeFilter.SHOW_TEXT);let offset=0,node,begun=false;while(node=walk.nextNode()){if(!begun&&start<=offset+node.length){range.setStart(node,start-offset);begun=true;}if(end<=offset+node.length){range.setEnd(node,end-offset);break;}offset+=node.length;}win.getSelection().removeAllRanges();win.getSelection().addRange(range);a.rememberWordSelection();}
let previous=null;
for(const entry of items){const {item,field,kind}=entry,editor=root.querySelector(`[data-bind="${kind}.${field}:${item.id}"]`);a.state.ui.selectedKind=kind;a.state.ui.selectedId=item.id;
 // An old range in another field must not receive the new color.
 a.onFocusIn({target:editor});select(editor,3,3);const before=previous?.innerHTML;
 a.handleToolbarColor('underline','#fe6f51');assert(/text-decoration-color:\s*#fe6f51/.test(editor.innerHTML),field);if(previous)assert.equal(previous.innerHTML,before);
 assert.equal(editor.textContent,'one two three');
 // Partial range formatting composes, then survives normalization/rendering.
 select(editor,4,7);a.onKeyDown({target:editor,key:'b',metaKey:true,preventDefault(){}});a.handleToolbarColor('highlight','#f7fb4f');a.handleToolbarColor('underline','#91a8ed');
 const span=[...editor.querySelectorAll('span')].find(e=>e.textContent==='two');assert.equal(span.style.fontWeight,'700');assert.equal(span.style.backgroundColor,'#f7fb4f');assert.equal(span.style.textDecorationColor,'#91a8ed');
 const roundtrip=kind==='hotspot'?a.normalizeHotspot(JSON.parse(JSON.stringify(item)),0):a.normalizeAnnotation(JSON.parse(JSON.stringify(item)),0);const rendered=a.renderWordText(roundtrip,field);assert(rendered.includes('91a8ed'));assert(rendered.includes('font-weight:700'));previous=editor;
}
// Selecting a box (no caret/range) formats that box's text.
a.rememberWordSelection.saved=null;a.state.ui.selectedKind='annotation';a.state.ui.selectedId=items[0].item.id;a.handleToolbarColor('underline','#ffc900');assert(root.querySelector('[data-bind="annotation.text:format-0"]').innerHTML.includes('#ffc900'));
for(const style of ['regular','hand','impact-label','impact-label-reversed']){a.addText(style);const item=a.selectedObject();assert.equal(item.textFontSize,style==='regular'?28:32);assert.equal(item.h,7);}
assert.equal(items[0].item.textFontSize,16,'existing font size stays unchanged');
slide.annotations=slide.annotations.filter(item=>item.type!=='slide-intro');
const title=a.ensureSlideTitleCard();assert.equal(title.cardTypographyVersion,1);assert.equal(title.textFontSize,28);assert(a.objectStyle(title).includes('--card-title-font-size:2.6666666666666665cqw'));
a.addCallout();const callout=a.selectedObject();assert.equal(callout.cardTypographyVersion,1);assert(a.objectStyle(callout).includes('--card-title-font-size:2.4cqw'));
assert(!html.includes('annotation-blur:not(.is-selected)'));
assert(html.includes('border: 0 !important;\n      outline: 0 !important;'));
for(const type of ['text','image','gif','shape','video','audio','link','blur','markup','magnifier','callout','slide-intro','clip-frame']){const item=a.normalizeAnnotation({type,w:1,h:1},0);assert.equal(item.w,1,type);assert.equal(item.h,1,type);const reload=a.normalizeAnnotation(JSON.parse(JSON.stringify(item)),0);assert.equal(reload.w,1);assert.equal(reload.h,1);}
assert.equal(a.normalizeHotspot({w:1,h:1},0).w,1);
for(const mode of ['tutorial','demo']){const result=await a.buildExportHtml(mode);assert(result.html.includes('91a8ed'));assert(result.html.includes('headerBottom + 8'));assert(result.html.includes('viewportHeight - (stageWrap'));if(process.argv.includes('--write-fixtures'))fs.writeFileSync(base+'/audits/responsive-composition/text-format-'+mode+'.html',result.html);}
console.log('PASS: underline, bold and highlight across 8 text fields; stale/collapsed selection; whole box; save/reload; new sizes; small box roundtrip; both export serializers.');
await win.happyDOM.close();
