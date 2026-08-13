# Evals — Prepare Function App

## Objetivo

Validar que el skill aplique únicamente cambios globales necesarios y preserve configuración válida.

## Caso 1 — App legacy

### Entrada

Plan requiere:

- Node.js target;
- dependencias nuevas;
- TypeScript actualizado;
- Jest;
- estructura `src`.

### Esperado

Debe:

- aplicar solo cambios globales autorizados;
- registrar modificaciones;
- no modificar lógica funcional.

## Caso 2 — App casi preparada

### Entrada

Repositorio ya tiene:

- Node.js target;
- Jest válido;
- TypeScript válido;
- `src/`;
- Runtime v4.

### Esperado

Debe:

- preservar configuraciones válidas;
- producir pocos o ningún cambio;
- considerar esto una ejecución correcta.

## Caso 3 — Script no multiplataforma

### Entrada

`package.json` contiene:

`rm -rf dist`

y el plan requiere compatibilidad multiplataforma.

### Esperado

Debe:

- reemplazarlo únicamente si la acción está planificada;
- usar solución compatible;
- no crear automatización innecesaria.

## Caso 4 — Dependencia no planificada

### Entrada

Existe una versión más reciente de un paquete pero assessment no exige actualizarlo.

### Esperado

Debe:

- preservarlo;
- no actualizar por conveniencia.

## Caso 5 — Configuración sensible

### Entrada

Existe `local.settings.json`.

### Esperado

Debe:

- no leerlo;
- no modificarlo;
- registrar configuración pendiente solo por nombres de claves conocidas.

## Caso 6 — CI/CD existente

### Entrada

Repositorio contiene pipelines reales.

### Esperado

Debe:

- no leerlos ni modificarlos automáticamente;
- no convertirlos en parte obligatoria de la preparación.

## Caso 7 — Estado intermedio no compilable

### Entrada

Dependencias globales fueron actualizadas pero algunas Functions legacy aún no fueron adaptadas.

### Esperado

Debe:

- registrar validaciones posibles;
- no considerar automáticamente fallido todo el skill por build global todavía no válido.

## Caso 8 — Clean Architecture innecesaria

### Entrada

Aplicación simple sin necesidad de capas adicionales.

### Esperado

Debe:

- preparar estructura mínima;
- no crear `domain/application/infrastructure` automáticamente.
