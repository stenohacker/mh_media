import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html=fs.readFileSync(process.argv[2] || new URL('../tutorial-demo-builder-v2.html',import.meta.url),'utf8');
function source(name){const start=html.indexOf(`    function ${name}(`);assert(start>=0);let end=html.indexOf('\n    function ',start+1);return html.slice(start,end);}
const context=vm.createContext({Math,clamp:(v,min,max)=>Math.max(min,Math.min(max,v))});
vm.runInContext(source('quadraticPoint')+source('lineLabelCurveSampler'),context);
for(const [width,height] of [[450,130],[130,450],[800,300]]){
 const points={start:{x:5,y:80},curve:{x:50,y:0},end:{x:95,y:80}};
 for(const t of [0,.25,.5,.9,1]){
  const sample=context.lineLabelCurveSampler(points,width,height,t),center=sample(0),p=context.quadraticPoint(points,t);
  assert(Math.abs(center.x-p.x*width/100)<.01);assert(Math.abs(center.y-p.y*height/100)<.01);
  for(const offset of [-500,-80,-20,20,80,500]){const q=sample(offset);assert(Number.isFinite(q.x)&&Number.isFinite(q.y)&&Number.isFinite(q.angle));}
 }
 const sample=context.lineLabelCurveSampler(points,width,height,.5);
 assert(sample(-40).angle<0&&sample(40).angle>0,'Letters must turn with the curve, not share one tangent');
 assert(sample(-40).y>sample(0).y&&sample(40).y>sample(0).y,'Letter centers follow the bow');
 const straight=context.lineLabelCurveSampler({start:{x:0,y:50},curve:{x:50,y:50},end:{x:100,y:50}},width,height,.5);
 assert(Math.abs(straight(25).x-width/2-25)<.01);assert.equal(straight(25).y,height/2);assert.equal(straight(25).angle,0);
}
assert.match(source('prepareLineLabelGlyphs'),/setBaseAndExtent/);
assert.match(source('prepareLineLabelGlyphs'),/grapheme/);
assert.doesNotMatch(html,/scrollIntoView|function revealScrollSlideObject/);
console.log('PASS curved and straight label geometry in wide/tall frames, endpoint overflow, grapheme/caret handling, and no automatic scroll-into-view.');
