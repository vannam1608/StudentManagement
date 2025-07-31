// DTOs/Notification/CreateNotificationDto.cs
namespace StudentManagementAPI.DTOs.Notification
{
    public class CreateNotificationDto
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string TargetRole { get; set; } = "All"; // Giá trị mặc định gửi cho tất cả
    }
}
