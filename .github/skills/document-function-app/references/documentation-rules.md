# Reglas de documentación

Este skill produce un documento de referencia estándar de una Function App completa, no un artifact de migración.
Estas reglas definen el estándar de calidad y qué no puede faltar, para que aplique igual a un repo legacy con mala
estructura que a uno moderno bien organizado.

## Principio: documentar la realidad, no la aspiración

Igual que `discover-function-app`, este documento es un espejo del código, no una idealización. Un repositorio
legacy con carpetas planas y sin separación de responsabilidades no es un "fallo" del documento — es evidencia que
debe capturarse con el mismo nivel de detalle que un repositorio bien organizado. La ausencia de estructura, tests o
boundaries es tan valiosa de documentar como su presencia.

## Estándar de contenido para el documento de repositorio (`repository.md`)

Basado en buenas prácticas de documentación de repos de servicios/Function Apps (README profesional + arquitectura +
runbook), adaptado al contexto Azure Functions:

1. **Visión general**: qué hace la Function App, en 2-4 frases sin jerga técnica, derivado únicamente de evidencia
   observable (nombres de Functions, triggers, capabilities) — nunca inventar propósito de negocio no respaldado.
2. **Plataforma**: Node.js, Azure Functions Runtime, Programming Model, Durable Functions, con estado observado y
   requisito mínimo oficial citado (`_shared/references/official-sources.md`) cuando el repo sea legacy.
3. **Arquitectura observable**: organización de carpetas, adapters, capas (o su ausencia), diagrama Mermaid.
4. **Inventario de Functions**: tabla con todas las Functions, trigger, capability, Programming Model, rol Durable,
   con el mismo nivel de detalle para legacy (`function.json`) y moderno (`app.X(...)`).
5. **Dependencias**: tabla de paquetes con `usageDetected`, y una nota explícita de cuáles son candidatas a limpieza
   (`usageDetected: false`).
6. **Configuración**: nombres de claves, nunca valores, con `sources` (dónde se leen).
7. **Recursos compartidos**: candidatos con consumidores y ownership (o su ausencia).
8. **Complejidad y deuda técnica** (sección obligatoria, ver más abajo): resumen ejecutivo + detalle por Function.
9. **Cómo ejecutar/desplegar**: solo comandos ya observables de forma segura (`package.json.scripts`), nunca
   credenciales ni pasos que requieran secretos.
10. **Riesgos y unknowns**: explícitos, sin ocultar incertidumbre.

## Estándar de contenido para el documento por Function (`functions/<FunctionName>.md`)

Reusar la estructura de `_shared/templates/function-current-state.template.md` (fidelidad al código, fragmento de
código relevante citado literal) como base, añadiendo:

- clasificación de complejidad de esta Function (ver rubric), con la combinación de señales que la produjo;
- si ya existe `analysis.json` para esta Function/slice, citar su `criticality`/`testability`/gaps en vez de
  re-derivarlos desde cero.

**Persistencia incremental obligatoria**: escribir este archivo tan pronto el análisis de esa Function/slice esté
completo, antes de pasar a la siguiente Function del inventario (ver `SKILL.md`, sección Workflow). No acumular el
análisis de varias Functions en memoria esperando escribir todo junto al final — eso arriesga perder trabajo ya
hecho si la ejecución se interrumpe, y no aporta ningún beneficio frente a escribir cada archivo apenas está listo.
`documentation/repository.md` se escribe al final, después de que todos los `documentation/functions/*.md`
relevantes ya existan en disco.

## Sección obligatoria: resumen de complejidad y deuda técnica

Esta es la sección que distingue este documento de un README genérico. Debe incluir:

1. **Resumen ejecutivo** (3-6 líneas): cuántas Functions son legacy vs. modernas, cuántas tienen criticidad `HIGH`,
   cuántos code smells/god files se detectaron, y la etiqueta agregada de complejidad del repo completo (BAJA/MEDIA/ALTA
   según `_shared/references/complexity-debt-rubric.md`).
2. **Tabla de complejidad por Function/slice**: Function | Criticidad | Testabilidad | Code smells detectados | Gaps
   de arquitectura | Etiqueta agregada.
3. **God files**: tabla de `largeFiles` de `inventory.json`, sin interpretar automáticamente como "debe refactorizarse".
4. **Deuda técnica priorizada**: lista de hallazgos ordenados por impacto (no por orden de detección), cada uno con
   evidencia y `affected scope`.
5. **Nota de alcance**: esta sección informa, no planifica. No incluir Action IDs, orden de ejecución ni executor
   sugerido — eso es responsabilidad de `plan-function-migration` si en el futuro se decide actuar sobre estos
   hallazgos.

## Nivel de detalle: igual para legacy y moderno

No dar menos detalle a una Function legacy asumiendo que "va a migrar pronto", ni más detalle a una moderna asumiendo
que "ya está bien". El nivel de detalle depende de la complejidad observada (criticidad, tamaño, acoplamiento), no
del Programming Model.

## Qué no hacer

- no generar Action IDs, plan de migración ni checklist mecánico v3→v4 (eso pertenece a `analyze-function`/
  `plan-function-migration`; este skill solo documenta, no planifica cambios técnicos de plataforma);
- no asumir intención de migración; el documento debe ser útil incluso si nunca se migra nada;
- no omitir Functions difíciles de documentar (poca estructura, sin tests) — documentar la dificultad misma como
  hallazgo;
- no inventar un score numérico de complejidad sin trazar la combinación de señales que lo produjo.
