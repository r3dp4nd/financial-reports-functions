const {
  BlobServiceClient
} = require("@azure/storage-blob");

const CONNECTION_STRING = "UseDevelopmentStorage=true";
const REPORTS_CONTAINER = "reports";

async function main() {

  const serviceClient = BlobServiceClient.fromConnectionString(CONNECTION_STRING);

  const containerClient = serviceClient.getContainerClient(REPORTS_CONTAINER);

  const result = await containerClient.createIfNotExists();

  if (result.succeeded) {

    console.log(`Blob container '${REPORTS_CONTAINER}' created.`);

    return;
  }

  console.log(`Blob container '${REPORTS_CONTAINER}' already exists.`);
}

main()
  .catch(error => {

    console.error("Unable to initialize local Blob Storage.", error instanceof Error ? error.message : error);

    process.exitCode = 1;
  });
