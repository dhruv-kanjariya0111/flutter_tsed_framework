# /offline-check — Offline-First Audit

## Only runs if offlineFirst: true in PROJECT_CONFIG.md

## Checks
1. All repositories implement SyncRepository pattern
2. Hive/Drift initialized before routing
3. All cached entities have TypeAdapters (Hive)
4. Connectivity detected: offline banner shown
5. Failed mutations queued and retried on reconnect
6. No direct API calls from presentation layer without cache fallback

## What's next
```
✅ Done: Offline-first audit complete.

👉 PASS → continue with /verify or /release
   FAIL → fix each listed gap (missing Hive/Isar cache, missing connectivity check), re-run /offline-check
```
