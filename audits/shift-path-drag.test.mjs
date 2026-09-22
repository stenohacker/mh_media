import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=fs.readFileSync(process.argv[2] || new URL('../tutorial-demo-builder-v2.html', import.meta.url),'utf8');
const runtime=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).find(s=>s.includes('function onPointerMove('));
new vm.Script(runtime);
const source=name=>{const a=runtime.indexOf(`    function ${name}(`);assert(a>=0);return runtime.slice(a,runtime.indexOf('\n    }',a)+6)};
const ctx=vm.createContext({clamp:(n,lo,hi)=>Math.max(lo,Math.min(hi,n))});
vm.runInContext(['normalizeMarkupPoints','reshapeMarkupPoint','constrainedPathDragDelta','pathEndpointAxis'].map(source).join('\n'),ctx);
const near=(a,b,m)=>assert(Math.abs(a-b)<1e-8,`${m}: ${a} vs ${b}`);
const rect={width:1500,height:900};
function world(item,key){const p=ctx.normalizeMarkupPoints(item.markupPoints,item.markup)[key],a=item.rotation*Math.PI/180,x=(p.x/100-.5)*item.w*rect.width/100,y=(p.y/100-.5)*item.h*rect.height/100;return{x:item.x*rect.width/100+x*Math.cos(a)-y*Math.sin(a),y:item.y*rect.height/100+x*Math.sin(a)+y*Math.cos(a)}}
for(const markup of ['line-solid','arrow-solid'])for(const rotation of [0,30,90,-45,178])for(const key of ['start','end'])for(const axis of ['x','y']){
 const orig={x:50,y:50,w:30,h:20,rotation,markup}, item=structuredClone(orig),fixed=key==='start'?'end':'start';
 const before=world(orig,fixed);ctx.reshapeMarkupPoint(item,orig,key,70,-35,rect,axis);
 const after=world(item,fixed),moving=world(item,key),curve=world(item,'curve');
 near(before.x,after.x,'Anchor X');near(before.y,after.y,'Anchor Y');
 near(after[axis==='x'?'y':'x'],moving[axis==='x'?'y':'x'],'Snapped axis');
 near(curve.x,(after.x+moving.x)/2,'Straight curve X');near(curve.y,(after.y+moving.y)/2,'Straight curve Y');
 const free=structuredClone(orig),oldEnd=world(orig,key);ctx.reshapeMarkupPoint(free,orig,key,70,-35,rect);
 near(world(free,key).x-oldEnd.x,70,'Free endpoint X');near(world(free,key).y-oldEnd.y,-35,'Free endpoint Y');
}
const s={};near(ctx.constrainedPathDragDelta(s,2,2,true).x,0,'Ignore shake');
near(ctx.constrainedPathDragDelta(s,40,8,true).y,0,'Horizontal');near(ctx.constrainedPathDragDelta(s,20,90,true).y,0,'Horizontal remains locked');
near(ctx.constrainedPathDragDelta(s,20,90,false).y,90,'Release Shift');near(ctx.constrainedPathDragDelta(s,20,90,true).x,0,'Vertical');
for(const r of [{width:500,height:1500},{width:1500,height:500}]){
 const orig={markup:'line-solid',w:20,h:10,rotation:0};assert.equal(ctx.pathEndpointAxis(orig,'end',10,0,r),'x');assert.equal(ctx.pathEndpointAxis(orig,'end',0,700,r),'y');
}
console.log('PASS syntax, 40 snapped endpoints, opposite-anchor preservation, 40 free endpoints, direction stability, Shift release, and non-square stage axes.');
