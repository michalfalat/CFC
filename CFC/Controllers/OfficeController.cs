using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CFC.Data.Entities;
using CFC.Data.Managers;
using CFC.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System;
using CFC.Data.Enums;
using AutoMapper;

namespace CFC.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class OfficeController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IApplicationUserManager _applicationUserManager;
        private readonly ICompanyManager _companyManager;
        private readonly IOfficeManager _officeManager;
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        private readonly IMapper _mapper;

        public OfficeController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory,
            IApplicationUserManager applicationUserManager,
            IConfiguration configuration,
            ICompanyManager companyManager,
            IOfficeManager officeManager,
            IEmailSender emailSender, IMapper mapper)
        {
            this._userManager = userManager;
            this._roleManager = roleManager;
            this._signInManager = signInManager;
            this._logger = loggerFactory.CreateLogger<AccountController>();
            this._applicationUserManager = applicationUserManager;
            this._configuration = configuration;
            this._emailSender = emailSender;
            this._mapper = mapper;
            this._companyManager = companyManager;
            this._officeManager = officeManager;
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] OfficeAddModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR));
            }
            var company = await this._companyManager.FindById(model.CompanyId);
            if (company == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            var office = this._mapper.Map<OfficeAddModel, Office>(model);
            office.Obsolete = false;
            office.RegistrationDate = DateTimeOffset.UtcNow;
            office.Status = OfficeStatus.ACTIVE;

            this._officeManager.Create(office);

            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetAll()
        {
            var offices = await this._officeManager.GetAll();
            var officeModels = this._mapper.Map<List<OfficeViewModel>>(offices);

            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { offices = officeModels }));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrator,Owner")]
        public async Task<IActionResult> Get(int id)
        {
            var office = await this._officeManager.FindById(id);
            if (office == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            var officeModel = this._mapper.Map<OfficeDetailViewModel>(office);

            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { office = officeModel }));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Remove(int id)
        {
            var office = await this._officeManager.FindById(id);
            if (office == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            this._officeManager.Remove(office);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpPost("Unremove/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Unremove(int id)
        {
            var office = await this._officeManager.FindById(id);
            if (office == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            this._officeManager.Unremove(office);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpPost("{id}/AddUser")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> AddUserToOffice(int id, [FromBody]OfficeAddUserModel model)
        {
            //TODO check percentage overflow 
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR));
            }
            var office = await this._officeManager.FindById(id);
            if (office == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            var userOffice = new ApplicationUserOffice();
            userOffice.OfficeId = model.OfficeId;
            userOffice.UserId = model.UserId;
            userOffice.Percentage = model.Percentage;
            this._officeManager.AddUserToOffice(userOffice, office);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpDelete("{id}/RemoveUser/{userId}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> RemoveUserFromOffice(int id, string userId)
        {
            var office = await this._officeManager.FindById(id);
            if (office == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            var user = await this._applicationUserManager.FindById(userId);
            if (user == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            this._officeManager.RemoveUserFromOffice(user, office);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpGet("{id}/Users")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetOfficeUsers(int id)
        {
            var office = await this._officeManager.FindById(id);
            if (office == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            var officeOwners = office.Owners.ToList();

            var officeyOwnersModel = this._mapper.Map<List<OfficeDetailViewModel>>(officeOwners);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { owners = officeyOwnersModel }));
        }

    }
}