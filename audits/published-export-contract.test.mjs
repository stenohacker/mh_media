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
  const open = runtime.indexOf(') {', start) + 2;
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
assert.match(build, /exportBody\.removeAttribute\("data-resize-mode"\)/);
assert.match(build, /querySelectorAll\("#scaleModeIndicator, \.scale-mode-indicator"\)\.forEach\(\(node\) => node\.remove\(\)\)/);
assert.match(build, /await embedSiteHeaderLogo\(documentElement\)/);
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

assert.match(runtime, /function renderDemoPlayerChrome\(\)/);
assert.match(runtime, /VISIT MAGICHASHTAGS\.COM/);
assert.match(runtime, /"close-demo-player": closeDemoPlayer/);
const closeDemo = functionBody('closeDemoPlayer');
assert.match(closeDemo, /new URLSearchParams\(location\.search\)\.get\("return"\)/);
assert.match(closeDemo, /history\.back\(\)/);
assert.match(closeDemo, /location\.assign\(`\$\{CANONICAL_SITE\}\/`\)/);
assert.match(runtime, /data-action="demo-video-sound"/);
assert.match(runtime, /indicator\.dataset\.builderOnly = ""/);
const duration = functionBody('demoSlideDurationMs');
assert.match(duration, /hasManualOverride[\s\S]*?slide\.demo\.manualDuration/);
assert.match(duration, /slide\?\.demo\?\.timing === "audio"[\s\S]*?slide\.demo\.duration/);
assert.match(duration, /state\.meta\.demoDefaultDuration/);
const audioPicker = functionBody('selectExistingSlideAudio');
assert.match(audioPicker, /mediaDurationSeconds\(file\)/);
assert.match(audioPicker, /targetSlide\.demo\.duration = clamp\(audioDuration/);

const png = functionBody('exportPng');
assert.match(png, /return exportReadingGuide\("png"\)/);
const reading = fs.readFileSync('/Users/tamchap/Dev/mh_media/scripts/tutorial-reading-export.js', 'utf8');
assert(reading.includes('slideIndex < slides.length'), 'Reading export includes every retained slide');
assert(functionBody('exportReadingGuide').includes('index < renderer.pageCount'), 'PNG and PDF include all continuation pages');
assert(build.includes('querySelector("#reading-export-runtime")?.remove()'), 'Standalone HTML has no external reading layout dependency');
assert(build.includes('["tutorial-reading-runtime", "scripts/tutorial-reading-export.js"'), 'Tutorial HTML embeds its reading-guide layout');
assert(build.includes('["tutorial-html2canvas-runtime", "scripts/html2canvas.min.js"'), 'Tutorial HTML embeds its image renderer');
assert(build.includes('["tutorial-pdf-runtime", "scripts/pdf-lib-1.17.1.min.js"'), 'Tutorial HTML embeds its PDF writer');
assert(runtime.includes('Optional page CTA URL (not catalog)'));
assert(runtime.includes('They do not connect the tutorial to the Reporter Tools catalog'));

console.log('Passed: tutorial and demo HTML retain their separate viewer contracts; PNG/PDF reading export includes every retained slide and continuation page.');
