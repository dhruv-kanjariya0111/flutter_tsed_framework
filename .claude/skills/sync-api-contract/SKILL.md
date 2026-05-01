# sync-api-contract

Syncs Flutter Freezed models with shared/openapi.yaml.

## Steps
1. Parse shared/openapi.yaml — extract all schema definitions
2. For each schema, find corresponding Flutter DTO in frontend/lib/src/**/dtos/
3. Compare:
   - Field names (apply x-dart-field overrides from openapi.yaml)
   - Types (string→String, integer→int, boolean→bool, etc.)
   - Nullability (required vs optional fields)
4. Report mismatches
5. If user approves: update Freezed models
6. Run: dart run build_runner build --delete-conflicting-outputs
7. Run: flutter test test/contract/ to verify sync

## Mismatch Format
MISMATCH: UserDto.displayName
  OpenAPI: display_name (string, required)
  Flutter: displayName (String, required) ✓ (x-dart-field matches)

MISMATCH: OrderDto.totalAmount
  OpenAPI: total_amount (number, required)
  Flutter: total (double?, optional) ← NEEDS FIX
