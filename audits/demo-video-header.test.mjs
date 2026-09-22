import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const builderPath = '/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html';
const html = fs.readFileSync(builderPath, 'utf8');
const runtime = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .find((match) => match[2].includes('function deleteSelected()'))[2];

new vm.Script(runtime);

assert.match(
  html,
  /body\[data-demo-player="true"\] \.demo-player-chrome \{[\s\S]*?background: var\(--yellow\)/,
  'The Video/Demo player header must use the solid site yellow.'
);
assert.match(runtime, /state\.meta\.videoTitle = String\(state\.meta\.videoTitle \|\| state\.tutorial\.title/);
assert.match(runtime, /const videoTitle = String\(state\.meta\.videoTitle \|\| ""\)\.trim\(\)/);
assert.doesNotMatch(runtime, /id="demoPlayerTitle"/, 'Video title entry belongs in the later metadata workflow, not this toolbar.');
assert.match(runtime, /menu\('B5','Video\/Demo duration override'/);
assert.doesNotMatch(runtime, /persistentTutorialHeader|toggle-tutorial-header|TITLE LOCK/,
  'The Video/Demo header must not introduce an all-slides tutorial header.');

console.log('Passed: Video/Demo export alone gets the solid yellow header; its future metadata title is separate and slide headers are unchanged.');
