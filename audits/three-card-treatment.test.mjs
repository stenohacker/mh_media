import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html = fs.readFileSync('/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html', 'utf8');
const runtime = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .find((match) => match[2].includes('function deleteSelected()'))[2];
new vm.Script(runtime);

assert.match(html, /\.annotation-slide-intro \.object-frame[\s\S]*?padding: var\(--intro-card-inset\)/);
assert.match(html, /\.annotation-callout \.object-frame[\s\S]*?padding: var\(--callout-card-inset\)/);
assert.match(html, /\.standalone-callout-card__title[\s\S]*?background: var\(--callout-header-color, var\(--black\)\)/);
assert.match(html, /\.standalone-callout-card__title[\s\S]*?color: var\(--callout-header-ink, var\(--white\)\)/);
assert.match(html, /\.slide-sidebar\.is-demo-popup[\s\S]*?padding: 3px/);
assert.match(html, /\.slide-sidebar\.is-demo-popup \.hotspot-row[\s\S]*?margin: 0;[\s\S]*?background: var\(--hotspot-color, var\(--black\)\)/);
assert.match(runtime, /item\.calloutHeaderColor \|\| "#000000"/);

console.log('Passed: title, callout, and hotspot cards share the inset outer frame and top-header treatment; JavaScript parses.');
