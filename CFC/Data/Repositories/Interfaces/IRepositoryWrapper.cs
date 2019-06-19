using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Repositories
{
    public interface IRepositoryWrapper
    {
        ICompanyRepository CompanyRepository { get; }

        IApplicationUserRepository ApplicationUserRepository { get; }

        IPasswordResetTokenRepository PasswordResetTokenRepository { get; }

        void Save();
    }
}
