using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Repositories
{
    public interface IRepositoryWrapper
    {
        ICompanyRepository CompanyRepository { get; }
        IOfficeRepository OfficeRepository { get; }

        IApplicationUserRepository ApplicationUserRepository { get; }
        IApplicationUserCompanyRepository ApplicationUserCompanyRepository { get; }
        ICompanyOfficeRepository CompanyOfficeRepository { get; }

        IPasswordResetTokenRepository PasswordResetTokenRepository { get; }
        IVerifyTokenRepository VerifyTokenRepository { get; }

        void Save();
    }
}
