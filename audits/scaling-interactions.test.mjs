import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';

const folder = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(folder, 'tutorial-demo-builder-v2.html'), 'utf8');
const runtime = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1]).find(source => source.includes('function deleteSelected()'));
new vm.Script(runtime);
const source = name => {
  const start = runtime.indexOf(`    function ${name}(`);
  assert(start >= 0, name);
  const end = runtime.indexOf('\n    }', start);
  return runtime.slice(start, end + 6);
};
const context = vm.createContext({
  clamp: (n, lo, hi) => Math.max(lo, Math.min(hi, n)),
  slideSceneAspect: () => 5 / 3,
});
vm.runInContext(source('resizeFrame'), context);
const initial = { x: 50, y: 50, w: 24, h: 40, contentScale: 1 };
for (const handle of ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']) {
  const box = context.resizeFrame(initial, handle, 3, 5, true);
  assert(Math.abs(box.w / box.h - initial.w / initial.h) < 1e-10, `${handle}: uniform aspect`);
  if (handle.includes('e')) assert.equal(box.x - box.w / 2, initial.x - initial.w / 2);
  if (handle.includes('w')) assert.equal(box.x + box.w / 2, initial.x + initial.w / 2);
}
const edge = context.resizeFrame(initial, 'e', 5, 8, false);
assert.equal(edge.h, initial.h);
assert.equal(edge.w, 29);
const corner = context.resizeFrame(initial, 'se', 5, 8, false);
assert.equal(corner.w, 29);
assert.equal(corner.h, 48);
assert.match(runtime, /Scale next resize · drag one handle · turns off on release/);
assert.match(runtime, /document\.addEventListener\("pointercancel", onPointerUp\)/);
assert.match(source('onPointerUp'), /popupDrag\.mode === "resize" && popupDrag\.scaling[\s\S]*setScaleMode\(false\)/);
assert.match(source('onPointerUp'), /completedDrag\.scaling[\s\S]*setScaleMode\(false\)/);
const layers = [{ id:'a', z:1 }, { id:'b', z:2 }, { id:'c', z:3 }, { id:'d', z:4 }];
context.currentSlide = () => ({ annotations: layers, hotspots: [] });
context.selectedObjects = () => [{ item: layers[1] }];
context.commit = () => {};
context.showToast = () => {};
vm.runInContext(source('moveSelectedZ'), context);
context.moveSelectedZ('forward');
assert.equal(layers[1].z, 3);
context.moveSelectedZ('backward');
assert.equal(layers[1].z, 2);
context.moveSelectedZ('front');
assert.equal(layers[1].z, 4);
context.moveSelectedZ('back');
assert.equal(layers[1].z, 1);
console.log('PASS syntax, all 8 uniform handles, ordinary edge/corner resizing, and 4 layer commands.');
vm.runInContext(['isPipeBodyLine','isNumberedBodyLine','mixedBodyLines','mixedBodyNumberStart'].map(source).join('\n'), context);
const numbered = context.mixedBodyLines('7. Seven\n8. Eight\n\n3. Restart');
assert.match(context.mixedBodyNumberStart(numbered,0), /data-list-start="7"/);
assert.doesNotMatch(context.mixedBodyNumberStart(numbered,1), /data-list-start/);
assert.match(context.mixedBodyNumberStart(numbered,3), /data-list-start="3"/);
vm.runInContext(['normalizeMarkupPoints','reshapeMarkupPoint','markupBendPoint'].map(source).join('\n'), context);
const arrow = {x:50,y:50,w:30,h:20,rotation:30,markup:'arrow-solid'};
const changed = {...arrow};
context.reshapeMarkupPoint(changed, arrow, 'end', 90, 40, {width:1500,height:900});
const world = (item, key) => {
  const p=context.normalizeMarkupPoints(item.markupPoints,item.markup)[key], a=item.rotation*Math.PI/180;
  const x=(p.x/100-.5)*item.w*15,y=(p.y/100-.5)*item.h*9;
  return {x:item.x*15+x*Math.cos(a)-y*Math.sin(a),y:item.y*9+x*Math.sin(a)+y*Math.cos(a)};
};
const start=world(arrow,'start'), end=world(arrow,'end'), newStart=world(changed,'start'), newEnd=world(changed,'end');
assert(Math.abs(start.x-newStart.x)<1e-8 && Math.abs(start.y-newStart.y)<1e-8);
assert(Math.abs(newEnd.x-end.x-90)<1e-8 && Math.abs(newEnd.y-end.y-40)<1e-8);
console.log('PASS explicit list start numbers and rotated arrow endpoint anchoring.');
vm.runInContext(['quadraticPoint','nearestMarkupPosition'].map(source).join('\n'), context);
const curve = {start:{x:5,y:70},curve:{x:30,y:5},end:{x:95,y:55}};
for (const t of [0,.05,.25,.5,.78,.95,1]) {
  const point=context.quadraticPoint(curve,t);
  assert(Math.abs(context.nearestMarkupPosition(curve,point,450,130)-t)<1e-5);
}
console.log('PASS label-position projection on a non-square curved line, including both ends.');
Object.assign(context, {
  normalizeMarkupKind: value=>value,
  uid: label=>label+'-qa',
  escapeHtml: value=>String(value).replaceAll('"','&quot;'),
});
vm.runInContext(['isPathMarkup','markupCornerRadii','markupPath','markupSvgBase','markupSvg'].map(source).join('\n'),context);
const pathItem={id:'test',markup:'arrow-solid',w:40,h:20,lineLabelEnabled:true};
const forward=context.markupSvg(pathItem), reverse=context.markupSvg({...pathItem,arrowheadReversed:true,outerOutlineWidth:3});
assert.match(forward,/data-line-label-gap/);
assert.match(forward,/maskUnits="userSpaceOnUse"/);
assert.match(forward,/marker-end=/);
assert.match(reverse,/marker-start=/);
assert.match(reverse,/orient="auto-start-reverse"/);
assert.match(reverse,/<g mask=.*<g filter=/);
assert.match(runtime,/text\.parentElement !== editor && text\.parentElement\.tagName === "SPAN"/);
console.log('PASS transparent SVG gap, independent arrowhead reversal, outline masking, and editable-span protection.');
context.SCENE_WIDTH=1500;
vm.runInContext(source('lineLabelStyle'),context);
assert.match(context.lineLabelStyle({}),/letter-spacing:0cqw/);
assert.match(context.lineLabelStyle({lineLabelLetterSpacing:3}),/letter-spacing:0.2cqw/);
assert.match(context.lineLabelStyle({lineLabelLetterSpacing:-1.5}),/letter-spacing:-0.1cqw/);
assert.match(context.lineLabelStyle({lineLabelLetterSpacing:99}),/letter-spacing:0.8cqw/);
assert.match(runtime,/lineLabelLetterSpacing: clamp\(item\?\.lineLabelLetterSpacing \?\? 0, -2, 12\)/);
assert.match(source('renderToolbar'),/range\('Character spacing',lineLabel\?'lineLabelLetterSpacing':'textLetterSpacing'/);
assert.match(source('updateLineLabelGeometry'),/label\.style\.cssText=lineLabelStyle\(item\)[\s\S]*label\.offsetWidth/);
console.log('PASS line/arrow label character spacing, legacy default, limits, toolbar routing, and gap remeasurement.');

if (process.argv.includes('--fixture')) {
  const state = JSON.parse(html.match(/<script id="project-state"[^>]*>([\s\S]*?)<\/script>/)[1]);
  state.tutorial.title = 'ISOLATED INTERACTION TEST';
  const slide = state.tutorial.slides[1];
  const body = '1. First bold line\n2. Second line\n\nSpacing stays\n| Pipe item';
  const rich = { text: body, lines: ['<b>First bold line</b>', 'Second line', '', 'Spacing stays', 'Pipe item'] };
  slide.annotations = [
    { id:'qa-callout', type:'callout', x:25, y:43, w:36, h:36, z:20, cardTypographyVersion:1, textFontSize:28, textStyle:'regular', calloutTitle:'Callout QA', calloutBody:body, richText:{ calloutBody:rich } },
    { id:'qa-intro', type:'slide-intro', persistentSlideTitle:true, x:73, y:28, w:36, h:34, z:21, cardTypographyVersion:1, textFontSize:28, introTitle:'Title QA', introBody:body, richText:{ introBody:rich } },
    { id:'qa-text', type:'text', x:24, y:83, w:36, h:12, z:22, text:'Select these words', textFontSize:28 },
  ];
  slide.hotspots = [{ id:'qa-hotspot', title:'Hotspot QA', body, richText:{body:rich}, x:60, y:77, popupX:76, popupY:75, popupW:28, popupH:34 }];
  state.ui.activeHotspotId = 'qa-hotspot';
  state.ui.selectedKind = 'annotation'; state.ui.selectedId = 'qa-callout';
  if (process.argv.includes('--labels') || process.argv.includes('--label-spacing')) {
    state.tutorial.title='ISOLATED LINE LABEL TEST';
    slide.annotations=[
      {id:'qa-arrow',type:'markup',markup:'arrow-solid',x:48,y:35,w:48,h:20,z:20,strokeWidth:5,markupColor:'#000000',rotation:0},
      {id:'qa-line',type:'markup',markup:'line-solid',x:48,y:70,w:48,h:16,z:21,strokeWidth:5,markupColor:'#000000',rotation:0},
    ];
    slide.hotspots=[]; state.ui.activeHotspotId=null; state.ui.selectedId='qa-arrow';
    if (process.argv.includes('--label-spacing')) {
      state.tutorial.title='ISOLATED LINE LABEL SPACING TEST';
      slide.annotations.forEach((item,index)=>Object.assign(item,{lineLabelEnabled:true,lineLabel:index?'Line label':'Arrow label',lineLabelBackground:index?'#ffffff':'transparent',lineLabelFont:index?'hand':'regular',lineLabelLetterSpacing:0}));
    }
  }
  if (process.argv.includes('--properties')) {
    state.tutorial.title='ISOLATED PROPERTY STYLING TEST';
    slide.annotations=[
      {id:'qa-source',type:'text',text:'Pink plain words',textStyle:'regular',textFontSize:28,textColor:'#000000',x:38,y:35,w:55,h:18,z:20,richText:{text:{text:'Pink plain words',lines:['<span style="font-family:var(--hand);font-weight:700;font-style:italic;color:#b23386;background-color:#f1f332;text-decoration-line:underline;text-decoration-color:#26ab9d;text-decoration-thickness:3px;text-underline-offset:4px">Pink</span> plain words']}}},
      {id:'qa-target',type:'text',text:'Keep every destination word',textStyle:'regular',textFontSize:20,textColor:'#000000',x:38,y:70,w:55,h:18,z:21,richText:{text:{text:'Keep every destination word',lines:['<span style="color:#91a8ed;font-family:var(--impact-label)">Keep every</span> destination word']}}},
    ];
    slide.hotspots=[]; state.ui.activeHotspotId=null; state.ui.selectedId='qa-source';
  }
  const domChecks = `
    {
      const results = [];
      const check = (name, condition) => { results.push({name, passed:Boolean(condition)}); };
      const styled = '<b>Bold</b><span style="font-family:var(--hand);color:#000000"> hand</span><br><br>';
      const clean = safeWordHtml(styled);
      check('Rich text sanitizer is idempotent, including trailing soft breaks', safeWordHtml(clean) === clean && clean.endsWith('<br><br>'));
      const drawn=safeWordHtml('<span style="text-decoration-line:underline;text-decoration-color:#26ab9d;--underline-hand-drawn:87;background-color:#f1f332">Drawn</span>');
      check('Hand-drawn underline amount and highlight survive repeated sanitizing',safeWordHtml(drawn)===drawn && drawn.includes('--underline-hand-drawn:87') && drawn.includes('data-gentle-highlight'));
      const straight=safeWordHtml('<span style="text-decoration-line:underline;--underline-hand-drawn:0">Straight</span>');
      check('Zero hand-drawn amount stays zero instead of reverting to legacy curve',safeWordHtml(straight)===straight && straight.includes('--underline-hand-drawn:0') && straight.includes('H40'));
      const editor = document.createElement('div'); editor.className='mixed-body-editor';
      editor.innerHTML='<div class="mixed-body-line is-numbered" data-list-kind="numbered" data-list-start="7"><b>Alpha</b><div class="mixed-body-line is-pipe" data-list-kind="pipe"><i>Beta</i></div></div><span style="font-family:var(--hand)">Loose</span>';
      const lines = ensureMixedBodyEditorLines(editor);
      check('Nested editing repair keeps bold, italic, and inline fonts', lines[0].innerHTML.includes('font-weight:600') && lines[1].innerHTML.includes('font-style:italic') && lines[2].innerHTML.includes('font-family:var(--hand)'));
      check('Nested editing repair keeps separate list kinds and starting number', lineListKind(lines[0])==='numbered' && lines[0].dataset.listStart==='7' && lineListKind(lines[1])==='pipe');
      check('Repair keeps original words', lines.map(l=>l.textContent).join('|')==='Alpha|Beta|Loose');
      const copySource={id:'qa-format-regression',type:'text',text:'Pink plain',richText:{}};
      const styleEditor=document.createElement('div'); styleEditor.contentEditable='true'; styleEditor.dataset.bind='annotation.text:'+copySource.id;
      styleEditor.style.cssText='position:absolute;visibility:hidden;color:#000000;font-weight:400;font-style:normal';
      styleEditor.innerHTML=safeWordHtml('<span style="color:#b23386;font-family:var(--hand);font-weight:700;font-style:italic;background-color:#f1f332;text-decoration-line:underline;text-decoration-color:#26ab9d;text-decoration-thickness:3px;text-underline-offset:4px;--underline-hand-drawn:87">Pink</span> plain');
      root.append(styleEditor);
      const oldWordSelection=rememberWordSelection.saved;
      rememberWordSelection.saved={binding:styleEditor.dataset.bind,start:0,end:4,text:copySource.text};
      const copyStyles=captureFormatTextStyles(copySource,'text');
      const pasteTarget={text:'1. Keep these words\\n\\n| Keep this line',richText:{}};
      pasteFormatTextStyles(pasteTarget,copyStyles);
      const styledTarget=document.createElement('div'); styledTarget.innerHTML=pasteTarget.richText.text.lines.join('<br>');
      check('Property paste uses selected word font, color, emphasis, highlight, and underline', styledTarget.querySelector('span').style.fontWeight==='600' && styledTarget.querySelector('span').style.fontStyle==='italic' && styledTarget.querySelector('span').style.color==='rgb(178, 51, 134)' && styledTarget.querySelector('[data-gentle-highlight]') && styledTarget.querySelector('[data-gentle-underline]'));
      check('Property paste retains destination words, list markers, and blank lines',pasteTarget.text==='1. Keep these words\\n\\n| Keep this line' && pasteTarget.richText.text.lines.length===3 && pasteTarget.richText.text.lines[1]==='');
      check('Copy Properties keeps selected word hand-drawn underline amount',styledTarget.querySelector('[data-gentle-underline]').style.getPropertyValue('--underline-hand-drawn')==='87');
      rememberWordSelection.saved={binding:styleEditor.dataset.bind,start:5,end:10,text:copySource.text};
      pasteFormatTextStyles(pasteTarget,captureFormatTextStyles(copySource,'text'));
      styledTarget.innerHTML=pasteTarget.richText.text.lines.join('<br>');
      check('Copying plain text removes old emphasis instead of retaining overrides',!styledTarget.querySelector('[data-gentle-highlight],[data-gentle-underline]') && styledTarget.querySelector('span').style.fontWeight==='400');
      rememberWordSelection.saved=oldWordSelection; styleEditor.remove();
      lastMixedBodySelection=null;
      const report=document.createElement('pre'); report.id='qa-runtime-results'; report.hidden=true; report.textContent=JSON.stringify(results); document.body.append(report);
      // Browser harness only: the in-app browser intercepts Ctrl+Shift+V as a
      // native paste, so exercise the same production property functions here.
      if(MODE==='builder') {
      const qaControls=document.createElement('div'); qaControls.style.cssText='position:fixed;bottom:0;right:0;z-index:99999;background:white;padding:4px';
      for(const [label,action] of [['QA Copy Properties',copySelectedFormatProperties],['QA Paste Properties',pasteSelectedFormatProperties]]) {
        const button=document.createElement('button'); button.textContent=label; button.onclick=action; qaControls.append(button);
      }
      document.body.append(qaControls);
      }
    }
  `;
  const fixture = html.replace('<head>', '<head><base href="/">')
    .replace('    initializeApp();', '    initializeApp();' + domChecks)
    .replace(/(<script id="project-state"[^>]*>)[\s\S]*?(<\/script>)/, (_, open, close) => open + JSON.stringify(state) + close);
  const fixtureName=process.argv.includes('--label-spacing') ? 'qa-line-label-spacing.html' : process.argv.includes('--properties') ? 'qa-builder-property-styles.html' : process.argv.includes('--labels') ? 'qa-builder-line-labels.html' : 'qa-builder-interactions.html';
  fs.writeFileSync(path.join(folder, 'audits/interaction-fixture.html'), fixture);
  fs.writeFileSync(path.join(folder, fixtureName), fixture);
  console.log('Generated isolated browser-only fixture: /audits/interaction-fixture.html (no project API writes).');
}
