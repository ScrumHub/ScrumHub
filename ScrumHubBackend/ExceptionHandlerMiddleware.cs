﻿using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CustomExceptions;
using System.Net;

namespace ScrumHubBackend
{
    /// <summary>
    /// Middleware handling exceptions
    /// </summary>
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlerMiddleware> _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        public ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        /// <summary>
        /// Invokes request catching potential exceptions
        /// </summary>
        public async Task InvokeAsync(HttpContext context, DatabaseContext dbContext)
        {
            Microsoft.EntityFrameworkCore.Storage.IDbContextTransaction? transaction = context.Request.Method == "GET" ? null : dbContext.Database.BeginTransaction();

            try
            {
                await _next(context);

                transaction?.Commit();
            }
            catch(Exception ex)
            {
                transaction?.Rollback();

                _logger.LogError("Exception {} occured: {}", ex.GetType(), ex.Message);

                if(ex is AggregateException aex)
                {
                    ex = aex.InnerException ?? new Exception(aex.Message);
                }

                context.Response.ContentType = "application/json";

                context.Response.StatusCode = ex switch
                {
                    BadHttpRequestException => (int)HttpStatusCode.BadRequest,
                    Octokit.AuthorizationException => (int)HttpStatusCode.Unauthorized,
                    ForbiddenException => (int)HttpStatusCode.Forbidden,
                    NotFoundException => (int)HttpStatusCode.NotFound,
                    Octokit.NotFoundException => (int)HttpStatusCode.NotFound,
                    ConflictException => (int)HttpStatusCode.Conflict,
                    _ => (int)HttpStatusCode.InternalServerError
                };

                var errorMessage = new ErrorMessage
                {
                    Message = ex.Message,
                    Code = context.Response.StatusCode
                }.ToString();

                await context.Response.WriteAsync(errorMessage ?? "");
            }
            finally
            {
                transaction?.Dispose();
            }
        }

    }
}
