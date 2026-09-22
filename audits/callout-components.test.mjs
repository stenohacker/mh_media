import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
const sourcePath=process.argv[2] || path.resolve(import.meta.dirname,'..','tutorial-demo-builder-v2.html');
const html=fs.readFileSync(sourcePath,'utf8');
const runtime=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).find(s=>s.includes('function transformCallout('));
new vm.Script(runtime);
const fn=name=>{const start=runtime.indexOf(`    function ${name}(`);assert(start>=0,name);return runtime.slice(start,runtime.indexOf('\n    }',start)+6);};
const definitions=runtime.slice(runtime.indexOf('    const CALLOUT_COMPONENTS ='),runtime.indexOf('    let multiSelection ='));
const state={ui:{},tutorial:{slides:[{annotations:[]}]}};
const context=vm.createContext({state,document:{getElementById:()=>({textContent:'{}'})},readJson:JSON.parse,clone:structuredClone,clamp:(n,lo,hi)=>Math.max(lo,Math.min(hi,n)),TEXT_FONT_SIZE_MIN:6,TEXT_FONT_SIZE_MAX:240,syncLiveEditableBeforeRender(){},currentSlide:()=>state.tutorial.slides[0],selectionKey:(kind,id)=>`${kind}:${id}`,commit(){}});
vm.runInContext(definitions+'\nlet multiSelection=[];\n'+fn('calloutComponent')+'\n'+fn('transformCallout'),context);
const base={id:'card',type:'callout',x:38,y:48,w:22,h:17,rotation:13,z:6,locked:false,objectGroupId:'group',contentScale:1.2,opacity:.8,calloutTitle:'My heading',calloutBody:'First\nSecond',richText:{calloutBody:{lines:['<b>First</b>','Second']}},cardText:{title:{font:'hand',fontSize:18},body:{font:'regular',fontSize:16}},cardShadow:true,imageShadow:true,cardTitleOffset:7,cardTypographyVersion:1,textStyle:'regular',appearanceColor:'#26ab9d'};
for(const variant of ['note','caution','troubleshooting']){
 const item=structuredClone(base);state.tutorial.slides[0].annotations=[item];
 context.transformCallout('card',variant);
 for(const key of ['id','x','y','w','h','rotation','z','locked','objectGroupId','contentScale','opacity','calloutTitle','calloutBody','richText'])assert.equal(JSON.stringify(item[key]),JSON.stringify(base[key]),`${variant} preserves ${key}`);
 assert.equal(item.calloutComponent,variant);assert.equal(item.cardText.title.font,'impact-label-reversed');assert.equal(item.cardShadow,false);assert.equal(item.imageShadow,false);
 context.transformCallout('card',variant);assert.deepEqual({...item,calloutComponent:undefined},{...base,calloutComponent:undefined});
 context.transformCallout('card',variant);item.calloutTitle='Edited title';item.calloutBody='Edited body';context.transformCallout('card',variant);assert.equal(item.calloutTitle,'Edited title');assert.equal(item.calloutBody,'Edited body');
}
const item=structuredClone(base);state.tutorial.slides[0].annotations=[item];context.transformCallout('card','note');context.transformCallout('card','caution');context.transformCallout('card','troubleshooting');context.transformCallout('card','troubleshooting');assert.deepEqual({...item,calloutComponent:undefined},{...base,calloutComponent:undefined});
item.locked=true;const locked=JSON.stringify(item);context.transformCallout('card','note');assert.equal(JSON.stringify(item),locked);
const art=JSON.parse(html.match(/<script id="callout-component-art"[^>]*>([\s\S]*?)<\/script>/)[1]);for(const key of ['note','caution','troubleshooting'])assert(art[key].startsWith('data:image/png;base64,')&&art[key].length>1000);
assert(fn('renderContentsPreviewAnnotation').includes('renderCalloutComponent(annotation, false)'));
assert(fn('renderAnnotation').includes('renderCalloutComponent(annotation)'));
console.log('PASS callout transforms: preserve content/geometry/grouping, edit then restore, switch then restore, lock, embedded art, shared export/preview rendering.');
