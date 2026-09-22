    async function runFramingBrowserChecks() {
      const panel=document.getElementById('framing-qa-panel'), out=panel.querySelector('output');
      out.textContent='Checking builder and generated HTML…';
      const saved=clone(state), checks=[], check=(ok,label,detail='')=>checks.push({pass:Boolean(ok),label,detail});
      const tick=win=>new Promise(resolve=>win.requestAnimationFrame(()=>win.requestAnimationFrame(resolve)));
      const testSlide=clone(framingFixtureBaseline.tutorial.slides[1]);
      state=clone(framingFixtureBaseline);state.tutorial.slides=[testSlide];
      state.ui={...state.ui,slideIndex:0,selectedKind:null,selectedId:null,activeHotspotId:null};render();
      const canonicalTutorial=tutorial=>{
        const copy=clone(tutorial);
        // Current title editors capture a single rich line instead of legacy
        // {html}; identical markup is the same authored content.
        for(const slide of copy.slides)for(const item of [...(slide.annotations||[]),...(slide.hotspots||[])])
          for(const rich of Object.values(item.richText||{}))if(rich.html!=null&&!rich.lines){rich.lines=[rich.html];delete rich.html;}
        return copy;
      };
      const designSnapshot=JSON.stringify(canonicalTutorial(state.tutorial));
      const builderDoc=document.documentElement.cloneNode(true);
      builderDoc.querySelector('#framing-qa-panel')?.remove();
      builderDoc.querySelector('body').dataset.framingQaChild='true';
      builderDoc.querySelector('#project-state').textContent=JSON.stringify(state);
      builderDoc.querySelector('head').insertAdjacentHTML('afterbegin','<base href="'+location.origin+'/">');
      builderDoc.querySelector('#app').innerHTML='';
      const builderHtml='<!doctype html>'+builderDoc.outerHTML;
      const result=await buildExportHtml('tutorial');
      const stateChanges=[];
      const diff=(a,b,path='tutorial')=>{if(JSON.stringify(a)===JSON.stringify(b))return;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const key of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[key],b[key],path+'.'+key);}else stateChanges.push({path,before:a,after:b});};
      diff(JSON.parse(designSnapshot),canonicalTutorial(state.tutorial));
      check(!stateChanges.length,'HTML generation preserves authored content and geometry',JSON.stringify(stateChanges));
      const playerDoc=new DOMParser().parseFromString(result.html,'text/html');
      playerDoc.querySelector('#framing-qa-panel')?.remove();
      playerDoc.head.insertAdjacentHTML('afterbegin','<base href="'+location.origin+'/">');
      const playerHtml='<!doctype html>'+playerDoc.documentElement.outerHTML;
      const makeFrame=async(html,w,h)=>{
        const f=document.createElement('iframe'); f.style.cssText=`position:fixed;left:-24000px;top:0;width:${w}px;height:${h}px;border:0`;document.body.append(f);
        await new Promise(resolve=>{f.onload=resolve;f.srcdoc=html;});await f.contentDocument.fonts.ready;await tick(f.contentWindow);return f;
      };
      const rect=(doc,sel)=>doc.querySelector(sel)?.getBoundingClientRect();
      const measure=doc=>{ const o=rect(doc,'.framed-tutorial'),f=rect(doc,'.tutorial-frame'),s=rect(doc,'[data-stage]'),n=rect(doc,'.reader-nav');return {o,f,s,n}; };
      const textMetrics=doc=>[...doc.querySelectorAll('.slide-intro-card__title,.slide-intro-card__body,.standalone-callout-card__title,.standalone-callout-card__body')].map(e=>{
        const c=doc.defaultView.getComputedStyle(e);return {text:e.textContent,font:c.fontSize,line:c.lineHeight,weight:c.fontWeight,letter:c.letterSpacing,width:e.clientWidth,height:e.clientHeight,scroll:e.scrollHeight};
      });
      try {
        for(const [w,h] of [[1440,800],[1024,768],[390,844],[812,375]]) {
          const prefix=`${w}×${h}: `;
          const b=await makeFrame(builderHtml,w,h), p=await makeFrame(playerHtml,w,h), bd=b.contentDocument,pd=p.contentDocument;
          const builder=measure(bd),closed=measure(pd), overlay=rect(pd,'.tutorial-open-cover');
          check(Math.abs(builder.s.width-closed.s.width)<1,prefix+'builder and opening export have identical canvas width');
          check(pd.defaultView.getComputedStyle(pd.querySelector('.site-header')).display!=='none',prefix+'opening page shows the site header');
          check(overlay.left>=closed.s.left && overlay.right<=closed.s.right && overlay.top>=closed.s.top && overlay.bottom<=closed.s.bottom,prefix+'opening overlay is contained in editable canvas');
          check(overlay.bottom<=closed.n.top,prefix+'navigation is outside the opening overlay');
          pd.querySelector('[data-action="open-tutorial-viewer"]').click();await tick(p.contentWindow);
          const opened=measure(pd);
          check(Math.abs(closed.s.width-opened.s.width)<1 && Math.abs(closed.o.height-opened.o.height)<1,prefix+'opening moves the frame without resizing it');
          check(opened.o.top<closed.o.top,prefix+'frame moves upward after opening');
          check(pd.defaultView.getComputedStyle(pd.querySelector('.site-header')).display==='none',prefix+'site header hides after opening');
          check(pd.defaultView.getComputedStyle(pd.querySelector('.tutorial-open-cover')).display==='none',prefix+'opening overlay disappears');
          check(opened.o.left>=0 && opened.o.right<=w+1 && opened.o.top>=0 && opened.o.bottom<=h+1,prefix+'entire opened frame fits the window');
          check(Math.abs(builder.s.width-opened.s.width)<1 && Math.abs(builder.s.height-opened.s.height)<1,prefix+'builder and opened export canvas dimensions match');
          check(Math.abs(opened.s.width-opened.n.width)<1,prefix+'navigation and canvas share one width');
          check(Math.abs(opened.f.width/opened.o.width-1508/1616)<.002,prefix+'surround keeps reference proportions');
          check(Math.abs(opened.s.width/opened.s.height-slideSceneAspect(testSlide))<.002,prefix+'canvas preserves the saved aspect ratio');
          const bm=textMetrics(bd),pm=textMetrics(pd);
          check(bm.length>0 && JSON.stringify(bm)===JSON.stringify(pm),prefix+'card text metrics and clipping match builder/export',JSON.stringify({builder:bm,player:pm}));
          const back=pd.querySelector('[data-action="reader-back"]'),menu=pd.querySelector('[data-action="open-contents"]'),next=pd.querySelector('[data-action="reader-next"]');
          check([back,menu,next].every(e=>{const r=e.getBoundingClientRect();return r.top>=opened.n.top && r.bottom<=opened.n.bottom+1 && r.left>=opened.n.left && r.right<=opened.n.right+1;}),prefix+'all navigation buttons stay inside the frame');
          menu.click();await tick(p.contentWindow);check(pd.querySelector('#contentsModal')?.hidden===false,prefix+'Menu opens');
          pd.querySelector('[data-action="close-contents"]')?.click();await tick(p.contentWindow);
          pd.querySelector('[data-action="close-tutorial-viewer"]').click();await tick(p.contentWindow);
          check(pd.defaultView.getComputedStyle(pd.querySelector('.site-header')).display!=='none',prefix+'closing restores the header');
          b.remove();p.remove();
        }
      } catch(e){check(false,'Browser harness completed',e.stack||String(e));}
      document.activeElement?.blur();state=saved;render();
      const report={pass:checks.every(c=>c.pass),total:checks.length,failures:checks.filter(c=>!c.pass),checks};
      out.textContent=JSON.stringify(report,null,2);out.style.whiteSpace='pre-wrap';
      document.title=(report.pass?'PASS':'FAIL')+' — '+report.total+' framing checks';
    }

    const framingFixtureBaseline = clone(embeddedProjectState());
    async function framingQaExport() {
      const snapshotBefore = JSON.stringify(state.tutorial);
      const result = await buildExportHtml("tutorial");
      const doc = new DOMParser().parseFromString(result.html, "text/html");
      doc.querySelector("#framing-qa-panel")?.remove();
      doc.head.insertAdjacentHTML("afterbegin", '<base href="' + location.origin + '/">');
      const html = '<!doctype html>' + doc.documentElement.outerHTML;
      const url = URL.createObjectURL(new Blob([html], {type:"text/html"}));
      const panel = document.getElementById("framing-qa-panel");
      panel.querySelector("output").textContent = "Tutorial generated for visual comparison; run framing checks for content-preservation assertions.";
      const link = panel.querySelector("a"); link.href = url; link.textContent="Open generated tutorial";
      const frame = panel.querySelector("iframe"); frame.srcdoc = html;
    }
    document.addEventListener("DOMContentLoaded", () => {
      if (MODE !== "builder" || document.body.dataset.framingQaChild) return;
      const panel = document.createElement("section");panel.id="framing-qa-panel";
      panel.style.cssText="margin:24px;padding:16px;border:1px solid #aaa;background:#fff";
      panel.innerHTML='<button data-qa="blank">Show empty reference frame</button> <button data-qa="draft">Show saved draft</button> <button data-qa="export">Generate tutorial for verification</button> <button data-qa="checks">Run framing checks</button> <output></output> <a target="_blank"></a><iframe title="Framing export verification" style="display:block;width:1440px;height:800px;border:0;margin-top:20px"></iframe>';
      document.body.append(panel);
      panel.querySelector('[data-qa="blank"]').onclick=()=>{document.activeElement?.blur();state=clone(framingFixtureBaseline);const blank=clone(currentSlide());blank.title="Framing reference";blank.description="";blank.annotations=[];blank.hotspots=[];state.tutorial.slides=[blank];state.ui.slideIndex=0;state.ui.selectedKind=null;state.ui.selectedId=null;state.ui.activeHotspotId=null;render();};
      panel.querySelector('[data-qa="draft"]').onclick=()=>{document.activeElement?.blur();state=clone(framingFixtureBaseline);render();};
      panel.querySelector('[data-qa="export"]').onclick=framingQaExport;
      panel.querySelector('[data-qa="checks"]').onclick=runFramingBrowserChecks;
    });
