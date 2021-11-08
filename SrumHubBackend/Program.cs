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
    c.IncludeXmlComments(string.Format(@"{0}\SrumHubBackend.xml", AppDomain.CurrentDomain.BaseDirectory));
});
builder.Services.AddMediatR(new[] { Assembly.GetExecutingAssembly() });
builder.Services.AddSingleton<IGitHubClientFactory, ScrumHubGitHubClientFactory>();
builder.Logging.AddFilter("Microsoft", LogLevel.Warning);
builder.Logging.AddFilter("System", LogLevel.Error);

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
}

/*
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();

        (HttpStatusCode code, string responseContent) = exceptionHandlerPathFeature?.Error switch
        {
            InvalidOperationException e => (HttpStatusCode.BadRequest, $"Invalid operation: {e.Message}"),
            Exception e => (HttpStatusCode.InternalServerError, $"{e.Message}"),
            _ => (HttpStatusCode.InternalServerError, "Unknown error"),
        };

        context.Response.StatusCode = (int)code;
        context.Response.ContentType = "text/plain";

        await context.Response.WriteAsync(responseContent);
    });
    errorApp.UseHsts();
});
*/

app.UseMiddleware<ScrumHubBackend.ExceptionHandlerMiddleware>();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
