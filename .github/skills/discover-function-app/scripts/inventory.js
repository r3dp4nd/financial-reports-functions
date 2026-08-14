#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.argv[2] || process.cwd());

const MAX_SOURCE_FILE_SIZE = 1024 * 1024;

const SKIP_DIRECTORIES = new Set(['.git', '.idea', '.vscode', '.migration', '.skill-improvement', 'node_modules', 'dist', 'coverage', 'test-results']);

const SOURCE_EXTENSIONS = new Set(['.js', '.cjs', '.mjs', '.ts', '.cts', '.mts']);

const KNOWN_AZURE_RESOURCE_PACKAGES = {
  '@azure/cosmos': 'COSMOS_DB',
  '@azure/service-bus': 'SERVICE_BUS',
  '@azure/storage-blob': 'BLOB_STORAGE',
  '@azure/event-hubs': 'EVENT_HUB'
};

const AZURE_PLATFORM_PACKAGES = new Set(['@azure/functions', 'durable-functions']);

const AZURE_REGISTRATION_METHODS = {
  http: 'httpTrigger',
  timer: 'timerTrigger',
  serviceBusQueue: 'serviceBusTrigger',
  serviceBusTopic: 'serviceBusTrigger',
  storageQueue: 'queueTrigger',
  storageBlob: 'blobTrigger',
  cosmosDB: 'cosmosDBTrigger',
  eventHub: 'eventHubTrigger'
};

const DURABLE_REGISTRATION_METHODS = {
  orchestration: 'ORCHESTRATOR', activity: 'ACTIVITY', entity: 'ENTITY'
};

function normalizeRelative(filePath) {
  return path
    .relative(ROOT, filePath)
    .split(path.sep)
    .join('/');
}

function safeStat(filePath) {
  try {
    return fs.statSync(filePath);
  } catch (error) {
    return null;
  }
}

function safeReadDir(directory) {
  try {
    return fs.readdirSync(directory, { withFileTypes: true });
  } catch (error) {
    return [];
  }
}

function safeReadText(filePath, warnings) {
  const stat = safeStat(filePath);

  if (!stat || !stat.isFile()) {
    return null;
  }

  if (stat.size > MAX_SOURCE_FILE_SIZE) {
    warnings.push({
      type: 'FILE_SKIPPED', path: normalizeRelative(filePath), reason: 'FILE_TOO_LARGE'
    });

    return null;
  }

  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    warnings.push({
      type: 'FILE_READ_FAILED', path: normalizeRelative(filePath), reason: error.message
    });

    return null;
  }
}

function safeReadJson(filePath, warnings) {
  const content = safeReadText(filePath, warnings);

  if (content === null) {
    return null;
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    warnings.push({
      type: 'INVALID_JSON', path: normalizeRelative(filePath), reason: error.message
    });

    return null;
  }
}

function isAzurePackage(packageName) {
  return (packageName.startsWith('@azure/') || AZURE_PLATFORM_PACKAGES.has(packageName));
}

function isEnvFile(name) {
  return (name === '.env' || name.startsWith('.env.') || name === 'local.settings.json');
}

function isCertificateOrKey(name) {
  const lower = name.toLowerCase();

  return (lower.endsWith('.pem') || lower.endsWith('.pfx') || lower.endsWith('.p12') || lower.endsWith('.key') || lower.endsWith('.crt') || lower.endsWith('.cer') || lower.endsWith('.jks'));
}

function isCiCdFile(relativePath) {
  const normalized = relativePath.toLowerCase();
  const base = path.basename(normalized);

  return (normalized.startsWith('.github/workflows/') || normalized === '.gitlab-ci.yml' || normalized === '.gitlab-ci.yaml' || base === 'jenkinsfile' || normalized === 'bitbucket-pipelines.yml' || normalized === 'bitbucket-pipelines.yaml' || normalized === 'azure-pipelines.yml' || normalized === 'azure-pipelines.yaml' || normalized.startsWith('pipelines/') || normalized.includes('/pipelines/') || normalized.startsWith('devops/') || normalized.includes('/devops/'));
}

function classifyProtectedFile(filePath) {
  const relativePath = normalizeRelative(filePath);
  const name = path.basename(filePath);

  if (isEnvFile(name)) {
    return {
      protected: true, category: 'SENSITIVE_CONFIGURATION'
    };
  }

  if (isCertificateOrKey(name)) {
    return {
      protected: true, category: 'CERTIFICATE_OR_KEY'
    };
  }

  if (isCiCdFile(relativePath)) {
    return {
      protected: true, category: 'CI_CD'
    };
  }

  return {
    protected: false, category: null
  };
}

function recordProtectedFile(filePath, protectedFiles, category) {
  const relativePath = normalizeRelative(filePath);

  if (protectedFiles.some(function (entry) {
    return entry.path === relativePath;
  })) {
    return;
  }

  protectedFiles.push({
    path: relativePath, category: category, contentRead: false
  });
}

function walkProtectedTree(directory, protectedFiles, category) {
  const entries = safeReadDir(directory);

  entries.forEach(function (entry) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walkProtectedTree(fullPath, protectedFiles, category);

      return;
    }

    if (entry.isFile()) {
      recordProtectedFile(fullPath, protectedFiles, category);
    }
  });
}

function detectGitHubWorkflowsMetadata(githubDirectory, protectedFiles) {
  const workflowsDirectory = path.join(githubDirectory, 'workflows');

  const stat = safeStat(workflowsDirectory);

  if (!stat || !stat.isDirectory()) {
    return;
  }

  walkProtectedTree(workflowsDirectory, protectedFiles, 'CI_CD');
}

function walkRepository(directory, files, protectedFiles) {
  const entries = safeReadDir(directory);

  entries.forEach(function (entry) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (SKIP_DIRECTORIES.has(entry.name)) {
        return;
      }

      if (entry.name === '.github' && path.resolve(directory) === ROOT) {
        detectGitHubWorkflowsMetadata(fullPath, protectedFiles);

        return;
      }

      if (entry.name.toLowerCase() === 'pipelines') {
        walkProtectedTree(fullPath, protectedFiles, 'CI_CD');

        return;
      }

      walkRepository(fullPath, files, protectedFiles);

      return;
    }

    if (!entry.isFile()) {
      return;
    }

    const classification = classifyProtectedFile(fullPath);

    if (classification.protected) {
      recordProtectedFile(fullPath, protectedFiles, classification.category);

      return;
    }

    files.push(fullPath);
  });
}

function findFunctionAppRoots(files) {
  const directories = {};

  files.forEach(function (filePath) {
    const name = path.basename(filePath);

    if (name !== 'host.json' && name !== 'package.json') {
      return;
    }

    const directory = path.dirname(filePath);

    if (!directories[directory]) {
      directories[directory] = {
        directory: directory, hostJson: false, packageJson: false
      };
    }

    if (name === 'host.json') {
      directories[directory].hostJson = true;
    }

    if (name === 'package.json') {
      directories[directory].packageJson = true;
    }
  });

  return Object.keys(directories)
    .map(function (key) {
      return directories[key];
    })
    .filter(function (candidate) {
      return candidate.hostJson;
    });
}

function packageMetadata(appRoot, warnings) {
  const packagePath = path.join(appRoot, 'package.json');

  const packageJson = safeReadJson(packagePath, warnings);

  if (!packageJson) {
    return {
      path: fs.existsSync(packagePath) ? normalizeRelative(packagePath) : null,
      name: null,
      version: null,
      engines: {},
      scripts: {},
      dependencies: {},
      devDependencies: {},
      packageManager: null
    };
  }

  return {
    path: normalizeRelative(packagePath),
    name: packageJson.name || null,
    version: packageJson.version || null,
    engines: packageJson.engines || {},
    scripts: packageJson.scripts || {},
    dependencies: packageJson.dependencies || {},
    devDependencies: packageJson.devDependencies || {},
    packageManager: packageJson.packageManager || null
  };
}

function hostMetadata(appRoot, warnings) {
  const hostPath = path.join(appRoot, 'host.json');

  const hostJson = safeReadJson(hostPath, warnings);

  const extensionBundle = hostJson && hostJson.extensionBundle && typeof hostJson.extensionBundle === 'object' ? {
    id: typeof hostJson.extensionBundle.id === 'string' ? hostJson.extensionBundle.id : null,
    version: typeof hostJson.extensionBundle.version === 'string' ? hostJson.extensionBundle.version : null,
    evidenceStatus: 'CONFIRMED'
  } : null;

  return {
    path: normalizeRelative(hostPath),
    version: hostJson && hostJson.version ? hostJson.version : null,
    extensionBundle: extensionBundle
  };
}

function dependencyList(packageInfo) {
  const result = [];

  Object.keys(packageInfo.dependencies || {}).forEach(function (name) {
    result.push({
      name: name, version: packageInfo.dependencies[name], scope: 'RUNTIME', azurePackage: isAzurePackage(name)
    });
  });

  Object.keys(packageInfo.devDependencies || {}).forEach(function (name) {
    result.push({
      name: name, version: packageInfo.devDependencies[name], scope: 'DEVELOPMENT', azurePackage: isAzurePackage(name)
    });
  });

  return result.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

function filesUnderRoot(files, appRoot) {
  const rootWithSeparator = appRoot.endsWith(path.sep) ? appRoot : appRoot + path.sep;

  return files.filter(function (filePath) {
    return (filePath === appRoot || filePath.startsWith(rootWithSeparator));
  });
}

function findLegacyFunctions(appRoot, appFiles, warnings) {
  const functions = [];

  appFiles.forEach(function (filePath) {
    if (path.basename(filePath) !== 'function.json') {
      return;
    }

    const functionJson = safeReadJson(filePath, warnings);

    if (!functionJson) {
      return;
    }

    const functionDirectory = path.dirname(filePath);

    const name = path.basename(functionDirectory);

    const bindings = Array.isArray(functionJson.bindings) ? functionJson.bindings : [];

    const trigger = bindings.find(function (binding) {
      return (binding && typeof binding.type === 'string' && /trigger$/i.test(binding.type));
    }) || null;

    functions.push({
      name: name,
      source: 'FUNCTION_JSON',
      programmingModel: 'legacy',
      evidenceStatus: 'CONFIRMED',
      directory: normalizeRelative(functionDirectory),
      functionJson: normalizeRelative(filePath),
      scriptFile: functionJson.scriptFile || null,
      trigger: trigger ? {
        type: trigger.type, direction: trigger.direction || null, name: trigger.name || null
      } : null,
      bindings: bindings.map(sanitizeBinding),
      durableRole: durableRoleFromBindings(bindings)
    });
  });

  return functions;
}

function sanitizeBinding(binding) {
  const safe = {};

  Object.keys(binding || {}).forEach(function (key) {
    const value = binding[key];

    if (key === 'connection' || key === 'connectionStringSetting') {
      safe[key] = typeof value === 'string' ? value : null;

      return;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
      safe[key] = value;
    }
  });

  return safe;
}

function durableRoleFromBindings(bindings) {
  const mapping = {
    orchestrationTrigger: 'ORCHESTRATOR', activityTrigger: 'ACTIVITY', entityTrigger: 'ENTITY', durableClient: 'CLIENT'
  };

  for (let index = 0; index < bindings.length; index += 1) {
    const binding = bindings[index];

    if (binding && mapping[binding.type]) {
      return mapping[binding.type];
    }
  }

  return null;
}

function sourceFiles(appFiles) {
  return appFiles.filter(function (filePath) {
    return SOURCE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
  });
}

function extractEnvironmentKeys(content) {
  const keys = new Set();

  const dotPattern = /process\.env\.([A-Za-z_][A-Za-z0-9_]*)/g;

  const bracketPattern = /process\.env\s*\[\s*['"]([^'"]+)['"]\s*\]/g;

  let match;

  while ((match = dotPattern.exec(content)) !== null) {
    keys.add(match[1]);
  }

  while ((match = bracketPattern.exec(content)) !== null) {
    keys.add(match[1]);
  }

  return Array.from(keys);
}

function parseV4Registrations(filePath, content) {
  const registrations = [];

  const pattern = /\bapp\.(http|timer|serviceBusQueue|serviceBusTopic|storageQueue|storageBlob|cosmosDB|eventHub)\s*\(\s*['"`]([^'"`]+)['"`]/g;

  let match;

  while ((match = pattern.exec(content)) !== null) {
    registrations.push({
      name: match[2],
      registrationMethod: match[1],
      triggerType: AZURE_REGISTRATION_METHODS[match[1]] || null,
      file: normalizeRelative(filePath),
      evidenceStatus: 'CONFIRMED'
    });
  }

  return registrations;
}

function parseDurableRegistrations(filePath, content) {
  const registrations = [];

  const pattern = /\bdf\.app\.(orchestration|activity|entity)\s*\(\s*['"`]([^'"`]+)['"`]/g;

  let match;

  while ((match = pattern.exec(content)) !== null) {
    registrations.push({
      name: match[2],
      registrationMethod: match[1],
      role: DURABLE_REGISTRATION_METHODS[match[1]],
      file: normalizeRelative(filePath),
      evidenceStatus: 'CONFIRMED'
    });
  }

  return registrations;
}

function sourceReferencesPackage(content, packageName) {
  const escaped = packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const pattern = new RegExp("(?:from\\s*['\"]" + escaped + "(?:\\/[^'\"]*)?['\"]|" + "require\\(\\s*['\"]" + escaped + "(?:\\/[^'\"]*)?['\"]\\s*\\))");

  return pattern.test(content);
}

function normalizeUsageMap(map) {
  const result = {};

  Object.keys(map)
    .sort()
    .forEach(function (key) {
      result[key] = Array.from(new Set(map[key])).sort();
    });

  return result;
}

function deduplicateObjects(values, keyFunction) {
  const seen = new Set();

  return values.filter(function (value) {
    const key = keyFunction(value);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function scanSources(appSourceFiles, warnings) {
  const v4Registrations = [];
  const durableRegistrations = [];
  const environmentUsage = {};
  const azureResourcePackageUsage = {};

  appSourceFiles.forEach(function (filePath) {
    const content = safeReadText(filePath, warnings);

    if (content === null) {
      return;
    }

    parseV4Registrations(filePath, content).forEach(function (registration) {
      v4Registrations.push(registration);
    });

    parseDurableRegistrations(filePath, content).forEach(function (registration) {
      durableRegistrations.push(registration);
    });

    extractEnvironmentKeys(content).forEach(function (key) {
      if (!environmentUsage[key]) {
        environmentUsage[key] = [];
      }

      environmentUsage[key].push(normalizeRelative(filePath));
    });

    Object.keys(KNOWN_AZURE_RESOURCE_PACKAGES).forEach(function (packageName) {
      if (sourceReferencesPackage(content, packageName)) {
        if (!azureResourcePackageUsage[packageName]) {
          azureResourcePackageUsage[packageName] = [];
        }

        azureResourcePackageUsage[packageName].push(normalizeRelative(filePath));
      }
    });
  });

  return {
    v4Registrations: deduplicateObjects(v4Registrations, function (entry) {
      return (entry.name + '|' + entry.registrationMethod + '|' + entry.file);
    }),

    durableRegistrations: deduplicateObjects(durableRegistrations, function (entry) {
      return (entry.name + '|' + entry.registrationMethod + '|' + entry.file);
    }),

    environmentUsage: normalizeUsageMap(environmentUsage),

    azureResourcePackageUsage: normalizeUsageMap(azureResourcePackageUsage)
  };
}

function packageMajor(version) {
  if (typeof version !== 'string') {
    return null;
  }

  const match = version.match(/(\d+)(?:\.\d+)?/);

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

function determineProgrammingModel(legacyFunctions, v4Registrations, packageInfo) {
  if (legacyFunctions.length > 0 && v4Registrations.length > 0) {
    return {
      value: 'mixed', evidenceStatus: 'CONFIRMED'
    };
  }

  if (v4Registrations.length > 0) {
    return {
      value: 'v4', evidenceStatus: 'CONFIRMED'
    };
  }

  if (legacyFunctions.length > 0) {
    return {
      value: 'legacy', evidenceStatus: 'CONFIRMED'
    };
  }

  const azureFunctionsVersion = packageInfo.dependencies['@azure/functions'] || packageInfo.devDependencies['@azure/functions'];

  const major = packageMajor(azureFunctionsVersion);

  if (major !== null && major >= 4) {
    return {
      value: 'v4', evidenceStatus: 'INFERRED'
    };
  }

  return {
    value: 'unknown', evidenceStatus: 'UNKNOWN'
  };
}

function determineFunctionsRuntime(hostInfo) {
  const extensionBundle = hostInfo && hostInfo.extensionBundle;

  if (!extensionBundle || typeof extensionBundle.version !== 'string') {
    return {
      value: null, evidenceStatus: 'UNKNOWN'
    };
  }

  if (/^\s*\[\s*4\.\*/.test(extensionBundle.version)) {
    return {
      value: 'v4',
      evidenceStatus: 'INFERRED',
      evidence: [{
        type: 'HOST_EXTENSION_BUNDLE',
        path: hostInfo.path,
        id: extensionBundle.id,
        version: extensionBundle.version
      }]
    };
  }

  return {
    value: null,
    evidenceStatus: 'UNKNOWN',
    evidence: [{
      type: 'HOST_EXTENSION_BUNDLE',
      path: hostInfo.path,
      id: extensionBundle.id,
      version: extensionBundle.version
    }]
  };
}

function determineDurable(packageInfo, legacyFunctions, durableRegistrations) {
  const packageVersion = packageInfo.dependencies['durable-functions'] || packageInfo.devDependencies['durable-functions'] || null;

  const legacyDurable = legacyFunctions.filter(function (fn) {
    return fn.durableRole !== null;
  });

  const detected = Boolean(packageVersion) || legacyDurable.length > 0 || durableRegistrations.length > 0;

  if (!detected) {
    return {
      detected: false, packageVersion: null, evidenceStatus: 'NOT_APPLICABLE'
    };
  }

  return {
    detected: true,
    packageVersion: packageVersion,
    evidenceStatus: legacyDurable.length > 0 || durableRegistrations.length > 0 ? 'CONFIRMED' : 'INFERRED'
  };
}

function determineAppConfidence(packageInfo) {
  const hasAzureFunctions = Boolean(packageInfo.dependencies['@azure/functions']) || Boolean(packageInfo.devDependencies['@azure/functions']);

  return hasAzureFunctions ? 'CONFIRMED' : 'INFERRED';
}

function buildV4Functions(v4Registrations, durableRegistrations) {
  const functions = [];

  v4Registrations.forEach(function (registration) {
    functions.push({
      name: registration.name,
      source: 'V4_REGISTRATION',
      programmingModel: 'v4',
      evidenceStatus: registration.evidenceStatus,
      file: registration.file,
      trigger: {
        type: registration.triggerType, registrationMethod: registration.registrationMethod
      },
      durableRole: null
    });
  });

  durableRegistrations.forEach(function (registration) {
    functions.push({
      name: registration.name,
      source: 'DURABLE_V4_REGISTRATION',
      programmingModel: 'v4',
      evidenceStatus: registration.evidenceStatus,
      file: registration.file,
      trigger: {
        type: registration.registrationMethod + 'Trigger', registrationMethod: registration.registrationMethod
      },
      durableRole: registration.role
    });
  });

  return deduplicateObjects(functions, function (entry) {
    return (entry.name + '|' + entry.source + '|' + (entry.file || ''));
  });
}

function buildConfigurationKeys(environmentUsage) {
  return Object.keys(environmentUsage)
    .sort()
    .map(function (key) {
      return {
        key: key, usedByFiles: environmentUsage[key], evidenceStatus: 'CONFIRMED'
      };
    });
}

function buildSharedResourceCandidates(azureResourcePackageUsage) {
  const candidates = [];

  Object.keys(azureResourcePackageUsage)
    .sort()
    .forEach(function (packageName) {
      const files = azureResourcePackageUsage[packageName];

      if (files.length < 2) {
        return;
      }

      candidates.push({
        id: 'CANDIDATE-' + packageName
          .replace(/^@/, '')
          .replace(/[^A-Za-z0-9]+/g, '-')
          .toUpperCase(),

        type: KNOWN_AZURE_RESOURCE_PACKAGES[packageName],

        package: packageName, paths: files, consumers: [], ownership: null, evidenceStatus: 'INFERRED',

        evidence: [{
          type: 'PACKAGE_USAGE', package: packageName, paths: files
        }]
      });
    });

  return candidates;
}

function buildFunctionApp(candidate, files, warnings) {
  const appRoot = candidate.directory;

  const appFiles = filesUnderRoot(files, appRoot);

  const packageInfo = packageMetadata(appRoot, warnings);

  const hostInfo = hostMetadata(appRoot, warnings);

  const legacyFunctions = findLegacyFunctions(appRoot, appFiles, warnings);

  const sourceScan = scanSources(sourceFiles(appFiles), warnings);

  const v4Functions = buildV4Functions(sourceScan.v4Registrations, sourceScan.durableRegistrations);

  const programmingModel = determineProgrammingModel(legacyFunctions, sourceScan.v4Registrations.concat(sourceScan.durableRegistrations), packageInfo);

  const durable = determineDurable(packageInfo, legacyFunctions, sourceScan.durableRegistrations);

  return {
    root: normalizeRelative(appRoot) || '.',

    evidenceStatus: determineAppConfidence(packageInfo),

    host: hostInfo,

    package: packageInfo,

    platform: {
      node: {
        declared: packageInfo.engines && packageInfo.engines.node ? packageInfo.engines.node : null,

        evidenceStatus: packageInfo.engines && packageInfo.engines.node ? 'CONFIRMED' : 'UNKNOWN'
      },

      functionsRuntime: determineFunctionsRuntime(hostInfo),

      programmingModel: programmingModel
    },

    durable: durable,

    dependencies: dependencyList(packageInfo),

    functions: legacyFunctions.concat(v4Functions),

    configurationKeys: buildConfigurationKeys(sourceScan.environmentUsage),

    azureResourcePackageUsage: sourceScan.azureResourcePackageUsage,

    sharedResourceCandidates: buildSharedResourceCandidates(sourceScan.azureResourcePackageUsage)
  };
}

function createInventory() {
  const files = [];
  const protectedFiles = [];
  const warnings = [];

  walkRepository(ROOT, files, protectedFiles);

  const candidates = findFunctionAppRoots(files);

  const functionApps = candidates.map(function (candidate) {
    return buildFunctionApp(candidate, files, warnings);
  });

  return {
    schemaVersion: '1',

    tool: {
      name: 'inventory', runtimeCompatibility: 'node>=14'
    },

    repository: {
      root: ROOT
    },

    functionApps: functionApps,

    sensitiveFilesDetected: protectedFiles.sort(function (a, b) {
      return a.path.localeCompare(b.path);
    }),

    warnings: warnings
  };
}

function main() {
  try {
    const inventory = createInventory();

    process.stdout.write(JSON.stringify(inventory, null, 2) + '\n');
  } catch (error) {
    process.stderr.write('[inventory] ' + error.message + '\n');

    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  createInventory: createInventory,
  classifyProtectedFile: classifyProtectedFile,
  isCiCdFile: isCiCdFile,
  isAzurePackage: isAzurePackage,
  extractEnvironmentKeys: extractEnvironmentKeys,
  determineProgrammingModel: determineProgrammingModel,
  buildSharedResourceCandidates: buildSharedResourceCandidates
};
