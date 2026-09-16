import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { Window } from '/private/tmp/mh-toolbar-audit/dom-tests/node_modules/happy-dom/lib/index.js';
const root='/Users/tamchap/Dev';
const paths=['website/learn/Appearance/appearance-pages-demo.html','mh_media/tutorial-demo-builder-v2.html'];
const oldPath='website-archive/2026-09-14-before-embed-pause-020751/appearance-pages-demo.html';
function runtime(path){return [...fs.readFileSync(root+'/'+path,'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].find(m=>m[2].includes('function deleteSelected()'))[2]}
function functionSource(s,name){return s.match(new RegExp('    function '+name+'\\([^\\n]*\\) \\{[\\s\\S]*?(?=\\n    (?:async )?function )'))?.[0]||''}
async function check(path,expectStable){
 const s=runtime(path);new vm.Script(s);
 const win=new Window();win.document.body.innerHTML='<div data-demo-playback><button data-action="demo-toggle"></button><input data-demo-seek><span data-demo-time></span></div>';
 const root=win.document.body,button=root.querySelector('button');let progress=20;
 const c=vm.createContext({root,IS_DEMO_PLAYER:true,demoSeekPreview:null,demoStarted:true,demoPlaying:true,demoFinished:false,slideHasMainVideo:()=>false,currentSlide:()=>({}),demoOverallProgress:()=>progress,demoProgressText:()=>progress+'%',demoTimelineText:()=>progress+'/100',demoToggleArt:p=>'<svg data-icon="'+(p?'pause':'play')+'"><path /></svg>'});
 vm.runInContext(['updateDemoToggleArt','updateDemoPlaybackUi'].map(n=>functionSource(s,n)).join('\n'),c);
 c.updateDemoPlaybackUi();const pointerTarget=button.querySelector('path');
 for(let i=0;i<25;i++){progress++;c.updateDemoPlaybackUi()}
 assert.equal(button.contains(pointerTarget),expectStable,'Timeline updates must retain the pointer target until the user releases the mouse');
 assert.equal(button.getAttribute('aria-label'),'Pause demo');assert.equal(root.querySelector('input').value,'45');
 c.demoPlaying=false;c.updateDemoPlaybackUi();assert.equal(button.getAttribute('aria-label'),'Play demo');assert.equal(button.getAttribute('aria-pressed'),'false');
 const pausedTarget=button.querySelector('path');for(let i=0;i<25;i++)c.updateDemoPlaybackUi();assert.equal(button.contains(pausedTarget),expectStable);
 c.demoPlaying=true;c.updateDemoPlaybackUi();assert.equal(button.getAttribute('aria-label'),'Pause demo');
 console.log(expectStable?'PASS stable control, timeline, pause and resume labels:':'REPRODUCED old lost-click target:',path);
 await win.happyDOM.close();
}
await check(oldPath,false);for(const p of paths)await check(p,true);
