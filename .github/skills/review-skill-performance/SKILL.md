---
name: review-skill-performance
description: Evalúa ejecuciones reales de los skills y sus lecciones aprendidas para detectar fallos recurrentes, gaps, reglas demasiado amplias, contexto innecesario y oportunidades de simplificación, generando un plan de mejora sin modificar automáticamente los skills.
---

# Review Skill Performance

## Objetivo

Evaluar la efectividad de uno o varios skills utilizando evidencia proveniente de ejecuciones reales.

El análisis debe permitir identificar:

- qué funcionó;
- qué falló;
- casos no contemplados;
- falsos positivos;
- falsos negativos;
- decisiones ambiguas;
- reglas demasiado amplias;
- reglas demasiado específicas;
- contexto innecesario;
- pasos redundantes;
- oportunidades de simplificación;
- oportunidades razonables de automatización;
- gaps en evals;
- posibles mejoras del skill.

Este capability propone mejoras.

No modifica automáticamente los skills.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/lessons-policy.md`

## Ámbito

Este capability forma parte del ciclo de mejora del toolkit.

No pertenece al flujo operativo normal:

`discover → assess → analyze → plan → prepare → migrate → verify`

No debe bloquear una migración ya verificada únicamente porque exista una oportunidad de mejorar un skill.

## Entradas

Puede recibir evidencia de una o varias ejecuciones.

Priorizar:

- `.migration/lessons/**`;
- artefactos JSON producidos por los skills;
- estados finales;
- blockers;
- `REQUIRES_REVIEW`;
- warnings;
- inconsistencias;
- evals actuales del skill evaluado;
- `SKILL.md` actual;
- scripts propios del skill cuando sean relevantes.

No cargar todos los artefactos completos por defecto.

Usar progressive disclosure.

## Selección de evidencia

Comenzar por:

1. lessons;
2. estados de ejecución;
3. failures o reviews;
4. evidencia directamente relacionada con el hallazgo.

Leer artefactos adicionales únicamente cuando sean necesarios para confirmar una conclusión.

No reconstruir migraciones completas.

## Unidad de análisis

La unidad principal es un skill.

Ejemplo:

`discover-function-app`

Puede analizarse una ejecución individual o varias ejecuciones del mismo skill.

Cuando existan varias ejecuciones, distinguir:

- caso aislado;
- patrón recurrente;
- problema sistémico.

## Tipos de hallazgo

Clasificar cuando corresponda:

- `FALSE_POSITIVE`
- `FALSE_NEGATIVE`
- `UNHANDLED_CASE`
- `AMBIGUOUS_RULE`
- `OVERGENERALIZATION`
- `OVERCONSTRAINT`
- `REDUNDANT_WORK`
- `EXCESS_CONTEXT`
- `MISSING_EVAL`
- `SCRIPT_GAP`
- `SKILL_GAP`
- `SIMPLIFICATION`
- `AUTOMATION_CANDIDATE`

No inventar categorías nuevas sin necesidad.

## Recurrencia

No convertir automáticamente una observación individual en una regla global.

Clasificar recurrencia:

- `ISOLATED`
- `REPEATED`
- `SYSTEMIC`
- `UNKNOWN`

### ISOLATED

Aparece en una ejecución y puede depender del repositorio.

### REPEATED

Aparece en varias ejecuciones independientes.

### SYSTEMIC

La evidencia indica que el comportamiento deriva directamente del diseño actual del skill.

### UNKNOWN

No existe suficiente evidencia para determinar recurrencia.

## Impacto

Clasificar:

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

Considerar impacto sobre:

- seguridad;
- comportamiento;
- exactitud;
- bloqueo innecesario;
- cambios incorrectos;
- pérdida de Functions;
- compatibilidad;
- uso excesivo de contexto;
- mantenibilidad del toolkit.

No asignar impacto alto únicamente porque una mejora sea conveniente.

## Costo de mejora

Estimar cualitativamente:

- `LOW`
- `MEDIUM`
- `HIGH`

Considerar:

- modificación de instrucciones;
- modificación de script;
- nuevos evals;
- riesgo de romper casos existentes;
- complejidad añadida.

## Principio de mejora

Preferir:

`regla más simple que resuelve el problema`

sobre:

`más instrucciones`

Una mejora no debe aprobarse solamente porque añade cobertura.

Evaluar también si:

- aumenta complejidad;
- duplica otra regla;
- contradice una política compartida;
- agrega contexto permanente;
- puede resolverse mejor mediante un script determinista;
- corresponde realmente a otro skill.

## Detección de responsabilidad incorrecta

Identificar cuando un skill esté haciendo trabajo que pertenece a otro.

Ejemplos:

- discovery evaluando compatibilidad;
- assessment refactorizando;
- analyze modificando código;
- plan reanalizando Functions;
- verify corrigiendo fallos.

Clasificarlo como:

`SKILL_GAP`

o:

`SIMPLIFICATION`

según el caso.

## Scripts

Cuando un problema corresponda a descubrimiento determinista, evaluar primero si debe resolverse en un script propio.

Ejemplo:

varios falsos negativos al detectar registros v4.

Puede generar:

`SCRIPT_GAP`

No mover automáticamente toda lógica de IA a scripts.

Automatizar únicamente cuando el comportamiento sea suficientemente determinista y repetible.

## Evals

Comparar los hallazgos con los evals existentes.

Si un fallo real no está protegido:

registrar:

`MISSING_EVAL`

Una mejora de implementación debe incluir, cuando corresponda, un eval que reproduzca el caso antes de modificar el
skill.

## Propuestas

Cada propuesta debe indicar:

- skill afectado;
- problema;
- evidencia;
- recurrencia;
- impacto;
- cambio propuesto;
- archivos potencialmente afectados;
- eval requerido;
- costo estimado;
- riesgo de la mejora;
- prioridad.

No escribir directamente el cambio.

## Prioridad

Usar:

- `P0`
- `P1`
- `P2`
- `P3`

### P0

Problema crítico de seguridad o riesgo grave de comportamiento incorrecto.

### P1

Fallo importante y reproducible que afecta migraciones.

### P2

Mejora relevante de precisión, robustez o eficiencia.

### P3

Simplificación o mejora menor no urgente.

No utilizar prioridad alta para preferencias estilísticas.

## Recomendación

Cada propuesta debe terminar en uno de estos estados:

- `RECOMMEND`
- `MONITOR`
- `REJECT`
- `NEEDS_MORE_EVIDENCE`

### RECOMMEND

Existe evidencia suficiente para proponer modificación.

### MONITOR

El caso es válido pero todavía parece aislado.

### REJECT

La propuesta añadiría más complejidad que valor o contradice principios existentes.

### NEEDS_MORE_EVIDENCE

La evidencia no permite decidir.

## Plan de mejora

Agrupar únicamente propuestas `RECOMMEND`.

Ordenarlas considerando:

1. seguridad;
2. exactitud;
3. riesgo funcional;
4. recurrencia;
5. reducción de bloqueos;
6. simplificación;
7. eficiencia de contexto.

No agrupar automáticamente todas las observaciones en el plan.

## Ciclo de aplicación

Este capability solo genera propuestas.

El flujo posterior es:

`hallazgo`

→ `propuesta`

→ `revisión humana`

→ `modificación del skill`

→ `ejecución de evals`

→ `aceptación o rechazo`

No saltar la revisión humana.

## Cambios a políticas compartidas

Una lección local no debe modificar automáticamente:

- `evidence-policy.md`;
- `security-policy.md`;
- `lessons-policy.md`.

Proponer cambios a políticas compartidas únicamente cuando:

- el problema afecte varios skills;
- exista evidencia suficiente;
- la regla sea realmente transversal.

## Salidas

Crear:

`.skill-improvement/assessment.json`

`.skill-improvement/assessment.md`

`.skill-improvement/improvement-plan.json`

`.skill-improvement/improvement-plan.md`

No modificar:

`.github/skills/**`

durante esta ejecución.

## assessment.json

Debe contener como mínimo:

- metadata;
- ejecuciones analizadas;
- skills analizados;
- hallazgos;
- recurrencia;
- impacto;
- evidencia;
- recomendaciones;
- unknowns.

## assessment.md

Debe explicar brevemente:

- qué skills fueron evaluados;
- principales problemas encontrados;
- qué parece aislado;
- qué parece recurrente;
- qué funciona correctamente;
- qué requiere más evidencia.

No debe ser un volcado del JSON.

## improvement-plan.json

Debe incluir únicamente propuestas recomendadas.

Cada mejora debe contener:

- id;
- skill;
- priority;
- problem;
- proposedChange;
- targetFiles;
- requiredEval;
- expectedBenefit;
- risk;
- status.

El estado inicial debe ser:

`PROPOSED`

Ejemplo conceptual:

    {
      "id": "IMP-001",
      "skill": "discover-function-app",
      "priority": "P1",
      "problem": "El script no detecta múltiples registros v4 del mismo tipo dentro de un archivo.",
      "proposedChange": "Ajustar la detección para recorrer todas las coincidencias.",
      "targetFiles": [
        ".github/skills/discover-function-app/scripts/inventory.js",
        ".github/skills/discover-function-app/scripts/inventory.test.js"
      ],
      "requiredEval": "Agregar caso con dos app.http en el mismo archivo.",
      "status": "PROPOSED"
    }

## improvement-plan.md

Debe presentar al developer:

- mejoras propuestas;
- prioridad;
- evidencia;
- beneficio esperado;
- riesgo;
- eval requerido;
- decisión pendiente.

Debe permitir aprobar o rechazar cada mejora de forma independiente.

## Sin hallazgos relevantes

Una ejecución válida puede concluir que no se requieren cambios.

En ese caso:

`improvement-plan.json`

debe contener:

`improvements = []`

No inventar mejoras.

## Lecciones del reviewer

Este capability también puede producir lecciones sobre su propia capacidad de análisis.

Crear:

`.skill-improvement/lessons/review-skill-performance.json`

`.skill-improvement/lessons/review-skill-performance.md`

Aplicar:

`../_shared/lessons-policy.md`

El reviewer tampoco se auto-modifica.

## Criterio de cierre

El capability termina cuando:

- las ejecuciones seleccionadas fueron identificadas;
- las lessons fueron consumidas primero;
- se leyó únicamente evidencia adicional necesaria;
- los hallazgos fueron clasificados;
- se distinguieron casos aislados de recurrentes;
- impacto y costo fueron evaluados;
- los evals existentes fueron considerados;
- las propuestas recomendadas fueron separadas de observaciones débiles;
- no se modificaron skills;
- se generaron assessment;
- se generó improvement plan;
- se generaron lessons del reviewer.

## Fuera de alcance

Este capability no debe:

- modificar `SKILL.md`;
- modificar scripts;
- modificar evals;
- modificar políticas;
- ejecutar migraciones;
- corregir repositorios objetivo;
- convertir cada lección en una regla;
- aprobar automáticamente sus propias propuestas;
- introducir optimizaciones sin evidencia.

El siguiente paso requiere revisión humana de:

`.skill-improvement/improvement-plan.md`
