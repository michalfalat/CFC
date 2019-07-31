using CFC.Data.Entities;
using CFC.Data.Repositories;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
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

        [Obsolete]
        public Task<ApplicationUser> FindById(int id)
        {
            throw new NotSupportedException();
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

        public async Task MarkPasswordResetTokenAsUsed(int id)
        {
            var token = await this.Repository.PasswordResetTokenRepository.FindByCondition(t => t.Id == id).FirstOrDefaultAsync();
            token.IsUsed = true;
            this.Repository.PasswordResetTokenRepository.Update(token);
            this.Repository.Save();
        }

        public void Edit(ApplicationUser entity)
        {
            this.Repository.ApplicationUserRepository.Update(entity);
            this.Repository.Save();

        }

        public Task<List<ApplicationUser>> GetAll()
        {
            return this.Repository.ApplicationUserRepository.FindAll().ToListAsync();
        }

        public void BlockUser(ApplicationUser entity)
        {
            entity.Blocked = true;
            this.Edit(entity);
        }

        public void UnblockUser(ApplicationUser entity)
        {
            entity.Blocked = false;
            this.Edit(entity);
        }

        public void Unremove(ApplicationUser entity)
        {
            entity.Obsolete = false;
            this.Edit(entity);
        }

        public void Remove(ApplicationUser entity)
        {
            entity.Obsolete = true;
            this.Edit(entity);
        }

        public void VerifyUser(ApplicationUser entity)
        {
            entity.EmailConfirmed = true;
            this.Edit(entity);
        }

        public void CreateVerifyUserToken(VerifyUserToken entity)
        {
            this.Repository.VerifyTokenRepository.Create(entity);
            this.Repository.Save();
        }

        public Task<VerifyUserToken> GetVerifyToken(string id)
        {
            return this.Repository.VerifyTokenRepository.FindByCondition(u => u.Token == id).FirstOrDefaultAsync();
        }

        public async Task MarkVerifyUserTokenAsUsed(int id)
        {
            var token = await this.Repository.VerifyTokenRepository.FindByCondition(t => t.Id == id).FirstOrDefaultAsync();
            token.Obsolete = true;
            this.Repository.VerifyTokenRepository.Update(token);
            this.Repository.Save();
        }
    }
}
