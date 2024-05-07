using HCS.Business.ResponseModel.ApiResponse;
using HCS.Domain.CustomExceptions;
using Newtonsoft.Json;

namespace HCS.API.Middlewares
{
    public class GlobalExceptionMiddleware : IMiddleware
    {
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(ILogger<GlobalExceptionMiddleware> logger)
        {
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch(MedicalRecordNotPaidBeforeCheckUpException ex)
            {
                _logger.LogError(ex, "Medical Record Not Paid Before Check Up.");
                var response = new ApiResponse();
                await WriteResponseAsync(context, response.SetApiResponse(
                statusCode: System.Net.HttpStatusCode.BadRequest,
                isSuccess: false,
                message: ex.Message,
                result: null));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");
                var response = new ApiResponse();
                await WriteResponseAsync(context, response.SetApiResponse(
                    statusCode: System.Net.HttpStatusCode.InternalServerError,
                    isSuccess: false,
                    message: ex.Message,
                    result: null));
            }
        }

        private static async Task WriteResponseAsync(HttpContext context, ApiResponse response)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)response.StatusCode;
            await context.Response.WriteAsync(JsonConvert.SerializeObject(response));
        }
    }
}
