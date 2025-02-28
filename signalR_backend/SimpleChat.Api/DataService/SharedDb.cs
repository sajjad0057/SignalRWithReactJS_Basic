using SimpleChat.Api.Models;
using System.Collections.Concurrent;

namespace SimpleChat.Api.DataService;

/// <summary>
/// Creating an inmemory database to store the user connections
/// </summary>
public class SharedDb
{
    private readonly ConcurrentDictionary<string, UserConnection> _connections = new ConcurrentDictionary<string, UserConnection>();
    public ConcurrentDictionary<string, UserConnection> Connections => _connections;
}
