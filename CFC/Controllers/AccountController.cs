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
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IApplicationUserManager _applicationUserManager;
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly IEmailSender _emailSender;
        private readonly IMapper _mapper;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory,
            IApplicationUserManager applicationUserManager,
            IConfiguration configuration,
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
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> GenerateDefaultUser()
        {
            var currentUser = await this._userManager.FindByNameAsync("administrator");
            if (currentUser != null)
            {
                return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { password = "GO AHEAD!" }));
            }
            var user = new ApplicationUser()
            {
                UserName = "administrator",
                Email = "admin@admin.sk",
                EmailConfirmed = true,
                Name = "administrator",
                Surname = "administrator",


            };
            var pwd = this._applicationUserManager.GenerateRandomPassword();
            var result = await this._userManager.CreateAsync(user, pwd);
            await this.GenerateRoles();
            var roleResult = await this._userManager.AddToRoleAsync(user, "admin");
            if (result.Succeeded && roleResult.Succeeded)
            {
                return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { password = pwd }));
            }
            else
            {
                this._logger.Log(LogLevel.Warning, $"generate default user failed: {result.Errors.Concat(roleResult.Errors).ToArray().ToString()}");
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_SUCEEDED));
            }
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody]LoginViewModel model, string button)
        {
            if (ModelState.IsValid)
            {

                var appUser = _userManager.Users.SingleOrDefault(r => r.Email == model.Email);
                if (appUser == null)
                {
                    return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.USER_NOT_FOUND, ""));
                }

                if (appUser.Blocked)
                {
                    return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.BLOCKED, ""));
                }

                if (appUser.Obsolete)
                {
                    return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.OBSOLETE, ""));
                }


                var result = await _signInManager.PasswordSignInAsync(appUser.UserName,
                    model.Password, model.RememberMe, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    var token = await GenerateJwtToken(model.Email, appUser);
                    var role = (await this._userManager.GetRolesAsync(appUser)).ToList().FirstOrDefault();
                    _logger.LogInformation($"User {appUser.Name} {appUser.Surname} [{role}] logged in.");
                    return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { token = token, email = model.Email, role = role }));
                }
                if (result.RequiresTwoFactor)
                {
                    return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.DOUBLE_FA, ""));
                }
                if (result.IsLockedOut)
                {
                    return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.BLOCKED, ""));
                }
                else
                {
                    this._logger.Log(LogLevel.Warning, $"Invalid login result status for user {appUser.Email}: {result.ToString()}");
                    return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND, ""));
                }
            }
            else
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR, ""));
            }
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> RequestNewPassword([FromBody]PasswordResetEmailModel model)
        {

            var appUser = _userManager.Users.SingleOrDefault(r => r.Email == model.EmailAddress);
            if (appUser == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.USER_NOT_FOUND, ""));
            }
            var passwordToken = new PasswordResetToken();
            passwordToken.UserEmail = model.EmailAddress;
            passwordToken.Token = await this._userManager.GeneratePasswordResetTokenAsync(appUser);
            passwordToken.ValidTo = DateTimeOffset.UtcNow.AddDays(1); // add 1 day for reset
            this._applicationUserManager.CreatePasswordResetToken(passwordToken);
            this._emailSender.SendPasswordResetToken(model.EmailAddress, passwordToken);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));

        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> RequestPasswordToken([FromBody]TokenLinkModel tokenLink)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR, ""));
            }
            var guidLink = Guid.Parse(tokenLink.Token);
            var token = await this._applicationUserManager.GetTokenFromLink(guidLink);
            if (token == null || token.ValidTo < DateTimeOffset.UtcNow || token.IsUsed)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.INVALID_TOKEN, ""));
            }
            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { token = token.Token }));
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> PasswordReset([FromBody]PasswordResetModel passwordReset)
        {
            if (ModelState.IsValid)
            {
                var token = await this._applicationUserManager.GetTokenFromLink(passwordReset.Link);
                if (token == null || token.ValidTo < DateTimeOffset.UtcNow || token.IsUsed || token.Token != passwordReset.Token)
                {
                    return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.INVALID_TOKEN, ""));
                }
                else
                {
                    var appUser = _userManager.Users.SingleOrDefault(r => r.Email == token.UserEmail);
                    if (appUser == null)
                    {
                        return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.USER_NOT_FOUND, ""));
                    }
                    var result = await this._userManager.ResetPasswordAsync(appUser, token.Token, passwordReset.Password);
                    if (result.Succeeded)
                    {
                        await this._applicationUserManager.MarkPasswordResetTokenAsUsed(token.Id);
                        return Ok(new ResponseDTO(ResponseDTOStatus.OK));
                    }
                    else
                    {
                        this._logger.Log(LogLevel.Warning, $"Invalid password for reset user {appUser.Email}: {result.Errors.ToArray().ToString()}");
                        return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_SUCEEDED, ""));
                    }
                }
            }
            else
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR, ""));
            }
        }



        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody]RegisterRequestViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR, ""));
            }

            var existingUser = _userManager.Users.SingleOrDefault(r => r.Email == model.Email);
            if (existingUser != null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.EXISTING_USER, ""));
            }

            var user = new ApplicationUser()
            {
                UserName = model.Email,
                Email = model.Email,
                PhoneNumber = model.Phone,
                EmailConfirmed = false,
                Name = model.Name,
                Surname = model.Surname,
                Blocked = false,
                Obsolete = false,
            };
            var pwd = this._applicationUserManager.GenerateRandomPassword();
            var result = await this._userManager.CreateAsync(user, pwd);
            var roleResult = await this._userManager.AddToRoleAsync(user, "owner");
            if (result.Succeeded && roleResult.Succeeded)
            {
                var token = new VerifyUserToken();
                token.Email = user.Email;
                token.Obsolete = false;
                token.Token = Guid.NewGuid().ToString();
                this._applicationUserManager.CreateVerifyUserToken(token);
                this._emailSender.SendVerifyToken(user.Email, token);
                return Ok(new ResponseDTO(ResponseDTOStatus.OK));
            }
            else
            {
                this._logger.Log(LogLevel.Warning, $"Invalid  error when registering user {user.Email}: {result.Errors.Concat(roleResult.Errors).ToArray().ToString()}");
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_SUCEEDED, ""));
            }
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> UserDetail()
        {
            var userId = this._userManager.GetUserId(this.HttpContext.User);

            var existingUser = this._userManager.Users.SingleOrDefault(r => r.Id == userId);
            if (existingUser == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.USER_NOT_FOUND, ""));
            }

            var user = new UserDetailModel()
            {
                Email = existingUser.Email,
                Phone = existingUser.PhoneNumber,
                Name = existingUser.Name,
                Surname = existingUser.Surname,
            };
            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { user }));

        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> UserDetail(string id)
        {

            var existingUser = this._userManager.Users.SingleOrDefault(r => r.Id == id);
            if (existingUser == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.USER_NOT_FOUND, ""));
            }

            var user = new UserDetailModel()
            {
                Email = existingUser.Email,
                Phone = existingUser.PhoneNumber,
                Name = existingUser.Name,
                Surname = existingUser.Surname,
            };
            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { user }));

        }

        [HttpPost("[action]")]
        public async Task<IActionResult> EditUser([FromBody]UserEditModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR, ""));
            }
            var loggedUserId = this._userManager.GetUserId(this.HttpContext.User);

            var loggedUser = _userManager.Users.SingleOrDefault(r => r.Id == loggedUserId);
            if (loggedUser.Email != model.Email && (await this.IsAdmin()) == false)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.USER_NOT_FOUND, ""));

            }

            var appUser = _userManager.Users.SingleOrDefault(r => r.Email == model.Email);
            if (appUser == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.USER_NOT_FOUND, ""));
            }

            appUser.Name = model.Name;
            appUser.Surname = model.Surname;
            appUser.PhoneNumber = model.Phone;
            this._applicationUserManager.EditUser(appUser);
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));

        }


        [HttpPost("[action]")]
        public async Task<IActionResult> ChangePassword([FromBody]PasswordChangeModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR, ""));
            }
            var userId = this._userManager.GetUserId(this.HttpContext.User);
            if (userId == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.USER_NOT_FOUND, ""));
            }

            var existingUser = this._userManager.Users.SingleOrDefault(r => r.Id == userId);
            if (existingUser == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.USER_NOT_FOUND, ""));
            }

            var result = await this._userManager.ChangePasswordAsync(existingUser, model.OldPassword, model.NewPassword);
            if (result.Succeeded)
            {
                return Ok(new ResponseDTO(ResponseDTOStatus.OK));
            }
            else
            {
                this._logger.Log(LogLevel.Warning, $"Invalid  error when changing password for {existingUser.Email}: {result.Errors.ToArray().ToString()}");
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_SUCEEDED, result.Errors.ToArray().ToString()));
            }

        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetUsers()
        {
            var isAdmin = await this.IsAdmin();
            if (!isAdmin)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.FORBIDDEN, ""));
            }

            var users = await this._applicationUserManager.GetUserList();
            var userModels = this._mapper.Map<List<UserExtendedDetailModel>>(users);
            foreach (var user in users)
            {
                var role = (await this._userManager.GetRolesAsync(user)).ToList().FirstOrDefault();
                userModels.FirstOrDefault(a => a.Email == user.Email).Role = role;
            }
            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: userModels));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> BlockUser([FromBody]BlockUserModel model)
        {
            var isAdmin = await this.IsAdmin();
            if (!isAdmin)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.FORBIDDEN, ""));
            }
            var existingUser = this._userManager.Users.SingleOrDefault(r => r.Id == model.Id);
            if (existingUser == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.USER_NOT_FOUND, ""));
            }
            if (model.Block)
            {
                this._applicationUserManager.BlockUser(existingUser);
            }
            else
            {
                this._applicationUserManager.UnblockUser(existingUser);

            }
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> RemoveUser([FromBody]RemoveUserModel model)
        {
            var isAdmin = await this.IsAdmin();
            if (!isAdmin)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.FORBIDDEN, ""));
            }
            var existingUser = this._userManager.Users.SingleOrDefault(r => r.Id == model.Id);
            if (existingUser == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.USER_NOT_FOUND, ""));
            }
            if (model.Remove)
            {
                this._applicationUserManager.RemoveUser(existingUser);
            }
            else
            {
                this._applicationUserManager.UnremoveUser(existingUser);

            }
            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyUser([FromBody]VerifyUserModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.MODEL_STATE_ERROR, ""));
            }
            var token = await this._applicationUserManager.GetVerifyToken(model.Token);
            if (token == null || token.Obsolete)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND, ""));
            }
            var existingUser = this._userManager.Users.SingleOrDefault(r => r.Email == token.Email);
            if (existingUser == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.USER_NOT_FOUND, ""));
            }
            this._applicationUserManager.VerifyUser(existingUser);
            var resetToken = await this._userManager.GeneratePasswordResetTokenAsync(existingUser);
            await this._userManager.ResetPasswordAsync(existingUser, resetToken, model.Password);
            await this._applicationUserManager.MarkVerifyUserTokenAsUsed(token.Id);

            return Ok(new ResponseDTO(ResponseDTOStatus.OK));
        }

        [HttpGet("[action]/{data}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetVerifyToken(string data)
        {
            var token = await this._applicationUserManager.GetVerifyToken(data);
            if (token == null || token.Obsolete)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.NOT_FOUND, ""));
            }
            var existingUser = this._userManager.Users.SingleOrDefault(r => r.Email == token.Email);
            if (existingUser == null)
            {
                return BadRequest(new ResponseDTO(ResponseDTOStatus.ERROR, ResponseDTOErrorLabel.USER_NOT_FOUND, ""));
            }

            return Ok(new ResponseDTO(ResponseDTOStatus.OK, data: new { email = token.Email }));
        }

        //TODO make annotation
        private async Task<bool> IsAdmin()
        {
            var userId = this._userManager.GetUserId(this.HttpContext.User);
            if (userId == null)
            {
                return false;
            }

            var existingUser = this._userManager.Users.SingleOrDefault(r => r.Id == userId);
            if (existingUser == null)
            {
                return false;
            }

            var isAdmin = await this._userManager.IsInRoleAsync(existingUser, "Admin");
            if (!isAdmin)
            {
                return false;
            }
            return true;
        }


        private async Task<object> GenerateJwtToken(string email, IdentityUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(_configuration["JwtExpireDays"]));

            var token = new JwtSecurityToken(
                _configuration["JwtIssuer"],
                _configuration["JwtIssuer"],
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        private async Task GenerateRoles()
        {
            string[] roleNames = { "admin", "owner" };
            IdentityResult roleResult;

            foreach (var roleName in roleNames)
            {
                var roleExist = await this._roleManager.RoleExistsAsync(roleName);
                if (!roleExist)
                {
                    //create the roles and seed them to the database: Question 1
                    roleResult = await this._roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

        }
    }
}