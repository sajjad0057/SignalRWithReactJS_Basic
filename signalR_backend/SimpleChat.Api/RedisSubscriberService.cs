using Microsoft.AspNetCore.SignalR;
using SimpleChat.Api.Hubs;
using StackExchange.Redis;
using System.Text.Json;

namespace SimpleChat.Api;

public class RedisSubscriberService : BackgroundService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IHubContext<ChatHub> _hubContext;

    public RedisSubscriberService(IConnectionMultiplexer redis, IHubContext<ChatHub> hubContext)
    {
        _redis = redis;
        _hubContext = hubContext;
    }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var subscriber = _redis.GetSubscriber();
        await subscriber.SubscribeAsync(RedisChannel.Literal("simple-chat-channel"), async (channel, message) =>
        {
            Console.WriteLine($"[RedisSubscriberService.ExecuteAsync] channel : {JsonSerializer.Serialize(channel)}; message : {JsonSerializer.Serialize(message)}");
            Console.WriteLine($"[RedisSubscriberService.ExecuteAsync] messageText: {message.ToString()}");
            await _hubContext.Clients.All.SendAsync("ReceiveChannelMessage", "system", message.ToString());
        });
    }
}
