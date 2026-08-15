# Tooling TypeScript, build y scripts npm

## Propósito

Definir una base genérica para preparar TypeScript, build, Jest, coverage y scripts npm en una Azure Function App Node.js/TypeScript.

Esta referencia sustenta `prepare-function-app` y debe aplicarse alineada con la estructura objetivo descrita en `../../../references/architecture/function-architecture.md`.

## Principio

El tooling debe apoyar la arquitectura, no esconder sus inconsistencias.

```text
estructura objetivo
        ↓
naming de contratos y comportamiento
        ↓
tsconfig / Jest / Sonar / scripts
        ↓
validación reproducible
```

No hardcodees nombres de proyecto, capabilities, Functions, queues, rutas, recursos ni carpetas propias de un repositorio ejemplo. Usa convenciones y placeholders.

## Archivos esperados

### `tsconfig.json`

Configuración base para desarrollo y compilación local.

Debe:

- compilar desde `src`;
- emitir hacia `dist`;
- usar `strict`;
- evitar emitir cuando hay errores;
- excluir outputs y artefactos generados;
- excluir specs si el build base produce artefactos ejecutables.

Base conceptual:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "moduleResolution": "node",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noEmitOnError": true
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "coverage",
    "test-results",
    "**/*.spec.ts"
  ]
}
```

Adapta `target`, `module` y opciones de resolución si el repositorio ya usa otra estrategia compatible.

### `tsconfig.prod.json`

Configuración para build productivo.

Debe:

- extender `tsconfig.json`;
- excluir tests, specs y tooling local;
- evitar sourcemaps si el objetivo de producción lo requiere;
- no emitir declaraciones salvo que el proyecto las necesite.

Base conceptual:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": false,
    "inlineSourceMap": false,
    "inlineSources": false,
    "removeComments": true,
    "noEmitOnError": true,
    "declaration": false,
    "incremental": false
  },
  "exclude": [
    "node_modules",
    "dist",
    "coverage",
    "test-results",
    "**/*.spec.ts",
    "**/*.test.ts",
    "local-infra/**"
  ]
}
```

### `tsconfig.spec.json`

Configuración para Jest/ts-jest.

Debe:

- extender `tsconfig.json`;
- incluir specs;
- activar tipos `node` y `jest`;
- no emitir archivos.

Base conceptual:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true,
    "types": [
      "node",
      "jest"
    ]
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "coverage",
    "test-results"
  ]
}
```

## Scripts npm

Agrega o normaliza scripts solo después de revisar los existentes.

Base recomendada:

```json
{
  "scripts": {
    "clean": "rimraf dist",
    "typecheck": "tsc --noEmit -p tsconfig.prod.json",
    "build": "npm run build:prod",
    "build:dev": "npm run clean && tsc -p tsconfig.json",
    "build:prod": "npm run clean && tsc -p tsconfig.prod.json",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --runInBand",
    "start": "npm run build:dev && func start"
  }
}
```

No sobrescribas scripts corporativos, pipelines locales o comandos con semántica distinta sin registrar la decisión.

## DevDependencies sugeridas

Cuando el repositorio necesite preparar TypeScript, Jest, coverage y reporter JUnit, usa esta base probada como sugerencia inicial:

```json
{
  "devDependencies": {
    "@types/jest": "^29.5.14",
    "@types/node": "^24.0.0",
    "jest": "^29.7.0",
    "jest-junit": "^16.0.0",
    "rimraf": "^6.1.3",
    "ts-jest": "^29.4.0",
    "typescript": "^5.9.0"
  }
}
```

Aplica esta lista solo si el repo escaneado necesita esas capacidades. Antes de modificar `package.json`:

- conserva versiones existentes cuando ya sean compatibles y estén justificadas por el proyecto;
- revisa compatibilidad entre `jest`, `ts-jest`, TypeScript y Node.js objetivo;
- no agregues `jest-junit` si el pipeline no consume reporte JUnit;
- no agregues `rimraf` si ya existe una alternativa equivalente usada por scripts vigentes;
- actualiza lockfile una sola vez y registra la razón.

## Relación con Jest

Jest debe usar `tsconfig.spec.json` cuando se use `ts-jest`.

Coverage debe seguir la estructura objetivo:

- exclude composition roots `src/functions/**/*.function.ts`;
- exclude contratos por sufijo (`*.types.ts`, `*.command.ts`, `*.query.ts`, `*.result.ts`, `*.integration-event.ts`, `*.http.types.ts`);
- exclude puertos por ubicación (`domain/ports`, `application/ports`);
- include comportamiento (`handler.ts`, `application/use-cases`, `domain/models`, `infrastructure`).

Consulta `../../../references/testing/jest.md` para detalles.

## Relación con Sonar

Sonar debe consumir el LCOV generado por Jest, normalmente:

```text
coverage/lcov.info
```

No dupliques una política distinta de coverage en Sonar. Consulta `../../../references/quality/sonar.md`.

## Validación mínima

Después de preparar tooling, ejecuta según disponibilidad:

```text
npm run typecheck
npm run build:prod
npm run test:ci
```

Comprueba además:

- `coverage/lcov.info` existe cuando coverage forma parte del objetivo;
- los artefactos de test como JUnit existen si el proyecto los configura;
- `package.json.main` apunta al output real que registra Functions v4;
- no se generaron cambios no relacionados en lockfile.

## Evidencia

Registra en `.migration/preparation.md`:

- archivos creados o actualizados;
- scripts agregados o preservados;
- convenciones de coverage aplicadas;
- validaciones ejecutadas;
- cambios pospuestos y razón.
