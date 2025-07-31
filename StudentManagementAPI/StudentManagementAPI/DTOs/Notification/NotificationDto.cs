// DTOs/Notification/NotificationDto.cs
namespace StudentManagementAPI.DTOs.Notification
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string CreatorName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string TargetRole { get; set; } = "All";

    }
}
