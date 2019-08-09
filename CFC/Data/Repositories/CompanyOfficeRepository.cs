using CFC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Repositories
{
    public class CompanyOfficeRepository : Repository<CompanyOffice>, ICompanyOfficeRepository
    {
        public CompanyOfficeRepository(ApplicationDbContext repositoryContext)
            : base(repositoryContext)
        {
        }

    }
}
