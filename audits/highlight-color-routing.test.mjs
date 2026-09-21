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

const palette = functionBody('highlightPalette');
assert.match(palette, /data-highlight-color=/);
assert.match(palette, /data-highlight-color-input/);
assert.doesNotMatch(palette, /data-palette-target/);

const select = functionBody('selectWordHighlightColor');
assert.match(select, /wordHighlightColor=color/);
assert.match(select, /applyWordStyles\(\{'background-color':color\}, false\)/);
assert.doesNotMatch(select, /text-decoration/);
assert.doesNotMatch(select, /wordUnderlineColor/);

const generic = functionBody('handleToolbarColor');
assert.doesNotMatch(generic, /target==='highlight'/);
assert.doesNotMatch(generic, /target==='body-highlight'/);
assert.match(generic, /target==='underline'/);

const cardControls = functionBody('renderWordFormatButtons');
assert.match(cardControls, /highlightPalette\(wordHighlightColor\)/);

assert.match(runtime, /menu\('C10','Selected words highlight',highlightPalette\(wordHighlightColor\)/);
assert.match(runtime, /menu\('C11','Selected words underline',toolbarPalette\('underline',wordUnderlineColor\)/);

for (const binding of ['hotspot.body:', 'annotation.introBody:', 'annotation.calloutBody:']) {
  assert(runtime.includes(binding), `${binding} must remain wired`);
}

console.log('Passed: title, callout, and hotspot highlight colors use an isolated background-highlight route; underline stays separate; JavaScript parses.');
