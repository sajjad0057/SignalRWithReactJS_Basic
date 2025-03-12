using SimpleChat.Api;
using SimpleChat.Api.DataService;
using SimpleChat.Api.Hubs;
using StackExchange.Redis;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Redis connection string from configuration (appsettings.json)
var redisConnectionStr = builder.Configuration.GetConnectionString("Redis")!;

// Configure Redis ConnectionMultiplexer
/*
The IConnectionMultiplexer is registered as a singleton service, which is more efficient for Redis since
it uses connection pooling internally. Reusing the same connection acrossservices like SignalR and 
distributed cache improves performance and ensures optimal resource usage
*/
var redisConnection = ConnectionMultiplexer.Connect(redisConnectionStr);
builder.Services.AddSingleton<IConnectionMultiplexer>(redisConnection);


//// Reistering workerservice /bgservice with service container
builder.Services.AddHostedService<RedisSubscriberService>();


// Configure SignalR with Redis Backplane
builder.Services.AddSignalR()
    .AddStackExchangeRedis(redisConnectionStr, options =>
    {
        options.Configuration.ChannelPrefix = RedisChannel.Literal("simple-chat-channel");
    });



//// configuring DI for SharedDb with service container
builder.Services.AddSingleton<SharedDb>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

////configuring CORS

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("reactApp", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/Chat");

//// enabling cors with policy
app.UseCors("reactApp");

app.Run();
