"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const artifactPath = process.argv[2];
const checksumPath = process.argv[3];

if (!artifactPath) {
  fail("Artifact path is required.");
}

if (!checksumPath) {
  fail("Checksum path is required.");
}

const resolvedArtifactPath = path.resolve(artifactPath);

const resolvedChecksumPath = path.resolve(checksumPath);

if (!fs.existsSync(resolvedArtifactPath)) {
  fail(`Artifact does not exist: ${resolvedArtifactPath}`);
}

if (!fs.existsSync(resolvedChecksumPath)) {
  fail(`Checksum file does not exist: ${resolvedChecksumPath}`);
}

const artifact = fs.readFileSync(resolvedArtifactPath);

const expectedChecksum = fs.readFileSync(resolvedChecksumPath, "utf8").trim();

if (!expectedChecksum) {
  fail("Checksum file is empty.");
}

const actualChecksum = crypto
  .createHash("sha256")
  .update(artifact)
  .digest("hex");

if (actualChecksum !== expectedChecksum) {
  console.error("Artifact checksum validation failed.");

  console.error(`Expected: ${expectedChecksum}`);

  console.error(`Actual:   ${actualChecksum}`);

  process.exit(1);
}

console.log("Artifact checksum validation passed.");

console.log(`SHA-256: ${actualChecksum}`);


function fail(message) {
  console.error(message);
  process.exit(1);
}
