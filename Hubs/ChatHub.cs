using System.Collections.Generic;
using System;
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
        public const int CollisionDistance = 20;
        public static void BasicCollisions(Dictionary<string, Pos> userPos)
        {
            var pos = userPos.ToList();
            for(var i = 0;i< pos.Count; i++) {
                for (var j = i+1; j < pos.Count; j++)
                {
                    Pos p1 = pos[i]!.Value;
                    Pos p2 = pos[j]!.Value;

                    if (p1 == null && p2 == null)
                        continue;

                    var distance = CalcDistance(p1, p2);
                    if (distance < CollisionDistance * 2)
                    {
                        var vColli = new Pos{ 
                            x= p2.x - p1.x, 
                            y= p2.y - p1.y };

                        var vC = new Pos{ x= vColli.x / distance, y= vColli.y / distance };

                        p1.x -= vC.x; 
                        p1.y -= vC.y; 
                        p2.x += vC.x;
                        p2.y += vC.y;
                    }
                }    
            }
        }

        public static double CalcDistance(Pos p1, Pos p2)
        {
            return Math.Sqrt(Math.Pow(p2.x - p1.x, 2) + Math.Pow(p2.y - p1.y, 2));
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