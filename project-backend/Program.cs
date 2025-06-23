using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using CloudinaryDotNet;
using Microsoft.Extensions.Options;
using project_backend.Data;
using project_backend.Data.Seed;
using Microsoft.AspNetCore.Identity;
using project_backend.Models;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];

// Register MVC services
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(60);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login"; // adjust as needed
        options.AccessDeniedPath = "/Account/AccessDenied"; // optional
        options.ExpireTimeSpan = TimeSpan.FromMinutes(60);
        options.SlidingExpiration = true;
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost3000", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.AddSingleton<Cloudinary>(provider =>
{
    var config = provider.GetRequiredService<IOptions<CloudinarySettings>>().Value;
    var account = new CloudinaryDotNet.Account(
        config.CloudName,
        config.ApiKey,
        config.ApiSecret
    );
    return new Cloudinary(account);
});
builder.Services.AddScoped<PasswordHasher<User>>();
builder.Services.AddEndpointsApiExplorer(); // <-- Important
builder.Services.AddSwaggerGen(c =>
{
    c.SupportNonNullableReferenceTypes(); // Optional
    c.EnableAnnotations(); // Optional
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowLocalhost3000");
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<DataContext>();

    await DatabaseSeeder.SeedAsync(context);
}

app.Run();

public class CloudinarySettings
{
    public string CloudName { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
    public string ApiSecret { get; set; } = string.Empty;
}