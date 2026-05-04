# /a11y-check — Accessibility Audit

## Steps
1. Run flutter test --tags a11y (accessibility test suite)
2. Check all interactive widgets have Semantics(identifier, label)
3. Verify minimum 48x48 touch targets on all buttons
4. Check no hardcoded colors bypassing theme (contrast risk)
5. Verify all images have semanticsLabel or are excluded
6. Check form fields have associated labels and error announcements

## Pass Criteria
- All a11y-tagged widget tests pass
- Zero missing Semantics on interactive widgets
- Zero touch targets below 48x48dp
- WCAG AA contrast: all text passes 4.5:1 minimum

## Report Format
PASS / FAIL
Missing Semantics: [list]
Touch target violations: [list]
Contrast issues: [list]

## What's next
```
✅ Done: Accessibility audit complete.

👉 PASS → continue to /perf-check or /release
   FAIL → fix each listed issue, then re-run /a11y-check

💡 Fix example: Add Semantics(identifier: 'login_button', label: 'Log in') to ElevatedButton.
```
