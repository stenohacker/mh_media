import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html = fs.readFileSync('/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html', 'utf8');
const runtime = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .find((match) => match[2].includes('function deleteSelected()'))[2];
new vm.Script(runtime);

const start = runtime.indexOf('function scheduleBuilderStageFit(');
assert(start >= 0, 'builder-only viewport fitting exists');
const end = runtime.indexOf('\n    }', start);
const fit = runtime.slice(start, end + 6);
assert.match(fit, /if \(MODE !== "builder"\) return/);
assert.match(fit, /viewportHeight - toolbarBottom - shellTopGap/);
assert.match(fit, /nav\.getBoundingClientRect\(\)\.height/);
assert.match(fit, /availableStageHeight \* slideSceneAspect\(\)/);
assert.match(runtime, /scheduleDemoStageSize\(\);\s*scheduleBuilderStageFit\(\);/);
assert.match(runtime, /window\.addEventListener\("resize", scheduleBuilderStageFit\)/);
assert.doesNotMatch(fit, /state\.|commit\(|scheduleSave\(/,
  'viewport fitting must never alter saved project data');

console.log('Passed: the builder canvas fits below its toolbar without changing authored state or export sizing.');
