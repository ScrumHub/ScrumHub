using MediatR;
using Microsoft.AspNetCore.Mvc;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CommunicationModel.Frontend;
using ScrumHubBackend.CQRS.Sprints;
using System.Net;

namespace ScrumHubBackend.Controllers
{
    /// <summary>
    /// Controller for sprints
    /// </summary>
    [Route("api/[controller]/")]
    [ApiController]
    public class SprintsController : ControllerBase
    {
        private readonly ILogger<SprintsController> _logger;
        private readonly IMediator _mediator;

        /// <summary>
        /// Constructor
        /// </summary>
        public SprintsController(ILogger<SprintsController> logger, IMediator mediator)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _mediator = mediator ?? throw new ArgumentException(null, nameof(mediator));
        }

        /// <summary>
        /// Gets sprints for given repository (requires read permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="pageNumber">Page to get, default = 1</param>
        /// <param name="pageSize">Size of page, default = 10</param>
        /// <param name="completed">Filter for only completed or only not completed sprints</param>
        /// <param name="onePage">True if want to fetch everything as one page, false/skipped otherwise</param>
        [HttpGet("{repositoryOwner}/{repositoryName}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(PaginatedList<Sprint>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetSprints(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? completed = null,
            [FromQuery] bool? onePage = null
            )
        {
            var query = new GetSprintsQuery
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                PageNumber = pageNumber,
                PageSize = pageSize,
                CompletedFilter = completed,
                OnePage = onePage
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Gets one sprint from the repository (requires read permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="sprintNumber">Number of the sprint</param>
        [HttpGet("{repositoryOwner}/{repositoryName}/{sprintNumber}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Sprint), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetOneSprint(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromRoute] int sprintNumber
            )
        {
            var query = new GetOneSprintQuery
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                SprintNumber = sprintNumber
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Add Sprint for given repository (requires admin permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="sprint">Item to add</param>
        [HttpPost("{repositoryOwner}/{repositoryName}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Sprint), (int)HttpStatusCode.Created)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> AddSprint(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromBody] SprintF sprint
            )
        {
            var query = new AddSprintCommand
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                Goal = sprint.Goal,
                PBIs = sprint.PBIs,
                Title = sprint.Title,
                FinishDate = sprint.FinishDate,
            };

            var result = await _mediator.Send(query);
            return Created($"/{result.SprintNumber}", result);
        }

        /// <summary>
        /// Update Sprint for given repository (requires admin permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="sprintNumber">Id of the PBI</param>
        /// <param name="sprint">All values (updated and not updated) of sprint</param>
        [HttpPut("{repositoryOwner}/{repositoryName}/{sprintNumber}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Sprint), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> UpdateSprint(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromRoute] int sprintNumber,
            [FromBody] SprintF sprint
            )
        {
            var query = new UpdateSprintCommand
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                Goal = sprint.Goal,
                PBIs = sprint.PBIs,
                Number = sprintNumber,
                Title = sprint.Title,
                FinishDate = sprint.FinishDate,
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Finish sprint (requires admin permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="sprintNumber">Id of the PBI</param>
        /// <param name="failed">True if sprint failed, false (default) if it was successful</param>
        [HttpPut("{repositoryOwner}/{repositoryName}/{sprintNumber}/finish")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(Sprint), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Conflict)]
        public async Task<IActionResult> FinishSprint(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromRoute] int sprintNumber,
            [FromQuery] bool failed
            )
        {
            var command = new FinishSprintCommand
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                SprintNumber = sprintNumber,
                IsFailure = failed
            };

            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}
