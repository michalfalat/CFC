﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Net;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using CFC.Data.Entities;

namespace CFC.Data.Managers
{
    public class EmailSender : IEmailSender
    {
        private IHostingEnvironment _hostingEnvironment;
        private IConfiguration _configuration;
        public EmailSender(IConfiguration configuration, IHostingEnvironment environment)
        {
            _configuration = configuration;
            _hostingEnvironment = environment;
        }

        public string GetEmailTemplate(string path)
        {
            return this.ReadFile(path);
        }

        public int SendEmail(string to, string subject, string body)
        {
            //TODO
            Console.WriteLine("EMAIL SENDER");
            Console.WriteLine($"To: {to}");
            Console.WriteLine($"Subject: {subject}");
            Console.WriteLine($"Body: {body}");

            string fromPassword = _configuration.GetValue<string>("EmailClient:Password");
            string fromEmail = _configuration.GetValue<string>("EmailClient:Address");
            var fromAddress = new MailAddress(fromEmail, "CFC administrator");
            var toAddress = new MailAddress(to, "User");

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };
            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body
            })
            {
                message.IsBodyHtml = true;
                smtp.Send(message);
            }

            return 1;
        }

        public void SendPasswordResetToken(string to, PasswordResetToken token)
        {
            var template = this.GetEmailTemplate("Assets\\EmailTemplates\\template1.html");
            template = template.Replace("{headerText}", "Reset hesla")
                                .Replace("{mainText}", "Vaše heslo si môžete zmeniť na nasledujúcom odkaze:")
                                .Replace("{buttonLink}", $"https://localhost:44388/reset-password/{token.Link}")
                                .Replace("{buttonText}", "Zmeniť heslo");
            this.SendEmail(to, "CFC - Reset hesla", template);
        }

        public void SendVerifyToken(string to, VerifyUserToken token)
        {
            var template = this.GetEmailTemplate("Assets\\EmailTemplates\\template1.html");
            template = template.Replace("{headerText}", "Overenie emailovej adresy pre CFC")
                                .Replace("{mainText}", "Táto emailová adresa bola zaregistrovaná v systéme CFC. Pre potvrdenie emailu prosím kliknite na nasledujúci odkaz:")
                                .Replace("{buttonLink}", $"https://localhost:44388/verify/{token.Token}")
                                .Replace("{buttonText}", "Overenie emailu");
            this.SendEmail(to, "CFC - Overenie emailovej adresy", template);
        }

        private string ReadFile(string path)
        {
            var fullPath = Path.Combine(_hostingEnvironment.WebRootPath, path);
            if (System.IO.File.Exists(fullPath))
            {
                return System.IO.File.ReadAllText(fullPath);
            }
            return "";
        }
    }
}
