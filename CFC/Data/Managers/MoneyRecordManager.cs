using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CFC.Data.Entities;
using CFC.Data.Enums;
using CFC.Data.Constants;
using CFC.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CFC.Data.Managers
{
    public class MoneyRecordManager : IMoneyRecordManager
    {
        private IRepositoryWrapper _repository { get; set; }
        private ICompanyManager _companyManager { get; set; }
        private IOfficeManager _officeManager { get; set; }
        public MoneyRecordManager(IRepositoryWrapper repository, ICompanyRepository companyRepository, ICompanyManager companyManager, IOfficeManager officeManager)
        {
            this._repository = repository;
            this._companyManager = companyManager;
            this._officeManager = officeManager;
            // this._companyRepository = companyRepository;
        }
        public void Create(MoneyRecord entity)
        {
            this._repository.MoneyRecordRepository.Create(entity);
            this._repository.MoneyRecordRepository.Save();
        }

        public void Edit(MoneyRecord entity)
        {
            this._repository.MoneyRecordRepository.Update(entity);
            this._repository.MoneyRecordRepository.Save();
        }

        public Task<MoneyRecord> FindById(int id)
        {
            return this._repository.MoneyRecordRepository.FindByCondition(a => a.Id == id)
                .Include(a => a.Company)
                .Include(a => a.Office)
                .Include(a => a.Creator)
                .FirstOrDefaultAsync();
        }

        public Task<List<MoneyRecord>> GetAll()
        {
            throw new NotImplementedException("Use with type!");
        }

        public Task<List<MoneyRecord>> GetAll(string type)
        {
            switch (type)
            {
                case Constants.Constants.RecordType.ALL:
                    return this._repository.MoneyRecordRepository.FindAll()
                       .Include(s => s.Company)
                       .Include(s => s.Office)
                       .Include(s => s.Creator)
                       .OrderByDescending(s => s.CreatedAt)
                       .ToListAsync();
                case Constants.Constants.RecordType.COMPANY:
                    return this._repository.MoneyRecordRepository.FindByCondition(r => r.Type == MoneyRecordType.EXPENSE || r.Type == MoneyRecordType.INCOME)
                       .Include(s => s.Company)
                       .Include(s => s.Office)
                       .Include(s => s.Creator)
                       .OrderByDescending(s => s.CreatedAt)
                       .ToListAsync();
                case Constants.Constants.RecordType.PERSONAL:
                    return this._repository.MoneyRecordRepository.FindByCondition(r => r.Type == MoneyRecordType.DEPOSIT || r.Type == MoneyRecordType.WITHDRAW)
                       .Include(s => s.Company)
                       .Include(s => s.Office)
                       .Include(s => s.Creator)
                       .OrderByDescending(s => s.CreatedAt)
                       .ToListAsync();
                default:
                    throw new Exception("Invalid record type");
            }           
        }

        public async Task<List<MoneyRecord>> GetAllCompanyRecordsForOwner(string type,string userId)
        {
            switch (type)
            {
                case Constants.Constants.RecordType.COMPANY:
                    var companies = await this._companyManager.GetCompaniesByOwner(userId);
                    var companyIds = companies.Select(c => c.Id).ToList();

                    var offices = await this._officeManager.GetOfficesByOwner(userId);
                    var officeIds = offices.Select(c => c.Id).ToList();

                    return this._repository.MoneyRecordRepository.FindByCondition(r =>
                        (r.Type == MoneyRecordType.EXPENSE || r.Type == MoneyRecordType.INCOME) &&
                        (companyIds.Contains(r.CompanyId.Value) || officeIds.Contains(r.OfficeId.Value))
                    )
                       .Include(s => s.Company)
                       .Include(s => s.Office)
                       .Include(s => s.Creator)
                       .OrderByDescending(s => s.CreatedAt)
                       .ToList();
                case Constants.Constants.RecordType.PERSONAL:
                    return this._repository.MoneyRecordRepository.FindByCondition(r => r.CreatorId == userId && (r.Type == MoneyRecordType.DEPOSIT || r.Type == MoneyRecordType.WITHDRAW))
                       .Include(s => s.Company)
                       .Include(s => s.Office)
                       .Include(s => s.Creator)
                       .OrderByDescending(s => s.CreatedAt)
                       .ToList();
                default:
                    throw new Exception("Invalid record type");
            }
        }

        public void Remove(MoneyRecord entity)
        {
            this._repository.MoneyRecordRepository.Delete(entity);
            this._repository.MoneyRecordRepository.Save();
        }

        [Obsolete]
        public void Unremove(MoneyRecord entity)
        {
            entity.Obsolete = false;
            this.Edit(entity);
        }

        public Task<List<MoneyRecord>> GetAllForCompany(int companyId)
        {
            return this._repository.MoneyRecordRepository
                .FindByCondition(a => a.CompanyId == companyId || a.Office.Companies.Select(c => c.CompanyId).Contains(companyId))
                 .Include(a => a.Company).ThenInclude(c => c.Offices)
                 .Include(a => a.Office).ThenInclude(c => c.Companies)
                 .Include(a => a.Creator)
                 .OrderByDescending(s => s.CreatedAt)
                 .ToListAsync();
        }

        public Task<List<MoneyRecord>> GetAllForOffice(int officeId)
        {
            return this._repository.MoneyRecordRepository.FindByCondition(a => a.OfficeId == officeId)
                 .Include(a => a.Company)
                 .Include(a => a.Office).ThenInclude(c => c.Companies)
                 .Include(a => a.Creator)
                 .OrderByDescending(s => s.CreatedAt)
                 .ToListAsync();
        }

        public Task<List<MoneyRecord>> GetAllPersonalForOwner(string userId)
        {
            return this._repository.MoneyRecordRepository.FindByCondition(a => a.CreatorId == userId &&
            (a.Type == MoneyRecordType.DEPOSIT || a.Type == MoneyRecordType.WITHDRAW))
                 .Include(a => a.Company)
                 .Include(a => a.Office).ThenInclude(c => c.Companies)
                 .Include(a => a.Creator)
                 .OrderByDescending(s => s.CreatedAt)
                 .ToListAsync();
        }

        public Task<List<MoneyRecord>> GetDepositsForOwner(string userId)
        {
            return this._repository.MoneyRecordRepository.FindByCondition(a => a.CreatorId == userId &&
            a.Type == MoneyRecordType.DEPOSIT)
                 .Include(a => a.Company)
                 .Include(a => a.Office).ThenInclude(c => c.Companies)
                 .Include(a => a.Creator)
                 .OrderByDescending(s => s.CreatedAt)
                 .ToListAsync();
        }

        public Task<List<MoneyRecord>> GetWithdrawsForOwner(string userId)
        {
            return this._repository.MoneyRecordRepository.FindByCondition(a => a.CreatorId == userId &&
            a.Type == MoneyRecordType.WITHDRAW)
                 .Include(a => a.Company)
                 .Include(a => a.Office).ThenInclude(c => c.Companies)
                 .Include(a => a.Creator)
                 .OrderByDescending(s => s.CreatedAt)
                 .ToListAsync();
        }

        public decimal SumRecords(List<MoneyRecord> records)
        {
            var companyRecordsSumIncomes = records.Where(a => (a.Type == MoneyRecordType.INCOME)).Sum(a => a.Amount);
            var companyRecordsSumExpenses = records.Where(a => (a.Type == MoneyRecordType.EXPENSE)).Sum(a => (a.Amount * (-1)));
            return companyRecordsSumIncomes + companyRecordsSumExpenses;
        }

        public decimal SumRecordsForCompany(int companyId, List<MoneyRecord> records)
        {
            var companyRecords = records.Where(r => r.Company != null).ToList();
            var officeRecords = records.Where(r => r.Office != null).ToList();
            var companyRecordsSumIncomes = companyRecords.Where(a => (a.Type == MoneyRecordType.INCOME)).Sum(a => a.Amount);
            var companyRecordsSumExpenses = companyRecords.Where(a => (a.Type == MoneyRecordType.EXPENSE)).Sum(a => (a.Amount * (-1)));
            var companyRecordsSumDeposits = companyRecords.Where(a => (a.Type == MoneyRecordType.DEPOSIT)).Sum(a => a.Amount);
            var companyRecordsSumWithdraws =  companyRecords.Where(a => (a.Type == MoneyRecordType.WITHDRAW)).Sum(a => (a.Amount * (-1)));
            var officeRecordsSum = 0m;
            foreach (var record in officeRecords)
            {
                var companyOffice = record.Office.Companies.FirstOrDefault(o => o.CompanyId == companyId);
                var percentage = companyOffice != null ? companyOffice.Percentage : 0;
                if(record.Type == MoneyRecordType.INCOME)
                {
                    officeRecordsSum += (record.Amount / 100m * percentage);
                }
                else if (record.Type == MoneyRecordType.EXPENSE)
                {
                    officeRecordsSum += (record.Amount / 100m * percentage * (-1));
                }
            }

            return companyRecordsSumIncomes + companyRecordsSumExpenses + officeRecordsSum + companyRecordsSumWithdraws + companyRecordsSumDeposits;
        }

        public decimal SumForeignDeposit(List<MoneyRecord> records, string exceptId)
        {
            var companyRecords = records.Where(r => r.Company != null).ToList();
            return companyRecords.Where(a => (a.Type == MoneyRecordType.DEPOSIT && a.CreatorId != exceptId)).Sum(a => a.Amount);
           
        }
        public decimal SumAllDeposits(List<MoneyRecord> records)
        {
            var companyRecords = records.Where(r => r.Company != null).ToList();
            return companyRecords.Where(a => (a.Type == MoneyRecordType.DEPOSIT)).Sum(a => a.Amount);
        }

        public decimal SumAllWithdraws(List<MoneyRecord> records)
        {
            var companyRecords = records.Where(r => r.Company != null).ToList();
            return companyRecords.Where(a => (a.Type == MoneyRecordType.WITHDRAW)).Sum(a => a.Amount * (-1));
        }

        public decimal SumRecordsForCompanyAndUser(int companyId, decimal percentage,  List<MoneyRecord> records)
        {
            return this.SumRecordsForCompany(companyId, records) / 100m * percentage;
        }


        public decimal SumRecordsForOwner(List<MoneyRecord> records)
        {
            var recordsSumDeposits = records.Where(a => (a.Type == MoneyRecordType.DEPOSIT)).Sum(a => a.Amount);
            var recordsSumWithdraws = records.Where(a => (a.Type == MoneyRecordType.WITHDRAW)).Sum(a => (a.Amount * (-1)));
            return recordsSumDeposits + recordsSumWithdraws;
        }

        public async Task<bool> CheckValidity(MoneyRecord record)
        {
            if(record.CreatorId == null)
            {
                return false;
            }
            var userCompanies = await this._companyManager.GetCompaniesByOwner(record.CreatorId);
            if(record.CompanyId != null)
            {
                var company = userCompanies.FirstOrDefault(c => c.Id == record.CompanyId);
                if(company == null)
                {
                    return false;
                }

            } else if(record.OfficeId != null)
            {
                var office = userCompanies.SelectMany(c => c.Offices).Where(o => o.OfficeId == record.OfficeId).FirstOrDefault();               
                if (office == null)
                {
                    return false;
                }
            }
            return true;
        }

    }
}