# Eval: migrate-shared-component

## Escenario

Repositorio con varios consumidores de un cliente, repositorio, mapper, servicio, configuración o wrapper de SDK compartido.

## Prompt

```text
Usa migrate-shared-component para migrar este componente compartido identificando consumidores, contrato, settings y verificaciones.
```

## Debe cargar

- `principles/copilot-rules.md`
- `references/dependencies/dependency-strategy.md` cuando cambie SDK/dependencia
- `references/architecture/function-architecture.md`
- `references/configuration/environment-and-bindings.md`
- `references/planning/migration-scope-and-debt.md`
- `references/evidence/migration-artifacts.md`

## Debe producir

`.migration/shared-components/<component-name>.md` o salida equivalente con:

- consumidores;
- contrato preservado;
- settings compartidos, solo por nombre;
- impacto por consumidor;
- validaciones realizadas;
- deuda o riesgos que no deban resolverse dentro del cambio compartido.

## No debe

- cambiar contrato público sin evidencia y aprobación;
- migrar consumidores no relacionados;
- leer secretos;
- crear una abstracción compartida nueva si no existe uso productivo inmediato;
- ocultar impacto transversal dentro de una Function individual.
