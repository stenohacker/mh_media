    async function runEdgePlacementChecks() {
      const out=document.getElementById('edge-results'),checks=[];
      const check=(pass,label,detail='')=>checks.push({pass:Boolean(pass),label,detail});
      const saved=clone(state),tick=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      const src='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect x="60" y="60" width="80" height="80" fill="#26ab9d"/></svg>');
      try {
        for(const [w,h] of [[65,15],[15,65]]){
          state=clone(embeddedProjectState());state.ui.slideIndex=0;
          const item=normalizeAnnotation({id:'edge-image',type:'image',src,label:'Edge placement test',x:50,y:50,w,h},0);
          currentSlide().annotations=[item];currentSlide().hotspots=[];
          state.ui.selectedKind='annotation';state.ui.selectedId=item.id;multiSelection=[selectionKey('annotation',item.id)];render();
          await root.querySelector('[data-object] img').decode();await tick();syncSelectionControls();
          const object=root.querySelector('[data-object]'),bounds=annotationAlphaBoundsById.get(item.id);
          check(Boolean(bounds),'Visible image bounds resolved '+w+'×'+h);
          const expected={left:parseFloat(object.style.getPropertyValue('--selection-left'))/object.offsetWidth,top:parseFloat(object.style.getPropertyValue('--selection-top'))/object.offsetHeight};
          check(Math.abs(bounds.left-expected.left)<.001&&Math.abs(bounds.top-expected.top)<.001,'Placement bounds include contained-image margins '+w+'×'+h);
          const content={src:item.src,w:item.w,h:item.h};
          for(const edge of ['left','right','top','bottom']){
            item.x=50;item.y=50;
            if(edge==='left')item.x=1.7+w/2-w*bounds.left;
            if(edge==='right')item.x=98.3+w/2-w*bounds.right;
            if(edge==='top')item.y=2.9+h/2-h*bounds.top;
            if(edge==='bottom')item.y=97.1+h/2-h*bounds.bottom;
            const x=item.x,y=item.y;fitStageObjectBounds(item);
            check(Math.abs(item.x-x)<.001&&Math.abs(item.y-y)<.001,'Visible image can reach '+edge+' canvas edge '+w+'×'+h);
          }
          check(JSON.stringify(content)===JSON.stringify({src:item.src,w:item.w,h:item.h}),'Edge placement preserves image source and dimensions '+w+'×'+h);
        }
      }catch(e){check(false,'Harness completed',e.stack||String(e));}
      document.activeElement?.blur();currentSlide().annotations[0].x=50;currentSlide().annotations[0].y=50;render();
      const report={pass:checks.every(c=>c.pass),total:checks.length,failures:checks.filter(c=>!c.pass),checks};
      out.textContent=JSON.stringify(report,null,2);document.title=(report.pass?'PASS':'FAIL')+' — '+checks.length+' edge checks';
    }
    document.addEventListener('DOMContentLoaded',()=>{
      if(MODE!=='builder')return;
      const panel=document.createElement('section');panel.innerHTML='<button id="run-edge-checks">Run edge placement checks</button><pre id="edge-results">Ready</pre>';document.body.append(panel);
      panel.querySelector('button').onclick=runEdgePlacementChecks;
    });
