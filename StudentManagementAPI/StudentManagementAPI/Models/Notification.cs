// Models/Notification.cs
using StudentManagementAPI.Models;

public class Notification
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public int CreatedBy { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
        public string TargetRole { get; set; } = "All";

    public User? Creator { get; set; }
}
