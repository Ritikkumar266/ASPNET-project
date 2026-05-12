using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using GrievanceApi.Services;

var builder = WebApplication.CreateBuilder(args);

// MongoDB
var connectionString = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING")
    ?? builder.Configuration["MongoDbSettings:ConnectionString"]
    ?? throw new Exception("MongoDB connection string not configured");

var databaseName = Environment.GetEnvironmentVariable("MONGODB_DATABASE_NAME")
    ?? builder.Configuration["MongoDbSettings:DatabaseName"]
    ?? "GrievanceDb";

var mongoClient = new MongoClient(connectionString);
var mongoDatabase = mongoClient.GetDatabase(databaseName);

builder.Services.AddSingleton<IMongoClient>(mongoClient);
builder.Services.AddSingleton(mongoDatabase);

// Services
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ComplaintService>();
builder.Services.AddScoped<DepartmentService>();
builder.Services.AddScoped<FeedbackService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<DashboardService>();

// JWT
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")
    ?? builder.Configuration["JwtSettings:Secret"]
    ?? throw new Exception("JWT secret not configured");

var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
    ?? builder.Configuration["JwtSettings:Issuer"] ?? "GrievanceApi";

var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
    ?? builder.Configuration["JwtSettings:Audience"] ?? "GrievanceApp";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://frontend", "http://frontend:80")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Seed admin user and departments
await SeedData(mongoDatabase);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Health check endpoint for Docker
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }));

app.Run();

// Seed default data
static async Task SeedData(IMongoDatabase db)
{
    // Seed admin user
    var users = db.GetCollection<GrievanceApi.Models.User>("users");
    var adminExists = await users.Find(u => u.Role == GrievanceApi.Models.UserRole.Admin).AnyAsync();
    if (!adminExists)
    {
        var admin = new GrievanceApi.Models.User
        {
            FullName = "System Admin",
            Email = "admin@grievance.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Phone = "0000000000",
            Role = GrievanceApi.Models.UserRole.Admin
        };
        await users.InsertOneAsync(admin);
        Console.WriteLine("Default admin created: admin@grievance.com / Admin@123");
    }

    // Seed default departments + managers
    var departments = db.GetCollection<GrievanceApi.Models.Department>("departments");
    // Force re-seed: drop existing departments and department users
    var existingManagerCount = await users.CountDocumentsAsync(u => u.Role == GrievanceApi.Models.UserRole.Department);
    if (existingManagerCount == 0)
    {
        await departments.DeleteManyAsync(_ => true);
    }
    var deptCount = await departments.CountDocumentsAsync(_ => true);
    if (deptCount == 0)
    {
        var defaultDepts = new List<GrievanceApi.Models.Department>
        {
            new() { Name = "Water Supply", Description = "Handles complaints related to water supply, pipelines, water quality, and water shortage issues" },
            new() { Name = "Electricity", Description = "Manages complaints about power outages, faulty wiring, street lights, and electrical infrastructure" },
            new() { Name = "Roads & Infrastructure", Description = "Deals with potholes, road damage, bridge maintenance, and public infrastructure issues" },
            new() { Name = "Sanitation", Description = "Handles waste management, sewage, drainage, cleanliness, and hygiene related complaints" },
            new() { Name = "Health", Description = "Manages complaints related to public health services, hospitals, clinics, and medical facilities" },
            new() { Name = "Education", Description = "Handles complaints about schools, colleges, educational facilities, and academic services" },
            new() { Name = "Public Safety", Description = "Deals with law enforcement, traffic management, fire safety, and public security issues" },
            new() { Name = "Transportation", Description = "Manages complaints about public transport, bus services, metro, and commuter infrastructure" },
            new() { Name = "Environment", Description = "Handles pollution, deforestation, noise complaints, and environmental conservation issues" },
            new() { Name = "Revenue & Taxation", Description = "Deals with property tax, land records, revenue disputes, and taxation services" },
        };
        await departments.InsertManyAsync(defaultDepts);
        Console.WriteLine($"Seeded {defaultDepts.Count} default departments");

        // Create a manager for each department
        var passwordHash = BCrypt.Net.BCrypt.HashPassword("Manager@123");
        var managers = new List<GrievanceApi.Models.User>();
        foreach (var dept in defaultDepts)
        {
            var emailPrefix = dept.Name.ToLower().Replace(" & ", "").Replace(" ", "").Replace("&", "");
            managers.Add(new GrievanceApi.Models.User
            {
                FullName = $"{dept.Name} Manager",
                Email = $"{emailPrefix}@grievance.com",
                PasswordHash = passwordHash,
                Phone = "0000000000",
                Role = GrievanceApi.Models.UserRole.Department,
                DepartmentId = dept.Id
            });
        }
        await users.InsertManyAsync(managers);
        Console.WriteLine($"Seeded {managers.Count} department managers");
        Console.WriteLine("─────────────────────────────────────────");
        Console.WriteLine("  DEFAULT DEPARTMENT MANAGER CREDENTIALS");
        Console.WriteLine("  Password for all: Manager@123");
        Console.WriteLine("─────────────────────────────────────────");
        foreach (var m in managers)
            Console.WriteLine($"  {m.Email}");
        Console.WriteLine("─────────────────────────────────────────");
    }
}
