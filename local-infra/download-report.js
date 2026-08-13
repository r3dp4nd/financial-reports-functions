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

  const target = `/tmp/${reportId}-financial-report.xlsx`;

  await blobClient.downloadToFile(target);

  console.log(target);
}

main()
  .catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
