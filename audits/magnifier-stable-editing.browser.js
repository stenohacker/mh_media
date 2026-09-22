    if(MODE==='builder' && /qa-magnifier-(?:before|after)\.html$/.test(location.pathname)) {
      const panel=document.createElement('section');panel.dataset.builderOnly='';panel.style.cssText='position:fixed;bottom:0;right:0;z-index:99999;background:white;max-width:540px';
      panel.innerHTML='<button id="qa-stability">Check editing stability</button><button id="qa-export-magnifier">Build magnifier export</button><pre id="qa-stability-result">Ready</pre>';
      document.body.append(panel);
      const tick=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      const bounds=()=>{const r=root.querySelector('.tutorial-layout-viewport').getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,scroll:window.scrollY};};
      panel.querySelector('#qa-stability').onclick=async()=>{
        document.activeElement?.blur();await tick();window.scrollTo(0,120);await tick();const before=bounds(),checks=[];
        const check=(name,pass,detail)=>checks.push({name,pass:!!pass,...(detail?{detail}: {})});
        for(let i=0;i<6;i++){
          adjustSelectedMagnifier(i%2?-.25:.25);
          const immediate=bounds();check('Edit '+i+' retains frame immediately',Object.keys(before).every(k=>Math.abs(before[k]-immediate[k])<.5),{before,after:immediate});
          for(let j=0;j<5;j++){await tick();const next=bounds();check('Edit '+i+' stable painted frame '+j,Object.keys(before).every(k=>Math.abs(before[k]-next[k])<.5));}
        }
        const animation=getComputedStyle(root.querySelector('.hotspot-object .object-frame'));
        check('No builder attention animation',animation.animationName==='none');
        check('No builder marker hopping',animation.transform==='none');
        const report={pass:checks.every(c=>c.pass),total:checks.length,failures:checks.filter(c=>!c.pass)};
        panel.querySelector('pre').textContent=JSON.stringify(report);document.title=(report.pass?'PASS':'FAIL')+' editing stability';
      };
      panel.querySelector('#qa-export-magnifier').onclick=async()=>{
        const result=await buildExportHtml('tutorial');const f=document.createElement('iframe');f.id='qa-magnifier-export';f.style.cssText='width:100%;height:800px';f.srcdoc=result.html;document.body.append(f);panel.querySelector('pre').textContent='Magnifier export ready';
      };
    }
