using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace GenerateImage.Services
{
    public class ImageEntry
    {

        [JsonProperty("id")]
        public required string Id { get; set; }

        [JsonProperty("userPrompt")]
        public required string UserPrompt { get; set; }

        [JsonProperty("imagePrompt")]
        public required string ImagePrompt { get; set; }

        [JsonProperty("userId")]
        public required string UserId { get; set; }

        [JsonProperty("status")]
        [JsonConverter(typeof(StringEnumConverter))]
        public required StatusEnum Status { get; set; }

        [JsonProperty("errorMessage")]
        public required string ErrorMessage { get; set; }

    }
    public enum StatusEnum
    {
        Pending,
        Error,
        Success,
        Processing
    }
}
