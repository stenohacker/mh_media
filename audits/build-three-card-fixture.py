"""Build an isolated browser fixture without changing the working project."""
from pathlib import Path
import re

root = Path(__file__).resolve().parent.parent
source = (root / "tutorial-demo-builder-v2.html").read_text()
state = (root / "audits/three-card-fixture-state.json").read_text()
source, replaced = re.subn(
    r'(<script id="project-state"[^>]*>)[\s\S]*?(</script>)',
    lambda match: match[1] + state + match[2], source, count=1,
)
assert replaced == 1
needle = '    if (IS_READING_EXPORT) {\n      window.readingExportReady'
assert source.count(needle) == 1
source = source.replace(
    needle, (root / "audits/three-card-controls.browser.js").read_text() + "\n" + needle,
)
target = root / "qa-three-card-verified.html"
target.write_text(source)
print(target)
