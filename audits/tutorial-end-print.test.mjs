import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../tutorial-demo-builder-v2.html', import.meta.url), 'utf8');
const runtime = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .find(source => source.includes('function deleteSelected()'));
new vm.Script(runtime);

const functionBody = name => {
  const start = runtime.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} must exist`);
  const open = runtime.indexOf('{', start);
  let depth = 0;
  for (let index = open; index < runtime.length; index += 1) {
    if (runtime[index] === '{') depth += 1;
    if (runtime[index] === '}' && --depth === 0) return runtime.slice(open + 1, index);
  }
  throw new Error(`${name} body did not close`);
};

const endCard = functionBody('renderTutorialEndCard');
assert.match(endCard, /data-action="download-tutorial-pdf"/);
assert.match(endCard, /Download PDF/);
assert.doesNotMatch(endCard, /data-action="print-tutorial"/);
assert.doesNotMatch(runtime, /function printTutorial\(/);

const download = functionBody('downloadTutorialPdf');
assert.match(download, /exportReadingGuide\("pdf"\)/);
assert.match(download, /pngExportInProgress/);
assert.match(download, /tutorialEndOpen = true/);

const build = functionBody('buildExportHtml');
assert.match(build, /tutorial-html2canvas-runtime/);
assert.match(build, /scripts\/html2canvas\.min\.js/);
assert.match(build, /tutorial-pdf-runtime/);
assert.match(build, /scripts\/pdf-lib-1\.17\.1\.min\.js/);
assert.match(build, /tutorial-reading-runtime/);
assert.match(build, /scripts\/tutorial-reading-export\.js/);
assert.match(build, /if \(!isDemoExport\)/);

const exportGuide = functionBody('exportReadingGuide');
assert.match(exportGuide, /PDFDocument\.create\(\)/);
assert.match(exportGuide, /downloadBlob\(`\$\{baseName\}-reading-guide\.pdf`/);
assert.match(exportGuide, /removeAccidentalBlankSlides\(snapshot\)/);

const layout = fs.readFileSync(new URL('../scripts/tutorial-reading-export.js', import.meta.url), 'utf8');
assert.match(layout, /slideIndex < slides\.length/);
assert.match(layout, /break-after:page/);

console.log('PASS tutorial completion downloads a self-contained full reading-guide PDF and never opens the browser print dialog.');
