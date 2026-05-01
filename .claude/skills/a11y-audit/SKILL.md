# a11y-audit

Audits the Flutter codebase for WCAG AA accessibility compliance.

## Steps
1. Find all interactive widgets: GestureDetector, IconButton, ElevatedButton, TextButton, InkWell, Checkbox, Radio, Switch
2. Verify each has Semantics(identifier, label) wrapper
3. Check minimum touch targets: SizedBox >= 48x48 around small targets
4. Check all Image widgets have semanticsLabel or ExcludeSemantics parent
5. Check form fields have associated labels (via labelText or Semantics)
6. Check error widgets have liveRegion: true in Semantics
7. Report missing items grouped by file

## Report Format
PASS / FAIL
Missing Semantics: [file:line — widget type]
Touch target violations: [file:line]
Missing image labels: [file:line]
Recommended fixes: [specific code snippets]
