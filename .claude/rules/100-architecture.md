# Architecture

## Layer Structure (feature-first clean — default)
features/<name>/
  domain/
    entities/           Pure Dart. No external dependencies.
    repositories/       Abstract interfaces. Data layer implements these.
    value_objects/      Validated, immutable types. Throw on invalid input.
  data/
    dtos/               JSON transfer objects. Freezed + JsonSerializable.
    mappers/            DTO <-> Entity conversion. Pure functions.
    datasources/        Remote (API) + Local (cache) implementations.
    repositories/       Concrete implementations of domain interfaces.
  presentation/
    providers/          AsyncNotifier / Notifier / Controller. No UI logic.
    views/              Screen widgets. Read state. Delegate actions.
    widgets/            Feature-specific composable widgets.

## Strict Layer Contracts
- Domain layer imports: NOTHING from Flutter, HTTP, or data layer.
- Data layer imports: domain interfaces only. Never presentation.
- Presentation imports: domain entities via providers. Never data DTOs directly.
- Cross-feature: use shared/domain/ value objects exclusively.
- Each feature folder must be independently compilable and testable.

## Naming Conventions
- Entities: UserEntity, OrderEntity (never just User in domain)
- DTOs: UserDto, CreateOrderDto
- Repositories: UserRepository (interface), UserRepositoryImpl (concrete)
- Providers: authNotifierProvider, userListProvider
- Views: AuthLoginView, UserProfileView (not Screen — use View)
- Notifiers: AuthNotifier, UserListNotifier
