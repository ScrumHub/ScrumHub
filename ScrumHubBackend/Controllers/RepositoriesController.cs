using MediatR;
using Microsoft.AspNetCore.Mvc;
using ScrumHubBackend.CQRS.Repositories;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CommunicationModel;
using System.Net;
using ScrumHubBackend.CommunicationModel.Frontend;

namespace ScrumHubBackend.Controllers
{
    /// <summary>
    /// Controller for repositories
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class RepositoriesController : ControllerBase
    {
        private readonly ILogger<RepositoriesController> _logger;
        private readonly IMediator _mediator;

        /// <summary>
        /// Constructor
        /// </summary>
        public RepositoriesController(ILogger<RepositoriesController> logger, IMediator mediator)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _mediator = mediator ?? throw new ArgumentException(null, nameof(mediator));
        }

        /// <summary>
        /// Gets repositories (requires read permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="pageNumber">Page to get, default = 1</param>
        /// <param name="pageSize">Size of page, default = 10</param>
        /// <param name="nameFilter">Filter for name, default is empty</param>
        [HttpGet("")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(PaginatedList<Repository>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        public async Task<IActionResult> GetRepositories([FromHeader] string authToken, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string? nameFilter = null)
        {
            var query = new GetRepositoriesQuery
            {
                AuthToken = authToken,
                PageNumber = pageNumber,
                PageSize = pageSize,
                NameFilter = nameFilter
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Adds repository to ScrumHub (requires admin permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryIndex">Id of repository that will be added to ScrumHub</param>
        [HttpPost("")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Repository), (int)HttpStatusCode.Created)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Forbidden)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Conflict)]
        public async Task<IActionResult> AddRepositoryToScrumHub([FromHeader] string authToken, [FromBody] IdF repositoryIndex)
        {
            var command = new AddRepositoryToScrumHubCommand
            {
                AuthToken = authToken,
                RepositoryId = repositoryIndex?.Index ?? 0
            };

            var result = await _mediator.Send(command);
            return Created($"/{result.Name}", result);
        }
    }
}
