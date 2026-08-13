"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const manifestPath = process.argv[2];
const artifactPath = process.argv[3];
const checksumPath = process.argv[4];

if (!manifestPath) {
  fail("Manifest path is required.");
}

if (!artifactPath) {
  fail("Artifact path is required.");
}

if (!checksumPath) {
  fail("Checksum path is required.");
}

const resolvedManifestPath = path.resolve(manifestPath);

const resolvedArtifactPath = path.resolve(artifactPath);

const resolvedChecksumPath = path.resolve(checksumPath);

assertFileExists(resolvedManifestPath, "Build manifest");

assertFileExists(resolvedArtifactPath, "Artifact");

assertFileExists(resolvedChecksumPath, "Checksum");

const manifest = readManifest(resolvedManifestPath);

validateManifest(manifest);

const expectedChecksum = fs
  .readFileSync(resolvedChecksumPath, "utf8")
  .trim();

if (!expectedChecksum) {
  fail("Checksum file is empty.");
}

const artifactBuffer = fs.readFileSync(resolvedArtifactPath);

const actualChecksum = crypto
  .createHash("sha256")
  .update(artifactBuffer)
  .digest("hex");

const artifactFileName = path.basename(resolvedArtifactPath);

const checksumFileName = path.basename(resolvedChecksumPath);

if (manifest.artifact !== artifactFileName) {
  fail(`Manifest artifact mismatch. ` + `Expected ${artifactFileName}, ` + `found ${manifest.artifact}.`);
}

if (manifest.checksumFile !== checksumFileName) {
  fail(`Manifest checksum file mismatch. ` + `Expected ${checksumFileName}, ` + `found ${manifest.checksumFile}.`);
}

if (manifest.sha256 !== expectedChecksum) {
  fail("Manifest SHA-256 does not match checksum file.");
}

if (manifest.sha256 !== actualChecksum) {
  fail("Artifact SHA-256 does not match build manifest.");
}

console.log("Release manifest validation passed.");

console.log(`Artifact: ${manifest.artifact}`);

console.log(`SHA-256: ${manifest.sha256}`);

console.log(`Commit: ${manifest.commit || "unknown"}`);

console.log(`Build: ${manifest.buildNumber || "unknown"}`);

console.log(`Node: ${manifest.nodeVersion}`);


function assertFileExists(filePath, label) {
  if (!fs.existsSync(filePath)) {
    fail(`${label} does not exist: ${filePath}`);
  }
}


function readManifest(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`Unable to read build manifest: ${error instanceof Error ? error.message : String(error)}`);
  }
}


function validateManifest(manifest) {
  if (!manifest || typeof manifest !== "object") {
    fail("Build manifest is invalid.");
  }

  if (manifest.schemaVersion !== 1) {
    fail(`Unsupported manifest schema version: ${manifest.schemaVersion}`);
  }

  if (typeof manifest.artifact !== "string" || !manifest.artifact) {
    fail("Build manifest artifact is required.");
  }

  if (typeof manifest.checksumFile !== "string" || !manifest.checksumFile) {
    fail("Build manifest checksumFile is required.");
  }

  if (typeof manifest.sha256 !== "string" || !/^[a-f0-9]{64}$/i.test(manifest.sha256)) {
    fail("Build manifest SHA-256 is invalid.");
  }

  if (typeof manifest.nodeVersion !== "string" || !manifest.nodeVersion) {
    fail("Build manifest nodeVersion is required.");
  }
}


function fail(message) {
  console.error(message);
  process.exit(1);
}
