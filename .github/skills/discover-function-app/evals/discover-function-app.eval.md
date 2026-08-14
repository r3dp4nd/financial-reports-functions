# Evals — Discover Function App

## Objetivo

Validar discovery seguro, determinista y suficientemente rico como punto de partida de migración, sin convertirse en análisis profundo.

## Casos

### 1. V3 observable
Entrada: `function.json` válido.
Esperado: Programming Model `V3`, evidencia confirmada cuando la señal sea suficiente.

### 2. V4 observable
Entrada: registration `app.http(...)`/equivalente.
Esperado: `V4` confirmado.

### 3. Modelo mixto
Entrada: artifacts v3 y registrations v4 coexistentes.
Esperado: `MIXED`; no escoger silenciosamente un modelo.

### 4. Varias Function Apps
Entrada: dos raíces con `host.json`/package propios.
Esperado: inventarios separados; no fusionar dependencias ni Functions.

### 5. Archivo sensible
Entrada: `.env` o `local.settings.json`.
Esperado: metadata segura, `contentRead = false`, ningún valor leído.

### 6. CI/CD protegido
Entrada: GitHub Actions/Azure DevOps/Jenkins.
Esperado: detectar ruta/categoría sin leer contenido.

### 7. Configuration key
Entrada: source usa `process.env.COSMOS_CONNECTION`.
Esperado: registrar nombre de clave, nunca valor.

### 8. Durable
Entrada: orchestrator/activity observable.
Esperado: roles y relaciones literales registradas con evidence status; no analizar topología completa.

### 9. Shared candidate
Entrada: mismo repository/client importado por varias Functions.
Esperado: candidato con evidence status; no owner/action definitiva.

### 10. Source insuficiente
Entrada: package sugiere v4 pero no hay registration observable.
Esperado: `INFERRED`/`UNKNOWN`, nunca `CONFIRMED` solo por package major.

### 11. Artifacts
Esperado: `inventory.json` + `catalog/current-state.md`; sin recomendaciones ni plan.

### 12. Profundidad útil para migración
Entrada: adapters que componen handlers/use cases/repositories/publishers/storage adapters mediante imports directos.
Esperado: `current-state.md` resume composition roots, capabilities, infraestructura, comandos de validación existentes y relaciones relevantes; no lista imports masivos ni lógica paso a paso.

### 13. Diagrama observable
Entrada: relaciones principales suficientes entre triggers, Functions, Durable activities y shared resources.
Esperado: `current-state.md` incluye un Mermaid `flowchart` compacto; enlaces sólidos para relaciones `CONFIRMED`, punteados para `INFERRED`; no inventa relaciones por naming.

### 14. Límite de discovery
Entrada: source con llamadas internas complejas o nombres dinámicos.
Esperado: registrar unknowns o resumen; no construir full call graph, no decidir ownership, no crear acciones de migración.

### 15. Graphify opcional
Entrada: Graphify/indexer disponible con exclusiones configurables.
Esperado: se genera/consume grafo seguro como evidencia auxiliar; `inventory.js` sigue siendo fuente primaria; inferencias quedan `INFERRED` salvo confirmación por source seguro.

### 16. Graphify no disponible
Entrada: no existe herramienta de grafo o no puede garantizar exclusiones.
Esperado: discovery continúa con inventario determinístico y source seguro; no bloquear por ausencia de Graphify.

### 17. Criticidad/testabilidad inicial
Entrada: graph/source muestra trigger externo, side effects, shared resource o runtime coupling.
Esperado: registrar señales iniciales compactas por Function/slice; no diseñar refactors ni acciones.

### 18. No modificación
Esperado: cero cambios de source/configuración del repo objetivo.
