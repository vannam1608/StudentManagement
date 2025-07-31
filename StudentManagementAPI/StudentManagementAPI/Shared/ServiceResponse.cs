namespace StudentManagementAPI.Shared
{
    public class ServiceResponse<T>
    {
        public T? Data { get; set; }
        public bool Success { get; set; }
        public string? Message { get; set; }

        public static ServiceResponse<T> SuccessResponse(T data, string? message = null)
            => new ServiceResponse<T> { Data = data, Success = true, Message = message };

        public static ServiceResponse<T> FailResponse(string message)
            => new ServiceResponse<T> { Success = false, Message = message };
    }
}
