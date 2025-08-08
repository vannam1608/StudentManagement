namespace StudentManagementAPI.Models
{
    public class ServiceResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }

        public static ServiceResult Ok(string? message = null) => new ServiceResult { Success = true, Message = message ?? "Thành công." };
        public static ServiceResult Fail(string message) => new ServiceResult { Success = false, Message = message };
    }

}
