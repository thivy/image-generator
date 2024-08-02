using Azure;
using Azure.AI.OpenAI;
using GenerateImage.AppConfiguration;
using Microsoft.Extensions.Options;
using OpenAI.Chat;
using OpenAI.Images;
using System.ClientModel;

namespace GenerateImage.Services
{
    public class AzureOpenAIService
    {
        private readonly AzureOpenAISettings openAISettings;

        private readonly AzureOpenAIClient azureOpenAIClient;

        public AzureOpenAIService(IOptions<AzureOpenAISettings> configuration)
        {
            openAISettings = configuration.Value;

            azureOpenAIClient = new(
                new Uri(openAISettings.ENDPOINT),
                new AzureKeyCredential(openAISettings.API_KEY));
        }

        public async Task<string> GenerateImagePrompt(string userPrompt)
        {

            ChatClient chatClient = azureOpenAIClient.GetChatClient(openAISettings.DEPLOYMENT_NAME);

            ChatMessage chatMessage = new SystemChatMessage("You are an expert in crafting prompts for DALL·E image generation. Follow these steps:\r\n\r\n1. Identify the subject the user wants to be depicted.\r\n2. Note the unique attributes and distinctive features of the subject.\r\n3. Use the provided template to create a new prompt, ensuring the subject and its attributes are clearly and accurately described.\r\n\r\n**Template:**\r\n\r\nCreate a minimalistic, isometric Minecraft-style rendering of a colorful [subject] as a Minecraft character. Ensure the full image is clearly visible and the [subject] centered in the composition.\r\n\r\nThe [subject] should be placed on a simple, isometric island. The background should be a clean and plain to keep the focus solely on the minimalistic, colorful [subject] and the island without any distractions.\r\n\r\n");
            ChatMessage useMessage = new UserChatMessage(userPrompt + "Rewrite this prompt and ensure you capture the character and the attributes clearly.");

            ClientResult<ChatCompletion> response = await chatClient.CompleteChatAsync([chatMessage, useMessage]);
            string imagePrompt = response.Value.Content[0].Text;

            return imagePrompt;
        }

        public async Task<byte[]> GenerateImageFromPrompt(string imagePrompt)
        {
            ImageClient imageClient = azureOpenAIClient.GetImageClient(openAISettings.IMAGE_DEPLOYMENT_NAME);

            ImageGenerationOptions imageGenerationOptions = new ImageGenerationOptions
            {
                Quality = GeneratedImageQuality.High,
                Size = GeneratedImageSize.W1024xH1024,
                Style = GeneratedImageStyle.Vivid,
                ResponseFormat = GeneratedImageFormat.Bytes
            };

            ClientResult<GeneratedImage> img = await imageClient.GenerateImageAsync(imagePrompt, imageGenerationOptions);
            return img.Value.ImageBytes.ToArray();
        }
    }


}
