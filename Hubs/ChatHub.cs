using System.Text.Json;
using Microsoft.AspNetCore.SignalR;

namespace SignalRChat.Hubs
{
    public class pos 
    {
        public double x { get; set;}
        public double y { get; set; }
    }
    public class ChatHub : Hub
    {

        public static Dictionary<string, pos> userPositions = new();
        public static int Count { get; set; }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
        public async Task ShareUserPosition(string user, double x, double y)
        {
            Console.WriteLine(Count);
            Count++;
            var position = new pos();

            if (x < 0)
                x = 0;
            if (y < 0)
                y = 0; 
            position.x = x;
            position.y = y;
            if (userPositions.ContainsKey(user))
            {
                userPositions[user] = position;
            }
            else 
            {
                userPositions.Add(user, position);
            }
            var positions = JsonSerializer.Serialize(userPositions.ToList());
            await Clients.All.SendAsync("AllUserPositions", positions);
        }
    }
}