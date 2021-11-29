using MediatR;
using Microsoft.AspNetCore.Mvc;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CQRS.Tasks;
using System.Net;

namespace ScrumHubBackend.Controllers
{
    /// <summary>
    /// Controller for tasks
    /// </summary>
    [Route("api/[controller]/")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ILogger<TasksController> _logger;
        private readonly IMediator _mediator;

        /// <summary>
        /// Constructor
        /// </summary>
        public TasksController(ILogger<TasksController> logger, IMediator mediator)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _mediator = mediator ?? throw new ArgumentException(null, nameof(mediator));
        }

        /// <summary>
        /// Gets tasks for given PBI (or uassigned) (requires read permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="pbiId">Id of the PBI or 0 for unassigned</param>
        [HttpGet("{repositoryOwner}/{repositoryName}/PBI/{pbiId}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(PaginatedList<Unit>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetSprints(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromRoute] long pbiId
            )
        {
            var query = new GetTasksForPBIQuery
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                PBIId = pbiId
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
