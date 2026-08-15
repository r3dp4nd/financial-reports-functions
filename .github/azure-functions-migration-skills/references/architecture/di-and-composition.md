# Dependency Injection y composition root

## Cuándo cargar

Carga esta referencia cuando estés refactorizando composición, construcción de clientes, factories, handlers o puertos para mejorar testabilidad.

## Responsabilidad del adapter Azure

Idealmente se limita a:

1. recibir trigger/input;
2. mapear al contrato de aplicación;
3. invocar el caso de uso;
4. mapear resultado/error al contrato Azure.

Un handler no necesita ser artificialmente pequeño si el código adicional sigue siendo estrictamente de adaptación.

## Cuándo crear un puerto

Crea un puerto/interfaz cuando:

- la aplicación depende de infraestructura que debe sustituirse en tests;
- existe más de una implementación real o previsible por requisito;
- el contrato expresa una capacidad del negocio mejor que el SDK concreto.

No crees una interfaz únicamente porque existe una clase.

Ubicación recomendada:

- `domain/ports/` si el contrato representa una capacidad del dominio o una dependencia necesaria para reglas de dominio.
- `application/ports/` si el contrato pertenece a la orquestación del caso de uso, por ejemplo publicar un evento de integración.

## Clientes Azure

Evita crear nuevos clientes de servicios en cada invocación cuando puedan reutilizarse de forma segura. Azure Functions recomienda reutilizar estado/clientes a nivel de módulo cuando sea apropiado, sin depender de que ese estado permanezca para siempre porque el worker puede reciclarse.

La composición debe mantener claro dónde se construyen estos clientes y cómo se inyectan hacia la aplicación.

## Dependency Injection

La dependency injection debe reducir acoplamiento real y mejorar testabilidad. No requiere introducir un contenedor si la composición manual es suficiente.

Patrón recomendado:

```text
*.function.ts
  └── construye clients/adapters/use cases una vez a nivel módulo
      └── crea handler con dependencias explícitas
          └── handler invoca caso de uso
              └── caso de uso depende de puertos
                  └── infraestructura implementa puertos
```

Reglas:

- usa `*.function.ts` como composition root del runtime Azure;
- inyecta dependencias en handlers mediante factory explícita cuando aporte testabilidad;
- inyecta puertos/adapters en casos de uso mediante constructor o factory simple;
- reutiliza clientes Azure a nivel módulo cuando sea seguro;
- evita service locators globales;
- evita contenedores DI si no existe complejidad real que los justifique;
- no crees interfaces únicamente para satisfacer un patrón de inyección.
