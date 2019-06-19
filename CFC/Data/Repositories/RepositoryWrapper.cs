using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Repositories
{
    public class RepositoryWrapper : IRepositoryWrapper
    {
        private ApplicationDbContext _dbContext;
        private ICompanyRepository _companyRepository;
        private IApplicationUserRepository _userRepository;
        private IPasswordResetTokenRepository _passwordResetTokenRepository;
        public ICompanyRepository CompanyRepository {
            get
            {
                if (_companyRepository == null)
                {
                    _companyRepository = new CompanyRepository(_dbContext);
                }

                return _companyRepository;
            }
        }

        public IApplicationUserRepository ApplicationUserRepository
        {
            get
            {
                if (_userRepository == null)
                {
                    _userRepository = new ApplicationUserRepository(_dbContext);
                }

                return _userRepository;
            }
        }


        public IPasswordResetTokenRepository PasswordResetTokenRepository
        {
            get
            {
                if (_passwordResetTokenRepository == null)
                {
                    _passwordResetTokenRepository = new  PasswordResetTokenRepository(_dbContext);
                }

                return _passwordResetTokenRepository;
            }
        }

        public RepositoryWrapper(ApplicationDbContext repositoryContext)
        {
            _dbContext = repositoryContext;
        }

        public void Save()
        {
            _dbContext.SaveChanges();
        }
    }
}
