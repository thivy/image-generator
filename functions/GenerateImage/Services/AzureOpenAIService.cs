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
                "### Instructions:\r\n1. **Subject:** Clearly identify the jewelry piece or concept that needs to be visualized.\r\n2. **Attributes:** Highlight specific design elements, materials, style, and any unique features that set the piece apart.\r\n3. **Prompt Structure:** Use the provided template to guide the description, focusing on the expertise and precision needed in luxury jewelry design.\r\n\r\n### Revised Template:\r\n\"Design an exquisite, high-end piece of jewelry, such as a `[subject]`. The `[subject]` should feature intricate details with `[material(s)]` and showcase a sophisticated, elegant style. The design should highlight `[specific attributes, such as gemstone cut, metalwork, or artistic motifs]`, resulting in a visually striking piece that blends classic craftsmanship with modern luxury.\r\n\r\nPlace the `[subject]` against a neutral, refined background to emphasize the intricate artistry and luxurious details. The overall scene should exude opulence and refinement while focusing on the brilliance and elegance of the expertly crafted jewelry piece.\"\r\n\r\n---\r\n\r\n### Example Using the Template:\r\n\"Design an exquisite, high-end diamond necklace. The necklace should feature intricate details with platinum settings and showcase a sophisticated, elegant style. The design should highlight a brilliant-cut diamond centerpiece surrounded by delicate floral motifs and pavé-set gemstones, resulting in a visually striking piece that blends classic craftsmanship with modern luxury.\r\n\r\nPlace the necklace against a neutral, refined background to emphasize the intricate artistry and luxurious details. The overall scene should exude opulence and refinement while focusing on the brilliance and elegance of the expertly crafted jewelry piece.\"\r\n");
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
