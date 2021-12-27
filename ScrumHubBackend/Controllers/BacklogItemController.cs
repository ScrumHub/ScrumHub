using MediatR;
using Microsoft.AspNetCore.Mvc;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CommunicationModel.Frontend;
using ScrumHubBackend.CQRS.PBI;
using System.Net;

namespace ScrumHubBackend.Controllers
{
    /// <summary>
    /// Controller for repositories
    /// </summary>
    [Route("api/[controller]/")]
    [ApiController]
    public class BacklogItemController : ControllerBase
    {
        private readonly ILogger<BacklogItemController> _logger;
        private readonly IMediator _mediator;

        /// <summary>
        /// Constructor
        /// </summary>
        public BacklogItemController(ILogger<BacklogItemController> logger, IMediator mediator)
        {
            _logger = logger ?? throw new ArgumentException(null, nameof(logger));
            _mediator = mediator ?? throw new ArgumentException(null, nameof(mediator));
        }

        /// <summary>
        /// Gets PBIs for given repository (requires read permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="pageNumber">Page to get, default = 1</param>
        /// <param name="pageSize">Size of page, default = 10</param>
        /// <param name="nameFilter">Filter for name, default is empty</param>
        /// <param name="finished">Filter for finished PBIs, true or false</param>
        /// <param name="esimated">Filter for esimated PBIs, true or false</param>
        /// <param name="inSprint">Filters for PBIs that are in a sprint, true or false</param>
        /// <param name="onePage">True if want to fetch everything as one page, false/skipped otherwise</param>
        [HttpGet("{repositoryOwner}/{repositoryName}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(PaginatedList<BacklogItem>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetBacklogItems(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? nameFilter = null,
            [FromQuery] bool? finished = null,
            [FromQuery] bool? esimated = null,
            [FromQuery] bool? inSprint = null,
            [FromQuery] bool? onePage = null
            )
        {
            var query = new GetPBIsQuery
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                PageNumber = pageNumber,
                PageSize = pageSize,
                NameFilter = nameFilter,
                FinishedFilter = finished,
                EstimatedFilter = esimated,
                InSprintFilter = inSprint,
                OnePage = onePage
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Gets one PBI from the repository (requires read permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="pbiId">Id of the PBI</param>
        [HttpGet("{repositoryOwner}/{repositoryName}/{pbiId}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(BacklogItem), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetOneBacklogItem(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromRoute] int pbiId
            )
        {
            var query = new GetOnePBIQuery
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                PBIId = pbiId,
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Add PBI for given repository (requires admin permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="backlogItem">Item to add</param>
        [HttpPost("{repositoryOwner}/{repositoryName}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(BacklogItem), (int)HttpStatusCode.Created)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> AddBacklogItem(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromBody] BacklogItemF backlogItem
            )
        {
            var query = new AddPBICommand
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                Name = backlogItem.Name,
                AcceptanceCriteria = backlogItem.AcceptanceCriteria,
                Priority = backlogItem.Priority,
            };

            var result = await _mediator.Send(query);
            return Created($"/{result.Id}", result);
        }

        /// <summary>
        /// Update PBI for given repository (requires admin permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="pbiId">Id of the PBI</param>
        /// <param name="backlogItem">All values (updated and not updated) of PBI</param>
        [HttpPut("{repositoryOwner}/{repositoryName}/{pbiId}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(BacklogItem), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> UpdateBacklogItem(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromRoute] int pbiId,
            [FromBody] BacklogItemF backlogItem
            )
        {
            var query = new UpdatePBICommand
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                PBIId = pbiId,
                Name = backlogItem.Name,
                AcceptanceCriteria = backlogItem.AcceptanceCriteria,
                Priority = backlogItem.Priority,
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Finish PBI for given repository (requires admin permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="pbiId">Id of the PBI</param>
        [HttpPatch("{repositoryOwner}/{repositoryName}/{pbiId}/finish")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(BacklogItem), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> FinishBacklogItem(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromRoute] int pbiId
            )
        {
            var query = new FinishPBICommand
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                PBIId = pbiId,
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Estimate PBI for given repository (requires admin permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="pbiId">Id of the PBI</param>
        /// <param name="estimation">Estimation of the PBI</param>
        [HttpPatch("{repositoryOwner}/{repositoryName}/{pbiId}/estimate")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(BacklogItem), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> EstimateBacklogItem(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromRoute] int pbiId,
            [FromBody] EstimateF estimation
            )
        {
            var query = new EstimatePBICommand
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                PBIId = pbiId,
                EstimationInHours = estimation.Hours
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Delete PBI for given repository (requires admin permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="pbiId">Id of the PBI</param>
        [HttpDelete("{repositoryOwner}/{repositoryName}/{pbiId}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(void), (int)HttpStatusCode.NoContent)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> RemoveBacklogItem(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromRoute] int pbiId
            )
        {
            var query = new RemovePBICommand
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                PBIId = pbiId,
            };

            await _mediator.Send(query);
            return NoContent();
        }

    }
}
