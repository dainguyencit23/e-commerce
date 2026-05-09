namespace E_commerce.Helpers
{
    public class BaseResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public int StatusCode { get; set; }

        public static BaseResponse<T> Ok(T data, string message = "Success") =>
            new() { Success = true, Message = message, Data = data, StatusCode = 200 };
        public static BaseResponse<T> Fail(string message, int statusCode = 400) =>
            new() { Success = false, Message = message, Data = default, StatusCode = statusCode };
    }
}
