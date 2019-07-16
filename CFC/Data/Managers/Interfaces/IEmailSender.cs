using CFC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Managers
{
    public interface IEmailSender
    {
        int SendEmail(string to, string subject, string body);


        void SendPasswordResetToken(string to, PasswordResetToken token);

        string GetEmailTemplate(string path);
    }
}
