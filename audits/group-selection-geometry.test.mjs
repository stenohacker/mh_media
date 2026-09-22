import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const html=fs.readFileSync(process.argv[2]||new URL('../tutorial-demo-builder-v2.html',import.meta.url),'utf8');
const source=name=>{const a=html.indexOf(`    function ${name}(`);assert(a>=0);return html.slice(a,html.indexOf('\n    }',a)+6)};
const ctx=vm.createContext({clamp:(n,lo,hi)=>Math.max(lo,Math.min(hi,n))});vm.runInContext(['selectionBounds','scaleSelectionFromCorner'].map(source).join('\n'),ctx);
const near=(a,b)=>assert(Math.abs(a-b)<1e-7,`${a} versus ${b}`);
for(const rect of [{width:1500,height:900},{width:600,height:1000}])for(const handle of ['nw','ne','sw','se'])for(const scale of [.5,1.5]){
 const originals=[{type:'image',x:20,y:35,w:14,h:20,rotation:30,cropEnabled:true,cropX:25,cropY:40},{type:'text',x:50,y:65,w:30,h:10,rotation:0,contentScale:1.4},{type:'markup',markup:'arrow-solid',x:80,y:25,w:10,h:15,rotation:-45,contentScale:.8}].map(original=>({original,item:structuredClone(original)}));
 const box=ctx.selectionBounds(originals.map(o=>({item:o.original})),rect),sx=handle.includes('e')?1:-1,sy=handle.includes('s')?1:-1;
 const actual=ctx.scaleSelectionFromCorner({box,rect,handle,originals},box.w*rect.width/100*(scale-1)*sx,box.h*rect.height/100*(scale-1)*sy);near(actual,scale);
 const after=ctx.selectionBounds(originals,rect);near(box.x-sx*box.w/2,after.x-sx*after.w/2);near(box.y-sy*box.h/2,after.y-sy*after.h/2);
 for(const {item,original:o}of originals){near(item.w/o.w,scale);near(item.h/o.h,scale);assert.equal(item.rotation,o.rotation);if(o.contentScale)near(item.contentScale/o.contentScale,scale);}
 assert.equal(originals[0].item.cropX,25);assert.equal(originals[0].item.cropY,40);
}
console.log('PASS mixed image/text/arrow groups: all four corners, shrink/grow, rotated bounds, fixed anchor, text scale, crop preservation, and two stage aspects.');
