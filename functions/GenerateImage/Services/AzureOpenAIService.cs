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

            ChatMessage chatMessage = new SystemChatMessage("" +
                "You are an expert in writing prompts for DALLE Image generation. " +
                "First, extract the character the user is asking you to create." +
                "Second, extract the unique attributes of the character. " +
                "Finally, re-write a new prompt using the template below and ensuring to capture the character clearly along with it's attributes." +
                "<template> " +
                "Create a highly detailed, isometric Minecraft-style rendering of a [character] as a Minecraft character. Transform the [character] into a blocky, pixelated figure while preserving its iconic shape and expressive features, such as its large, friendly eyes, and distinctive traits.\r\n\r\nThe background should be a clean, plain white to keep the focus solely on the [character] without any distractions." +
                "<template>");
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
