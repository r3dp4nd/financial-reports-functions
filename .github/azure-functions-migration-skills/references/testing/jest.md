# Testing con Jest

## Propósito

Establecer una configuración y estrategia mínima de tests para proteger comportamiento durante la migración sin perseguir cobertura artificial.

## Regla de calidad

Los tests deben derivarse del comportamiento y riesgo observados.

Prioridad general:

```text
reglas de dominio
      ↓
casos de uso / aplicación
      ↓
adapters con lógica propia
      ↓
integraciones cuando sean necesarias y viables
```

No conviertas esta jerarquía en una cuota fija por capa.

## Configuración mínima

Cuando Jest no exista:

- agrega `jest` como `devDependency`;
- agrega el soporte TypeScript mínimo compatible con el proyecto;
- define un script `test`;
- define un script de coverage cuando forme parte del objetivo;
- excluye outputs compilados y archivos sin lógica ejecutable de la cobertura.

Para TypeScript, Jest documenta varias opciones de transformación. No introduzcas Babel y `ts-jest` simultáneamente sin necesidad. Conserva el mecanismo ya existente si funciona y separa el type-check de la mera transpilation cuando sea relevante.

## Type checking

Un test que transpila TypeScript no sustituye `tsc`.

Mantén build/type-check como validación independiente cuando el proyecto lo use.

## Coverage

Jest puede producir LCOV y lo incluye entre sus coverage reporters soportados.

Configura `collectCoverageFrom` para representar código productivo relevante, no únicamente archivos alcanzados por tests; así los archivos sin cobertura no desaparecen silenciosamente del reporte.

No fijes un threshold arbitrario desde el toolkit. Si la organización tiene un quality gate, respétalo; si no existe, usa la cobertura como señal para localizar riesgos, no como objetivo porcentual aislado.

## Exclusiones por convención

No excluyas implementaciones por sufijos ambiguos como `*.repository.ts`, `*.publisher.ts`, `*.generator.ts` o `*.storage.ts`, porque en `infrastructure/` esos nombres suelen representar comportamiento real.

Prefiere excluir lo que el naming y la estructura declaran como contrato:

```text
src/functions/**/*.function.ts
**/*.spec.ts
**/*.types.ts
**/*.command.ts
**/*.query.ts
**/*.result.ts
**/*.integration-event.ts
**/*.http.types.ts
src/**/domain/ports/**/*.ts
src/**/application/ports/**/*.ts
```

Incluye comportamiento por defecto:

```text
src/**/handler.ts
src/**/application/use-cases/**/*.ts
src/**/domain/models/**/*.ts
src/**/infrastructure/**/*.ts
src/shared/infrastructure/**/*.ts
```

Si un archivo contiene solo interfaces o tipos pero no cumple una convención excluible, no agregues una excepción puntual salvo transición inevitable. Corrige el naming o la ubicación durante la migración de esa capability.

## Tests de caracterización

Antes de un refactor de riesgo, prioriza escenarios observados que documenten:

- entrada válida;
- validaciones;
- decisiones de negocio;
- errores relevantes;
- side effects;
- comportamiento vacío/límite cuando aplique.

No inventes un comportamiento deseado si el legacy demuestra otro; registra la discrepancia para decisión humana.

## Tests después del desacoplamiento

En arquitectura objetivo:

- prueba casos de uso contra ports/doubles simples;
- evita mockear detalles internos;
- prueba el adapter Azure solo cuando el mapping, status, headers, metadata o binding merezcan evidencia propia.

Programming Model v4 permite construir `InvocationContext` fuera del host para pruebas del adapter, pero no es obligatorio usarlo para lógica de aplicación.

## Dobles de prueba

Prefiere fakes/stubs pequeños orientados al contrato. Usa mocks para interacciones relevantes, no para reproducir toda la implementación de un SDK Azure.

## Fuentes oficiales

- Jest Getting Started / TypeScript: https://jestjs.io/docs/getting-started
- Jest configuration / coverage: https://jestjs.io/docs/configuration
- Azure Functions Programming Model v4 migration: https://learn.microsoft.com/en-us/azure/azure-functions/functions-node-upgrade-v4
