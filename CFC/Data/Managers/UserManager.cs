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
        private IRepositoryWrapper _repository { get; set; }
        public ApplicationUserManager(IRepositoryWrapper repository)
        {
            this._repository = repository;
        }
        public void Create(ApplicationUser entity)
        {
            this._repository.ApplicationUserRepository.Create(entity);
            this._repository.Save();
        }

        public Task<ApplicationUser> FindById(string id)
        {
            return this._repository.ApplicationUserRepository.FindByCondition(u => u.Id == id).FirstOrDefaultAsync();
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
            return this._repository.PasswordResetTokenRepository.FindByCondition(u => u.Link == link).FirstOrDefaultAsync();
        }

        public void CreatePasswordResetToken(PasswordResetToken entity)
        {
            this._repository.PasswordResetTokenRepository.Create(entity);
            this._repository.Save();
        }

        public async Task MarkPasswordResetTokenAsUsed(int id)
        {
            var token = await this._repository.PasswordResetTokenRepository.FindByCondition(t => t.Id == id).FirstOrDefaultAsync();
            token.IsUsed = true;
            this._repository.PasswordResetTokenRepository.Update(token);
            this._repository.Save();
        }

        public void Edit(ApplicationUser entity)
        {
            this._repository.ApplicationUserRepository.Update(entity);
            this._repository.Save();

        }

        public Task<List<ApplicationUser>> GetAll()
        {
            return this._repository.ApplicationUserRepository.FindAll().ToListAsync();
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
            this._repository.VerifyTokenRepository.Create(entity);
            this._repository.Save();
        }

        public Task<VerifyUserToken> GetVerifyToken(string id)
        {
            return this._repository.VerifyTokenRepository.FindByCondition(u => u.Token == id).FirstOrDefaultAsync();
        }

        public async Task MarkVerifyUserTokenAsUsed(int id)
        {
            var token = await this._repository.VerifyTokenRepository.FindByCondition(t => t.Id == id).FirstOrDefaultAsync();
            token.Obsolete = true;
            this._repository.VerifyTokenRepository.Update(token);
            this._repository.Save();
        }
    }
}
