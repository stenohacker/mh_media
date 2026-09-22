import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';

const html = fs.readFileSync('/Users/tamchap/Dev/mh_media/tutorial-demo-builder-v2.html', 'utf8');
const runtime = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .find((match) => match[2].includes('function deleteSelected()'))[2];

new vm.Script(runtime);

const functionBody = (name) => {
  const start = runtime.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} must exist`);
  let depth = 0;
  const open = runtime.indexOf('{', start);
  for (let index = open; index < runtime.length; index += 1) {
    if (runtime[index] === '{') depth += 1;
    if (runtime[index] === '}' && --depth === 0) return runtime.slice(open + 1, index);
  }
  throw new Error(`${name} body did not close`);
};

const functionSource = (name) => {
  const body = functionBody(name);
  const start = runtime.indexOf(`function ${name}(`);
  const open = runtime.indexOf('{', start);
  return runtime.slice(start, open + body.length + 2);
};

for (const kind of ['text', 'markup', 'slide-intro', 'callout', 'hotspot']) {
  assert.match(runtime, new RegExp(`(?:^|\\s|[,{])['\"]?${kind.replace('-', '\\-')}['\"]?\\s*:`), `${kind} property profile must exist`);
}

const shortcut = runtime.slice(runtime.indexOf('const formatPropertyShortcut'), runtime.indexOf('const objectGroupShortcut'));
assert.match(shortcut, /event\.shiftKey/);
assert.match(shortcut, /\["c", "v"\]/);
assert.match(shortcut, /formatPropertyKind\(state\.ui\.selectedKind, selectedObject\(\)\)/);

const copy = functionBody('copySelectedFormatProperties');
assert.match(copy, /FORMAT_PROPERTY_KEYS\[kind\]/);
assert.match(copy, /Copied.*properties/);

const paste = functionBody('pasteSelectedFormatProperties');
assert.match(paste, /formatPropertyKind\(kind, item\) === formatPropertiesClipboard\.kind/);
assert.match(paste, /target\[key\] = value/);
assert.match(paste, /commit\(`Applied/);

const profiles = runtime.match(/const FORMAT_PROPERTY_KEYS = Object\.freeze\(\{[\s\S]*?\n    \}\);/)?.[0];
assert(profiles, 'property profiles must be extractable');
const context = {
  clone: structuredClone,
  syncLiveEditableBeforeRender() {},
  captureFormatTextStyles() { return {}; },
  pasteFormatTextStyles() {},
  document: { activeElement:null },
  rememberWordSelection: {saved:null},
  source: null,
  selected: [],
  state: { ui: { selectedKind: null } },
  lastToast: '',
  lastCommit: '',
  normalizeMarkupKind(value) { return value || 'line-solid'; },
  CLOSED_MARKUP_STYLES: [],
  MARKUP_STYLES: []
};
context.showToast = (message) => { context.lastToast = message; };
context.commit = (message) => { context.lastCommit = message; };
context.selectedObject = () => context.source;
context.selectedObjects = () => context.selected;
vm.createContext(context);
const componentProfiles=runtime.match(/const CALLOUT_COMPONENTS = Object\.freeze\(\{[\s\S]*?\n    \}\);/)[0];
const componentStyleKeys=runtime.match(/const CALLOUT_COMPONENT_STYLE_KEYS = \[[^;]+;/)[0];
vm.runInContext(`${componentProfiles}\n${componentStyleKeys}\n${functionSource('calloutComponent')}\n${profiles}\nlet formatPropertiesClipboard = null;\n${functionSource('formatPropertyKind')}\n${functionSource('formatPropertyLabel')}\n${functionSource('copySelectedFormatProperties')}\n${functionSource('pasteSelectedFormatProperties')}`, context);

for (const [kind, source, target] of [
  ['text', { type:'text', textStyle:'hand', textColor:'#b23386', textFontSize:34, textLetterSpacing:1.5, textLineHeight:1.4, textAlign:'left', contentScale:1.3, opacity:.8 }, {type:'text',textStyle:'regular',textColor:'#000000',textFontSize:16}],
  ['markup', { type:'markup', markupColor:'#26ab9d',fillColor:'#ffffff',strokeWidth:7,contentScale:1.2,opacity:.7,markupCornerRadius:12,outerOutlineWidth:3,outerOutlineColor:'#f1f332',outlineEnabled:true,imageShadow:true,shadowHeight:12,shadowFlipped:true,lineLabelColor:'#000000',lineLabelBackground:'#ffffff',lineLabelFont:'hand',lineLabelSize:32,lineLabelLetterSpacing:3.5 }, {type:'markup',markup:'line-solid',lineLabel:'Keep my words',lineLabelPosition:.7}],
  ['shape', { type:'shape',opacity:.8,imageShadow:true,shadowHeight:10,shadowFlipped:false,outerOutlineWidth:2,outerOutlineColor:'#ffffff',outlineEnabled:true,appearanceColor:'#26ab9d',cornerRadius:4 }, {type:'shape',src:'keep-this-art.png'}],
  ['hotspot', { textAlign: 'center', textLetterSpacing: 2, textLineHeight: 1.8, opacity: .7, imageShadow: true, shadowHeight: 14 }, { textAlign: 'left', textLetterSpacing: 0, textLineHeight: 1.2, opacity: 1, imageShadow: false, shadowHeight: 2 }],
  ['callout', { type: 'callout', calloutAlign: 'center', calloutBodyAlign: 'left', textStyle: 'hand', textFontSize: 31, textLetterSpacing: 1, textLineHeight: 1.7, appearanceColor: '#123456', calloutHeaderColor: '#26ab9d', shadowHeight: 12, shadowFlipped: true, outerOutlineWidth: 4, outerOutlineColor: '#ffffff', outlineEnabled: true }, { type: 'callout', calloutAlign: 'left', textFontSize: 16 }],
  ['callout', {type:'callout',calloutComponent:'note',cardShadow:false,cardText:{title:{font:'impact-label-reversed',fontSize:22}}}, {type:'callout',cardShadow:true,cardText:{title:{font:'regular',fontSize:18}},calloutTitle:'Keep my title'}],
  ['slide-intro', { type: 'slide-intro', introAlign: 'center', introBodyAlign: 'left', introTitleOnly: true, textFontSize: 29, textLetterSpacing: .5, textLineHeight: 1.6, appearanceColor: '#abcdef', shadowHeight: 10, shadowFlipped: false, outerOutlineWidth: 3, outerOutlineColor: '#000000', outlineEnabled: true }, { type: 'slide-intro', introAlign: 'left', textFontSize: 16 }]
]) {
  const contents = {x:23,y:61,w:18,h:12,text:'Keep this content',richText:{text:{text:'Keep this content',html:'<b>Keep</b> this content'}}};
  Object.assign(target, structuredClone(contents));
  const before=structuredClone(target);
  context.source = source;
  context.state.ui.selectedKind = kind === 'hotspot' ? 'hotspot' : 'annotation';
  assert.equal(vm.runInContext('copySelectedFormatProperties()', context), true);
  context.selected = [{ kind: kind === 'hotspot' ? 'hotspot' : 'annotation', item: target }];
  assert.equal(vm.runInContext('pasteSelectedFormatProperties()', context), true);
  for (const key of Object.keys(source).filter((key) => key !== 'type')) {
    assert.deepEqual(target[key], source[key], `${kind}.${key} must paste`);
  }
  if(source.calloutComponent){assert.deepEqual(target.calloutComponentBaseStyle.cardText,before.cardText);assert.equal(target.calloutComponentBaseStyle.cardShadow,true);}
  for (const key of ['x','y','w','h','text','richText','src','lineLabel','lineLabelPosition']) {
    assert.deepEqual(target[key],before[key],`${kind}.${key} contents/geometry must not be replaced`);
  }
}

// Test the actual shortcut dispatcher independently of native browser paste
// accelerators. Browser fixtures separately exercise word-level style copying.
Object.assign(context, {
  MODE:'builder',scaleMode:false,tutorialEndOpen:false,IS_TUTORIAL_PLAYER:false,
  handleShapeNavigationKey:()=>false,selectedTextAnnotation:()=>null,
  copySelectedFormatProperties:()=>{context.command='copy';},
  pasteSelectedFormatProperties:()=>{context.command='paste';},
  undoLastChange:()=>{context.command='undo';},redoLastChange:()=>{context.command='redo';},
});
context.source={type:'text'}; context.state.ui.selectedKind='annotation';
vm.runInContext(functionSource('onKeyDown'),context);
for(const meta of [false,true]) for(const [key,shift,expected] of [['c',true,'copy'],['v',true,'paste'],['z',false,'undo'],['z',true,'redo']]) {
  let prevented=false;
  context.onKeyDown({key,shiftKey:shift,metaKey:meta,ctrlKey:!meta,altKey:false,target:{id:'',closest:()=>null,isContentEditable:false},preventDefault(){prevented=true;}});
  assert.equal(context.command,expected); assert(prevented);
}
console.log('Passed: actual Ctrl/Cmd property and undo/redo shortcuts; scalar profiles for text, drawn shapes, artwork shapes, cards and hotspots; geometry/content preservation; JavaScript parses.');
