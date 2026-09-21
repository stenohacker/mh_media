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

const single = functionBody('syncLiveEditableBeforeRender');
assert.match(single, /dispatchEvent\(new Event\("input"/);
assert.match(single, /captureWordFormatting\(editable\)/);

const all = functionBody('syncAllLiveEditablesBeforeRender');
assert.match(all, /querySelectorAll\('\[contenteditable="true"\]\[data-bind\]'\)/);
assert.match(all, /dispatchEvent\(new Event\("input"/);
assert.match(all, /captureWordFormatting\(editable\)/);

const render = functionBody('render');
assert.match(render, /syncLiveEditableBeforeRender\(\)/);
assert.doesNotMatch(render, /syncAllLiveEditablesBeforeRender\(\)/,
  'passive redraws must not rewrite every saved rich-text block');

const pointerDown = functionBody('onPointerDown');
assert.match(pointerDown, /syncLiveEditableBeforeRender\(\)/,
  'resize and move gestures must capture the editor before focus reaches a handle');

const exportHtml = functionBody('buildExportHtml');
assert.match(exportHtml, /syncAllLiveEditablesBeforeRender\(\)/,
  'export must explicitly capture every visible editor');

for (const binding of ['hotspot.body:', 'annotation.introBody:', 'annotation.calloutBody:']) {
  assert(runtime.includes(binding), `${binding} must remain wired`);
}

console.log('Passed: resize captures the active editor, passive redraws do not rewrite drafts, and export captures all card editors; JavaScript parses.');
