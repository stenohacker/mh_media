import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { Window } from '/private/tmp/mh-toolbar-audit/dom-tests/node_modules/happy-dom/lib/index.js';

const base = '/Users/tamchap/Dev/mh_media';
const html = fs.readFileSync(base + '/tutorial-demo-builder-v2.html', 'utf8');
const runtime = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .find(m => m[2].includes('function deleteSelected()'))[2];
new vm.Script(runtime);
const win = new Window({ url: 'http://127.0.0.1:8765/navigation-unit.html', settings: {
  disableJavaScriptEvaluation: true, disableCSSFileLoading: true, disableJavaScriptFileLoading: true
} });
win.document.write(html);
win.eval(runtime.replace('    initializeApp();', '').replace('  })();', `
  window.audit = {normalizeState, normalizeSlide, slideSceneHeight, playerCompositionBounds,
    playerViewportBounds, readerNext, readerBack, currentSlide,
    get state(){return state}, set state(v){state=v},
    quiet(){commit=()=>{};render=()=>{};scheduleSave=()=>{};stopAudio=()=>{};showToast=()=>{};}
  };})();`));
const a = win.audit;
const originalHtml = fs.readFileSync('/Users/tamchap/Downloads/tutorial-title (28).html', 'utf8');
const original = JSON.parse(originalHtml.match(/<script[^>]*id="project-state"[^>]*>([\s\S]*?)<\/script>/)[1]);
const copy = x => JSON.parse(JSON.stringify(x));
a.state = copy(original); a.quiet(); a.normalizeState();
const fourth = a.state.tutorial.slides[3];
assert.equal(fourth.backgroundLayout, 'background-v1');
assert.equal(a.slideSceneHeight(fourth), a.slideSceneHeight(a.state.tutorial.slides[2]));
assert.deepEqual(copy(fourth.media), original.tutorial.slides[3].media);
for (const [i, item] of fourth.annotations.entries()) {
  for (const key of ['id', 'type', 'x', 'y', 'w', 'h', 'rotation'])
    assert.equal(item[key], original.tutorial.slides[3].annotations[i][key]);
}
const viewport = copy(a.playerViewportBounds());
assert(viewport.right > 1500, 'Preserve the authored label outside the canvas');
for (const slide of a.state.tutorial.slides) {
  const bounds = a.playerCompositionBounds(slide);
  assert(viewport.left <= bounds.left && viewport.right >= bounds.right);
  assert(viewport.top <= bounds.top && viewport.bottom >= bounds.bottom);
}
a.state.ui.slideIndex = 2;
a.readerNext(); assert.equal(a.currentSlide().id, fourth.id);
assert.deepEqual(copy(a.playerViewportBounds()), viewport);
a.readerNext(); a.readerBack(); assert.equal(a.currentSlide().id, fourth.id);
assert.deepEqual(copy(a.playerViewportBounds()), viewport);
a.readerBack(); a.readerNext(); assert.equal(a.currentSlide().id, fourth.id);
assert.deepEqual(copy(a.playerViewportBounds()), viewport);
a.normalizeState();
assert.deepEqual(copy(a.playerViewportBounds()), viewport, 'Reload is stable');
const legacy = a.normalizeSlide({kind:'image',media:{url:'https://example.test/screenshot.png'},annotations:[{type:'text',x:50,y:50,w:20,h:20}]},0);
assert.equal(a.slideSceneHeight(legacy), 900, 'Unrelated legacy screenshots retain their canvas');
assert(!html.includes('transform: scale(.985)'));
console.log('PASS: actual slide 4 background recovery; unchanged authored geometry; stable Next/Back composition; all off-canvas content included; reload and unrelated legacy layout.');
await win.happyDOM.close();
