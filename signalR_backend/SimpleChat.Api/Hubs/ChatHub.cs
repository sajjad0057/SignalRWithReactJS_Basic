using Microsoft.AspNet.SignalR;
using SimpleChat.Api.Models;

namespace SimpleChat.Api.Hubs;

public class ChatHub : Hub
{
    public async Task JoinChat(UserConnection connect)
    {
        await Clients.All
            .SendAsync("ReceiveMessage", "admin", $"{connect.UserName} has joined");
    }
}
