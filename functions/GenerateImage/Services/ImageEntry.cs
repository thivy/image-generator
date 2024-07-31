using System.Text.Json.Serialization;

namespace GenerateImage.Services
{
    public class ImageEntry
    {

        [JsonPropertyName("id")]
        public required string Id { get; set; }
        [JsonPropertyName("imagePrompt")]
        public required string ImagePrompt { get; set; }
        [JsonPropertyName("imageId")]
        public required string ImageId { get; set; }
        [JsonPropertyName("userId")]
        public required string UserId { get; set; }
    }
}
