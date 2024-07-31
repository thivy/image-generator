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

            ChatMessage chatMessage = new SystemChatMessage("You are an expert in writing prompts for DALLE Image generation. Rewrite this prompt so it looks like a Disney movie.");
            ChatMessage useMessage = new UserChatMessage(userPrompt);

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
