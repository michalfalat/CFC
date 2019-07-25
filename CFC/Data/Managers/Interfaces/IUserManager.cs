using CFC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Managers
{
    public interface IApplicationUserManager
    {
        void Create(ApplicationUser entity);
        Task<ApplicationUser> FindById(string id);
        string GenerateRandomPassword();

        Task<PasswordResetToken> GetTokenFromLink(Guid link);

        void CreatePasswordResetToken(PasswordResetToken token);

        Task MarkPasswordResetTokenAsUsed(int id);

        void EditUser(ApplicationUser entity);

        Task<List<ApplicationUser>> GetUserList();
    }
}
