namespace GenerateImage.AppConfiguration
{
    public class AzureOpenAISettings
    {
        public required string API_KEY { get; set; }
        public required string ENDPOINT { get; set; }
        public required string DEPLOYMENT_NAME { get; set; }
        public required string IMAGE_DEPLOYMENT_NAME { get; set; }
    }
}