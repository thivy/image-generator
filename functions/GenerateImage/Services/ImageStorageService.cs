using Azure.Storage.Blobs;
using GenerateImage.AppConfiguration;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Options;

namespace GenerateImage.Services
{
    public class ImageStorageService
    {
        private readonly BlobContainerClient _copyContainerClient;

        private readonly CosmosClient _cosmosClient;
        public ImageStorageService(IAzureClientFactory<BlobServiceClient> blobClientFactory, IOptions<AzureStorageSettings> options, CosmosClient cosmosClient)
        {
            AzureStorageSettings settings = options.Value;
            _copyContainerClient = blobClientFactory
                .CreateClient(Defaults.BLOB_OUTPUT)
                .GetBlobContainerClient(settings.CONTAINER);

            _cosmosClient = cosmosClient;

        }

        public async Task UpsertImageEntry(ImageEntry imageEntry)
        {
            Database database = await _cosmosClient.CreateDatabaseIfNotExistsAsync("stu-kickoff");
            Container container = await database.CreateContainerIfNotExistsAsync("image-entry", "/userId");
            PartitionKey partitionKey = new PartitionKey(imageEntry.UserId);
            await container.UpsertItemAsync<ImageEntry>(imageEntry, partitionKey);
        }

        public async Task<List<ImageEntry>> FindTopItemsToBeProcessed(int topCount = 5)
        {
            Database database = await _cosmosClient.CreateDatabaseIfNotExistsAsync("stu-kickoff");
            Container container = await database.CreateContainerIfNotExistsAsync("image-entry", "/userId");
            QueryDefinition queryDefinition = new QueryDefinition($"SELECT TOP {topCount} * FROM c WHERE c.status = 'Error' ORDER BY c._ts ASC");
            FeedIterator<ImageEntry> feedIterator = container.GetItemQueryIterator<ImageEntry>(queryDefinition);

            List<ImageEntry> imageEntries = new List<ImageEntry>();

            while (feedIterator.HasMoreResults)
            {
                FeedResponse<ImageEntry> response = await feedIterator.ReadNextAsync();
                foreach (ImageEntry imageEntry in response)
                {
                    // Process the image
                    imageEntries.Add(imageEntry);
                }
            }

            return imageEntries;
        }

        public async Task UploadImageAsync(byte[] imageBytes, string name)
        {
            BlobClient blobClient = _copyContainerClient.GetBlobClient(name);
            await blobClient.UploadAsync(new MemoryStream(imageBytes), overwrite: true);
        }
    }
}
