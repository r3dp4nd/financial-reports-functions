import {getBlobStorageConfig} from "./blob-storage.config";

describe("getBlobStorageConfig", () => {

  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return blob storage configuration", () => {

    process.env.STORAGE_CONNECTION = "UseDevelopmentStorage=true";
    process.env.STORAGE_REPORTS_CONTAINER = "reports";

    const result = getBlobStorageConfig();

    expect(result).toEqual({
      connectionString: "UseDevelopmentStorage=true",
      reportsContainerName: "reports"
    });
  });

  it("should throw when STORAGE_CONNECTION is missing", () => {

    delete process.env.STORAGE_CONNECTION;
    process.env.STORAGE_REPORTS_CONTAINER = "reports";

    expect(() => getBlobStorageConfig())
      .toThrow("STORAGE_CONNECTION is required");
  });

  it("should throw when STORAGE_REPORTS_CONTAINER is missing", () => {

    process.env.STORAGE_CONNECTION = "UseDevelopmentStorage=true";
    delete process.env.STORAGE_REPORTS_CONTAINER;

    expect(() => getBlobStorageConfig())
      .toThrow("STORAGE_REPORTS_CONTAINER is required");
  });

  it("should throw when both variables are missing", () => {

    delete process.env.STORAGE_CONNECTION;
    delete process.env.STORAGE_REPORTS_CONTAINER;

    expect(() => getBlobStorageConfig())
      .toThrow("STORAGE_CONNECTION is required");
  });

});
