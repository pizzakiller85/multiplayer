using System.Text.Json;
using Microsoft.AspNetCore.SignalR;

namespace SignalRChat.Hubs
{
    public class Pos 
    {
        public double x { get; set;}
        public double y { get; set; }
    }
    public class ChatHub : Hub
    {

        public static Dictionary<string, Pos> userPositions = new();
        public static int Count { get; set; }
        public static void BasicCollisions(Dictionary<string, Pos> userPos)
        {

            var pos = userPos.ToList();
            for(var i = 0;i< pos.Count; i++) {
                for (var j = i+1; j < pos.Count; j++)
                {
                    var one = pos[i].Value;
                    var two = pos[j].Value;
                     if((one.y < two.y &&
                        one.y + 20> two.y && 
                        one.x < two.x &&
                        one.x + 20> two.x)
                        ||(two.y < one.y &&
                        two.y + 20> one.y && 
                        two.x < one.x &&
                        two.x + 20> one.x
                        ))
                    {
                        Console.WriteLine("Collission");
                    }
                }    
            }


        }
        public async Task ShareUserPosition(string user, double x, double y)
        {
            Console.WriteLine($"x:{x} y:{y}");
            Count++;
            var position = new Pos();

            if (x < 20)
                x = 20;
            if (y < 20)
                y = 20;

            BasicCollisions(userPositions);
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