import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html = fs.readFileSync('/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html', 'utf8');
const runtime = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .find((match) => match[2].includes('function deleteSelected()'))[2];
new vm.Script(runtime);

assert.match(html, /\.annotation-slide-intro \.object-frame[\s\S]*?padding: var\(--intro-card-inset\)/);
assert.match(html, /\.annotation-callout \.object-frame::before[\s\S]*?content: ""[\s\S]*?border-right:/);
assert.match(html, /\.annotation-callout \.object-frame::before \{ background: var\(--yellow\)/);
assert.match(html, /\.standalone-callout-card__title[\s\S]*?background: transparent;[\s\S]*?color: var\(--black\)/);
assert.match(html, /\.slide-sidebar\.is-demo-popup \.hotspot-row__title[\s\S]*?border: 1px solid var\(--black\);[\s\S]*?background: var\(--white\)/);
assert.match(runtime, /function cardTextTarget\(/);
assert.match(runtime, /referenceCardShadow \? item\.cardShadow !== false : item\.imageShadow/);
console.log('Passed: original left-strip callout, inset white hotspot title, title-card header, and controllable card shadows; JavaScript parses.');
