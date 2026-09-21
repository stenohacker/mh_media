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

const functionSource = (name) => {
  const body = functionBody(name);
  const start = runtime.indexOf(`function ${name}(`);
  const open = runtime.indexOf('{', start);
  return runtime.slice(start, open + body.length + 2);
};

for (const kind of ['text', 'markup', 'slide-intro', 'callout', 'hotspot']) {
  assert.match(runtime, new RegExp(`(?:^|\\s|[,{])['\"]?${kind.replace('-', '\\-')}['\"]?\\s*:`), `${kind} property profile must exist`);
}

const shortcut = runtime.slice(runtime.indexOf('const formatPropertyShortcut'), runtime.indexOf('const objectGroupShortcut'));
assert.match(shortcut, /event\.shiftKey/);
assert.match(shortcut, /\["c", "v"\]/);
assert.match(shortcut, /formatPropertyKind\(state\.ui\.selectedKind, selectedObject\(\)\)/);

const copy = functionBody('copySelectedFormatProperties');
assert.match(copy, /FORMAT_PROPERTY_KEYS\[kind\]/);
assert.match(copy, /Copied.*properties/);

const paste = functionBody('pasteSelectedFormatProperties');
assert.match(paste, /formatPropertyKind\(kind, item\) === formatPropertiesClipboard\.kind/);
assert.match(paste, /target\[key\] = value/);
assert.match(paste, /commit\(`Applied/);

const profiles = runtime.match(/const FORMAT_PROPERTY_KEYS = Object\.freeze\(\{[\s\S]*?\n    \}\);/)?.[0];
assert(profiles, 'property profiles must be extractable');
const context = {
  source: null,
  selected: [],
  state: { ui: { selectedKind: null } },
  lastToast: '',
  lastCommit: '',
  normalizeMarkupKind(value) { return value; },
  CLOSED_MARKUP_STYLES: [],
  MARKUP_STYLES: []
};
context.showToast = (message) => { context.lastToast = message; };
context.commit = (message) => { context.lastCommit = message; };
context.selectedObject = () => context.source;
context.selectedObjects = () => context.selected;
vm.createContext(context);
vm.runInContext(`${profiles}\nlet formatPropertiesClipboard = null;\n${functionSource('formatPropertyKind')}\n${functionSource('formatPropertyLabel')}\n${functionSource('copySelectedFormatProperties')}\n${functionSource('pasteSelectedFormatProperties')}`, context);

for (const [kind, source, target] of [
  ['hotspot', { textAlign: 'center', textLetterSpacing: 2, textLineHeight: 1.8, opacity: .7, imageShadow: true, shadowHeight: 14 }, { textAlign: 'left', textLetterSpacing: 0, textLineHeight: 1.2, opacity: 1, imageShadow: false, shadowHeight: 2 }],
  ['callout', { type: 'callout', calloutAlign: 'center', calloutBodyAlign: 'left', textStyle: 'hand', textFontSize: 31, textLetterSpacing: 1, textLineHeight: 1.7, appearanceColor: '#123456', calloutHeaderColor: '#26ab9d', shadowHeight: 12, shadowFlipped: true, outerOutlineWidth: 4, outerOutlineColor: '#ffffff', outlineEnabled: true }, { type: 'callout', calloutAlign: 'left', textFontSize: 16 }],
  ['slide-intro', { type: 'slide-intro', introAlign: 'center', introBodyAlign: 'left', introTitleOnly: true, textFontSize: 29, textLetterSpacing: .5, textLineHeight: 1.6, appearanceColor: '#abcdef', shadowHeight: 10, shadowFlipped: false, outerOutlineWidth: 3, outerOutlineColor: '#000000', outlineEnabled: true }, { type: 'slide-intro', introAlign: 'left', textFontSize: 16 }]
]) {
  context.source = source;
  context.state.ui.selectedKind = kind === 'hotspot' ? 'hotspot' : 'annotation';
  assert.equal(vm.runInContext('copySelectedFormatProperties()', context), true);
  context.selected = [{ kind: kind === 'hotspot' ? 'hotspot' : 'annotation', item: target }];
  assert.equal(vm.runInContext('pasteSelectedFormatProperties()', context), true);
  for (const key of Object.keys(source).filter((key) => key !== 'type')) {
    assert.deepEqual(target[key], source[key], `${kind}.${key} must paste`);
  }
}

console.log('Passed: Command/Control-Shift-C and -V route real property values for title cards, callouts, hotspots, text, and shapes; JavaScript parses.');
