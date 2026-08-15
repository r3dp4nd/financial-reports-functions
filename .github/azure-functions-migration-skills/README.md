# Azure Functions Migration Skills

Toolkit de skills para usar una IA como **copiloto técnico** durante la modernización de Azure Functions legacy.

## Objetivo

Acelerar migraciones hacia:

- Azure Functions Runtime v4.
- Node.js 24 como runtime objetivo cuando el hosting y la plataforma lo soporten.
- Programming Model v4.
- Dependencias compatibles.
- Arquitectura desacoplada y orientada por capability.
- Tests con Jest y cobertura útil.
- Integración de calidad compatible con Sonar.

El toolkit **no es un flujo autónomo**. El desarrollador conserva el control de las decisiones y solicita a la IA la capacidad que necesita en cada momento.

## Modelo de trabajo

```text
Developer
   |
   v
IA como copiloto técnico
   |
   +-- comprender
   +-- preparar
   +-- transformar
   +-- proteger
   +-- comprobar
   |
   v
Skills + evidencia
```

Las skills no se encadenan automáticamente ni conocen una "siguiente skill". Pueden reutilizar evidencia existente y se ejecutan según la intención del desarrollador y el estado observable del repositorio.

## Skills

### Alcance Function App

- `assess-function-app`: comprende la aplicación, su estado actual y las brechas de migración.
- `prepare-function-app`: prepara tooling y configuración global sin mezclar cambios incompatibles.
- `verify-function-app`: comprueba integralmente el estado final de la Function App.

### Alcance Function

- `analyze-function`: comprende una Function y propone su separación conceptual.
- `migrate-function`: migra Programming Model preservando comportamiento observable.
- `refactor-function`: desacopla runtime, negocio e infraestructura con arquitectura mínima.
- `test-function`: implementa pruebas útiles y aporta evidencia de comportamiento.

### Alcance compartido

- `migrate-shared-component`: transforma componentes usados por varias Functions de forma coordinada.

## Principios

Todas las skills aplican [`principles/copilot-rules.md`](principles/copilot-rules.md).

Resumen:

1. Evidencia antes que inferencia.
2. Preservar comportamiento de negocio.
3. Cambiar una dimensión a la vez cuando sea viable.
4. Identificar impacto compartido antes de modificar.
5. Aplicar arquitectura mínima necesaria.
6. Comprobar todo cambio.
7. Escalar decisiones según riesgo e impacto.

## Progressive disclosure

Cada `SKILL.md` contiene únicamente las instrucciones necesarias para ejecutar su responsabilidad. El conocimiento especializado se incorpora como referencia y se carga solo cuando el caso lo requiere.

Referencias disponibles:

```text
references/
├── azure-functions/
│   ├── platform-target.md
│   ├── programming-model-v4.md
│   ├── bindings-v4.md
│   └── durable-v4.md
├── dependencies/
│   └── dependency-strategy.md
├── architecture/
│   └── function-architecture.md
├── testing/
│   └── jest.md
└── quality/
    └── sonar.md
```

No se crea una skill nueva por cada tecnología, trigger o dependencia. Primero se evalúa si la necesidad cabe como regla, referencia o herramienta de una skill existente.

## Evidencia

Las skills deben favorecer resultados comprobables. Cuando el repositorio use una carpeta de evidencia, el toolkit propone `.migration/` como ubicación neutral para conservar diagnósticos, análisis, decisiones y verificaciones sin convertirla en un motor de workflow.

## Idioma y nombres

- Identificadores y nombres de skills: inglés.
- Contenido de `SKILL.md`, referencias y documentación: español técnico claro.
- Nombres oficiales de tecnologías, APIs, campos y estándares: se conservan cuando traducirlos reduce precisión.

## Estado

Esta versión mantiene el **núcleo inicial** y agrega únicamente referencias necesarias para decisiones recurrentes de plataforma, Programming Model, bindings, Durable Functions, dependencias, arquitectura, testing y calidad. Los detalles por trigger o SDK permanecen bajo documentación oficial salvo que la experiencia demuestre que merecen una referencia reutilizable.
