import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html = fs.readFileSync(new URL('../tutorial-demo-builder-v2.html', import.meta.url), 'utf8');
const runtime = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1])
  .find((source) => source.includes('function deleteSelected()'));

new vm.Script(runtime);

const source = (name) => {
  const start = runtime.indexOf(`    function ${name}(`);
  assert(start >= 0, `Missing ${name}`);
  const end = runtime.indexOf('\n    }', start);
  return runtime.slice(start, end + 6);
};

const slide = {
  kind: 'image',
  hotspots: [
    { id: 'h1', locked: false, globalLocked: false },
    { id: 'h2', locked: false, globalLocked: false },
    { id: 'h3', locked: false, globalLocked: false },
  ],
  annotations: [],
};
const state = { ui: { activeHotspotId: 'h1' } };
const context = vm.createContext({
  state,
  IS_READING_EXPORT: false,
  currentSlide: () => slide,
  isSlideIntroState: () => false,
});
vm.runInContext([
  source('isHotspotVisibleForActiveState'),
  source('isVisibleForActiveHotspot'),
].join('\n'), context);

assert.equal(context.isHotspotVisibleForActiveState(slide.hotspots[0], slide), true, 'active hotspot is visible');
state.ui.activeHotspotId = 'h2';
assert.equal(context.isHotspotVisibleForActiveState(slide.hotspots[0], slide), false, 'unlocked prior hotspot disappears');
slide.hotspots[0].locked = true;
assert.equal(context.isHotspotVisibleForActiveState(slide.hotspots[0], slide), true, 'regular lock remains from its step forward');
state.ui.activeHotspotId = 'h1';
slide.hotspots[2].locked = true;
assert.equal(context.isHotspotVisibleForActiveState(slide.hotspots[2], slide), false, 'regular lock does not appear before placement');
slide.hotspots[2].globalLocked = true;
assert.equal(context.isHotspotVisibleForActiveState(slide.hotspots[2], slide), true, 'global lock appears from Hotspot 1');

const freeArrow = { id: 'free-arrow', type: 'markup', hotspotGroupId: '', locked: false };
const groupedArrow = { id: 'grouped-arrow', type: 'markup', hotspotGroupId: 'h1', locked: false };
state.ui.activeHotspotId = 'h2';
slide.hotspots[0].locked = false;
assert.equal(context.isVisibleForActiveHotspot(freeArrow), true, 'ungrouped annotation remains slide-wide');
assert.equal(context.isVisibleForActiveHotspot(groupedArrow), false, 'grouped annotation disappears with unlocked hotspot');
slide.hotspots[0].locked = true;
assert.equal(context.isVisibleForActiveHotspot(groupedArrow), true, 'grouped annotation follows regular hotspot lock');

assert.match(source('assignNewAnnotationToActiveHotspot'), /annotation\.hotspotGroupId = ""/,
  'new annotations must not auto-group to the active hotspot');
assert.match(source('renderToolbar'), /groupAction=hotspotGrouping\.valid\?'group-hotspot':'group-objects'/,
  'the visible Group control must route hotspot-plus-annotation selections to hotspot grouping');
assert.match(runtime, /"global-lock-selected": toggleSelectedGlobalHotspotLock/);
assert.match(runtime, /"global-lock-all-hotspots": toggleAllHotspotsGlobalLock/);

console.log('Passed: unlocked, regular-lock, and global-lock hotspot visibility; grouped annotations follow hotspots; ungrouped annotations stay slide-wide.');

if (process.argv.includes('--fixture')) {
  const projectMatch = html.match(/<script id="project-state"[^>]*>([\s\S]*?)<\/script>/);
  const fixtureState = JSON.parse(projectMatch[1]);
  const fixtureSlide = fixtureState.tutorial.slides.find((item) => item.kind === 'image') || fixtureState.tutorial.slides[0];
  fixtureState.tutorial.title = 'HOTSPOT VISIBILITY BROWSER QA';
  fixtureState.tutorial.slides = [fixtureSlide];
  fixtureState.ui.slideIndex = 0;
  fixtureState.ui.activeHotspotId = 'qa-h1';
  fixtureState.ui.selectedKind = 'hotspot';
  fixtureState.ui.selectedId = 'qa-h1';
  fixtureSlide.hotspots = [
    { id: 'qa-h1', title: 'HOTSPOT 1', body: 'First', x: 25, y: 28, w: 8, h: 13.333, z: 20, locked: false },
    { id: 'qa-h2', title: 'HOTSPOT 2', body: 'Second', x: 50, y: 28, w: 8, h: 13.333, z: 21, locked: false },
    { id: 'qa-h3', title: 'HOTSPOT 3', body: 'Third', x: 75, y: 28, w: 8, h: 13.333, z: 22, locked: false },
  ];
  fixtureSlide.annotations = [
    { id: 'qa-grouped', type: 'text', text: 'GROUPED WITH HOTSPOT 1', x: 30, y: 65, w: 28, h: 8, z: 30, hotspotGroupId: 'qa-h1' },
    { id: 'qa-global', type: 'text', text: 'UNGROUPED — STAYS', x: 70, y: 65, w: 28, h: 8, z: 31, hotspotGroupId: '' },
  ];
  const fixture = html.replace('<head>', '<head><base href="/">')
    .replace(/(<script id="project-state"[^>]*>)[\s\S]*?(<\/script>)/,
      (_, open, close) => open + JSON.stringify(fixtureState) + close);
  fs.writeFileSync(new URL('./qa-hotspot-rules-browser.html', import.meta.url), fixture);
  console.log('Generated isolated browser fixture: /audits/qa-hotspot-rules-browser.html');
}
