using CFC.Data.Entities;
using CFC.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Managers
{
    public class ApplicationUserManager : IApplicationUserManager
    {
        public IRepositoryWrapper Repository { get; set; }
        public ApplicationUserManager(IRepositoryWrapper repository)
        {
            this.Repository = repository;
        }
        public void Create(ApplicationUser entity)
        {
            this.Repository.ApplicationUserRepository.Create(entity);
            this.Repository.Save();
        }

        public Task<ApplicationUser> FindById(string id)
        {
            return this.Repository.ApplicationUserRepository.FindByCondition(u => u.Id == id).FirstOrDefaultAsync();
        }

        public string GenerateRandomPassword()
        {
            Random r = new Random();
            string chars = "abcdefghijklmnopqrstwvxyz";
            string numbers = "0123456789";
            string sChars = "!@#$%&*()*-+";
            string finalPwd = "";
            for (int i = 0; i < 5; i++)
            {
                finalPwd += chars[r.Next(chars.Length)];
                finalPwd += chars[r.Next(chars.Length)].ToString().ToUpper();
                finalPwd += numbers[r.Next(numbers.Length)];
                finalPwd += sChars[r.Next(sChars.Length)];
            }
            //TODO shuffle
            return finalPwd;
        }

        public Task<PasswordResetToken> GetTokenFromLink(Guid link)
        {
            return this.Repository.PasswordResetTokenRepository.FindByCondition(u => u.Link == link).FirstOrDefaultAsync();
        }

        public void CreatePasswordResetToken(PasswordResetToken entity)
        {
            this.Repository.PasswordResetTokenRepository.Create(entity);
            this.Repository.Save();
        }
    }
}
