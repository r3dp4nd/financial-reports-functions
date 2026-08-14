# Manual Execution Support

Usar esta referencia para skills de apoyo que ayudan a devs humanos a ejecutar, revisar o validar acciones del plan sin convertir a la IA en ejecutor principal.

## Principios

- Consumir Action IDs desde `.migration/30-plan/`.
- No crear ni renombrar Action IDs.
- No modificar el plan para coincidir con la ejecución.
- No ampliar scope por conveniencia.
- Respetar `preserveBehavior` y `prohibitedChanges`.
- No aceptar optimizaciones funcionales no aprobadas.
- No leer secretos.
- Escribir artifacts solo en `.migration/40-execution/`.

## Modos

- `explain`: explicar qué hacer, sin artifacts obligatorios.
- `task-pack`: empaquetar trabajo para dev humano.
- `suggestion`: proponer diff o cambio sin aplicarlo.
- `checks`: ejecutar validaciones aprobadas.
- `review`: revisar cambios humanos contra plan.

## Entradas comunes

- Action ID o scope;
- `.migration/30-plan/migration-plan.json`;
- plan local Function/slice cuando aplique;
- analysis/BEFORE cuando el Action ID lo referencia;
- execution artifacts previos cuando se revisa o valida.

## Reglas de salida

Las salidas deben ser accionables:

- qué hacer;
- qué no tocar;
- archivos probables;
- criterios de done;
- comandos/checks;
- riesgos;
- preguntas para humano.

## Prohibido

- aplicar patches desde skills de explicación/sugerencia;
- instalar tooling;
- generar tests salvo desde `support/generate-tests-for-function-slice`;
- ejecutar comandos que requieran secretos;
- marcar un Action ID como completo sin evidencia.
