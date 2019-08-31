using CFC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Repositories
{
    public class MoneyRecordRepository : Repository<MoneyRecord>, IMoneyRecordRepository
    {
        public MoneyRecordRepository(ApplicationDbContext repositoryContext)
            : base(repositoryContext)
        {
        }
    }
}
