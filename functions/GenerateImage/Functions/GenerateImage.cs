using GenerateImage.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

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

        private async Task ProcessImageEntry(ImageEntry imageEntry)
        {
            try
            {
                imageEntry.Status = StatusEnum.Processing;
                await _imageStorageService.UpsertImageEntry(imageEntry);

                _logger.LogInformation($"Processing image entry: {imageEntry.Id}");
                string imagePrompt = await _azureOpenAIService.GenerateImagePrompt(imageEntry.UserPrompt);
                byte[] imageBytes = await _azureOpenAIService.GenerateImageFromPrompt(imagePrompt);
                await _imageStorageService.UploadImageAsync(imageBytes, $"{imageEntry.Id}.png");

                imageEntry.Status = StatusEnum.Success;
                imageEntry.ImagePrompt = imagePrompt;

                await _imageStorageService.UpsertImageEntry(imageEntry);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error processing image entry");
                imageEntry.Status = StatusEnum.Error;
                imageEntry.ErrorMessage = e.Message;
                await _imageStorageService.UpsertImageEntry(imageEntry);
            }
        }

        [Function(nameof(RunOnTimer))]
        //[FixedDelayRetry(5, "00:00:10")]
        public async Task RunOnTimer([TimerTrigger("*/15 * * * * *")] TimerInfo timerInfo, FunctionContext context)
        {
            List<ImageEntry> items = await _imageStorageService.FindTopItemsToBeProcessed(15);

            // list of promises
            List<Task> promises = new List<Task>();

            foreach (ImageEntry input in items)
            {
                Task promise = ProcessImageEntry(input);
                promises.Add(promise);
            }
            await Task.WhenAll(promises);
        }

        [Function(nameof(GenerateImage))]
        public async Task Run([QueueTrigger("img")] Input input)
        {

            ImageEntry imageEntry = new ImageEntry
            {
                Id = input.Id,
                ImagePrompt = "",
                UserId = input.UserId,
                Status = StatusEnum.Processing,
                UserPrompt = input.UserPrompt,
                ErrorMessage = ""
            };

            try
            {

                await _imageStorageService.UpsertImageEntry(imageEntry);

                _logger.LogInformation($"C# Queue trigger function processed: {input}");
                string imagePrompt = await _azureOpenAIService.GenerateImagePrompt(input.UserPrompt);
                byte[] imageBytes = await _azureOpenAIService.GenerateImageFromPrompt(imagePrompt);
                await _imageStorageService.UploadImageAsync(imageBytes, $"{input.Id}.png");

                imageEntry.Status = StatusEnum.Success;
                imageEntry.ImagePrompt = imagePrompt;

                await _imageStorageService.UpsertImageEntry(imageEntry);

            }
            catch (Exception e)
            {
                _logger.LogError(e, "Error processing queue message");
                imageEntry.Status = StatusEnum.Error;
                imageEntry.ErrorMessage = e.Message;
                await _imageStorageService.UpsertImageEntry(imageEntry);

            }

        }
    }

    public class Input
    {
        [JsonProperty("id")]
        public required string Id { get; set; }

        [JsonProperty("userPrompt")]
        public required string UserPrompt { get; set; }

        [JsonProperty("userId")]
        public required string UserId { get; set; }
    }

    public class Output
    {


        [CosmosDBOutput(databaseName: "stu-kickoff", containerName: "image-entry", Connection = "AZURE_COSMOSDB_CONNECTION_STRING")]

        public required ImageEntry ImageEntry { get; set; }

    }
}
