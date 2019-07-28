using CFC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Repositories
{
    public class VerifyTokenRepository : Repository<VerifyUserToken>, IVerifyTokenRepository
    {
        public VerifyTokenRepository(ApplicationDbContext repositoryContext)
            : base(repositoryContext)
        {
        }
    }
}
