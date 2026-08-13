# Security Policy

## Objetivo

Evitar que los skills, agentes o scripts carguen información sensible durante análisis, preparación, migración o
verificación.

## Regla principal

No leer, cargar, inspeccionar ni incluir en contexto contenido que pueda contener:

- API keys;
- contraseñas;
- tokens;
- connection strings;
- secretos;
- certificados;
- credenciales;
- claves privadas.

## Archivos sensibles

Excluir antes de analizar contenido, entre otros:

- `local.settings.json`;
- `.env`;
- `.env.*`;
- certificados;
- claves privadas;
- archivos de secretos;
- configuraciones equivalentes.

Puede registrarse:

- existencia;
- ruta;
- nombre de una clave de configuración cuando sea necesario.

Nunca registrar su valor.

## process.env

Puede analizarse código fuente para detectar referencias como:

`process.env.KEY`

Registrar únicamente:

- nombre de la clave;
- ubicación de uso.

Nunca intentar resolver automáticamente el valor.

## Configuración local

Cuando una validación necesite settings locales:

- indicar qué claves son necesarias;
- solicitar una copia sanitizada o expresamente aprobada por el desarrollador;
- no abrir automáticamente un `local.settings.json` existente.

## CI/CD

Excluir por defecto contenido de:

- GitHub Actions;
- Azure DevOps;
- GitLab CI;
- Jenkins;
- Bitbucket Pipelines;
- automatización equivalente.

Estos archivos pueden contener:

- endpoints;
- resource groups;
- service connections;
- suscripciones;
- variables;
- secretos;
- topología interna.

Solo analizar una copia previamente sanitizada y aprobada cuando sea necesario.

## Scripts

Los scripts deterministas deben aplicar las exclusiones antes de leer archivos.

Cuando detecten un archivo excluido pueden registrar:

- ruta;
- clasificación;
- `contentRead = false`.

No deben leer primero el archivo para decidir después que era sensible.

## Principio

La exclusión ocurre antes de la lectura.

La seguridad tiene prioridad sobre completar automáticamente un análisis.
