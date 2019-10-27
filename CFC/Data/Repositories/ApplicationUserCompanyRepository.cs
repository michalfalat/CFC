using CFC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Repositories
{
    public class ApplicationUserCompanyRepository : Repository<ApplicationUserCompany>, IApplicationUserCompanyRepository
    {
        public ApplicationUserCompanyRepository(ApplicationDbContext repositoryContext)
            : base(repositoryContext)
        {
        }

    }
}
