# Scaffold Rules

## Naming

Preferir los patrones existentes del repo.

- Function registration: nombre público observable, por ejemplo `RequestReport`.
- Adapter file: `src/functions/<kebab-name>.function.ts`.
- Capability folder: `src/<PascalCapability>/`.
- Handler factory: `create<Capability>Handler`.
- Use case: `<verb-object>.use-case.ts`.

No renombrar convenciones existentes si el repo ya usa otra forma consistente.

## Variantes

### handler-only

Crear:

```text
src/functions/<name>.function.ts
src/<Capability>/handler.ts
src/<Capability>/handler.spec.ts
```

Usar para separar runtime/contrato sin reglas de aplicación profundas.

### application

Agregar:

```text
src/<Capability>/application/<use-case>.ts
src/<Capability>/application/<command>.ts
src/<Capability>/application/<result>.ts
src/<Capability>/application/<use-case>.spec.ts
```

Usar cuando exista intención funcional testeable o coordinación de dependencias.

### full-boundary

Agregar solo si hay boundary real:

```text
src/<Capability>/domain/
src/<Capability>/infrastructure/
```

Usar para invariantes, persistence, messaging, storage, HTTP externo o SDKs.

## Adapter

El adapter debe:

- registrar trigger;
- construir dependencias concretas;
- pasar config por nombre de clave, nunca valores;
- delegar al handler/use case.

No debe contener lógica funcional.

## Handler

El handler debe:

- recibir dependencias por factory;
- traducir runtime/contrato;
- mapear errores conocidos cuando estén especificados;
- registrar errores inesperados con `context`.

Si no se conocen status/payloads, usar TODOs mínimos y no inventar API.

## Tests

Crear specs solo para scaffold testeable y si el repo usa Jest o el usuario lo pidió.

No agregar frameworks de test desde este skill.
