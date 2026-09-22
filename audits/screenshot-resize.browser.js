    if (MODE === 'builder' && location.pathname.endsWith('/qa-screenshot-resize.html')) {
      const qaPanel = document.createElement('section');
      qaPanel.dataset.builderOnly = '';
      qaPanel.style.cssText = 'position:fixed;bottom:0;right:0;z-index:999999;background:white;max-width:600px;max-height:120px;overflow:auto';
      qaPanel.innerHTML = '<button id="run-image-checks">Check screenshot resizing</button><button id="setup-image-check">Reset screenshot test</button><button id="export-image-check">Build screenshot export test</button><pre id="image-results">Ready</pre>';
      document.body.append(qaPanel);
      const qaSrc = 'http://127.0.0.1:8765/tutorials/appearance-pages-guide/ap-cover.png';
      const qaTick = () => new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      async function qaImageSetup({type='image',crop=false,browserFrame=false,rotation=0,wide=false}={}) {
        imageCropEditId=''; scaleMode=false; drag=null;
        const slide=currentSlide();slide.hotspots=[];
        const w=34,h=wide?14:w*slideSceneAspect()/(1506/806);
        const item=normalizeAnnotation({id:'qa-screenshot',type,src:qaSrc,label:'Screenshot resize test',x:50,y:48,w,h,rotation,browserFrame,
          cropEnabled:crop,cropWindow:crop?{left:-25,top:-25,width:150,height:150}:null},0);
        slide.annotations=[item]; state.ui.selectedKind='annotation';state.ui.selectedId=item.id;multiSelection=[selectionKey('annotation',item.id)];render();
        await root.querySelector('[data-object][data-id="qa-screenshot"] img').decode();await qaTick();syncSelectionControls();
        return item;
      }
      document.getElementById('setup-image-check').onclick=()=>qaImageSetup({crop:true});
      document.getElementById('export-image-check').onclick=async()=>{
        const result=await buildExportHtml('tutorial');
        const output=document.createElement('textarea');output.id='image-export-html';output.value=result.html;output.hidden=true;document.body.append(output);
        const iframe=document.createElement('iframe');iframe.id='image-export-preview';iframe.style.cssText='width:100%;height:850px';iframe.srcdoc=result.html;document.body.append(iframe);
        document.getElementById('image-results').textContent='Tutorial export built';
      };
      document.getElementById('run-image-checks').onclick=async()=>{
        const checks=[];
        const check=(pass,name,detail)=>checks.push({pass:!!pass,name,...(detail?{detail}: {})});
        const close=(a,b)=>Math.abs(a-b)<.002;
        try {
          for(const type of ['image','gif','shape']) for(const crop of [false,true]) for(const rotation of [0,30]) for(const handle of ['nw','n','ne','e','se','s','sw','w']) {
            const item=await qaImageSetup({type,crop,rotation});
            const before=clone(item),el=root.querySelector('[data-object][data-id="qa-screenshot"]'),rect=el.closest('[data-stage]').getBoundingClientRect();
            const radians=rotation*Math.PI/180;
            drag={id:item.id,kind:'annotation',handle,startX:0,startY:0,rect,original:clone(item),scaling:false,objectRect:el.getBoundingClientRect()};
            onPointerMove({clientX:36*Math.cos(radians)-19*Math.sin(radians),clientY:36*Math.sin(radians)+19*Math.cos(radians),preventDefault(){}});
            drag=null;
            check(close(item.w/item.h,before.w/before.h),`${type} ${crop?'cropped':'full'} ${rotation}° ${handle} keeps proportions`);
            check(item.src===before.src&&JSON.stringify(item.cropWindow)===JSON.stringify(before.cropWindow),`${type} ${crop?'cropped':'full'} ${rotation}° ${handle} keeps source and crop`);
          }
          for(const browserFrame of [false,true]) for(const handle of ['nw','n','ne','e','se','s','sw','w']) {
            const item=await qaImageSetup({crop:true,browserFrame});
            const before=clone(item),el=root.querySelector('[data-object][data-id="qa-screenshot"]'),rect=el.closest('[data-stage]').getBoundingClientRect();
            imageCropEditId=item.id;
            drag={id:item.id,kind:'annotation',handle,startX:0,startY:0,rect,original:clone(item),scaling:false,objectRect:el.getBoundingClientRect()};
            onPointerMove({clientX:handle.includes('w')?20:-20,clientY:handle.includes('n')?15:-15,preventDefault(){}});drag=null;
            check(close(item.w*item.cropWindow.width,before.w*before.cropWindow.width)&&close(item.h*item.cropWindow.height,before.h*before.cropWindow.height),`Crop ${browserFrame?'browser frame':'plain'} ${handle} trims without rescaling image`);
            const img=el.querySelector('img'),style=getComputedStyle(img);
            check(style.position==='absolute'&&close(parseFloat(style.width)/parseFloat(style.height),1506/806),`Crop ${browserFrame?'browser frame':'plain'} ${handle} rendered image keeps original ratio`);
          }
          await qaImageSetup({browserFrame:true,wide:true});
          check(getComputedStyle(root.querySelector('[data-object][data-id="qa-screenshot"] img')).objectFit==='contain','Mismatched browser frame fits full screenshot without stretching');
          await qaImageSetup({crop:true});
        } catch(e){check(false,'Harness finished',e.stack||String(e));}
        const report={pass:checks.every(c=>c.pass),total:checks.length,failures:checks.filter(c=>!c.pass)};
        document.getElementById('image-results').textContent=JSON.stringify(report);document.title=(report.pass?'PASS':'FAIL')+' screenshot resize checks';
      };
    }
