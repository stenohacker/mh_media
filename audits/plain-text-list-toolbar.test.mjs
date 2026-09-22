import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html = fs.readFileSync('/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html', 'utf8');
const runtime = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .find((match) => match[2].includes('function deleteSelected()'))[2];

new vm.Script(runtime);

const leftCenter = runtime.indexOf("['left','center'].forEach");
const pipeButton = runtime.indexOf('data-action="toggle-toolbar-pipe-list"', leftCenter);
const numberedButton = runtime.indexOf('data-action="toggle-toolbar-numbered-list"', leftCenter);
const objectAlignment = runtime.indexOf("['left','center','middle','right','top','bottom'].forEach", leftCenter);
assert(leftCenter >= 0 && pipeButton > leftCenter && numberedButton > pipeButton && objectAlignment > numberedButton,
  'plain-text list buttons must sit directly after Text left and Text center');

assert.match(runtime, /"toggle-annotation-pipe-list": \(\) => toggleAnnotationTextList\(id, actionNode, "pipe"\)/);
assert.match(runtime, /"toggle-annotation-numbered-list": \(\) => toggleAnnotationTextList\(id, actionNode, "numbered"\)/);
assert.match(runtime, /function toggleAnnotationTextList\(id, button, kind\)/);
assert.match(runtime, /item\.id === id && item\.type === "text"/);
assert.match(runtime, /toggleMixedBodyListLines\(editor, button, kind\)/);

const textRenderStart = runtime.indexOf('} else if (annotation.type === "text") {');
const textRenderEnd = runtime.indexOf('} else if (annotation.type === "markup") {', textRenderStart);
const textRender = runtime.slice(textRenderStart, textRenderEnd);
assert.match(textRender, /renderBody\(annotation\.text/);
assert.match(textRender, /binding: `annotation\.text:/);
assert.match(textRender, /style: `color:/);

assert.match(runtime, /text: normalizeMixedBodyValue\(normalizeMultilineText/);
assert.match(runtime, /textListStyle: ""/);
assert.match(runtime, /function renderContentsPreviewText\(annotation\)/);
assert.match(runtime, /mixedBodyLines\(annotation\.text\)/);
assert.match(runtime, /renderContentsPreviewText\(annotation\)/);
assert.match(runtime, /function savedWordLines\(item, field\)/);
assert.match(runtime, /saved\.text == null && typeof saved\.html === "string"/);
assert.match(runtime, /if \(savedText === currentText\) return \{ \.\.\.saved, text: item\?\.\[field\] \}/);
assert(runtime.includes('saved.lines.map(line => safeWordHtml(line)).join("<br>")'), 'Saved row formatting also supports internal soft breaks');
assert(runtime.includes('normalizeMultilineText(node.textContent).split("\\n").forEach'), 'Soft breaks expand to physical lines without duplicating later rows');
assert.match(runtime, /const richLines = target \? savedWordLines\(target\.item, target\.field\) : null/);
assert.match(html, /\.contents-preview-text-line\.is-pipe::before/);
assert.match(html, /\.contents-preview-text-line\.is-numbered::before/);
assert.match(runtime, /textColor: mainTextColorDefault/);
assert.doesNotMatch(runtime, /mainTextColorDefault=color/);

console.log('Passed: plain-text Pipe and Numbered buttons preserve legacy rich formatting, default new text to black, persist list styling, and render in menu thumbnails; JavaScript parses.');
