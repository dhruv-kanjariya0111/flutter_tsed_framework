# scaffold-feature

Scaffolds a complete fullstack feature (Flutter + Ts.ED).

## Steps
1. Run /api-design <feature> — update shared/openapi.yaml
2. Create Flutter feature folder structure:
   frontend/lib/src/features/<feature>/
     domain/entities/, repositories/, value_objects/
     data/dtos/, mappers/, datasources/, repositories/
     presentation/providers/, views/, widgets/
3. Create Flutter test mirror:
   frontend/test/unit/features/<feature>/
   frontend/test/widget/features/<feature>/
4. Create Ts.ED module:
   backend/src/modules/<feature>/
     dto/, entities/, <feature>.service.ts, <feature>.controller.ts, <feature>.module.ts
5. Create backend test mirror:
   backend/test/unit/<feature>/
6. Run: cd frontend && dart run build_runner build --delete-conflicting-outputs
7. Run: cd frontend && flutter analyze --fatal-infos
8. Run: cd backend && npm run lint

## Output
Scaffold complete. Files created: [list]
Next: run /tdd <feature> to implement with TDD.
