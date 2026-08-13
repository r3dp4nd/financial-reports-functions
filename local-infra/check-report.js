const {BlobServiceClient} = require("@azure/storage-blob");

async function main() {

  const reportId = process.argv[2];

  if (!reportId) {
    throw new Error("reportId argument is required");
  }

  const serviceClient = BlobServiceClient.fromConnectionString("UseDevelopmentStorage=true");

  const containerClient = serviceClient.getContainerClient("reports");

  const blobName = `${reportId}/financial-report.xlsx`;

  const blobClient = containerClient.getBlobClient(blobName);

  const exists = await blobClient.exists();

  console.log({
    reportId, blobName, exists
  });
}

main()
  .catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
