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


        void CreateVerifyUserToken(VerifyUserToken token);

        Task<VerifyUserToken> GetVerifyToken(string id);

        Task MarkPasswordResetTokenAsUsed(int id);

        void EditUser(ApplicationUser entity);

        void BlockUser(ApplicationUser entity);

        void RemoveUser(ApplicationUser entity);

        void UnblockUser(ApplicationUser entity);

        void UnremoveUser(ApplicationUser entity);

        void VerifyUser(ApplicationUser entity);

        Task MarkVerifyUserTokenAsUsed(int id);

        Task<List<ApplicationUser>> GetUserList();


    }
}
