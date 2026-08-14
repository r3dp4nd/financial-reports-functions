# Patrones de contenido protegido

Usar esta referencia cuando una etapa necesite decidir si una ruta puede inspeccionarse.

## Archivos y rutas

Excluir contenido de:

```text
.env
.env.*
local.settings.json
secrets/**
.azure/**
*.pem
*.key
*.pfx
*.p12
*.crt
*.tfvars
```

Excluir por defecto contenido de CI/CD y automatización:

```text
.github/workflows/**
azure-pipelines*.yml
azure-pipelines*.yaml
.gitlab-ci*.yml
.gitlab-ci*.yaml
Jenkinsfile*
bitbucket-pipelines*.yml
bitbucket-pipelines*.yaml
**/pipelines/**
devops/**
```

Las rutas pueden registrarse como metadata, pero no leerse.

## Directorios no-source

No tratar como source de aplicación:

```text
.git/**
node_modules/**
dist/**
coverage/**
test-results/**
.migration/**
.graphify/**
```

`.graphify/**` es metadata/cache regenerable del propio indexador Graphify (grafo, ASTs, análisis intermedios), no
source de la Function App bajo migración; nunca debe escanearse como código ni citarse como evidencia de arquitectura
del repositorio objetivo.

El propio toolkit (`.github/skills/**` cuando se instale allí) tampoco forma parte del source de la Function App.

## Valores ficticios

Cuando una validación necesite ejemplos de configuración, usar valores claramente ficticios y sin semejanza con credenciales reales.
