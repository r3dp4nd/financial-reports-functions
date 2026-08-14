# Evals — Discover Function App

## Objetivo

Validar discovery seguro, determinista y no interpretativo.

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
Esperado: roles/relaciones registradas sin analizar topology completa.

### 9. Shared candidate
Entrada: mismo repository/client importado por varias Functions.
Esperado: candidato con evidence status; no owner/action definitiva.

### 10. Source insuficiente
Entrada: package sugiere v4 pero no hay registration observable.
Esperado: `INFERRED`/`UNKNOWN`, nunca `CONFIRMED` solo por package major.

### 11. Artifacts
Esperado: `inventory.json` + `catalog/current-state.md`; sin recomendaciones ni plan.

### 12. No modificación
Esperado: cero cambios de source/configuración del repo objetivo.
