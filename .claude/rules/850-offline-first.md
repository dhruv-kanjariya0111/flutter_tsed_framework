# Offline-First Strategy

## Check PROJECT_CONFIG.md: offlineFirst value before applying these rules.

## Local Storage (Hive)
- Hive for key-value and simple object caching.
- TypeAdapters for all cached entities.
- Box initialization at app startup (before router resolves).
- Encryption: HiveAesCipher with key from FlutterSecureStorage.

## Local Database (Drift — for relational data)
- Drift (formerly Moor) for structured offline data.
- Database class in core/storage/app_database.dart.
- DAOs per feature. Never access tables directly from repositories.
- Run migrations in onUpgrade callback.

## Repository Sync Pattern
class SyncRepository {
  // 1. Return cached data immediately (offline UX).
  // 2. Fetch fresh from API in background.
  // 3. Update cache.
  // 4. Notify UI of fresh data via stream.
}

## Conflict Resolution
- Last-write-wins for simple data (user preferences).
- Server-authoritative for financial/transactional data.
- Optimistic updates with rollback on API failure.
- Sync status indicator in UI: SyncStatusWidget.

## Connectivity
- connectivity_plus package for network status.
- Queue failed mutations. Retry on reconnect.
- Show offline banner when no connection detected.
