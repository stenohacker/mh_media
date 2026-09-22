from pathlib import Path
import json,re
p=Path(__file__).resolve().parent.parent
s=(p/'tutorial-demo-builder-v2.html').read_text()
projects=json.loads((p/'.tutorial-demo-projects.json').read_text())['projects']
state=next(v['state'] for v in projects if v['id']=='project-20260921045818-16f79c6a')
state['ui'].update(slideIndex=1,selectedKind=None,selectedId=None,activeHotspotId=None)
s=re.sub(r'(<script id="project-state"[^>]*>)[\s\S]*?(</script>)',lambda m:m[1]+json.dumps(state)+m[2],s,count=1)
needle='    if (IS_READING_EXPORT) {\n      window.readingExportReady'
assert s.count(needle)==1
s=s.replace(needle,(p/'audits/framing-qa-controls.js').read_text()+'\n'+needle)
(p/'qa-unified-framing.html').write_text(s)
print('Framing fixture updated.')
