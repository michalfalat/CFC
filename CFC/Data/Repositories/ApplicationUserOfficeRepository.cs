using CFC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Repositories
{
    public class ApplicationUserOfficeRepository : Repository<ApplicationUserOffice>, IApplicationUserOfficeRepository
    {
        public ApplicationUserOfficeRepository(ApplicationDbContext repositoryContext)
            : base(repositoryContext)
        {
        }

    }
}
