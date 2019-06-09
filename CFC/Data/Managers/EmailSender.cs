using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace CFC.Data.Managers
{
    public class EmailSender : IEmailSender
    {

        readonly IConfiguration _configuration;
        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
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
                smtp.Send(message);
            }

            return 1;
        }
    }
}
