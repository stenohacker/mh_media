import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const builderPath = '/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html';
const html = fs.readFileSync(builderPath, 'utf8');
const runtime = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .find((match) => match[2].includes('function deleteSelected()'))[2];
new vm.Script(runtime);
assert.doesNotMatch(html, /background-image:\s*url\("images\/logo\.png"\)/,
  'the toolbar must not request the removed legacy logo path');
assert.match(html, /background-image:\s*url\("images\/new-logo-nav\.png"\)/);
assert(fs.existsSync('/Users/tamchap/Dev/mh_media/images/new-logo-nav.png'),
  'the toolbar logo asset must exist locally');

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

const prepare = functionBody('prepareLoadedState');
for (const migration of [
  'applyBrowserFrameLayoutUpgrade',
  'applyVisualRefinements',
  'applyCoverAutoFit',
  'applyFixedVideoFrame'
]) {
  assert.doesNotMatch(prepare, new RegExp(`${migration}\\(`),
    `${migration} must not silently restyle a draft during reopen`);
}

for (const name of ['normalizeSlide', 'normalizeHotspot', 'normalizeAnnotation']) {
  const body = functionBody(name);
  assert.match(body, /typeof .* === "object" \? clone\(/,
    `${name} must preserve fields it does not recognize yet`);
}

const slide = functionBody('normalizeSlide');
assert.doesNotMatch(slide, /fitStageObjectBounds\(/,
  'loading a slide must not move or resize its saved objects');
assert.match(slide, /title: String\(slide\?\.title \?\?/,
  'an intentionally blank slide title must stay blank');

const annotation = functionBody('normalizeAnnotation');
for (const field of ['text', 'introTitle', 'introBody', 'calloutTitle', 'calloutBody', 'browserTitle']) {
  assert(annotation.includes(`${field}:`), `${field} must remain normalized`);
}
assert.match(annotation, /item\?\.text \?\?/);
assert.match(annotation, /item\?\.introTitle \?\?/);
assert.match(annotation, /item\?\.calloutTitle \?\?/);

const color = functionBody('normalizeSiteColor');
assert.match(color, /String\(value \?\? fallback\)\.trim\(\)/);
assert.doesNotMatch(color, /LEGACY_SITE_COLOR_REPLACEMENTS/,
  'opening a draft must not replace an authored color');

const render = functionBody('render');
assert.doesNotMatch(render, /syncAllLiveEditablesBeforeRender\(\)/,
  'passive catalog, font, or image redraws must not rewrite all rich text');

const visibilityHandler = runtime.slice(runtime.indexOf('document.addEventListener("visibilitychange"'), runtime.indexOf('window.addEventListener("resize", sizeActiveVideoModal)'));
assert.match(visibilityHandler, /syncLiveEditableBeforeRender\(\);[\s\S]*saveStateNow\(\)/,
  'the active editor must be captured before a hidden-page save');

const exportHtml = functionBody('buildExportHtml');
assert.match(exportHtml, /syncAllLiveEditablesBeforeRender\(\)/,
  'export must snapshot all rendered editors before cloning the document');
assert.match(exportHtml, /const exportState = clone\(state\)/,
  'export must use a snapshot instead of mutating the working draft');

console.log('Passed: reopen, passive redraw, hidden-page autosave, and export preserve draft styling and unknown fields; JavaScript parses.');
