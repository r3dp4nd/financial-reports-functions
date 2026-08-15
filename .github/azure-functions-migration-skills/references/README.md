# Referencias

Este directorio reserva conocimiento técnico reutilizable que varias skills pueden cargar bajo demanda.

## Criterio

Una tecnología, trigger o dependencia **no justifica por sí sola una skill nueva**.

Prefiere una referencia cuando el contenido:

- aporta reglas específicas de una tecnología;
- se necesita solo en algunos repositorios;
- puede ser reutilizado por más de una skill;
- no define por sí mismo una responsabilidad operativa distinta.

## Referencias disponibles

```text
azure-functions/
  platform-target.md
  programming-model-v4.md
  bindings-v4.md
  durable-v4.md

evidence/
  migration-artifacts.md

dependencies/
  dependency-strategy.md

architecture/
  function-architecture.md

testing/
  jest.md

quality/
  sonar.md
```

Estas referencias existen porque resuelven decisiones transversales o especializadas que varias skills necesitan. No se han creado archivos separados por cada trigger o SDK; si un caso requiere detalle adicional, se consulta primero la documentación oficial y solo se promueve a referencia reutilizable cuando aporte valor recurrente.

## Fuentes

Las reglas de compatibilidad, APIs, soporte y migración deben fundamentarse prioritariamente en documentación oficial del proveedor correspondiente. Consulta `official-sources.md`.
