using CFC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Managers
{
    public interface IApplicationUserManager : IManager<ApplicationUser>
    {
        Task<ApplicationUser> FindById(string id);
        string GenerateRandomPassword();

        Task<PasswordResetToken> GetTokenFromLink(Guid link);

        void CreatePasswordResetToken(PasswordResetToken token);


        void CreateVerifyUserToken(VerifyUserToken token);

        Task<VerifyUserToken> GetVerifyToken(string id);


        Task<VerifyUserToken> GetVerifyTokenByUserEmail(string email);

        Task MarkPasswordResetTokenAsUsed(int id);


        void BlockUser(ApplicationUser entity);


        void UnblockUser(ApplicationUser entity);

        void VerifyUser(ApplicationUser entity);

        Task MarkVerifyUserTokenAsUsed(int id);



    }
}
