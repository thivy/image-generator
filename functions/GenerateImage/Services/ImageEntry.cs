using System.Text.Json.Serialization;

namespace GenerateImage.Services
{
    public class ImageEntry
    {

        [JsonPropertyName("id")]
        public required string Id { get; set; }

        [JsonPropertyName("userPrompt")]
        public required string userPrompt { get; set; }

        [JsonPropertyName("imagePrompt")]
        public required string ImagePrompt { get; set; }

        [JsonPropertyName("userId")]
        public required string UserId { get; set; }
        [JsonPropertyName("userName")]
        public required string UserName { get; set; }

        [JsonPropertyName("status")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public required StatusEnum Status { get; set; }

        [JsonPropertyName("errorMessage")]
        public string? ErrorMessage { get; set; }
    }

    public enum StatusEnum
    {
        Pending,
        Error,
        Success,
        Processing
    }
}
