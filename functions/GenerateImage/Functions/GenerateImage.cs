using GenerateImage.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace GenerateImage.Functions
{
    public class GenerateImage
    {
        private readonly ILogger<GenerateImage> _logger;
        private readonly AzureOpenAIService _azureOpenAIService;
        private readonly ImageStorageService _imageStorageService;

        public GenerateImage(
            ILogger<GenerateImage> logger,
            AzureOpenAIService azureOpenAIService,
            ImageStorageService imageStorageService)
        {
            _logger = logger;
            _azureOpenAIService = azureOpenAIService;
            _imageStorageService = imageStorageService;
        }

        [Function(nameof(GenerateImage))]
        public async Task<Output> Run([QueueTrigger("img")] string message)
        {
            string id = Guid.NewGuid().ToString();
            _logger.LogInformation($"C# Queue trigger function processed: {message}");

            string imagePrompt = await _azureOpenAIService.GenerateImagePrompt(message);
            byte[] imageBytes = await _azureOpenAIService.GenerateImageFromPrompt(imagePrompt);
            await _imageStorageService.UploadImageAsync(imageBytes, $"{id}.png");

            return new Output
            {
                ImageEntry = new ImageEntry
                {
                    Id = id,
                    ImagePrompt = imagePrompt,
                    ImageId = id,
                    UserId = "user"
                }
            };
        }

    }

    public class Output
    {


        [CosmosDBOutput(databaseName: "platform-engineering", containerName: "image-entry", Connection = "AZURE_COSMOSDB_CONNECTION_STRING")]

        public required ImageEntry ImageEntry { get; set; }

    }
}
