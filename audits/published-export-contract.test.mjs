import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html = fs.readFileSync('/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html', 'utf8');
const runtime = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .find((match) => match[2].includes('function deleteSelected()'))[2];
new vm.Script(runtime);

const functionBody = (name) => {
  const start = runtime.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} must exist`);
  let depth = 0;
  const open = runtime.indexOf('{', start);
  for (let index = open; index < runtime.length; index += 1) {
    if (runtime[index] === '{') depth += 1;
    if (runtime[index] === '}' && --depth === 0) return runtime.slice(open + 1, index);
  }
  throw new Error(`${name} body did not close`);
};

const build = functionBody('buildExportHtml');
assert.match(build, /exportBody\.dataset\.mode = "player"/);
assert.match(build, /if \(isDemoExport\) exportBody\.dataset\.demoPlayer = "true"/);
assert.match(build, /else exportBody\.removeAttribute\("data-demo-player"\)/);
assert.match(build, /exportBody\.removeAttribute\("data-demo-embed"\)/);
assert.match(build, /if \(!isDemoExport\) await embedSiteHeaderLogo\(documentElement\)/);
assert.match(build, /isDemoExport \? "noindex, nofollow" : "index, follow"/);
assert.match(build, /contentsOpen: false/);

const open = functionBody('openTutorialViewer');
assert.match(open, /tutorialViewerOpen = true/);
assert.match(open, /render\(\)/);
assert.match(runtime, /function closeTutorialViewer\(\{ completed = false \} = \{\}\) \{[\s\S]{0,180}?tutorialViewerOpen = false/);

assert.match(html, /body\[data-mode="player"\]\[data-tutorial-viewer="open"\] \.site-header \{ display: none !important; \}/);
assert.match(html, /body\[data-mode="player"\]\[data-tutorial-viewer="open"\] \.tutorial-shell[\s\S]*?grid-template-rows: minmax\(0, 1fr\) auto/);
assert.match(html, /body\[data-mode="player"\]\[data-tutorial-viewer="open"\] \.tutorial-viewer-close \{ display: grid/);
assert.match(runtime, /renderReaderNav\(\)/);
assert.match(runtime, /return tutorialViewerOpen && atEnd\(\) \? "Finish" : "Next"/);

const png = functionBody('exportPng');
assert.match(png, /for \(let index = 0; index < state\.tutorial\.slides\.length; index \+= 1\)/);

console.log('Passed: tutorial export starts as a normal indexed page, Start hides the header and fits navigation in the viewer, demo export stays noindex, and PNG export iterates every slide.');
