using GenerateImage.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Text.Json.Serialization;

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
        public async Task<Output> Run([QueueTrigger("img")] Input input)
        {


            //_logger.LogInformation($"C# Queue trigger function processed: {message}");

            string imagePrompt = await _azureOpenAIService.GenerateImagePrompt(input.Prompt);
            byte[] imageBytes = await _azureOpenAIService.GenerateImageFromPrompt(imagePrompt);
            await _imageStorageService.UploadImageAsync(imageBytes, $"{input.Id}.png");

            return new Output
            {
                ImageEntry = new ImageEntry
                {
                    Id = input.Id,
                    ImagePrompt = imagePrompt,
                    UserId = "user"
                }
            };
        }

    }

    public class Input
    {
        [JsonPropertyName("id")]
        public required string Id { get; set; }

        [JsonPropertyName("prompt")]
        public required string Prompt { get; set; }
    }

    public class Output
    {


        [CosmosDBOutput(databaseName: "stu-kickoff", containerName: "image-entry", Connection = "AZURE_COSMOSDB_CONNECTION_STRING")]

        public required ImageEntry ImageEntry { get; set; }

    }
}
