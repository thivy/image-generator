using GenerateImage.AppConfiguration;
using Microsoft.Extensions.Hosting;

IHost host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureEnvironment()
    .ConfigureImageServices()
    .Build();

host.Run();

