using Microsoft.AspNetCore.SignalR;
using SimpleChat.Api.DataService;
using SimpleChat.Api.Models;
using StackExchange.Redis;
using System.Text.Json;

namespace SimpleChat.Api.Hubs;

public class ChatHub : Hub
{
    private readonly IConnectionMultiplexer _redis;
    private readonly SharedDb _sharedDb;

    public ChatHub(SharedDb sharedDb, IConnectionMultiplexer redis)
    {
        _sharedDb = sharedDb;
        _redis = redis;
    }

    //public async Task JoinChat(UserConnection userConnection)
    //{
    //    Console.WriteLine($"[ChatHub.JoinSpecificChatRoom] : UserConnection : {JsonSerializer.Serialize(userConnection)}");
    //    //// here SendAsync methods 1st parameter is client end method name
    //    await Clients.All
    //        .SendAsync("ReceiveMessage", "admin", $"{userConnection.UserName} has joined");
    //}

    /// <summary>
    /// here JoinSpecificChatRoomServerSide is server end method name
    /// and JoinSpecificChatRoomClientSide is client end method name thats called from here
    /// </summary>
    /// <param name="userConnection"></param>
    /// <returns></returns>
    /// 


    /// <summary>
    ///If want to send message through redis channel,
    ///it's need when use redisbackplane to serve message through multiple server instance.
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    public async Task PublishMessageToChannel(string message)
    {
        var redisDb = _redis.GetDatabase();
        await redisDb.PublishAsync(new RedisChannel("simple-chat-channel", RedisChannel.PatternMode.Literal), message); //// publish message through redis channel
    }


    public async Task JoinSpecificChatRoomServerSide(UserConnection userConnection)
    {
        Console.WriteLine($"[ChatHub.JoinSpecificChatRoom] : joinded success with specific chatroom with ConnectionId : {Context.ConnectionId} \n" +
            $"UserConnection : {JsonSerializer.Serialize(userConnection)}");

        _sharedDb.Connections.TryAdd(Context.ConnectionId, userConnection);

        Console.WriteLine($"[ChatHub.JoinSpecificChatRoom] _sharedDb.Connections : {JsonSerializer.Serialize(_sharedDb.Connections)}");

        await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.ChatRoom);
        //// here SendAsync methods 1st parameter is client end method name
        await Clients.Group(userConnection.ChatRoom)
            .SendAsync("JoinSpecificChatRoomClientSide", userConnection.UserName,
            $"{userConnection.UserName} has joined {userConnection.ChatRoom}");
    }

    /// <summary>
    /// here SendSpecificMessageServerSide is server end method name
    /// and ReceiveSpecificMessageClientSide is client end method name thats called from here
    /// </summary>
    /// <param name="message"></param>
    /// <returns></returns>
    public async Task SendSpecificMessageServerSide(string message)
    {
        if(_sharedDb.Connections.TryGetValue(Context.ConnectionId, out UserConnection userConnection))
        {
            Console.WriteLine($"[ChatHub.SendMessage] UserConnection : {JsonSerializer.Serialize(userConnection)}");
            //// here SendAsync methods 1st parameter is client end method name
            await Clients.Group(userConnection.ChatRoom)
                .SendAsync("ReceiveSpecificMessageClientSide", userConnection.UserName, message);
        }
    }
}
