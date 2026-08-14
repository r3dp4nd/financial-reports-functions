# Security Policy

## Objetivo

Evitar que el agente lea, cargue, copie o exponga secretos, credenciales o topología interna durante cualquier etapa de la migración.

## Regla obligatoria

La exclusión ocurre **antes** de leer contenido.

Si una ruta puede contener secretos o información operativa sensible:

- no abrirla;
- no incluirla en contexto;
- no inferir valores;
- registrar solo metadata segura cuando sea útil.

Metadata segura típica:

- ruta;
- categoría;
- `contentRead = false`.

## Contenido protegido

Aplicar los patrones de [references/security-patterns.md](references/security-patterns.md) antes de cualquier discovery o lectura selectiva.

Incluye por defecto:

- `.env*`;
- `local.settings.json`;
- certificados, keys y keystores;
- archivos de variables sensibles;
- CI/CD y automatización;
- rutas explícitamente dedicadas a secretos.

## Configuración de aplicación

En source puede registrarse el **nombre** de una clave usada, por ejemplo `process.env.COSMOS_CONNECTION`.

Nunca registrar su valor.

Si una validación local necesita configuración, utilizar únicamente una copia sanitizada y aprobada por el desarrollador.

## CI/CD

GitHub Actions, Azure DevOps, GitLab CI, Jenkins, Bitbucket Pipelines y equivalentes se consideran protegidos por defecto.

Solo analizar una copia sanitizada y aprobada explícitamente.

## Scripts y tools

Toda tool determinista debe:

1. aplicar exclusiones por ruta/patrón antes de leer;
2. evitar seguir symlinks hacia contenido protegido;
3. no imprimir valores sensibles en stdout/stderr;
4. producir artifacts seguros.

## Evidencia y artifacts

No persistir secretos en `.migration/`, logs, lessons, evals ni reportes.

Ante duda, clasificar como protegido y requerir revisión humana.
