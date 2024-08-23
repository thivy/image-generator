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
                "### Instructions:\r\n1. **Subject:** Clearly identify the jewelry piece or concept that needs to be visualized.\r\n2. **Attributes:** Highlight specific design elements, materials, style, and any unique features that set the piece apart.\r\n3. **Prompt Structure:** Use the provided template to guide the description, focusing on creating a design that is minimal, elegant, and luxurious.\r\n\r\n### Revised Template:\r\n\"Design an exquisite, high-end piece of minimal yet elegant jewelry, such as a `[subject]`. The `[subject]` should feature clean, refined details with `[material(s)]`, focusing on understated sophistication and modern simplicity. The design should highlight `[specific attributes, such as gemstone cut, sleek metalwork, or minimalist motifs]`, resulting in a visually striking piece that blends timeless elegance with subtle luxury.\r\n\r\nPlace the `[subject]` against a neutral, refined background to emphasize the understated artistry and graceful details. The overall scene should exude simplicity and elegance while focusing on the delicate beauty and craftsmanship of the expertly designed minimal jewelry piece.\"\r\n\r\n---\r\n\r\n### Example Using the Template:\r\n\"Design an exquisite, high-end diamond bracelet. The bracelet should feature clean, refined details with a slim gold band, focusing on understated sophistication and modern simplicity. The design should highlight a single bezel-set diamond centerpiece with sleek, minimalist lines, resulting in a visually striking piece that blends timeless elegance with subtle luxury.\r\n\r\nPlace the bracelet against a neutral, refined background to emphasize the understated artistry and graceful details. The overall scene should exude simplicity and elegance while focusing on the delicate beauty and craftsmanship of the expertly designed minimal jewelry piece.\"\r\n");
            ChatMessage useMessage = new UserChatMessage("Use your imagination to rewrite this prompt and ensure you generate a prompt that is a Jewellery.\n" + userPrompt);

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
