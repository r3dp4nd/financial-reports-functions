---
name: verify-function-app
description: Verifica una Azure Function App después de completar todas las migraciones aplicables. Úsalo para comparar BEFORE, PLAN, EXECUTION y AFTER, ejecutar gates deterministas finales y emitir VERIFIED, VERIFIED_WITH_DEBT, BLOCKED o REQUIRES_REVIEW sin corregir código.
---

# Verify Function App

## Objetivo

Determinar si la Function App alcanzó el target aprobado y preservó los contratos observables requeridos.

## Identidad y audiencia

Al redactar `verification.md`, actuar como un **QA/arquitecto senior cerrando el ciclo de migración**: la
audiencia no necesita otra lista de checkmarks verde/rojo, necesita saber si el sistema realmente está listo para
producción y por qué. Cada gate en rojo o en deuda debe interpretarse en contexto — no todos los fallos tienen el
mismo peso, y el documento debe decirlo explícitamente antes de que el lector tenga que inferirlo de una tabla
plana de 17 filas.

El documento cierra con una narrativa de conjunto: no basta con agregar los gates individuales, hay que explicar
qué significa el resultado combinado (¿está listo, tiene deuda aceptable, o hay algo que realmente bloquea?). Cada
sección mayor abre con 1-3 frases que dicen qué es y por qué importa antes de la tabla.

## Políticas

Aplicar:

- `../_shared/evidence-policy.md`
- `../_shared/security-policy.md`
- `../_shared/status-policy.md`
- `../_shared/architecture-policy.md`
- `../_shared/references/artifact-layout.md`
- `../_shared/references/validation-tooling.md`
- `../_shared/references/graphify-usage.md` solo si se necesita confirmar residuales legacy o relaciones no cubiertas por los artifacts de ejecución ya emitidos

## Entradas

Consumir artifacts aplicables de discovery, assessment, analyses, planning y execution.

No exigir artifacts correctamente `NOT_APPLICABLE`.

## Principio

```text
BEFORE
→ PLAN
→ EXECUTION
→ AFTER
```

Verification no corrige ni redefine targets.

## Workflow

1. Confirmar effective scope y target desde el plan/baseline.
2. Verificar cumplimiento de Action IDs requeridos.
3. Comprobar dependencias, Node.js y Runtime.
4. Instalar dependencias en entorno seguro cuando corresponda.
5. Ejecutar typecheck si aplica.
6. Ejecutar **build global final** después de completar todas las Functions.
7. Validar Functions, Programming Model y Durable.
8. Validar estructura requerida y shared resources.
9. Ejecutar `func start` local solo si es seguro/viable y no requiere secretos reales.
10. Comparar contratos, efectos, topology y comportamiento preservado contra BEFORE/PLAN. Leer explícitamente la
    sección "Contrato a preservar" (Entrada exacta/Salida exacta/Efectos secundarios/Errores observables/Invariantes)
    de cada `analysis.json|md` del effective scope y compararla campo por campo contra AFTER, sin reinterpretar.
11. Comparar inventario/estructura AFTER contra BEFORE/PLAN, reusando las relaciones ya persistidas en
    `analysis.json`, `programming-model-v4.json` y `durable-v4.json` para detectar residuales legacy; consultar
    Graphify únicamente cuando esa evidencia de ejecución no alcance para confirmar un residual sospechado.
12. Agregar gates y emitir status final.

Cargar:

- `references/verification-gates.md`
- `references/artifacts.md`

## Salidas

- `.migration/50-verification/verification.json`
- `.migration/50-verification/verification.md`

## Cierre

Aplicar la agregación de `../_shared/status-policy.md`.

## No hacer

- modificar código/configuración para corregir fallos;
- generar tests;
- cambiar tests existentes para hacerlos pasar;
- seleccionar nuevas versiones;
- crear Action IDs;
- desplegar;
- aceptar optimizaciones funcionales no aprobadas como mejora.
