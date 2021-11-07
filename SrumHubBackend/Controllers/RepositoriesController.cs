using MediatR;
using Microsoft.AspNetCore.Mvc;
using SrumHubBackend.CQRS.Repositories;
using SrumHubBackend.CommunicationModel;

namespace SrumHubBackend.Controllers
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
        [HttpGet("")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(IEnumerable<Repository>), 200)]
        public async Task<IActionResult> GetRepositories([FromHeader] string authToken)
        {
            var query = new GetRepositoriesQuery
            {
                AuthToken = authToken
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
