using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CFC.Data.Entities;
using CFC.Data.Enums;
using CFC.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace CFC.Data.Managers
{
    public class MoneyRecordManager : IMoneyRecordManager
    {
        private IRepositoryWrapper _repository { get; set; }
        public MoneyRecordManager(IRepositoryWrapper repository, ICompanyRepository companyRepository)
        {
            this._repository = repository;
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
            return this._repository.MoneyRecordRepository.FindAll()
                .Include(s => s.Company)
                .Include(s => s.Office)
                .Include(s => s.Creator)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public void Remove(MoneyRecord entity)
        {
            entity.Obsolete = true;
            this.Edit(entity);
        }

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
                 .ToListAsync();
        }

        public Task<List<MoneyRecord>> GetAllForOffice(int officeId)
        {
            return this._repository.MoneyRecordRepository.FindByCondition(a => a.OfficeId == officeId)
                 .Include(a => a.Company)
                 .Include(a => a.Office).ThenInclude(c => c.Companies)
                 .Include(a => a.Creator)
                 .ToListAsync();
        }

        public decimal SumRecords(List<MoneyRecord> records)
        {
           return records.Sum(a => ((a.Type == MoneyRecordType.INCOME) ? a.Amount : a.Amount * -1));
        }

        public decimal SumRecordsForCompany(int companyId, List<MoneyRecord> records)
        {
            var companyRecords = records.Where(r => r.Company != null).ToList();
            var officeRecords = records.Where(r => r.Office != null).ToList();
            var companyRecordsSumIncomes = companyRecords.Where(a => (a.Type == MoneyRecordType.INCOME)).Sum(a => a.Amount);
            var companyRecordsSumExpenses = companyRecords.Where(a => (a.Type == MoneyRecordType.EXPENSE)).Sum(a => (a.Amount * (-1)));
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

            return companyRecordsSumIncomes + companyRecordsSumExpenses + officeRecordsSum;
        }
    }
}