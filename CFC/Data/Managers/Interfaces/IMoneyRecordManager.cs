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
        decimal SumForeignDeposit(List<MoneyRecord> records, string exceptId);
        decimal SumAllWithdraws(List<MoneyRecord> records);
        decimal SumAllDeposits(List<MoneyRecord> records);
        decimal SumRecordsForOwner(List<MoneyRecord> records);
        decimal SumRecordsForCompanyAndUser(int companyId, decimal percentage, List<MoneyRecord> records);
        Task<bool> CheckValidity(MoneyRecord record);

        Task<List<MoneyRecord>> GetAll(string type);

        Task<List<MoneyRecord>> GetAllCompanyRecordsForOwner(string type, string userId);

        Task<List<MoneyRecord>> GetWithdrawsForOwner(string userId);
        Task<List<MoneyRecord>> GetDepositsForOwner(string userId);
        Task<List<MoneyRecord>> GetAllPersonalForOwner(string userId);

    }
}
