namespace StudentManagementAPI.Shared
{
    public class Result
    {
        public bool Success { get; set; }
        public string? Message { get; set; }

        public static Result Fail(string message) => new Result { Success = false, Message = message };
        public static Result Ok(string? message = null) => new Result { Success = true, Message = message };
    }
}
