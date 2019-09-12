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
    public class DashboardController : Controller
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

        public DashboardController(
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

      

        [HttpGet("admin")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR)]
        public async Task<IActionResult> GetAdminDashboard()
        {
            var companiesTask = this._companyManager.GetAll();
            var officesTask = this._officeManager.GetAll();
            var usersTask = this._applicationUserManager.GetAll();           

            var companies = await companiesTask;
            var offices = await officesTask;
            var users = await usersTask;

            var companiesModel = this._mapper.Map<List<CompanyViewModel>>(companies);
            var officesModel = this._mapper.Map<List<OfficeViewModel>>(offices);
            var usersModel = this._mapper.Map<List<UserExtendedDetailModel>>(users);

            var adminModel = new AdminDashboardViewModel()
            {
                Companies = companiesModel,
                Offices = officesModel,
                Users = usersModel,
            };
            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { data = adminModel }));
        }

        [HttpGet("user")]
        [Authorize(Roles = Constants.Roles.ADMININISTRATOR_AND_OWNER)]
        public async Task<IActionResult> GetUserDashboard(int id)
        {
            var userId = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var companies = await this._companyManager.GetCompaniesByOwner(userId);
            var offices = await this._officeManager.GetOfficesByOwner(userId);
            var totalWithdraw = await this._moneyRecordManager.GetWithdrawsForOwner(userId);
            var totalWithdrawSum = this._moneyRecordManager.SumRecordsForOwner(totalWithdraw);


            var totalDeposit = await this._moneyRecordManager.GetDepositsForOwner(userId);
            var totalDepositSum = this._moneyRecordManager.SumRecordsForOwner(totalDeposit);

            var companiesModel = this._mapper.Map<List<CompanyViewModel>>(companies);
            var officesModel = this._mapper.Map<List<OfficeViewModel>>(offices);
            var totalAvailable = 0m;
            foreach (var company in companies)
            {
                var userCompany = company.Owners.Where(o => o.UserId == userId).FirstOrDefault();
                var percentage = userCompany != null ? userCompany.Percentage : 0m;
                var records = await this._moneyRecordManager.GetAllForCompany(company.Id);
                totalAvailable += this._moneyRecordManager.SumRecordsForCompanyAndUser(company.Id, percentage, records);
            }

            var model = new OwnerDashboardViewModel()
            {
                Companies = companiesModel,
                Offices = officesModel,
                TotalAvailable = totalAvailable,
                TotalDeposit = totalDepositSum,
                TotalWithdraw = totalWithdrawSum
            };

            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { data = model }));
        }

       

    }
}