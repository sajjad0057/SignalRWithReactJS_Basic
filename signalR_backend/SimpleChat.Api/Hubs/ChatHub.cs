using Microsoft.AspNetCore.SignalR;
using SimpleChat.Api.Models;
using System.Text.Json;

namespace SimpleChat.Api.Hubs;

public class ChatHub : Hub
{
    public async Task JoinChat(UserConnection connect)
    {
        Console.WriteLine($"[ChatHub.JoinSpecificChatRoom] : JoinChat : {JsonSerializer.Serialize(connect)}");
        await Clients.All
            .SendAsync("ReceiveMessage", "admin", $"{connect.UserName} has joined");
    }

    public async Task JoinSpecificChatRoom(UserConnection connect)
    {
        Console.WriteLine($"[ChatHub.JoinSpecificChatRoom] : joinded success with specific chatroom : {JsonSerializer.Serialize(connect)}");
        await Groups.AddToGroupAsync(Context.ConnectionId, connect.ChatRoom);
        await Clients.Group(connect.ChatRoom)
            .SendAsync("ReceiveMessage", "admin", $"{connect.UserName} has joined {connect.ChatRoom}");
    }
}
