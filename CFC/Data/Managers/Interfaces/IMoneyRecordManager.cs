using CFC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Managers
{
    public interface IMoneyRecordManager : IManager<MoneyRecord>
    {
        Task<List<MoneyRecord>> GetAllForCompany(int companyId);
        Task<List<MoneyRecord>> GetAllForOffice(int officeId);
        decimal SumRecords(List<MoneyRecord> records);
        decimal SumRecordsForCompany(int companyId, List<MoneyRecord> records);

    }
}
