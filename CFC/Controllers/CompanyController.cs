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
using CFC.Data.Constants;

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
        private readonly IOfficeManager _officeManager;
        private readonly IMoneyRecordManager _moneyRecordManager;
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
            IEmailSender emailSender,
            IOfficeManager officeManager,
            IMoneyRecordManager moneyRecordManager,
            IMapper mapper)
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
            this._moneyRecordManager = moneyRecordManager;
        }

        [HttpPost]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> Add([FromBody] CompanyAddModel model)
        {

            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR));
            }
            var company = this._mapper.Map<CompanyAddModel, Company>(model);
            company.Obsolete = false;
            company.RegistrationDate = DateTimeOffset.UtcNow;
            company.Status = CompanyStatus.ACTIVE;

            this._companyManager.Create(company);

            var userCompany = new ApplicationUserCompany()
            {
                CompanyId = company.Id,
                Percentage = 100,
                Role = CompanyOwnerRole.EXECUTIVE,
                UserId = userId,
            };
            this._companyManager.AddUserToCompany(userCompany, company);

            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpGet]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> GetAll()
        {

            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdminUser = HttpContext.User.IsInRole(Constants.Roles.ADMININISTRATOR);
            var companies = new List<Company>();
            if (isAdminUser)
            {
                companies = await this._companyManager.GetAll();
            }
            else
            {
                companies = await this._companyManager.GetCompaniesByOwner(userId);
            }
            var companyModels = this._mapper.Map<List<CompanyViewModel>>(companies);
            foreach (var company in companyModels)
            {
                var currentUserOwner = companies.Where(c => c.Id == company.Id)
                                                .FirstOrDefault().Owners
                                                .Where(o => o.UserId == userId)
                                                .FirstOrDefault();
                var records = await this._moneyRecordManager.GetAllForCompany(company.Id);
                company.ActualCash = this._moneyRecordManager.SumRecordsForCompany(company.Id, records);
                company.CurrentRole = isAdminUser ?  CompanyOwnerRole.EXECUTIVE : currentUserOwner.Role;
            }

            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { companies = companyModels }));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> Get(int id)
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = HttpContext.User.IsInRole(Constants.Roles.ADMININISTRATOR);
            var company = await this._companyManager.FindById(id);
            if (company == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            if (isAdmin == false && company.Owners.Select(o => o.UserId).Contains(userId) == false)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.FORBIDDEN));
            }
            var currentUserOwner = company.Owners.Where(o => o.UserId == userId).FirstOrDefault();
            var companyModel = this._mapper.Map<CompanyDetailViewModel>(company);
            var records = await this._moneyRecordManager.GetAllForCompany(company.Id);
            var recordsModels = this._mapper.Map<List<MoneyRecordViewModel>>(records);
            companyModel.Cashflow = recordsModels;
            companyModel.ActualCash = this._moneyRecordManager.SumRecordsForCompany(company.Id, records);
            companyModel.History = this._moneyRecordManager.GetHistoryForCompany(company.Id, records, 24);
            companyModel.CurrentRole = isAdmin ? CompanyOwnerRole.EXECUTIVE : currentUserOwner.Role;

            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { company = companyModel }));
        }

        [HttpGet("{id}/preview")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> GetPreview(int id)
        {
            var company = await this._companyManager.FindById(id);
            if (company == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            var companyModel = this._mapper.Map<CompanyPreviewModel>(company);

            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { company = companyModel }));
        }

        [HttpPost("[action]")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> Edit([FromBody] CompanyEditModel model)
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
            company.Name = model.Name;
            company.IdentificationNumber = model.IdentificationNumber;
            company.RegistrationDate = model.RegistrationDate;
            company.Status = model.Status;
            this._companyManager.Edit(company);

            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
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
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
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
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> AddUserToCompany(int id, [FromBody]CompanyAddUserModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR));
            }
            var company = await this._companyManager.FindById(id);
            if (company == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            var sum = this._companyManager.SumCompanyPercentage(company) + model.Percentage;
            if (sum > 100)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_SUCEEDED));
            }

            var userCompany = this._mapper.Map<CompanyAddUserModel, ApplicationUserCompany>(model);
            this._companyManager.AddUserToCompany(userCompany, company);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpPost("{id}/EditUser")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> EditUserInCompany(int id, [FromBody]CompanyEditUserModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR));
            }
            var company = await this._companyManager.FindById(id);
            if (company == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }          

            var user = company.Owners.FirstOrDefault(a => a.UserId == model.UserId);
            var sum = this._companyManager.SumCompanyPercentage(company) + model.Percentage - user.Percentage;
            if (sum > 100)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_SUCEEDED));
            }
            user.Percentage = model.Percentage;
            user.Role = model.Role;
            this._companyManager.EditUserInCompany(user);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpDelete("{id}/RemoveUser/{userId}")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> RemoveUserFromCompany(int id, string userId)
        {
            var company = await this._companyManager.FindById(id);
            if (company == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            var user = await this._applicationUserManager.FindById(userId);
            if (user == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            this._companyManager.RemoveUserFromCompany(user, company);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpGet("{id}/Users")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> GetCompanyUsers(int id)
        {
            var company = await this._companyManager.FindById(id);
            if (company == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            var companyOwners = company.Owners.ToList();

            var companyOwnersModel = this._mapper.Map<List<CompanyDetailViewModel>>(companyOwners);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { owners = companyOwnersModel }));
        }

    }
}