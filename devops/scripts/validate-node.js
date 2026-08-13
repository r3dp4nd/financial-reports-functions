"use strict";

const fs = require("fs");
const path = require("path");

const expectedMajor = Number(process.argv[2] || "24");

if (!Number.isInteger(expectedMajor)) {
  console.error("Expected Node.js major version must be an integer.");
  process.exit(1);
}

const actualMajor = Number(process.versions.node.split(".")[0]);

if (actualMajor !== expectedMajor) {
  console.error(`Expected Node.js ${expectedMajor}.x but found ${process.version}.`);
  process.exit(1);
}

const packageJsonPath = path.resolve(process.cwd(), "package.json");

if (!fs.existsSync(packageJsonPath)) {
  console.error("package.json was not found.");
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

if (!packageJson.engines || !packageJson.engines.node) {
  console.error("package.json must define engines.node.");
  process.exit(1);
}

console.log(`Node.js runtime: ${process.version}`);

console.log(`package.json engines.node: ${packageJson.engines.node}`);

console.log("Node.js validation passed.");
