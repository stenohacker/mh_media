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
assert.match(fit, /shell\.style\.removeProperty\("width"\)/);
assert.match(fit, /requestAnimationFrame\(syncSelectionControls\)/);
assert.doesNotMatch(fit, /viewportHeight|availableStageHeight|fittedWidth|style\.width\s*=/,
  'builder canvas must not shrink to the remaining viewport height');
assert.match(runtime, /scheduleDemoStageSize\(\);\s*scheduleBuilderStageFit\(\);/);
assert.match(runtime, /window\.addEventListener\("resize", scheduleBuilderStageFit\)/);
assert.doesNotMatch(fit, /state\.|commit\(|scheduleSave\(/,
  'builder layout must never alter saved project data');

assert.match(html,
  /body\[data-mode="player"\] \.builder-app \{ padding-bottom: 0; background: #fff; \}/,
  'the published HTML page must remain white outside the tutorial frame');
assert.match(html,
  /documentElement\.querySelectorAll\("#scaleModeIndicator, \.scale-mode-indicator"\)\.forEach\(\(node\) => node\.remove\(\)\)/,
  'temporary scale-mode UI must never be included in an export');

console.log('Passed: the builder keeps the toolbar width, the exported page stays white outside the frame, transient scale UI is removed, and authored state/export sizing are unchanged.');
