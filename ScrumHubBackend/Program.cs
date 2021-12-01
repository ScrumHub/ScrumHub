using MediatR;
using ScrumHubBackend;
using ScrumHubBackend.GitHubClient;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<DatabaseContext>(options 
    => options
        .UseSqlServer(builder.Configuration.GetConnectionString("Database"))
        );

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "API", Version = "v1" });
    c.IncludeXmlComments(string.Format(@"{0}ScrumHubBackend.xml", AppDomain.CurrentDomain.BaseDirectory));
});

builder.Services.AddMediatR(new[] { Assembly.GetExecutingAssembly() });

builder.Services.AddSingleton<IGitHubClientFactory, ScrumHubGitHubClientFactory>();
builder.Services.AddSingleton<IGitHubResynchronization, GitHubResynchronization>();

builder.Logging.AddFilter("Microsoft", LogLevel.Warning);
builder.Logging.AddFilter("System", LogLevel.Error);

var corsPolicyName = "_frontendOrigin";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, builder =>
    {
        builder.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowedToAllowWildcardSubdomains();
    });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
}

app.UseMiddleware<ScrumHubBackend.ExceptionHandlerMiddleware>();

app.UseCors(corsPolicyName);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
