import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync(new URL('../../tutorial-demo-builder-v2.html',import.meta.url),'utf8');
const start=html.indexOf('    function playerCompositionBounds(slide) {');
const end=html.indexOf('    // Fit text at the design size',start);
const context=vm.createContext({SCENE_WIDTH:1500,SCENE_HEIGHT:900,SCENE_ASPECT:5/3,topLevelAnnotations:s=>s.annotations});
const geometryStart=html.indexOf('    function slideSceneAspect(');
const geometryEnd=html.indexOf('    function scrollPageHeightUnits(',geometryStart);
vm.runInContext(html.slice(geometryStart,geometryEnd)+html.slice(start,end),context);
const bounds=slide=>context.playerCompositionBounds({kind:'image',hotspots:[],annotations:[],...slide});
assert.equal(bounds({}).left,0);assert.equal(bounds({}).right,1500);
const item={type:'text',x:-5,y:8,w:25,h:12};
assert(bounds({annotations:[item]}).left < -250);
assert(bounds({annotations:[{...item,x:110}]}).right > 1800);
for(const rotation of [0,30,90,135,270]) {
 const annotation={...item,rotation}; const before=JSON.stringify(annotation);
 const b=bounds({annotations:[annotation]}); const angle=rotation*Math.PI/180;
 for(const dx of [-187.5,187.5])for(const dy of [-54,54]) {
  const x=-75+dx*Math.cos(angle)-dy*Math.sin(angle),y=72+dx*Math.sin(angle)+dy*Math.cos(angle);
  assert(x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom,`Rotated corner clipped at ${rotation} degrees`);
 }
 assert.equal(JSON.stringify(annotation),before,'Layout must not mutate authoring state');
}
assert.equal(bounds({kind:'scroll',annotations:[{...item,y:500}]}).bottom,900,'Long pages must scroll inside their viewport');
assert.equal(bounds({backgroundLayout:'background-v1'}).bottom,1500*3522/6806);
console.log('Composition bounds: side labels, right-side cards, rotated corners, state preservation and scrolling passed.');
