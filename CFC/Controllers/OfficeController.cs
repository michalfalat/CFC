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

        [HttpPost("{id}/AddCompany")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> AddCompanyToOffice(int id, [FromBody]OfficeAddCompanyModel model)
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

            var userOffice = this._mapper.Map<CompanyOffice>(model);
            this._officeManager.AddCompanyToOffice(userOffice, office);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpDelete("{id}/RemoveCompany/{companyId}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> RemoveCompanyFromOffice(int id, int companyId)
        {
            var office = await this._officeManager.FindById(id);
            if (office == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            var company = await this._companyManager.FindById(companyId);
            if (company == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            this._officeManager.RemoveCompanyFromOffice(company, office);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpGet("{id}/Companies")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetOfficeCompanies(int id)
        {
            var office = await this._officeManager.FindById(id);
            if (office == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            var companyOffices = office.Companies.ToList();

            var companyOfficesModel = this._mapper.Map<List<OfficeDetailViewModel>>(companyOffices);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { companies = companyOfficesModel }));
        }

    }
}