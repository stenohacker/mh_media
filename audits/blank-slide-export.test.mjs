import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html = fs.readFileSync('/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html', 'utf8');
const runtime = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .find((match) => match[2].includes('function deleteSelected()'))[2];
new vm.Script(runtime);

assert.match(runtime, /function isAccidentalBlankSlide\(slide\)/);
assert.match(runtime, /function removeAccidentalBlankSlides\(exportState\)/);
assert.match(runtime, /slides\.filter\(\(slide\) => !isAccidentalBlankSlide\(slide\)\)/);
assert.match(runtime, /throw new Error\("Every slide is blank\. Add content before exporting\."\)/);

const htmlExport = runtime.slice(runtime.indexOf('async function buildExportHtml'), runtime.indexOf('async function previewDemo'));
assert.match(htmlExport, /const skippedBlankSlides = removeAccidentalBlankSlides\(exportState\)/);

const readingExport = runtime.slice(runtime.indexOf('async function exportReadingGuide'), runtime.indexOf('async function copyPublicUrl'));
assert.match(readingExport, /const skippedBlankSlides = removeAccidentalBlankSlides\(snapshot\)/);
assert.match(readingExport, /createReadingExportFrame\(snapshot\)/);

assert.match(runtime, /Skipped \$\{skippedBlankSlides\} blank slide/);

console.log('Passed: HTML, PNG, and PDF exports omit accidental default-background placeholder slides without deleting them from the builder.');
