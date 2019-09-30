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
    public class MoneyRecordController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IApplicationUserManager _applicationUserManager;
        private readonly IMoneyRecordManager _moneyRecordManager;
        private readonly ICompanyManager _companyManager;
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        private readonly IMapper _mapper;

        public MoneyRecordController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory,
            IApplicationUserManager applicationUserManager,
            IConfiguration configuration,
            IMoneyRecordManager moneyRecordManager,
            IEmailSender emailSender,
            ICompanyManager companyManager, IMapper mapper)
        {
            this._userManager = userManager;
            this._roleManager = roleManager;
            this._signInManager = signInManager;
            this._logger = loggerFactory.CreateLogger<AccountController>();
            this._applicationUserManager = applicationUserManager;
            this._configuration = configuration;
            this._emailSender = emailSender;
            this._mapper = mapper;
            this._moneyRecordManager = moneyRecordManager;
            this._companyManager = companyManager;
        }

        [HttpPost]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> Add([FromBody] MoneyRecordAddModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR));
            }
            var record = this._mapper.Map<MoneyRecordAddModel, MoneyRecord>(model);
            record.CreatorId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            record.Obsolete = false;
            record.CreatedAt = DateTime.Now;
            record.EditedAt = DateTime.Now;

            this._moneyRecordManager.Create(record);

            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpPost("[action]")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR)]
        public async Task<IActionResult> AddExtended([FromBody] MoneyRecordExtendedAddModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR));
            }
            var record = this._mapper.Map<MoneyRecordExtendedAddModel, MoneyRecord>(model);
            record.Obsolete = false;
            record.CreatedAt = DateTime.Now;
            record.EditedAt = DateTime.Now;
            var validity =  await this._moneyRecordManager.CheckValidity(record);
            if(validity)
            {
                this._moneyRecordManager.Create(record);
                return Ok(new ResponseDTO(ResponseDTOStatus.OK));
            } else
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.FORBIDDEN));
            }


        }

        [HttpGet("all/company")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> GetAllForCompany()
        {
            var records = new List<MoneyRecord>();
            var isAdmin = HttpContext.User.IsInRole(Constants.Roles.ADMININISTRATOR);
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            string type = "company";
            if (isAdmin)
            {
                records = await this._moneyRecordManager.GetAll(type);
            }
            else
            {
                records = await this._moneyRecordManager.GetAllCompanyRecordsForOwner(type, userId);

            }
            var recordsModels = this._mapper.Map<List<MoneyRecordViewModel>>(records);
            foreach (var record in recordsModels)
            {
                record.Editable = isAdmin || record.CreatorId == userId;
            }

            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { records = recordsModels }));
        }

        [HttpGet("all/company/recordLabels")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> GetRecordLabels()
        {
            var records = new List<MoneyRecord>();
            var isAdmin = HttpContext.User.IsInRole(Constants.Roles.ADMININISTRATOR);
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            string type = "company";
            if (isAdmin)
            {
                records = await this._moneyRecordManager.GetAll(type);
            }
            else
            {
                records = await this._moneyRecordManager.GetAllCompanyRecordsForOwner(type, userId);

            }
            var recordLabels = records.Select(r => r.Description).ToList();
           

            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { labels = recordLabels }));
        }



        [HttpGet("all/personal")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> GetAllPersonal()
        {
            var records = new List<MoneyRecord>();
            string type = "personal";
            if (HttpContext.User.IsInRole(Constants.Roles.ADMININISTRATOR))
            {
                records = await this._moneyRecordManager.GetAll(type);
                var companies = await this._companyManager.GetAll();
                var model = new List<MoneyRecordPersonalGroupedViewModel>();
                foreach (var company in companies)
                {
                    var filteredRecords = records.Where(r => r.CompanyId == company.Id).ToList();
                    var filteredRecordsModels = this._mapper.Map<List<MoneyRecordViewModel>>(filteredRecords);
                    var item = new MoneyRecordPersonalGroupedViewModel()
                    {
                        CompanyId = company.Id,
                        CompanyName = company.Name,
                        Records = filteredRecordsModels,
                        Percentage = null,
                        Cashflow = null,
                    };
                    model.Add(item);
                }

                return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { records = model }));

            }
            else
            {
                var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
                records = await this._moneyRecordManager.GetAllCompanyRecordsForOwner(type, userId);
                var companies = await this._companyManager.GetCompaniesByOwner(userId);
                var model = new List<MoneyRecordPersonalGroupedViewModel>();
                foreach (var company in companies)
                {
                    var filteredRecords = records.Where(r => r.CompanyId == company.Id).ToList();
                    var filteredRecordsModels = this._mapper.Map<List<MoneyRecordViewModel>>(filteredRecords);
                    var companyRecords = await this._moneyRecordManager.GetAllForCompany(company.Id);
                    var owner = company.Owners.FirstOrDefault(a => a.UserId == userId);
                    var item = new MoneyRecordPersonalGroupedViewModel()
                    {
                        CompanyId = company.Id,
                        CompanyName = company.Name,
                        Records = filteredRecordsModels,
                        Percentage = owner?.Percentage,
                        Cashflow = this._moneyRecordManager.SumRecordsForCompany(company.Id, companyRecords),
                        AllDeposit = this._moneyRecordManager.SumAllDeposits( companyRecords),
                        AllWithdraw = this._moneyRecordManager.SumAllWithdraws(companyRecords),
                        PersonalDeposit = filteredRecords.Where(r => r.Type == MoneyRecordType.DEPOSIT).Sum(r => r.Amount),
                        PersonalWithdraw = filteredRecords.Where(r => r.Type == MoneyRecordType.WITHDRAW).Sum(r => r.Amount * (-1)),
                    };
                    model.Add(item);
                }

                return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { records = model }));
            }
        }

        [HttpGet("{id}")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> Get(int id)
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = HttpContext.User.IsInRole(Constants.Roles.ADMININISTRATOR);
            var record = await this._moneyRecordManager.FindById(id);
            if (record == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            if (record.CreatorId != userId && isAdmin == false)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            var recordModel = this._mapper.Map<MoneyRecordDetailViewModel>(record);

            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { record = recordModel }));
        }

        [HttpPost("[action]")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> Edit([FromBody] MoneyRecordEditModel model)
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = HttpContext.User.IsInRole(Constants.Roles.ADMININISTRATOR);
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR));
            }

            var record = await this._moneyRecordManager.FindById(model.RecordId);
            if (record == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }

            if (record.CreatorId != userId && isAdmin == false)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }

            record.Amount = model.Amount;
            record.CompanyId = model.CompanyId;
            record.OfficeId = model.OfficeId;
            record.Type = model.Type;
            record.CreatedAt = model.Created;
            record.Description = model.Description;
            this._moneyRecordManager.Edit(record);

            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> Remove(int id)
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isAdmin = HttpContext.User.IsInRole(Constants.Roles.ADMININISTRATOR);
            var record = await this._moneyRecordManager.FindById(id);
            if (record == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }

            if (record.CreatorId != userId && isAdmin == false)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            }
            this._moneyRecordManager.Remove(record);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpPost("Unremove/{id}")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR)]
        public async Task<IActionResult> Unremove(int id)
        {
            //var record = await this._moneyRecordManager.FindById(id);
            //if (record == null)
            //{
            //    return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND));
            //}
            //this._moneyRecordManager.Unremove(record);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }
    }
}
