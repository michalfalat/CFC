using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Managers
{
    public class EmailSender : IEmailSender
    {
        public int SendEmail(string to, string subject, string body)
        {
            //TODO
            Console.WriteLine("EMAIL SENDER");
            Console.WriteLine($"To: {to}");
            Console.WriteLine($"Subject: {subject}");
            Console.WriteLine($"Body: {body}");

            return 1;
        }
    }
}
