from pathlib import Path
import re,json
r=Path(__file__).resolve().parent.parent
s=(r/'tutorial-demo-builder-v2.html').read_text()
old=(r/'audits/qa-pdf-download-original.html').read_text()
state=json.loads(re.search(r'<script id="project-state"[^>]*>(.*?)</script>',old,re.S).group(1))
s=s.replace('<head>','<head><base href="http://127.0.0.1:8765/">',1)
s=re.sub(r'(<script id="project-state"[^>]*>).*?(</script>)',lambda m:m[1]+json.dumps(state)+m[2],s,count=1,flags=re.S)
qa='''
    const pdfQaButton=document.createElement('button');
    pdfQaButton.textContent='Build PDF repair test export'; pdfQaButton.id='qa-build-pdf';
    pdfQaButton.style.cssText='position:fixed;top:0;left:0;z-index:999999';
    pdfQaButton.onclick=async()=>{
      pdfQaButton.remove();
      try {
        const result=await buildExportHtml('tutorial');
        download('tutorial-pdf-repaired.html',result.html,'text/html');
        pdfQaButton.textContent='Export built and downloaded';
      } catch(error) {pdfQaButton.textContent='FAIL: '+error.message;}
      document.body.append(pdfQaButton);
    };
    document.body.append(pdfQaButton);
'''
s=s.replace('    } else initializeApp();','    } else { initializeApp();'+qa+' }')
(r/'qa-pdf-download-builder.html').write_text(s)
print('Isolated PDF download fixture rebuilt.')
