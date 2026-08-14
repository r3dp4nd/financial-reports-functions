# Validation Tooling

Usar esta referencia para detectar, evaluar o planificar tooling de validación. No copiar configuración por plantilla; adaptar solo cuando el plan lo apruebe y el repo lo necesite.

## Objetivo

La migración debe dejar evidencia determinista. El tooling deseado aporta:

- typecheck reproducible;
- build prod separado de build dev/local;
- tests existentes ejecutables cuando existan;
- coverage y reportes consumibles por CI/Sonar cuando el repo ya usa esa práctica o el plan la aprueba;
- exclusiones coherentes para composition roots, contratos pasivos y artifacts generados.

No generar tests por defecto ni instalar Jest/Sonar solo porque falten.

## package.json scripts

Patrón recomendado cuando se use TypeScript:

```json
{
  "scripts": {
    "clean": "rimraf dist",
    "typecheck": "tsc --noEmit -p tsconfig.prod.json",
    "build": "npm run build:prod",
    "build:dev": "npm run clean && tsc -p tsconfig.json",
    "build:prod": "npm run clean && tsc -p tsconfig.prod.json",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --runInBand",
    "start": "npm run build:dev && func start"
  }
}
```

Usar scripts existentes si ya cumplen el objetivo. No renombrar por uniformidad si no aporta.

## tsconfig

Separar intención cuando aplique:

- `tsconfig.json`: desarrollo/build base;
- `tsconfig.prod.json`: build/typecheck productivo sin tests ni infra local;
- `tsconfig.spec.json`: type context para specs.

Señales útiles:

- `strict: true`;
- `noEmitOnError: true`;
- `noImplicitReturns: true`;
- `noFallthroughCasesInSwitch: true`;
- `rootDir: "src"` y `outDir: "dist"` cuando el repo compile desde `src`;
- excluir `node_modules`, `dist`, `coverage`, `test-results` y specs en prod.

No endurecer flags TypeScript como parte de migración técnica si eso dispara refactor funcional amplio; planificarlo como deuda o lane separado.

## Jest

Usar Jest/ts-jest cuando el repo ya lo usa o el plan aprueba agregarlo como tooling de validación.

Patrones útiles:

- `testEnvironment: "node"`;
- `testMatch: ["**/*.spec.ts"]`;
- `ts-jest` usando `tsconfig.spec.json`;
- `clearMocks` y `restoreMocks`;
- `coverageProvider: "v8"`;
- coverage output en `coverage/lcov.info`;
- reporter JUnit cuando CI/Sonar lo consume.

Coverage debe excluir código sin comportamiento runtime cuando corresponda:

- composition roots `src/functions/**/*.function.ts`;
- specs/tests;
- tipos y contratos pasivos: `*.types.ts`, `*.command.ts`, `*.query.ts`, `*.result.ts`;
- declarations de boundaries: `*.repository.ts`, `*.publisher.ts`, `*.generator.ts`, `*.storage.ts`;
- artifacts generados, `dist`, `coverage`, `test-results`.

Thresholds solo deben agregarse o elevarse con evidencia de suite existente y aprobación del plan.

## Sonar

Usar `sonar-project.properties` cuando el repo o CI ya use Sonar/SonarCloud, o cuando una acción global aprobada lo agregue.

Patrones útiles:

- `sonar.sources=src`;
- `sonar.tests=src`;
- `sonar.test.inclusions` para `*.spec.ts`;
- `sonar.javascript.lcov.reportPaths=coverage/lcov.info`;
- exclusiones alineadas con Jest coverage exclusions.

No configurar claves, organizaciones, tokens o service connections dentro del repo si son secretos o dependen de la plataforma CI.

## Discovery

Registrar presencia y comandos disponibles:

- package scripts: `typecheck`, `build`, `test`, `test:coverage`, `test:ci`, `start`;
- `jest.config.*`;
- `tsconfig*.json`;
- `sonar-project.properties`;
- CI templates que ejecutan Node, install, typecheck, test/coverage o Sonar, sin leer secretos.

## Assessment

Clasificar capacidad de validación:

- `READY`: install/typecheck/build y tests existentes claros;
- `PARTIAL`: algunos checks faltan o son ambiguos;
- `REVIEW_REQUIRED`: Sonar/CI/secrets o tooling no verificable localmente;
- `MISSING`: no hay comandos deterministas relevantes.

Ausencia de tests no bloquea por sí sola. Falta de typecheck/build sí puede bloquear planning/verification si impide validar la migración.

## Planning

Crear acciones globales de tooling solo cuando:

- son necesarias para verificar target;
- el repo ya tiene tooling parcialmente configurado y falta alineación mínima;
- el plan requiere evidencia CI/Sonar.

No crear acciones para "mejorar calidad" en abstracto. Separar `VALIDATION` de `REFACTOR_TESTABILITY`.

## Verification

Ejecutar el menor conjunto determinista aprobado:

1. install (`npm ci`) cuando sea seguro;
2. typecheck;
3. build final global;
4. tests existentes/coverage si el plan lo exige o el repo ya los usa;
5. Sonar solo cuando el entorno/CI lo permite y no requiere secretos locales.
