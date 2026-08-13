describe("blob storage client", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();

    process.env = {
      ...originalEnv,
      STORAGE_CONNECTION:
        "DefaultEndpointsProtocol=https;AccountName=testaccount;AccountKey=test-key;EndpointSuffix=core.windows.net",
      STORAGE_REPORTS_CONTAINER:
        "reports",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it("should create Blob Service Client", async () => {
    const {BlobServiceClient} = await import("@azure/storage-blob");
    const blobModule = await import("./blob-storage.client");

    expect(blobModule.blobServiceClient)
      .toBeInstanceOf(BlobServiceClient);
  });

  it("should create reports blob container", async () => {
    const blobModule = await import("./blob-storage.client");

    expect(blobModule.reportsBlobContainer)
      .toBeDefined();
  });

  it("should expose a ContainerClient", async () => {
    const {ContainerClient} = await import("@azure/storage-blob");
    const blobModule = await import("./blob-storage.client");

    expect(blobModule.reportsBlobContainer)
      .toBeInstanceOf(ContainerClient);
  });
});
