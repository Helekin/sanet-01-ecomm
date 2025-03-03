using dotenv.net;
using Microsoft.EntityFrameworkCore;

using Infrastructure.Data;
using Core.Interfaces;

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

builder.Services.AddScoped<IProductRepository, ProductRepository>();

var app = builder.Build();

app.MapControllers();

app.Run();
