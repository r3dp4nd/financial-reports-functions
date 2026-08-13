"use strict";

const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const childProcess = require("child_process");

const INVENTORY_SCRIPT = path.resolve(__dirname, "inventory.js");

function createTempRepository() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "azure-functions-inventory-"));
}

function writeFile(root, relativePath, content) {
  const absolutePath = path.join(root, relativePath);

  fs.mkdirSync(path.dirname(absolutePath), {
    recursive: true
  });

  fs.writeFileSync(absolutePath, content, "utf8");
}

function writeJson(root, relativePath, value) {
  writeFile(root, relativePath, JSON.stringify(value, null, 2));
}

function executeInventory(repositoryRoot) {
  const output = childProcess.execFileSync(process.execPath, [INVENTORY_SCRIPT, repositoryRoot], {
    encoding: "utf8"
  });

  return JSON.parse(output);
}

function removeRepository(root) {
  fs.rmSync(root, {
    recursive: true, force: true
  });
}

function test(name, action) {
  try {
    action();

    process.stdout.write("PASS " + name + "\n");
  } catch (error) {
    process.stderr.write("FAIL " + name + "\n");

    throw error;
  }
}

function createBasicHost(root) {
  writeJson(root, "host.json", {
    version: "2.0"
  });
}

function runTests() {
  test("detecta una Function App legacy", function () {
    const root = createTempRepository();

    try {
      createBasicHost(root);

      writeJson(root, "package.json", {
        name: "legacy-functions", engines: {
          node: "14.x"
        }, dependencies: {
          "@azure/functions": "^1.2.3"
        }
      });

      writeJson(root, "RequestReport/function.json", {
        bindings: [{
          name: "req", type: "httpTrigger", direction: "in"
        }, {
          name: "res", type: "http", direction: "out"
        }]
      });

      writeFile(root, "RequestReport/index.ts", ["const database =", "  process.env.COSMOS_DATABASE;"].join("\n"));

      const result = executeInventory(root);

      assert.strictEqual(result.functionApps.length, 1);

      const app = result.functionApps[0];

      assert.strictEqual(app.status, "CONFIRMED");

      assert.strictEqual(app.programmingModel.version, "v3-or-earlier");

      assert.strictEqual(app.programmingModel.status, "CONFIRMED");

      assert.strictEqual(app.functions.length, 1);

      assert.strictEqual(app.functions[0].name, "RequestReport");

      assert.strictEqual(app.functions[0].trigger, "httpTrigger");

      assert.deepStrictEqual(app.environmentKeys, [{
        name: "COSMOS_DATABASE", references: ["RequestReport/index.ts"]
      }]);
    } finally {
      removeRepository(root);
    }
  });

  test("detecta múltiples Function Apps", function () {
    const root = createTempRepository();

    try {
      createBasicHost(path.join(root, "app-a"));

      writeJson(root, "app-a/package.json", {
        name: "app-a", dependencies: {
          "@azure/functions": "^1.2.3"
        }
      });

      createBasicHost(path.join(root, "app-b"));

      writeJson(root, "app-b/package.json", {
        name: "app-b", dependencies: {
          "@azure/functions": "^4.0.0"
        }
      });

      const result = executeInventory(root);

      assert.strictEqual(result.functionApps.length, 2);

      const paths = result.functionApps
        .map(function (app) {
          return app.path;
        })
        .sort();

      assert.deepStrictEqual(paths, ["app-a", "app-b"]);
    } finally {
      removeRepository(root);
    }
  });

  test("detecta archivos sensibles sin leer su contenido", function () {
    const root = createTempRepository();

    try {
      createBasicHost(root);

      writeJson(root, "package.json", {
        name: "sensitive-functions", dependencies: {
          "@azure/functions": "^4.0.0"
        }
      });

      writeFile(root, "local.settings.json", "THIS_IS_NOT_VALID_JSON_AND_MUST_NOT_BE_READ");

      writeFile(root, ".env", "SUPER_SECRET=value");

      writeFile(root, "src/example.ts", "const name = process.env.REPORT_CONTAINER;");

      const result = executeInventory(root);

      const sensitivePaths = result
        .sensitiveFilesDetected
        .map(function (item) {
          return item.path;
        });

      assert.ok(sensitivePaths.includes("local.settings.json"));

      assert.ok(sensitivePaths.includes(".env"));

      result
        .sensitiveFilesDetected
        .forEach(function (item) {
          assert.strictEqual(item.contentRead, false);
        });

      assert.strictEqual(result.warnings.length, 0);

      assert.deepStrictEqual(result.functionApps[0].environmentKeys, [{
        name: "REPORT_CONTAINER", references: ["src/example.ts"]
      }]);
    } finally {
      removeRepository(root);
    }
  });

  test("detecta Programming Model v4", function () {
    const root = createTempRepository();

    try {
      createBasicHost(root);

      writeJson(root, "package.json", {
        name: "v4-functions", main: "dist/functions/*.js", dependencies: {
          "@azure/functions": "^4.16.0"
        }
      });

      writeFile(root, "src/functions/request-report.function.ts", ["import { app } from '@azure/functions';", "", "app.http('RequestReport', {", "  handler: async () => ({", "    status: 200", "  })", "});"].join("\n"));

      const result = executeInventory(root);

      const app = result.functionApps[0];

      assert.strictEqual(app.programmingModel.version, "v4");

      assert.strictEqual(app.programmingModel.status, "CONFIRMED");

      assert.strictEqual(app.functions.length, 1);

      assert.strictEqual(app.functions[0].name, "RequestReport");

      assert.strictEqual(app.functions[0].programmingModel, "v4");
    } finally {
      removeRepository(root);
    }
  });

  test("detecta múltiples registros v4 en un mismo archivo", function () {
    const root = createTempRepository();

    try {
      createBasicHost(root);

      writeJson(root, "package.json", {
        name: "multiple-v4-functions", dependencies: {
          "@azure/functions": "^4.16.0"
        }
      });

      writeFile(root, "src/functions/http.function.ts", ["import { app } from '@azure/functions';", "", "app.http('FunctionA', {", "  handler: async () => ({ status: 200 })", "});", "", "app.http('FunctionB', {", "  handler: async () => ({ status: 200 })", "});"].join("\n"));

      const result = executeInventory(root);

      const names = result.functionApps[0]
        .functions
        .map(function (fn) {
          return fn.name;
        })
        .sort();

      assert.deepStrictEqual(names, ["FunctionA", "FunctionB"]);
    } finally {
      removeRepository(root);
    }
  });

  test("marca como desconocido un estado mixto legacy y v4", function () {
    const root = createTempRepository();

    try {
      createBasicHost(root);

      writeJson(root, "package.json", {
        name: "mixed-functions", dependencies: {
          "@azure/functions": "^4.16.0"
        }
      });

      writeJson(root, "LegacyFunction/function.json", {
        bindings: [{
          name: "timer", type: "timerTrigger", direction: "in"
        }]
      });

      writeFile(root, "src/functions/new.function.ts", ["import { app } from '@azure/functions';", "", "app.http('NewFunction', {", "  handler: async () => ({ status: 200 })", "});"].join("\n"));

      const result = executeInventory(root);

      const model = result.functionApps[0].programmingModel;

      assert.strictEqual(model.version, null);

      assert.strictEqual(model.status, "UNKNOWN");

      assert.ok(typeof model.warning === "string");
    } finally {
      removeRepository(root);
    }
  });

  test("detecta Durable Functions v4", function () {
    const root = createTempRepository();

    try {
      createBasicHost(root);

      writeJson(root, "package.json", {
        name: "durable-functions-v4", dependencies: {
          "@azure/functions": "^4.16.0", "durable-functions": "^3.5.0"
        }
      });

      writeFile(root, "src/functions/durable.function.ts", ["import * as df from 'durable-functions';", "", "df.app.orchestration(", "  'ReportOrchestrator',", "  function* () {}", ");", "", "df.app.activity(", "  'GenerateExcel',", "  { handler: async () => null }", ");"].join("\n"));

      const result = executeInventory(root);

      const app = result.functionApps[0];

      assert.strictEqual(app.durableFunctionsDetected, true);

      const orchestrator = app.functions.find(function (fn) {
        return (fn.name === "ReportOrchestrator");
      });

      const activity = app.functions.find(function (fn) {
        return (fn.name === "GenerateExcel");
      });

      assert.ok(orchestrator);

      assert.ok(activity);

      assert.strictEqual(orchestrator.durableRole, "orchestrator");

      assert.strictEqual(activity.durableRole, "activity");

      assert.strictEqual(app.programmingModel.version, "v4");
    } finally {
      removeRepository(root);
    }
  });

  process.stdout.write("\nAll repository-inventory tests passed.\n");
}

runTests();
