using dotenv.net;
using Microsoft.EntityFrameworkCore;

using Infrastructure.Data;
using Core.Interfaces;
using API.Middleware;
using StackExchange.Redis;
using Infrastructure.Services;

DotEnv.Load();

var envs = DotEnv.Read();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")?
.Replace("${DB_SERVER}", envs["DB_SERVER"])
.Replace("${DB_PORT}", envs["DB_PORT"])
.Replace("${DB_NAME}", envs["DB_NAME"])
.Replace("${DB_USER}", envs["DB_USER"])
.Replace("${DB_PASSWORD}", envs["DB_PASSWORD"]);

builder.Services.AddControllers();
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
});

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddCors();
builder.Services.AddSingleton<IConnectionMultiplexer>(config =>
{
    var redisConnectionString = builder.Configuration.GetConnectionString("Redis")?
    .Replace("${REDIS_SERVER}", envs["REDIS_SERVER"])
    .Replace("${REDIS_PORT}", envs["REDIS_PORT"]);

    if (string.IsNullOrWhiteSpace(redisConnectionString)) throw new Exception("Redis connection string is null or empty.");

    var configuration = ConfigurationOptions.Parse(redisConnectionString, true);
    return ConnectionMultiplexer.Connect(configuration);
});
builder.Services.AddSingleton<ICartService, CartService>();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("*"));

app.MapControllers();

try
{
    using var scope = app.Services.CreateScope();

    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<StoreContext>();

    await context.Database.MigrateAsync();

    await StoreContextSeed.SeedAsync(context);

}
catch (Exception ex)
{
    Console.WriteLine(ex);
    throw;
}

app.Run();
