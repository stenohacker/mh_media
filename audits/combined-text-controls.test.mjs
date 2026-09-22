import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const folder = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(folder, 'tutorial-demo-builder-v2.html'), 'utf8');
const runtime = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1]).find(source => source.includes('function deleteSelected()'));
new vm.Script(runtime);
const source = name => {
  const start = runtime.indexOf(`    function ${name}(`);
  assert(start >= 0, name);
  return runtime.slice(start, runtime.indexOf('\n    }', start) + 6);
};
const context = vm.createContext({
  clamp: (n, lo, hi) => Math.max(lo, Math.min(hi, n)),
  escapeHtml: value => String(value).replaceAll('"', '&quot;'),
});
vm.runInContext(['underlineHandDrawnAmount', 'gentleUnderlineAttributes'].map(source).join('\n'), context);
const base = {'text-decoration-line':'underline','text-decoration-color':'#26ab9d','text-decoration-thickness':'3px','text-underline-offset':'4px'};
const svg = amount => decodeURIComponent(context.gentleUnderlineAttributes({...base, ...(amount === undefined ? {} : {'--underline-hand-drawn':amount})}).match(/data:image\/svg\+xml,([^&]+)/)[1]);
assert.match(svg(0), /d="M0 2.5 H40"/);
assert.match(svg(30), /d="M0 2.5 Q10 1.3 20 2.5 T40 2.5"/);
assert.equal(svg(), svg(30), 'Legacy gentle underlines do not change appearance');
assert.notEqual(svg(100), svg(30));
assert.equal(svg(100), svg(100), 'No random artwork changes on redraw');
for (const thickness of [.5, 2, 10]) {
  const attributes = context.gentleUnderlineAttributes({...base,'text-decoration-thickness':thickness+'px','--underline-hand-drawn':'100'});
  const height = Number(attributes.match(/--underline-height:(\d+)px/)[1]);
  assert(height >= thickness + 4, 'Wave and stroke fit within SVG without clipping');
}
for (const [input, expected] of [[0,0],['0',0],[100,100],[-2,0],[150,100],[undefined,30],['',30],['bogus',30]]) {
  assert.equal(context.underlineHandDrawnAmount(input), expected);
}
const toolbar = source('renderToolbar');
assert.match(toolbar, /menu\('C18','Text size and spacing',range\('Font size'[\s\S]+range\('Character spacing'[\s\S]+range\('Line spacing'/);
assert.match(toolbar, /menu\('C11','Underline',toolbarPalette\('underline'[\s\S]+range\('Underline thickness'[\s\S]+range\('Underline offset'[\s\S]+range\('Straight → Hand-drawn'/);
assert.doesNotMatch(toolbar, /menu\('C(?:20|21)'/);
assert.match(source('safeWordHtml'), /String\(underlineHandDrawnAmount\(value\)\)/);
assert.match(source('captureFormatTextStyles'), /"--underline-hand-drawn"/);
assert.match(source('applyWordStyles'), /span\.setAttribute\('data-gentle-highlight','true'\)/);
assert.match(html, /\[data-gentle-underline\]\[data-gentle-highlight\][\s\S]*?background-image: var\(--underline-wave\), var\(--word-highlight-image\)/);
const backup = fs.readFileSync(path.join(folder, 'backups/2026-09-21-before-combined-text-controls/tutorial-demo-builder-v2.html'), 'utf8');
const projectState = value => value.match(/<script id="project-state"[^>]*>([\s\S]*?)<\/script>/)[1];
assert.equal(projectState(html), projectState(backup), 'Embedded user project stays untouched');
console.log('PASS combined toolbar menus, straight/gentle/hand-drawn geometry, legacy appearance, value limits, persistence/copy routes, highlight layering, and unchanged embedded project.');
