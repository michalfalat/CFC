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
        private IOfficeRepository _officeRepository;
        private IApplicationUserRepository _userRepository;
        private IPasswordResetTokenRepository _passwordResetTokenRepository;
        private IVerifyTokenRepository _verifyTokenRepository;
        private IApplicationUserCompanyRepository _userCompanyRepository;
        private ICompanyOfficeRepository _companyOfficeRepository;
        private IMoneyRecordRepository _moneyRecordRepository;
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

        public IOfficeRepository OfficeRepository
        {
            get
            {
                if (_officeRepository == null)
                {
                    _officeRepository = new OfficeRepository(_dbContext);
                }

                return _officeRepository;
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

        public IApplicationUserCompanyRepository ApplicationUserCompanyRepository
        {
            get
            {
                if (_userCompanyRepository == null)
                {
                    _userCompanyRepository = new ApplicationUserCompanyRepository(_dbContext);
                }

                return _userCompanyRepository;
            }
        }

        public ICompanyOfficeRepository CompanyOfficeRepository
        {
            get
            {
                if (_companyOfficeRepository == null)
                {
                    _companyOfficeRepository = new CompanyOfficeRepository(_dbContext);
                }

                return _companyOfficeRepository;
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

        public IVerifyTokenRepository VerifyTokenRepository
        {
            get
            {
                if (_verifyTokenRepository == null)
                {
                    _verifyTokenRepository = new VerifyTokenRepository(_dbContext);
                }

                return _verifyTokenRepository;
            }
        }

        public IMoneyRecordRepository MoneyRecordRepository
        {
            get
            {
                if (_moneyRecordRepository == null)
                {
                    _moneyRecordRepository = new MoneyRecordRepository(_dbContext);
                }

                return _moneyRecordRepository;
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
