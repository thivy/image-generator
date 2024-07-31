using Azure.Storage.Blobs;
using GenerateImage.AppConfiguration;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Options;

namespace GenerateImage.Services
{
    public class ImageStorageService
    {
        private readonly BlobContainerClient _copyContainerClient;
        public ImageStorageService(IAzureClientFactory<BlobServiceClient> blobClientFactory, IOptions<AzureStorageSettings> options)
        {
            AzureStorageSettings settings = options.Value;
            _copyContainerClient = blobClientFactory
                .CreateClient(Defaults.BLOB_OUTPUT)
                .GetBlobContainerClient(settings.CONTAINER);
        }

        public async Task UploadImageAsync(byte[] imageBytes, string name)
        {
            await _copyContainerClient.UploadBlobAsync(name, new MemoryStream(imageBytes));
        }
    }
}
