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
    public class CompanyController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IApplicationUserManager _applicationUserManager;
        private readonly ICompanyManager _companyManager;
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        private readonly IMapper _mapper;

        public CompanyController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory,
            IApplicationUserManager applicationUserManager,
            IConfiguration configuration,
            ICompanyManager companyManager,
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
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CompanyAddModel model)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR));
            }
            var company = this._mapper.Map<CompanyAddModel, Company>(model);
            company.Obsolete = false;
            company.RegistrationDate = DateTimeOffset.UtcNow;
            company.Status = CompanyStatus.ACTIVE;

            this._companyManager.Create(company);

            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> GetAll()
        {
            var companies = await this._companyManager.GetAll();
            var companyModels = this._mapper.Map<List<CompanyViewModel>>(companies);

            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { companies = companyModels }));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Administrator,Owner")]
        public async Task<IActionResult> Get(int id)
        {
            var company = await this._companyManager.FindById(id);
            if (company == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            var companyModel = this._mapper.Map<CompanyDetailViewModel>(company);

            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { company = companyModel }));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Remove(int id)
        {
            var company = await this._companyManager.FindById(id);
            if (company == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            this._companyManager.Remove(company);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpPost("Unremove/{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> Unremove(int id)
        {
            var company = await this._companyManager.FindById(id);
            if (company == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            this._companyManager.Unremove(company);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpPost("{id}/AddUser")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> AddUserToCompany(int id)
        {
            var company = await this._companyManager.FindById(id);
            if (company == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            // TODO
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

    }
}