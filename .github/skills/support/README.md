# Support Skills

Skills de apoyo para acelerar ejecucion manual o semi-asistida de una migracion/refactor. No reemplazan el flujo principal ni el plan; consumen Action IDs, evidencia y criterios ya definidos.

## Uso rapido

1. Parte desde `.migration/30-plan/migration-plan.json`.
2. Elige uno o varios Action IDs.
3. Usa el support skill que corresponda al momento del trabajo.
4. Conserva artifacts en `.migration/40-execution/` cuando el skill los genere.
5. Cierra con checks/review antes de marcar una accion como lista.

## Skills disponibles

| Skill | Para que sirve | Modifica codigo |
|---|---|---|
| `explain-migration-action` | Explica un Action ID para que un dev entienda objetivo, alcance, riesgos y checks. | No |
| `generate-dev-task-pack` | Convierte Action IDs en un paquete de trabajo Markdown para ejecucion humana. | No |
| `suggest-code-change` | Propone cambios concretos o diff Markdown sin aplicarlos. | No |
| `run-migration-checks` | Ejecuta validaciones aprobadas o seguras y registra resultados. | No |
| `review-manual-migration` | Revisa cambios humanos contra plan, diff y checks. | No |
| `scaffold-function-capability` | Crea scaffold minimo de capability + Azure Function cuando se pide explicitamente o existe Action ID aprobado. | Si |
| `generate-tests-for-function-slice` | Genera o propone tests para una ruta/slice testeable cuando se pide explicitamente o existe Action ID aprobado. | Si, solo specs |

## Secuencias recomendadas

Para trabajo manual:

```text
explain-migration-action
generate-dev-task-pack
suggest-code-change
run-migration-checks
review-manual-migration
```

Para crear una nueva capability o Function:

```text
scaffold-function-capability
generate-tests-for-function-slice
run-migration-checks
review-manual-migration
```

Para mejorar testabilidad sin migrar codigo productivo:

```text
generate-tests-for-function-slice modo plan-only
generate-tests-for-function-slice modo generate
run-migration-checks
review-manual-migration
```

## Reglas

- No ampliar scope fuera del Action ID o solicitud explicita.
- No inventar logica de negocio.
- No leer secretos ni depender de servicios externos.
- Preferir artifacts Markdown para humanos y JSON para agentes.
- Usar `suggest-code-change` cuando el dev quiere guia sin que la IA aplique cambios.
- Usar `review-manual-migration` para detectar scope creep antes de cerrar una accion.
