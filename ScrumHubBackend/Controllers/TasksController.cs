using MediatR;
using Microsoft.AspNetCore.Mvc;
using ScrumHubBackend.CommunicationModel;
using ScrumHubBackend.CommunicationModel.Common;
using ScrumHubBackend.CommunicationModel.Frontend;
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
        /// Gets tasks for repository (requires read permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="pageNumber">Page to get, default = 1</param>
        /// <param name="pageSize">Size of page, default = 10</param>
        /// <param name="onePage">True if want to fetch everything as one page, false/skipped otherwise</param>
        [HttpGet("{repositoryOwner}/{repositoryName}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(PaginatedList<SHTask>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetTasksForRepository(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool? onePage = null
            )
        {
            var query = new GetTasksQuery
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                PageNumber = pageNumber,
                PageSize = pageSize,
                OnePage = onePage
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Gets one task (requires read permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="taskId">Id of the task</param>
        [HttpGet("{repositoryOwner}/{repositoryName}/{taskId}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(SHTask), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetOneTask(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromRoute] long taskId
            )
        {
            var query = new GetOneTaskQuery
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                TaskId = taskId
            };

            var result = await _mediator.Send(query);
            return Ok(result);
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
        [ProducesResponseType(typeof(PaginatedList<SHTask>), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> GetTasksForPBI(
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

        /// <summary>
        /// Assigns the PBI for the task (or unassigns it) (requires admin permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="taskId">Id of the task</param>
        /// <param name="pbiId">Id of the PBI, 0 to unassign</param>
        [HttpPatch("{repositoryOwner}/{repositoryName}/{taskId}/assignpbi")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(SHTask), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> AssignPBIToTask(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromRoute] long taskId,
            [FromBody] IdF pbiId
            )
        {
            var query = new AssignTaskToPBICommand
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                TaskId = taskId,
                PBIId = pbiId.Index
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Adds new task in the repository (requires admin permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="newTask">Information about new task</param>
        [HttpPost("{repositoryOwner}/{repositoryName}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(SHTask), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> CreateTask(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromBody] TaskF newTask
            )
        {
            var query = new AddTaskCommand
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                Name = newTask.Name,
                PBIId = newTask.PBIId
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Assigns the person for the task (requires admin permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="taskId">Id of the task</param>
        /// <param name="login">Login of the person</param>
        [HttpPatch("{repositoryOwner}/{repositoryName}/{taskId}/assignperson")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(SHTask), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> AssignPersonToTask(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromRoute] long taskId,
            [FromBody] AssignPersonF login
            )
        {
            var query = new ChangePersonInTaskCommand
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                TaskId = taskId,
                PersonLogin = login.Login,
                AssignPerson = true,
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }

        /// <summary>
        /// Unassigns the person from the task (requires admin permissions in repository)
        /// </summary>
        /// <param name="authToken">Authorization token of user</param>
        /// <param name="repositoryOwner">Owner of the repository</param>
        /// <param name="repositoryName">Name of the repository</param>
        /// <param name="taskId">Id of the task</param>
        /// <param name="login">Login of the person</param>
        [HttpPatch("{repositoryOwner}/{repositoryName}/{taskId}/unassignperson")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(SHTask), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.BadRequest)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.Unauthorized)]
        [ProducesResponseType(typeof(ErrorMessage), (int)HttpStatusCode.NotFound)]
        public async Task<IActionResult> UnassignPersonToTask(
            [FromHeader] string authToken,
            [FromRoute] string repositoryOwner,
            [FromRoute] string repositoryName,
            [FromRoute] long taskId,
            [FromBody] AssignPersonF login
            )
        {
            var query = new ChangePersonInTaskCommand
            {
                AuthToken = authToken,
                RepositoryOwner = repositoryOwner,
                RepositoryName = repositoryName,
                TaskId = taskId,
                PersonLogin = login.Login,
                AssignPerson = false,
            };

            var result = await _mediator.Send(query);
            return Ok(result);
        }
    }
}
