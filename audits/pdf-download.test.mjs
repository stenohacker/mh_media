import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html = fs.readFileSync(new URL('../tutorial-demo-builder-v2.html', import.meta.url), 'utf8');
const section = (start, end) => html.slice(html.indexOf(start), html.indexOf(end, html.indexOf(start)));
const origin = 'https://iridescent-wisp-57bcb1.netlify.app';
const source = origin + '/images/tutorial-annotations/objects/text-box-short.png?v=old';
const calls = [];
const elements = new Map();
const document = {
  baseURI: 'http://127.0.0.1:8765/tutorial-demo-builder-v2.html',
  ownerDocument: {createElement: () => ({})},
  querySelector: selector => selector === 'head' ? {append: node => elements.set(node.id, node)} : {remove() {}}
};
const context = vm.createContext({
  URL, AbortSignal, document, location: {origin:'http://127.0.0.1:8765',hostname:'127.0.0.1',protocol:'http:'},
  MEDIA_SITE_ORIGIN: origin, DEVICE_FRAME_URL:'data:image/png;base64,frame', DEVICE_ADDRESS_BAR_URL:'data:image/png;base64,bar',
  isDefaultSlideBackgroundUrl: value => value.includes('/slide-backgrounds/0913background.png'),
  blobAsDataUrl: async blob => 'data:image/png;base64,' + Buffer.from(await blob.arrayBuffer()).toString('base64'),
  fetch: async value => { calls.push(value); return value.includes('removed%20annotations/') || value.startsWith('data:')
    ? {ok:true,blob:async()=>new Blob(['original pixels'],{type:'image/png'})} : {ok:false}; }
});
vm.runInContext(section('    function readingMediaKey(', '    async function buildExportHtml('), context);
const project = {tutorial:{slides:[{annotations:[{type:'image',src:source},{type:'image',src:source.replace('old','new')}]}]}};
const before = JSON.stringify(project);
await context.embedReadingMedia(document,project);
assert.equal(JSON.stringify(project),before,'Embedding must not rewrite authored URLs or data');
const assets = JSON.parse(elements.get('tutorial-reading-media').textContent);
assert.equal(assets[source.split('?')[0]],'data:image/png;base64,b3JpZ2luYWwgcGl4ZWxz','Retired image is embedded byte-for-byte');
assert.equal(calls.filter(url=>url.includes('removed%20annotations/')).length,1,'Repeated URLs are deduplicated');
assert(!calls.some(url=>url.startsWith(origin)),'Locally available original never needs a hosted request');
context.fetch=async()=>({ok:false});
await assert.rejects(()=>context.embedReadingMedia(document,project),/PDF artwork could not be included: text-box-short.png/,'Missing artwork must fail explicitly');
const downloadContext = vm.createContext({
  IS_TUTORIAL_PLAYER:true,EMBEDDED_TUTORIAL_PDF:null,pngExportInProgress:false,tutorialPdfStatus:'',tutorialEndOpen:false,
  exportReadingGuide:async()=>({ok:false,error:'Image unavailable'}),render(){},setTimeout(){},root:{querySelector(){}}
});
vm.runInContext(section('    async function downloadTutorialPdf()', '    function readerNext()'),downloadContext);
await downloadContext.downloadTutorialPdf();
assert.match(downloadContext.tutorialPdfStatus,/Image unavailable/,'Failure persists in completion dialog');
downloadContext.exportReadingGuide=async()=>({ok:true,pageCount:4});
await downloadContext.downloadTutorialPdf();
assert.match(downloadContext.tutorialPdfStatus,/prepared/,'Successful retry replaces old failure');
downloadContext.EMBEDDED_TUTORIAL_PDF={filename:'guide.pdf',data:'data:application/pdf;base64,JVBERi0xLjc='};
downloadContext.atob=value=>Buffer.from(value,'base64').toString('binary');
downloadContext.Uint8Array=Uint8Array;downloadContext.Blob=Blob;
let directDownload;
downloadContext.downloadBlob=(filename,blob)=>{directDownload={filename,blob};};
downloadContext.exportReadingGuide=()=>{throw Error('Reader must not rerender a finished PDF');};
await downloadContext.downloadTutorialPdf();
assert.equal(await directDownload.blob.text(),'%PDF-1.7');
assert.equal(directDownload.filename,'guide.pdf');
const original=fs.readFileSync(new URL('../backups/2026-09-21-before-export-pdf-download-repair/tutorial-demo-builder-v2.html',import.meta.url),'utf8');
const projectJSON=s=>s.match(/<script id="project-state"[^>]*>([\s\S]*?)<\/script>/)[1];
assert.equal(projectJSON(html),projectJSON(original),'Embedded working draft remains byte-for-byte intact');
console.log('PASS portable PDF artwork, archived-source fallback, lossless bytes, deduplication, explicit failure/retry, and draft preservation.');
