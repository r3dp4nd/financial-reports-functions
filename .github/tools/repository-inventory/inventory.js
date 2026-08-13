"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(process.argv[2] || process.cwd());

const EXCLUDED_DIRECTORIES = new Set([".git", ".idea", ".vscode", ".github", ".migration", "node_modules", "dist", "coverage", "test-results"]);

const SENSITIVE_FILE_NAMES = new Set(["local.settings.json", ".env", ".env.local", ".env.development", ".env.production", ".env.test"]);

const SENSITIVE_FILE_PATTERNS = [/^\.env\./i, /\.pem$/i, /\.pfx$/i, /\.p12$/i, /\.key$/i, /\.crt$/i, /\.cer$/i, /\.jks$/i];

const CI_CD_PATH_PATTERNS = [/(^|\/)\.github\/workflows(\/|$)/i, /(^|\/)azure-pipelines(\/|$)/i, /(^|\/)pipelines(\/|$)/i, /(^|\/)\.gitlab-ci\.ya?ml$/i, /(^|\/)Jenkinsfile$/i, /(^|\/)bitbucket-pipelines\.ya?ml$/i];

const SOURCE_EXTENSIONS = new Set([".js", ".cjs", ".mjs", ".ts", ".tsx"]);

function normalizeRelativePath(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join("/");
}

function isExcludedDirectory(name) {
  return EXCLUDED_DIRECTORIES.has(name);
}

function isSensitiveFile(relativePath) {
  const baseName = path.basename(relativePath);

  if (SENSITIVE_FILE_NAMES.has(baseName)) {
    return true;
  }

  return SENSITIVE_FILE_PATTERNS.some(function (pattern) {
    return pattern.test(baseName);
  });
}

function isCiCdFile(relativePath) {
  return CI_CD_PATH_PATTERNS.some(function (pattern) {
    return pattern.test(relativePath);
  });
}

function readJsonSafe(filePath, warnings) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    warnings.push({
      type: "INVALID_JSON", path: normalizeRelativePath(filePath), message: error.message
    });

    return null;
  }
}

function readTextSafe(filePath, warnings) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    warnings.push({
      type: "READ_ERROR", path: normalizeRelativePath(filePath), message: error.message
    });

    return null;
  }
}

function walkDirectory(directory, state) {
  let entries;

  try {
    entries = fs.readdirSync(directory, {
      withFileTypes: true
    });
  } catch (error) {
    state.warnings.push({
      type: "DIRECTORY_READ_ERROR", path: normalizeRelativePath(directory), message: error.message
    });

    return;
  }

  entries.forEach(function (entry) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = normalizeRelativePath(absolutePath);

    if (entry.isDirectory()) {
      if (isExcludedDirectory(entry.name)) {
        return;
      }

      if (isCiCdFile(relativePath)) {
        state.sensitiveFilesDetected.push({
          path: relativePath, classification: "CI_CD", contentRead: false
        });

        return;
      }

      walkDirectory(absolutePath, state);
      return;
    }

    if (!entry.isFile()) {
      return;
    }

    if (isSensitiveFile(relativePath)) {
      state.sensitiveFilesDetected.push({
        path: relativePath, classification: "SENSITIVE", contentRead: false
      });

      return;
    }

    if (isCiCdFile(relativePath)) {
      state.sensitiveFilesDetected.push({
        path: relativePath, classification: "CI_CD", contentRead: false
      });

      return;
    }

    state.files.push({
      absolutePath: absolutePath, relativePath: relativePath
    });
  });
}

function findFunctionAppCandidates(files, warnings) {
  const hostJsonFiles = files.filter(function (file) {
    return path.basename(file.absolutePath) === "host.json";
  });

  return hostJsonFiles.map(function (hostFile) {
    const appRoot = path.dirname(hostFile.absolutePath);

    const packageJsonPath = path.join(appRoot, "package.json");

    const hasPackageJson = fs.existsSync(packageJsonPath);

    const packageJson = hasPackageJson ? readJsonSafe(packageJsonPath, warnings) : null;

    const dependencies = packageJson ? Object.assign({}, packageJson.dependencies || {}, packageJson.devDependencies || {}) : {};

    const hasAzureFunctionsDependency = Object.prototype.hasOwnProperty.call(dependencies, "@azure/functions");

    const hasDurableFunctionsDependency = Object.prototype.hasOwnProperty.call(dependencies, "durable-functions");

    let confidence = "UNKNOWN";

    if (hasPackageJson && hasAzureFunctionsDependency) {
      confidence = "CONFIRMED";
    } else if (hasPackageJson) {
      confidence = "INFERRED";
    }

    return {
      id: path.basename(appRoot) || ".", path: normalizeRelativePath(appRoot) || ".", status: confidence,

      packageJson: {
        detected: hasPackageJson, path: hasPackageJson ? normalizeRelativePath(packageJsonPath) : null
      },

      hostJson: {
        detected: true, path: hostFile.relativePath
      },

      package: packageJson ? {
        name: packageJson.name || null,
        version: packageJson.version || null,
        main: packageJson.main || null,
        engines: packageJson.engines || {},
        dependencies: packageJson.dependencies || {},
        devDependencies: packageJson.devDependencies || {}
      } : null,

      azureDependencies: {
        azureFunctions: dependencies["@azure/functions"] || null,

        durableFunctions: dependencies["durable-functions"] || null
      },

      durableFunctionsDetected: hasDurableFunctionsDependency,

      functions: [], environmentKeys: []
    };
  });
}

function belongsToFunctionApp(filePath, appRoot) {
  const relative = path.relative(appRoot, filePath);

  return (relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative));
}

function discoverLegacyFunctions(app, files, warnings) {
  const appRoot = path.resolve(ROOT, app.path);

  const functionJsonFiles = files.filter(function (file) {
    return (path.basename(file.absolutePath) === "function.json" && belongsToFunctionApp(file.absolutePath, appRoot));
  });

  return functionJsonFiles.map(function (file) {
    const definition = readJsonSafe(file.absolutePath, warnings);

    if (!definition) {
      return {
        name: path.basename(path.dirname(file.absolutePath)),
        path: file.relativePath,
        programmingModel: "UNKNOWN",
        trigger: null,
        bindings: [],
        status: "UNKNOWN"
      };
    }

    const bindings = Array.isArray(definition.bindings) ? definition.bindings : [];

    const triggerBinding = bindings.find(function (binding) {
      return (binding && typeof binding.type === "string" && binding.type.toLowerCase().endsWith("trigger"));
    });

    return {
      name: path.basename(path.dirname(file.absolutePath)),
      path: file.relativePath,
      programmingModel: "v3-or-earlier",
      trigger: triggerBinding ? triggerBinding.type : null,
      bindings: bindings
        .filter(function (binding) {
          return binding && typeof binding.type === "string";
        })
        .map(function (binding) {
          return {
            name: binding.name || null, type: binding.type, direction: binding.direction || null
          };
        }),
      status: "CONFIRMED"
    };
  });
}

function extractProcessEnvKeys(source) {
  const keys = new Set();

  const dotPattern = /process\.env\.([A-Za-z_][A-Za-z0-9_]*)/g;

  const bracketPattern = /process\.env\[\s*["']([A-Za-z_][A-Za-z0-9_]*)["']\s*\]/g;

  let match;

  while ((match = dotPattern.exec(source)) !== null) {
    keys.add(match[1]);
  }

  while ((match = bracketPattern.exec(source)) !== null) {
    keys.add(match[1]);
  }

  return Array.from(keys);
}

function discoverEnvironmentKeys(app, files, warnings) {
  const appRoot = path.resolve(ROOT, app.path);
  const usage = {};

  files.forEach(function (file) {
    if (!belongsToFunctionApp(file.absolutePath, appRoot)) {
      return;
    }

    const extension = path.extname(file.absolutePath);

    if (!SOURCE_EXTENSIONS.has(extension)) {
      return;
    }

    const source = readTextSafe(file.absolutePath, warnings);

    if (source === null) {
      return;
    }

    const keys = extractProcessEnvKeys(source);

    keys.forEach(function (key) {
      if (!usage[key]) {
        usage[key] = [];
      }

      usage[key].push(file.relativePath);
    });
  });

  return Object.keys(usage)
    .sort()
    .map(function (key) {
      return {
        name: key, references: usage[key].sort()
      };
    });
}

function buildRepositoryMetadata() {
  return {
    root: ".", name: path.basename(ROOT)
  };
}

function discoverV4Registrations(app, files, warnings) {
  const appRoot = path.resolve(ROOT, app.path);

  const registrations = [];

  const registrationPatterns = [{
    type: "http", pattern: /\bapp\.http\s*\(\s*["'`]([^"'`]+)["'`]/
  }, {
    type: "timer", pattern: /\bapp\.timer\s*\(\s*["'`]([^"'`]+)["'`]/
  }, {
    type: "serviceBusQueue", pattern: /\bapp\.serviceBusQueue\s*\(\s*["'`]([^"'`]+)["'`]/
  }, {
    type: "serviceBusTopic", pattern: /\bapp\.serviceBusTopic\s*\(\s*["'`]([^"'`]+)["'`]/
  }, {
    type: "cosmosDB", pattern: /\bapp\.cosmosDB\s*\(\s*["'`]([^"'`]+)["'`]/
  }];

  files.forEach(function (file) {
    if (!belongsToFunctionApp(file.absolutePath, appRoot)) {
      return;
    }

    const extension = path.extname(file.absolutePath);

    if (!SOURCE_EXTENSIONS.has(extension)) {
      return;
    }

    const source = readTextSafe(file.absolutePath, warnings);

    if (source === null) {
      return;
    }

    registrationPatterns.forEach(function (candidate) {
      const match = candidate.pattern.exec(source);

      if (!match) {
        return;
      }

      registrations.push({
        name: match[1],
        path: file.relativePath,
        programmingModel: "v4",
        trigger: candidate.type,
        bindings: [],
        durableRole: null,
        status: "CONFIRMED"
      });
    });
  });

  return registrations;
}

function discoverDurableV4Registrations(app, files, warnings) {
  const appRoot = path.resolve(ROOT, app.path);

  const registrations = [];

  const durablePatterns = [{
    role: "orchestrator",
    trigger: "orchestrationTrigger",
    pattern: /\bdf\.app\.orchestration\s*\(\s*["'`]([^"'`]+)["'`]/
  }, {
    role: "activity", trigger: "activityTrigger", pattern: /\bdf\.app\.activity\s*\(\s*["'`]([^"'`]+)["'`]/
  }];

  files.forEach(function (file) {
    if (!belongsToFunctionApp(file.absolutePath, appRoot)) {
      return;
    }

    const extension = path.extname(file.absolutePath);

    if (!SOURCE_EXTENSIONS.has(extension)) {
      return;
    }

    const source = readTextSafe(file.absolutePath, warnings);

    if (source === null) {
      return;
    }

    durablePatterns.forEach(function (candidate) {
      const match = candidate.pattern.exec(source);

      if (!match) {
        return;
      }

      registrations.push({
        name: match[1],
        path: file.relativePath,
        programmingModel: "v4",
        trigger: candidate.trigger,
        bindings: [],
        durableRole: candidate.role,
        status: "CONFIRMED"
      });
    });
  });

  return registrations;
}

function determineProgrammingModel(app, legacyFunctions, v4Functions) {
  const azureFunctionsVersion = app.azureDependencies.azureFunctions;

  const hasLegacyFunctions = legacyFunctions.length > 0;

  const hasV4Functions = v4Functions.length > 0;

  if (hasV4Functions && !hasLegacyFunctions) {
    return {
      version: "v4", status: "CONFIRMED", evidence: ["v4 registrations detected"]
    };
  }

  if (hasLegacyFunctions && !hasV4Functions) {
    return {
      version: "v3-or-earlier", status: "CONFIRMED", evidence: ["function.json detected"]
    };
  }

  if (hasLegacyFunctions && hasV4Functions) {
    return {
      version: null,
      status: "UNKNOWN",
      evidence: ["legacy and v4 registrations detected"],
      warning: "Se detectaron artefactos legacy y registros v4."
    };
  }

  if (typeof azureFunctionsVersion === "string" && /^(\^|~)?4\./.test(azureFunctionsVersion)) {
    return {
      version: "v4", status: "INFERRED", evidence: ["@azure/functions 4.x detected"]
    };
  }

  return {
    version: null, status: "UNKNOWN", evidence: []
  };
}

function execute() {
  const state = {
    files: [], sensitiveFilesDetected: [], warnings: []
  };

  walkDirectory(ROOT, state);

  const functionApps = findFunctionAppCandidates(state.files, state.warnings);

  functionApps.forEach(function (app) {
    const legacyFunctions = discoverLegacyFunctions(app, state.files, state.warnings);

    const v4Functions = discoverV4Registrations(app, state.files, state.warnings);

    const durableV4Functions = discoverDurableV4Registrations(app, state.files, state.warnings);

    const allV4Functions = v4Functions.concat(durableV4Functions);

    app.functions = legacyFunctions.concat(allV4Functions);

    app.programmingModel = determineProgrammingModel(app, legacyFunctions, allV4Functions);

    app.environmentKeys = discoverEnvironmentKeys(app, state.files, state.warnings);
  });

  const result = {
    schemaVersion: "1",

    tool: "repository-inventory",

    repository: buildRepositoryMetadata(),

    functionApps: functionApps,

    sensitiveFilesDetected: state.sensitiveFilesDetected.sort(function (a, b) {
      return a.path.localeCompare(b.path);
    }),

    warnings: state.warnings
  };

  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
}

execute();
