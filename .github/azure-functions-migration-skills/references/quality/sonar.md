# Sonar y cobertura JavaScript/TypeScript

## Propósito

Integrar Sonar como consumidor de evidencia de calidad sin convertirlo en el conductor del diseño o de los tests.

## Separación de responsabilidades

Jest ejecuta tests y genera coverage.

Sonar analiza el código e importa el reporte de coverage.

No instales un scanner dentro del proyecto solo porque Sonar forme parte del objetivo. La organización puede ejecutar el scanner desde CI/CD o tooling corporativo.

## LCOV

Sonar para JavaScript/TypeScript consume reportes LCOV. Con Jest, ejecuta coverage antes del análisis Sonar y asegúrate de que exista el archivo esperado, normalmente bajo `coverage/lcov.info` si la configuración conserva esa ruta.

Cuando la ruta sea distinta, configura el parámetro Sonar correspondiente en lugar de copiar el archivo artificialmente.

## Principios

- coverage no equivale a calidad;
- no escribas tests triviales para aumentar el porcentaje;
- no excluyas código productivo solo para satisfacer el gate;
- justifica exclusiones técnicas reales;
- evita duplicar configuración si el repositorio ya la gestiona desde CI/CD.
- mantén las exclusiones de coverage alineadas con Jest y con la convención arquitectónica.

## Exclusiones recomendadas

Cuando el proyecto use la estructura objetivo de capabilities, Sonar debe importar el LCOV de Jest y excluir las mismas categorías no testeables:

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

No excluyas `infrastructure/**/*.repository.ts`, `infrastructure/**/*.publisher.ts`, `infrastructure/**/*.generator.ts` ni `infrastructure/**/*.storage.ts`: esas implementaciones deben quedar visibles para coverage.

## Preparación

`prepare-function-app` puede:

- asegurar que Jest produzca LCOV;
- mantener scripts de test/coverage consistentes;
- agregar o ajustar configuración Sonar del repositorio solo si realmente se versiona allí;
- registrar qué parte debe resolverse en CI/CD sin leer pipelines excluidos.

## Verificación

`verify-function-app` debe comprobar, cuando Sonar forma parte del alcance:

- tests exitosos;
- LCOV generado;
- ruta coherente con configuración Sonar disponible;
- ausencia de exclusiones nuevas no justificadas;
- no declarar que el Quality Gate pasó si el scanner/servidor no fue ejecutado.

## Fuente oficial

- Sonar JavaScript/TypeScript test coverage: https://docs.sonarsource.com/sonarqube-server/analyzing-source-code/test-coverage/javascript-typescript-test-coverage
- SonarQube Cloud JavaScript/TypeScript test coverage: https://docs.sonarsource.com/sonarqube-cloud/analyzing-source-code/test-coverage/javascript-typescript-test-coverage
- Jest coverage configuration: https://jestjs.io/docs/configuration
