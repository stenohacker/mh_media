    // Injected only into the isolated QA copy, never into the active builder.
    async function runThreeCardChecks() {
      const results = [], failures = [];
      const baseline = clone(state);
      const out = document.getElementById('three-card-results');
      const check = (condition, label) => { results.push({ pass: Boolean(condition), label }); if (!condition) failures.push(label); };
      const tick = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const reset = () => { document.activeElement?.blur(); state = clone(baseline); rememberWordSelection.saved = null; lastMixedBodySelection = null; render(); };
      const choose = (kind, item, part = 'body') => {
        state.ui.selectedKind = kind; state.ui.selectedId = item.id;
        state.ui.activeHotspotId = currentSlide().hotspots[0].id;
        multiSelection = [selectionKey(kind,item.id)]; rememberWordSelection.saved = null;
        render(); selectCardTextPart(part); return toolbarTextEditor();
      };
      const click = action => {
        const button = root.querySelector(`[data-action="${action}"]`);
        if (!button || button.disabled) throw new Error('Unavailable control: '+action);
        button.dispatchEvent(new PointerEvent('pointerdown', {bubbles:true, button:0}));
        button.click();
      };
      const field = (name,value) => {
        const input=root.querySelector(`[data-toolbar-field="${name}"]`);
        if(!input || input.disabled) throw new Error('Unavailable field: '+name);
        input.value=String(value); input.dispatchEvent(new Event('input',{bubbles:true})); input.dispatchEvent(new Event('change',{bubbles:true}));
      };
      const select = (editor, start=0, end=0) => { editor.focus(); restoreEditorTextRange(editor,{start,end}); rememberWordSelection(); rememberMixedBodySelection(); };
      const textRect = editor => { const range=document.createRange();range.selectNodeContents(editor.firstElementChild);return range.getBoundingClientRect(); };
      const kinds = ['slide-intro','callout','hotspot'];
      for(const type of kinds) {
        reset();
        const kind=type==='hotspot'?'hotspot':'annotation';
        const item=kind==='hotspot'?currentSlide().hotspots[0]:currentSlide().annotations.find(a=>a.type===type);
        const [titleField,bodyField]=cardFieldNames(item,kind);
        const prefix=type+': ';
        try {
          let editor=choose(kind,item);
          const titleBefore=item[titleField], bodyBefore=item[bodyField];
          check(!root.querySelector('.annotation-slide-intro .body-format-bar,.annotation-callout .body-format-bar,.hotspot-detail-panel .body-format-bar'),prefix+'no bottom formatting buttons');
          select(editor,0,0); click('toggle-toolbar-pipe-list');
          check(item[bodyField].startsWith('| '+bodyBefore.split('\n')[0]) && !item[bodyField].split('\n')[1].startsWith('|'),prefix+'pipe applies only to first line');
          check(document.activeElement===editor && window.getSelection().isCollapsed && mixedBodyCaret(editor)?.offset===0,prefix+'first-line list retains caret');
          // Type through the same editable input route and verify placement.
          document.execCommand('insertText',false,'Q');
          check(item[bodyField].startsWith('| Q'),prefix+'typing resumes on the formatted first line');
          select(editor,0,1); click('toggle-toolbar-numbered-list');
          check(item[bodyField].startsWith('1. Q') && item[bodyField].split('\n')[1]===bodyBefore.split('\n')[1],prefix+'numbered list leaves unselected line intact');
          select(editor,0,1); click('format-bold'); click('format-italic');
          const span=editor.querySelector('span');
          check(Number(getComputedStyle(span).fontWeight)>=600 && getComputedStyle(span).fontStyle==='italic',prefix+'bold and italic from main toolbar');
          select(editor,0,1); wordUnderlineColor='#26ab9d'; click('toolbar-underline');
          field('wordUnderlineWidth',3); field('wordUnderlineOffset',6);
          selectWordHighlightColor('#f1f332');
          check(Boolean(editor.querySelector('[data-gentle-underline][data-gentle-highlight]')),prefix+'highlight and underline coexist');
          check(editor.innerHTML.includes('text-underline-offset:6px') || editor.innerHTML.includes('text-underline-offset: 6px'),prefix+'underline offset persists');
          check(item[titleField]===titleBefore,prefix+'body edits preserve title');
          selectCardTextPart('title');
          const titleEditor=toolbarTextEditor();
          select(titleEditor,0,0); click('toggle-toolbar-pipe-list');
          check(item[titleField].startsWith('| '),prefix+'header supports toolbar lists');
          click('toggle-toolbar-pipe-list');
          field('textFontSize',32); field('textLetterSpacing',2); field('textLineHeight',1.4);
          click('toolbar-text-align'); // first toolbar alignment is left
          root.querySelector('[data-action="toolbar-text-align"][data-value="center"]').click();
          changeSelectedFontOrAddText('hand');
          check(item.cardText.title.fontSize===32 && item.cardText.title.font==='hand' && item.cardText.title.align==='center',prefix+'independent title size, font, alignment');
          selectCardTextPart('body'); field('textFontSize',18);field('textLetterSpacing',.5);field('textLineHeight',1.8);
          changeSelectedFontOrAddText('regular');
          check(item.cardText.body.fontSize===18 && item.cardText.body.font==='regular' && item.cardText.title.fontSize===32 && item.cardText.title.font==='hand',prefix+'body settings leave title settings intact');
          const savedTypography=JSON.stringify(item.cardText);
          copySelectedFormatProperties();
          const original=clone(item);
          item.cardText.title.fontSize=44;
          check(formatPropertiesClipboard.values.cardText.title.fontSize===32,prefix+'copied typography is an independent snapshot');
          pasteSelectedFormatProperties();
          check(JSON.stringify(item.cardText)===savedTypography,prefix+'paste formatting restores independent fields');
          item.cardText.title.fontSize=33;
          check(formatPropertiesClipboard.values.cardText.title.fontSize===32,prefix+'pasted typography does not share mutable settings');
          item.cardText.title.fontSize=32;render();
          click('toggle-inserted-image-shadow');
          check(item.cardShadow===false,prefix+'shadow toggles off');
          const shadowElement=kind==='hotspot'?root.querySelector('.slide-sidebar.is-demo-popup'):root.querySelector(`[data-object][data-id="${item.id}"] .object-frame`);
          check(getComputedStyle(shadowElement)[kind==='hotspot'?'boxShadow':'filter']==='none',prefix+'shadow visually removed');
          click('toggle-inserted-image-shadow');field('shadowHeight',14);
          check(item.cardShadow===true && item.shadowHeight===14,prefix+'shadow size and toggle enabled');
          const bodySnapshot=JSON.stringify([item[bodyField],item.richText[bodyField],item.cardText.body]);
          moveCardTitle(6);check(item.cardTitleOffset===6,prefix+'title container moves down');moveCardTitle(-6);
          click('toggle-card-title-only');await tick();
          const titleOnlyElement=kind==='hotspot'?root.querySelector('.slide-sidebar.is-demo-popup'):root.querySelector(`[data-object][data-id="${item.id}"]`);
          const collapsedHeight=titleOnlyElement.getBoundingClientRect().height;
          check(cardIsTitleOnly(item) && !root.querySelector(`[data-bind="${kind}.${bodyField}:${item.id}"]`),prefix+'title-only hides body');
          if(kind==='hotspot') activateHotspot(item.id); else render();
          check(!root.querySelector(`[data-bind="${kind}.${bodyField}:${item.id}"]`),prefix+'title-only remains collapsed on activation/redraw');
          click('toggle-card-title-only');await tick();
          const expandedElement=kind==='hotspot'?root.querySelector('.slide-sidebar.is-demo-popup'):root.querySelector(`[data-object][data-id="${item.id}"]`);
          check(expandedElement.getBoundingClientRect().height>collapsedHeight,prefix+'title-only restores expanded height');
          check(JSON.stringify([item[bodyField],item.richText[bodyField],item.cardText.body])===bodySnapshot,prefix+'title-only preserves body and its formatting');
          choose(kind,item,'body');await tick();
          let title=root.querySelector(`[data-bind="${kind}.${titleField}:${item.id}"]`), body=toolbarTextEditor();
          const before=[textRect(title),textRect(body)];
          const fieldSettings=JSON.stringify(item.cardText);
          item.contentScale=1.5;
          if(kind==='hotspot') {item.popupW*=1.5;item.popupH*=1.5;} else {item.w*=1.5;item.h*=1.5;}
          render();await tick();
          title=root.querySelector(`[data-bind="${kind}.${titleField}:${item.id}"]`);body=root.querySelector(`[data-bind="${kind}.${bodyField}:${item.id}"]`);
          const after=[textRect(title),textRect(body)];
          check(after.every((r,i)=>Math.abs(r.height/before[i].height-1.5)<.06),prefix+'title and body visually scale together (1.5x)');
          check(JSON.stringify(item.cardText)===fieldSettings,prefix+'scaling retains independent typography settings');
          const serialized=JSON.parse(JSON.stringify(item));
          const normalized=kind==='hotspot'?normalizeHotspot(serialized,0):normalizeAnnotation(serialized,0);
          check(JSON.stringify(normalized.cardText)===fieldSettings && normalized.contentScale===1.5,prefix+'independent settings and shared scale survive save/reload normalization');
          const beforeResize=[textRect(title).height,textRect(body).height];
          if(kind==='hotspot') item.popupW*=.95; else item.w*=.95;
          render();await tick();
          title=root.querySelector(`[data-bind="${kind}.${titleField}:${item.id}"]`);body=root.querySelector(`[data-bind="${kind}.${bodyField}:${item.id}"]`);
          check(Math.abs(textRect(title).height-beforeResize[0])<1 && Math.abs(textRect(body).height-beforeResize[1])<1,prefix+'ordinary resize leaves title/body font sizes unchanged');
          check(kind==='hotspot'?root.querySelectorAll('.popup-move-handle').length===2:root.querySelector(`[data-object][data-id="${item.id}"]`).querySelectorAll('.move-handle').length===2,prefix+'two side move handles');
          selectCardTextPart('body'); fitCardTextToSpace();
          check(Number.isFinite(item.cardText.body.fontSize) && item.cardText.title.fontSize===32,prefix+'fit text targets body only');
          setCardTextProperty('fontSize',18); document.activeElement?.blur();
          if(kind==='hotspot')item.popupH=75;else item.h=75;
          render();await tick();fitSelectedTextFrame();
          check(kind==='hotspot'?item.popupH===null:item.h<70,prefix+'fit frame shrinks to its text');
        } catch(error) { check(false,prefix+error.message); }
      }
      reset();
      try {
        const plain=normalizeAnnotation({id:'qa-plain',type:'text',text:'Plain first\nPlain second',x:30,y:60,w:30,h:20},0);
        currentSlide().annotations.push(plain);state.ui.selectedKind='annotation';state.ui.selectedId=plain.id;render();
        const editor=toolbarTextEditor();select(editor,0,0);click('toggle-toolbar-pipe-list');
        check(plain.text==='| Plain first\nPlain second','plain text annotation keeps first-line pipe behavior');
        click('toggle-toolbar-numbered-list');
        check(plain.text==='1. Plain first\nPlain second','plain text annotation keeps first-line numbering');
      } catch(error) {check(false,'plain text: '+error.message);}
      reset();
      // The same exported runtime must retain the field settings and collapsed state.
      try {
        for(const item of currentSlide().annotations) item.cardText={title:{fontSize:31,font:'hand'},body:{fontSize:17,font:'regular'}};
        currentSlide().hotspots[0].cardText={title:{fontSize:21,font:'hand'},body:{fontSize:15,font:'regular'}};
        currentSlide().hotspots[0].cardTitleOnly=true;
        document.activeElement?.blur();render();
        for(const mode of ['demo','tutorial']) {
          const exported=await buildExportHtml(mode);
          const doc=new DOMParser().parseFromString(exported.html,'text/html');
          doc.querySelector('#three-card-qa')?.remove();
          const saved=JSON.parse(doc.querySelector('#project-state').textContent);
          check(saved.tutorial.slides[0].hotspots[0].cardTitleOnly && saved.tutorial.slides[0].hotspots[0].cardText.title.font==='hand',mode+' export retains title-only and independent fields');
          check(doc.body.dataset.mode==='player' && !doc.querySelector('.card-toolbar-controls'),mode+' export removes authoring controls');
          const iframe=document.createElement('iframe');iframe.title='QA '+mode+' export';iframe.style.cssText='width:100%;height:800px';
          doc.head.insertAdjacentHTML('afterbegin','<base href="'+location.origin+'/">');
          iframe.srcdoc='<!doctype html>'+doc.documentElement.outerHTML;document.getElementById('three-card-export-previews').append(iframe);
          await new Promise(resolve=>iframe.addEventListener('load',resolve,{once:true}));
          await tick();
          const player=iframe.contentDocument;
          if(mode==='tutorial')player.querySelector('[data-action="open-tutorial-viewer"]')?.click();
          player.querySelector('[data-action="activate-hotspot"]')?.click();await tick();
          check(!player.querySelector('.body-format-bar,.popup-move-handle,.card-toolbar-controls'),mode+' player contains no editing controls');
          check(!player.querySelector('.hotspot-detail'),mode+' player keeps title-only hotspot collapsed');
          check(Boolean(player.querySelector('.annotation-callout .object-frame')),mode+' player renders restored callout');
          const calloutTitle=player.querySelector('.standalone-callout-card__title');
          const calloutBody=player.querySelector('.standalone-callout-card__body');
          check(calloutTitle?.style.fontFamily==='var(--hand)' && calloutBody?.style.fontFamily==='var(--sans)',mode+' player renders independent title/body fonts');
        }
      } catch(error) {check(false,'export: '+error.message);}
      try {
        const snapshot=clone(state);
        snapshot.tutorial.slides[0].hotspots[0].cardTitleOnly=false;
        const job=createReadingExportFrame(snapshot);
        await job.ready;
        const doc=job.frame.contentDocument;
        const card=doc.querySelector(`[data-reading-hotspot="${snapshot.tutorial.slides[0].hotspots[0].id}"]`);
        const title=card?.querySelector('.reading-card-heading'),body=card?.querySelector('.reading-card-body');
        check(title?.style.fontFamily==='var(--hand)' && body?.style.fontFamily==='var(--sans)','reading guide retains independent title/body fonts');
        check(title?.style.fontSize==='21px' && body?.style.fontSize==='15px','reading guide retains independent title/body sizes');
        job.frame.remove();
        snapshot.tutorial.slides[0].hotspots[0].cardTitleOnly=true;
        const rolled=createReadingExportFrame(snapshot);await rolled.ready;
        check(!rolled.frame.contentDocument.querySelector(`[data-reading-hotspot="${snapshot.tutorial.slides[0].hotspots[0].id}"] .reading-card-body`)?.textContent.trim(),'reading guide honors title-only hotspot');
        rolled.frame.remove();
      } catch(error) {check(false,'reading guide: '+error.message);}
      reset();
      out.textContent=JSON.stringify({pass:failures.length===0,total:results.length,failures,results},null,2);
      out.dataset.complete='true';out.dataset.pass=String(failures.length===0);
      document.title=(failures.length?'FAIL':'PASS')+' — '+results.length+' card checks';
    }
    document.addEventListener('DOMContentLoaded',()=>{
      if (MODE !== 'builder') return;
      const panel=document.createElement('section');panel.style.cssText='padding:20px;background:#fff;color:#000';
      panel.id='three-card-qa';
      panel.innerHTML='<button id="run-three-card-checks">Run card verification</button><pre id="three-card-results">Ready</pre><div id="three-card-export-previews"></div>';
      document.body.append(panel);
      panel.querySelector('button').addEventListener('click',runThreeCardChecks);
    });
