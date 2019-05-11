﻿using System.Collections.Generic;
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

namespace CFC.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        public IApplicationUserManager _applicationUserManager { get; set; }
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            ILoggerFactory loggerFactory,
            IApplicationUserManager applicationUserManager,
            IConfiguration configuration)
        {
            this._userManager = userManager;
            this._roleManager = roleManager;
            this._signInManager = signInManager;
            this._logger = loggerFactory.CreateLogger<AccountController>();
            this._applicationUserManager = applicationUserManager;
            this._configuration = configuration;
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> GenerateDefaultUser()
        {
            var currentUser = await this._userManager.FindByNameAsync("administrator");
            if(currentUser != null)
            {
                return Ok(new { result = "OK", password = "Go ahead!" });
            }
            var user = new ApplicationUser()
            {
                UserName = "administrator",
                Email = "admin@admin.sk",
                EmailConfirmed = true,
                Name = "administrator",
                Surname = "administrator",
                

            };
            var pwd = "f@kePassw0rd"; // TODO Generate dynamically
            var result = await this._userManager.CreateAsync(user, pwd);
            await this.GenerateRoles();
            var roleResult = await this._userManager.AddToRoleAsync(user, "admin");
            if (result.Succeeded && roleResult.Succeeded)
            {
                return Ok(new { result = "OK", password = pwd });
            }
           else
            {
                return Ok(new { result = "ERROR", errors = result.Errors.Concat(roleResult.Errors).ToArray() });
            }
        }

        [HttpPost("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody]LoginViewModel model, string button)
        {
            if (ModelState.IsValid)
            {

                var appUser = _userManager.Users.SingleOrDefault(r => r.Email == model.Email);
                if(appUser == null)
                {
                    return StatusCode(403, new { message = "InvalidLogin" });
                }
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, 
                // set lockoutOnFailure: true
                var result = await _signInManager.PasswordSignInAsync(appUser.UserName,
                    model.Password, model.RememberMe, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    var token = await GenerateJwtToken(model.Email, appUser);
                    var role = (await this._userManager.GetRolesAsync(appUser)).ToList().FirstOrDefault();
                    _logger.LogInformation("User logged in.");
                    return Ok(new { result = "OK", token = token, email = model.Email, role = role });
                }
                if (result.RequiresTwoFactor)
                {
                    return StatusCode(403, new { message = "2FA" });
                }
                if (result.IsLockedOut)
                {
                    return StatusCode(403, new { message = "Locked" });
                }
                else
                {
                    return StatusCode(403, new { message= "InvalidLogin"});
                }
            }
            else
            {
                return StatusCode(403, new { message = "InvalidLogin" });
            }
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
            string[] roleNames = { "admin", "owner"};
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

        //[HttpPost]
        //[Route("api/[controller]")]
        //public async Task<IActionResult> Register([FromBody]RegisterRequestViewModel model)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var user = new ApplicationUser { UserName = model.Email, Name = model.Name, Email = model.Email };

        //    var result = await _userManager.CreateAsync(user, model.Password);

        //    if (!result.Succeeded) return BadRequest(result.Errors);

        //    await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("userName", user.UserName));
        //    await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("name", user.Name));
        //    await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("email", user.Email));
        //    await _userManager.AddClaimAsync(user, new System.Security.Claims.Claim("role", Roles.Consumer));

        //    return Ok(new RegisterResponseViewModel(user));
        //}

        //
        //    // GET: /Account/Login
        //    [HttpGet]
        //    [AllowAnonymous]
        //    public IActionResult Login(string returnUrl = null)
        //    {
        //        ViewData["ReturnUrl"] = returnUrl;
        //        return View();
        //    }

        //    //
        //    // POST: /Account/Login
        //    [HttpPost]
        //    [AllowAnonymous]
        //    [ValidateAntiForgeryToken]
        //    public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = null)
        //    {
        //        ViewData["ReturnUrl"] = returnUrl;
        //        if (ModelState.IsValid)
        //        {
        //            // This doesn't count login failures towards account lockout
        //            // To enable password failures to trigger account lockout, set lockoutOnFailure: true
        //            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);
        //            if (result.Succeeded)
        //            {
        //                _logger.LogInformation(1, "User logged in.");
        //                return RedirectToLocal(returnUrl);
        //            }
        //            if (result.RequiresTwoFactor)
        //            {
        //                return RedirectToAction(nameof(SendCode), new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
        //            }
        //            if (result.IsLockedOut)
        //            {
        //                _logger.LogWarning(2, "User account locked out.");
        //                return View("Lockout");
        //            }
        //            else
        //            {
        //                ModelState.AddModelError(string.Empty, "Invalid login attempt.");
        //                return View(model);
        //            }
        //        }

        //        // If we got this far, something failed, redisplay form
        //        return View(model);
        //    }

        //    //
        //    // GET: /Account/Register
        //    [HttpGet]
        //    [AllowAnonymous]
        //    public IActionResult Register()
        //    {
        //        return View();
        //    }

        //    //
        //    // POST: /Account/Register
        //    [HttpPost]
        //    [AllowAnonymous]
        //    [ValidateAntiForgeryToken]
        //    public async Task<IActionResult> Register(RegisterViewModel model)
        //    {
        //        if (ModelState.IsValid)
        //        {
        //            var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
        //            var result = await _userManager.CreateAsync(user, model.Password);
        //            if (result.Succeeded)
        //            {
        //                // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=532713
        //                // Send an email with this link
        //                //var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        //                //var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
        //                //await _emailSender.SendEmailAsync(model.Email, "Confirm your account",
        //                //    "Please confirm your account by clicking this link: <a href=\"" + callbackUrl + "\">link</a>");
        //                await _signInManager.SignInAsync(user, isPersistent: false);
        //                _logger.LogInformation(3, "User created a new account with password.");
        //                return RedirectToAction(nameof(HomeController.Index), "Home");
        //            }
        //            AddErrors(result);
        //        }

        //        // If we got this far, something failed, redisplay form
        //        return View(model);
        //    }

        //    //
        //    // POST: /Account/LogOff
        //    [HttpPost]
        //    [ValidateAntiForgeryToken]
        //    public async Task<IActionResult> LogOff()
        //    {
        //        await _signInManager.SignOutAsync();
        //        _logger.LogInformation(4, "User logged out.");
        //        return RedirectToAction(nameof(HomeController.Index), "Home");
        //    }

        //    //
        //    // POST: /Account/ExternalLogin
        //    [HttpPost]
        //    [AllowAnonymous]
        //    [ValidateAntiForgeryToken]
        //    public IActionResult ExternalLogin(string provider, string returnUrl = null)
        //    {
        //        // Request a redirect to the external login provider.
        //        var redirectUrl = Url.Action("ExternalLoginCallback", "Account", new { ReturnUrl = returnUrl });
        //        var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
        //        return new ChallengeResult(provider, properties);
        //    }

        //    //
        //    // GET: /Account/ExternalLoginCallback
        //    [HttpGet]
        //    [AllowAnonymous]
        //    public async Task<IActionResult> ExternalLoginCallback(string returnUrl = null)
        //    {
        //        var info = await _signInManager.GetExternalLoginInfoAsync();
        //        if (info == null)
        //        {
        //            return RedirectToAction(nameof(Login));
        //        }

        //        // Sign in the user with this external login provider if the user already has a login.
        //        var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false);
        //        if (result.Succeeded)
        //        {
        //            _logger.LogInformation(5, "User logged in with {Name} provider.", info.LoginProvider);
        //            return RedirectToLocal(returnUrl);
        //        }
        //        if (result.RequiresTwoFactor)
        //        {
        //            return RedirectToAction(nameof(SendCode), new { ReturnUrl = returnUrl });
        //        }
        //        if (result.IsLockedOut)
        //        {
        //            return View("Lockout");
        //        }
        //        else
        //        {
        //            // If the user does not have an account, then ask the user to create an account.
        //            ViewData["ReturnUrl"] = returnUrl;
        //            ViewData["LoginProvider"] = info.LoginProvider;
        //            var email = info.Principal.FindFirstValue(ClaimTypes.Email);
        //            return View("ExternalLoginConfirmation", new ExternalLoginConfirmationViewModel { Email = email });
        //        }
        //    }

        //    //
        //    // POST: /Account/ExternalLoginConfirmation
        //    [HttpPost]
        //    [AllowAnonymous]
        //    [ValidateAntiForgeryToken]
        //    public async Task<IActionResult> ExternalLoginConfirmation(ExternalLoginConfirmationViewModel model, string returnUrl = null)
        //    {
        //        if (_signInManager.IsSignedIn(User))
        //        {
        //            return RedirectToAction(nameof(ManageController.Index), "Manage");
        //        }

        //        if (ModelState.IsValid)
        //        {
        //            // Get the information about the user from the external login provider
        //            var info = await _signInManager.GetExternalLoginInfoAsync();
        //            if (info == null)
        //            {
        //                return View("ExternalLoginFailure");
        //            }
        //            var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
        //            var result = await _userManager.CreateAsync(user);
        //            if (result.Succeeded)
        //            {
        //                result = await _userManager.AddLoginAsync(user, info);
        //                if (result.Succeeded)
        //                {
        //                    await _signInManager.SignInAsync(user, isPersistent: false);
        //                    _logger.LogInformation(6, "User created an account using {Name} provider.", info.LoginProvider);
        //                    return RedirectToLocal(returnUrl);
        //                }
        //            }
        //            AddErrors(result);
        //        }

        //        ViewData["ReturnUrl"] = returnUrl;
        //        return View(model);
        //    }

        //    // GET: /Account/ConfirmEmail
        //    [HttpGet]
        //    [AllowAnonymous]
        //    public async Task<IActionResult> ConfirmEmail(string userId, string code)
        //    {
        //        if (userId == null || code == null)
        //        {
        //            return View("Error");
        //        }
        //        var user = await _userManager.FindByIdAsync(userId);
        //        if (user == null)
        //        {
        //            return View("Error");
        //        }
        //        var result = await _userManager.ConfirmEmailAsync(user, code);
        //        return View(result.Succeeded ? "ConfirmEmail" : "Error");
        //    }

        //    //
        //    // GET: /Account/ForgotPassword
        //    [HttpGet]
        //    [AllowAnonymous]
        //    public IActionResult ForgotPassword()
        //    {
        //        return View();
        //    }

        //    //
        //    // POST: /Account/ForgotPassword
        //    [HttpPost]
        //    [AllowAnonymous]
        //    [ValidateAntiForgeryToken]
        //    public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        //    {
        //        if (ModelState.IsValid)
        //        {
        //            var user = await _userManager.FindByNameAsync(model.Email);
        //            if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
        //            {
        //                // Don't reveal that the user does not exist or is not confirmed
        //                return View("ForgotPasswordConfirmation");
        //            }

        //            // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=532713
        //            // Send an email with this link
        //            //var code = await _userManager.GeneratePasswordResetTokenAsync(user);
        //            //var callbackUrl = Url.Action("ResetPassword", "Account", new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
        //            //await _emailSender.SendEmailAsync(model.Email, "Reset Password",
        //            //   "Please reset your password by clicking here: <a href=\"" + callbackUrl + "\">link</a>");
        //            //return View("ForgotPasswordConfirmation");
        //        }

        //        // If we got this far, something failed, redisplay form
        //        return View(model);
        //    }

        //    //
        //    // GET: /Account/ForgotPasswordConfirmation
        //    [HttpGet]
        //    [AllowAnonymous]
        //    public IActionResult ForgotPasswordConfirmation()
        //    {
        //        return View();
        //    }

        //    //
        //    // GET: /Account/ResetPassword
        //    [HttpGet]
        //    [AllowAnonymous]
        //    public IActionResult ResetPassword(string code = null)
        //    {
        //        return code == null ? View("Error") : View();
        //    }

        //    //
        //    // POST: /Account/ResetPassword
        //    [HttpPost]
        //    [AllowAnonymous]
        //    [ValidateAntiForgeryToken]
        //    public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return View(model);
        //        }
        //        var user = await _userManager.FindByNameAsync(model.Email);
        //        if (user == null)
        //        {
        //            // Don't reveal that the user does not exist
        //            return RedirectToAction(nameof(AccountController.ResetPasswordConfirmation), "Account");
        //        }
        //        var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);
        //        if (result.Succeeded)
        //        {
        //            return RedirectToAction(nameof(AccountController.ResetPasswordConfirmation), "Account");
        //        }
        //        AddErrors(result);
        //        return View();
        //    }

        //    //
        //    // GET: /Account/ResetPasswordConfirmation
        //    [HttpGet]
        //    [AllowAnonymous]
        //    public IActionResult ResetPasswordConfirmation()
        //    {
        //        return View();
        //    }

        //    //
        //    // GET: /Account/SendCode
        //    [HttpGet]
        //    [AllowAnonymous]
        //    public async Task<ActionResult> SendCode(string returnUrl = null, bool rememberMe = false)
        //    {
        //        var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
        //        if (user == null)
        //        {
        //            return View("Error");
        //        }
        //        var userFactors = await _userManager.GetValidTwoFactorProvidersAsync(user);
        //        var factorOptions = userFactors.Select(purpose => new SelectListItem { Text = purpose, Value = purpose }).ToList();
        //        return View(new SendCodeViewModel { Providers = factorOptions, ReturnUrl = returnUrl, RememberMe = rememberMe });
        //    }

        //    //
        //    // POST: /Account/SendCode
        //    [HttpPost]
        //    [AllowAnonymous]
        //    [ValidateAntiForgeryToken]
        //    public async Task<IActionResult> SendCode(SendCodeViewModel model)
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return View();
        //        }

        //        var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
        //        if (user == null)
        //        {
        //            return View("Error");
        //        }

        //        // Generate the token and send it
        //        var code = await _userManager.GenerateTwoFactorTokenAsync(user, model.SelectedProvider);
        //        if (string.IsNullOrWhiteSpace(code))
        //        {
        //            return View("Error");
        //        }

        //        var message = "Your security code is: " + code;
        //        if (model.SelectedProvider == "Email")
        //        {
        //            await _emailSender.SendEmailAsync(await _userManager.GetEmailAsync(user), "Security Code", message);
        //        }
        //        else if (model.SelectedProvider == "Phone")
        //        {
        //            await _smsSender.SendSmsAsync(await _userManager.GetPhoneNumberAsync(user), message);
        //        }

        //        return RedirectToAction(nameof(VerifyCode), new { Provider = model.SelectedProvider, ReturnUrl = model.ReturnUrl, RememberMe = model.RememberMe });
        //    }

        //    //
        //    // GET: /Account/VerifyCode
        //    [HttpGet]
        //    [AllowAnonymous]
        //    public async Task<IActionResult> VerifyCode(string provider, bool rememberMe, string returnUrl = null)
        //    {
        //        // Require that the user has already logged in via username/password or external login
        //        var user = await _signInManager.GetTwoFactorAuthenticationUserAsync();
        //        if (user == null)
        //        {
        //            return View("Error");
        //        }
        //        return View(new VerifyCodeViewModel { Provider = provider, ReturnUrl = returnUrl, RememberMe = rememberMe });
        //    }

        //    //
        //    // POST: /Account/VerifyCode
        //    [HttpPost]
        //    [AllowAnonymous]
        //    [ValidateAntiForgeryToken]
        //    public async Task<IActionResult> VerifyCode(VerifyCodeViewModel model)
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return View(model);
        //        }

        //        // The following code protects for brute force attacks against the two factor codes.
        //        // If a user enters incorrect codes for a specified amount of time then the user account
        //        // will be locked out for a specified amount of time.
        //        var result = await _signInManager.TwoFactorSignInAsync(model.Provider, model.Code, model.RememberMe, model.RememberBrowser);
        //        if (result.Succeeded)
        //        {
        //            return RedirectToLocal(model.ReturnUrl);
        //        }
        //        if (result.IsLockedOut)
        //        {
        //            _logger.LogWarning(7, "User account locked out.");
        //            return View("Lockout");
        //        }
        //        else
        //        {
        //            ModelState.AddModelError("", "Invalid code.");
        //            return View(model);
        //        }
        //    }

        //    #region Helpers

        //    private void AddErrors(IdentityResult result)
        //    {
        //        foreach (var error in result.Errors)
        //        {
        //            ModelState.AddModelError(string.Empty, error.Description);
        //        }
        //    }

        //    private async Task<ApplicationUser> GetCurrentUserAsync()
        //    {
        //        return await _userManager.GetUserAsync(HttpContext.User);
        //    }

        //    private IActionResult RedirectToLocal(string returnUrl)
        //    {
        //        if (Url.IsLocalUrl(returnUrl))
        //        {
        //            return Redirect(returnUrl);
        //        }
        //        else
        //        {
        //            return RedirectToAction(nameof(HomeController.Index), "Home");
        //        }
        //    }

        //    #endregion
        //}
    }
}