using MediatR;
using Microsoft.AspNetCore.Mvc;
using ScrumHubBackend.CQRS.Repositories;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CommunicationModel;

namespace ScrumHubBackend.Controllers
{
    /// <summary>
    /// Controller for repositories
    /// </summary>
    [Route("api/[controller]/repositories")]
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
        /// Gets repositories
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="pageNumber">Page to get, default = 1</param>
        /// <param name="pageSize">Size of page, default = 10</param>
        /// <param name="nameFilter">Filter for name, default is empty</param>
        [HttpGet("")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(PaginatedList<Repository>), 200)]
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
        /// Adds repository to ScrumHub
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryId">Id of repository that will be added to ScrumHub</param>
        [HttpPost("")]
        [ProducesResponseType(typeof(Repository), 201)]
        public async Task<IActionResult> AddRepositoryToScrumHub([FromHeader] string authToken, [FromBody] long repositoryId)
        {
            var query = new AddRepositoryToScrumHubCommand
            {
                AuthToken = authToken,
                RepositoryId = repositoryId
            };

            var result = await _mediator.Send(query);
            return Created($"/{result.Name}", result);
        }
    }
}
