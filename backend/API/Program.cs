using dotenv.net;
using Microsoft.EntityFrameworkCore;

using Infrastructure.Data;
using Core.Interfaces;
using API.Middleware;

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
    opt.UseSqlServer(connectionString);
});

builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddCors();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins("*"));

app.MapControllers();

app.Run();
