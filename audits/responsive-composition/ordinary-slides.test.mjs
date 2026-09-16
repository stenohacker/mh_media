import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { Window } from '/private/tmp/mh-toolbar-audit/dom-tests/node_modules/happy-dom/lib/index.js';

const root = '/Users/tamchap/Dev/mh_media';
const html = fs.readFileSync(`${root}/tutorial-demo-builder-v2.html`, 'utf8');
const runtime = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .find(m => m[2].includes('function deleteSelected()'))[2];
new vm.Script(runtime);
const code = runtime.replace('    initializeApp();', '').replace('  })();', `
  window.audit = { normalizeState, normalizeSlide, newProjectTemplate, createSlide,
    defaultSlideBackground, applyDefaultBackground, applyDefaultBackgroundToSlide,
    applyCoverAutoFit, displayMediaUrl, resolveAnnotationAssetSrc, renderToolbar,
    renderContentsModal, duplicateSlide, moveSlide, deleteSlide, linkMediaToSlide,
    get state() { return state; }, set state(v) { state = v; },
    quiet() { commit = () => {}; stopAudio = () => {}; showToast = () => {}; }
  }; })();`);
const win = new Window({ url: 'http://127.0.0.1:8765/ordinary-unit.html', settings: {
  disableJavaScriptEvaluation: true, disableCSSFileLoading: true, disableJavaScriptFileLoading: true
} });
win.document.write(html);
win.eval(code);
const a = win.audit;
const copy = value => JSON.parse(JSON.stringify(value));
a.quiet();
a.normalizeState();
for (const slide of a.state.tutorial.slides) {
  assert.equal(slide.kind, 'image');
  assert.equal(slide.media.url, a.defaultSlideBackground().url);
}
for (const slide of a.newProjectTemplate().tutorial.slides) {
  assert.equal(slide.kind, 'image');
  assert.equal(slide.media.url, a.defaultSlideBackground().url);
}
assert.equal(a.createSlide('image').media.url, a.defaultSlideBackground().url);
assert.equal(a.createSlide('video').media.url, '');
assert.equal(a.createSlide('scroll').media.url, a.defaultSlideBackground().url);

// Legacy cover becomes an ordinary page without resetting its authored background.
const custom = { kind: 'cover', media: { url: 'https://example.test/custom.png',
  fit: 'contain', x: 7, y: 2, scale: 1.4 }, annotations: [], hotspots: [] };
const normalized = a.normalizeSlide(custom, 0);
assert.equal(normalized.kind, 'image');
assert.equal(normalized.media.url, custom.media.url);
assert.equal(normalized.media.scale, 1.4);
assert.equal(normalized.media.x, 7);

// Existing real drafts retain order, IDs, backgrounds and every object's geometry.
const projects = JSON.parse(fs.readFileSync(`${root}/.tutorial-demo-projects.json`, 'utf8')).projects;
for (const project of projects) {
  const before = copy(project.state);
  a.state = copy(before);
  a.normalizeState();
  a.applyCoverAutoFit();
  assert.deepEqual(copy(a.state.tutorial.slides.map(s => s.id)), before.tutorial.slides.map(s => s.id));
  for (const [index, oldSlide] of before.tutorial.slides.entries()) {
    const slide = a.state.tutorial.slides[index];
    const recoveredScroll = slide.kind === 'scroll' && !oldSlide.scrollImage?.url && slide.scrollImage?.url === oldSlide.media?.url;
    if (recoveredScroll) {
      assert(slide.media.url.endsWith('/slide-backgrounds/0913background.png'));
      assert.equal(slide.scrollImage.naturalHeight, oldSlide.media.naturalHeight);
    }
    if (oldSlide.media?.url && !recoveredScroll) {
      for (const key of ['url', 'fit', 'x', 'y', 'scale']) assert.equal(slide.media[key], oldSlide.media[key], `${project.name}: background ${key}`);
    }
    for (const type of ['annotations', 'hotspots']) {
      assert.equal(slide[type].length, oldSlide[type].length);
      for (const [i, old] of oldSlide[type].entries()) {
        for (const key of ['id', 'x', 'y', 'w', 'h', 'src', 'rotation', 'clipFrameId']) {
          if (key in old) assert.equal(slide[type][i][key], old[key], `${project.name}: ${type} ${old.id} ${key}`);
        }
      }
    }
  }
}

a.state.ui.slideIndex = 0;
const count = a.state.tutorial.slides.length;
const first = a.state.tutorial.slides[0];
const objects = copy({ annotations: first.annotations, hotspots: first.hotspots });
a.applyDefaultBackgroundToSlide(first);
assert.equal(a.state.tutorial.slides.length, count);
assert.deepEqual(copy({ annotations: first.annotations, hotspots: first.hotspots }), objects);
a.linkMediaToSlide(first.id, { name: 'custom.png', type: 'image/png' }, ['images', 'custom.png'], 'Test');
assert.equal(first.media.url, 'https://iridescent-wisp-57bcb1.netlify.app/images/custom.png');
assert.deepEqual(copy({ annotations: first.annotations, hotspots: first.hotspots }), objects);
assert(a.renderToolbar(first, null).includes('Replace slide background'));
assert(a.renderContentsModal().includes('Manage page 1'));
a.duplicateSlide();
assert.equal(a.state.tutorial.slides.length, count + 1);
assert.notEqual(a.state.tutorial.slides[1].id, first.id);
a.moveSlide(-1);
assert.equal(a.state.ui.slideIndex, 0);
win.confirm = () => true;
a.deleteSlide();
assert.equal(a.state.tutorial.slides.length, count);
assert.equal(a.state.tutorial.slides[0].id, first.id);
a.applyDefaultBackground();
assert.equal(a.state.tutorial.slides.length, count + 1);
assert.equal(a.state.tutorial.slides[a.state.ui.slideIndex].media.url, a.defaultSlideBackground().url);
a.normalizeState();
assert.equal(a.state.tutorial.slides.length, count + 1, 'Reload must not insert a cover');
a.state.tutorial.slides = [a.createSlide('image')];
a.state.ui.slideIndex = 0;
a.deleteSlide();
assert.equal(a.state.tutorial.slides.length, 1);
assert.equal(a.displayMediaUrl('https://example.test/custom.png'), 'https://example.test/custom.png');
assert.equal(a.resolveAnnotationAssetSrc('https://iridescent-wisp-57bcb1.netlify.app/images/tutorial-drafts/example/screen.png'), '/images/tutorial-drafts/example/screen.png');
console.log('Passed: ordinary first page; default backgrounds; custom background and real-draft geometry preservation; independent background replacement; first-page management; no cover reinserted on reload; local Drafts screenshot paths; JavaScript parse.');
await win.happyDOM.close();
