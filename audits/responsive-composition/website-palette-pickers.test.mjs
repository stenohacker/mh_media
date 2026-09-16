import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { Window } from '/private/tmp/mh-toolbar-audit/dom-tests/node_modules/happy-dom/lib/index.js';
const base='/Users/tamchap/Dev/mh_media';const html=fs.readFileSync(base+'/tutorial-demo-builder-v2.html','utf8');
const runtime=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].find(m=>m[1].includes('function deleteSelected()'))[1];new vm.Script(runtime);
const win=new Window({url:'http://127.0.0.1:8765/palette-unit.html',settings:{disableJavaScriptEvaluation:true,disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});win.document.write(html);
win.eval(runtime.replace('    initializeApp();','').replace('  })();',`window.audit={normalizeState,normalizeAnnotation,renderToolbar,currentSlide,SITE_COLOR_PRESETS,TOOLBAR_PALETTE,toolbarPalette,renderWordColorControls,get state(){return state}};})();`));
const a=win.audit;a.normalizeState();
const css=fs.readFileSync('/Users/tamchap/Dev/website/styles/site-system.css','utf8');
const website=[...new Set([...css.matchAll(/--color-[\w-]+:\s*(#[\da-f]{6});/gi)].map(m=>m[1].toLowerCase()))].sort();
assert.deepEqual([...a.TOOLBAR_PALETTE].sort(),website);assert.equal(a.TOOLBAR_PALETTE.length,11);
const slide=a.currentSlide();const item=a.normalizeAnnotation({id:'palette-shape',type:'markup',markup:'circle-fill-solid',markupFillVersion:1},0);slide.annotations.push(item);a.state.ui.selectedKind='annotation';a.state.ui.selectedId=item.id;
const doc=win.document;doc.querySelector('#app').innerHTML=a.renderToolbar(slide,item);
for(const target of ['main','highlight','underline','background','outline','stroke']) {
 const colors=[...doc.querySelectorAll(`[data-palette-target="${target}"]`)].map(b=>b.dataset.color).sort();assert.deepEqual(colors,website,target);
 assert.equal(doc.querySelector(`[data-palette-input="${target}"]`).getAttribute('list'),'magic-hashtags-color-palette');
}
assert.deepEqual([...doc.querySelectorAll('#magic-hashtags-color-palette option')].map(o=>o.value).sort(),website);
const old=doc.createElement('div');old.innerHTML=a.renderWordColorControls();assert([...old.querySelectorAll('input[type="color"]')].every(i=>i.getAttribute('list')==='magic-hashtags-color-palette'));
assert(a.toolbarPalette('main','#123456').includes('value="#123456"'),'Custom colors remain available');
console.log('PASS: all six palette targets and native picker suggestions match the eleven website colors; black/white/gray included; custom colors retained.');await win.happyDOM.close();
