using GenerateImage.Services;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace GenerateImage.AppConfiguration
{
    public static class AppStartup
    {
        public static IHostBuilder ConfigureEnvironment(this IHostBuilder builder)
        {
            builder.ConfigureAppConfiguration((context, config) =>
            {

                if (context.HostingEnvironment.IsDevelopment())
                {
                    config.AddJsonFile("local.settings.json", optional: true, reloadOnChange: true);
                }
                else
                {
                    config.AddJsonFile($"appsettings.{context.HostingEnvironment.EnvironmentName}.json", optional: true, reloadOnChange: true);
                }

                config.AddEnvironmentVariables();
            });

            return builder;
        }

        public static IHostBuilder ConfigureImageServices(this IHostBuilder builder)
        {
            builder.ConfigureServices((hostContext, services) =>
            {
                services.AddOptions<AzureOpenAISettings>().BindConfiguration("AZURE_OPENAI");
                services.AddOptions<AzureStorageSettings>().BindConfiguration("AZURE_STORAGE");

                services.AddAzureClients(clientBuilder =>
                {
                    IConfigurationSection config = hostContext.Configuration.GetSection("AzureWebJobsStorage");

                    clientBuilder
                        .AddBlobServiceClient(config)
                        .WithName(Defaults.BLOB_OUTPUT);
                });

                services.AddScoped<AzureOpenAIService>();
                services.AddScoped<ImageStorageService>();

                services.AddApplicationInsightsTelemetryWorkerService();
                services.ConfigureFunctionsApplicationInsights();




            });

            return builder;
        }
    }
}
