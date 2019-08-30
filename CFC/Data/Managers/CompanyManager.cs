using CFC.Data.Entities;
using CFC.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CFC.Data.Managers
{
    public class CompanyManager : ICompanyManager
    {
        private IRepositoryWrapper _repository { get; set; }
        private ICompanyRepository _companyRepository { get; set; }
        public CompanyManager(IRepositoryWrapper repository, ICompanyRepository companyRepository)
        {
            this._repository = repository;
            this._companyRepository = companyRepository;
        }
        public void Create(Company entity)
        {
            this._companyRepository.Create(entity);
            this._companyRepository.Save();
        }

        public void Edit(Company entity)
        {
            this._companyRepository.Update(entity);
            this._companyRepository.Save();
        }

        public Task<Company> FindById(int id)
        {
            return this._companyRepository.FindByCondition(a => a.Id == id)
                .Include(a => a.Owners)
                .ThenInclude(b => b.User)
                .Include(a => a.Offices).ThenInclude(o => o.Office)
                .FirstOrDefaultAsync();
        }

        public Task<List<Company>> GetAll()
        {
            return this._companyRepository.FindAll()
                .Include(s => s.Owners)
                .Include(s => s.Offices)
                .ToListAsync();
        }

        public void Remove(Company entity)
        {
            entity.Obsolete = true;
            this.Edit(entity);
        }

        public void Unremove(Company entity)
        {
            entity.Obsolete = false;
            this.Edit(entity);
        }

        public void AddUserToCompany(ApplicationUserCompany entity, Company company)
        {
            if (company.Owners == null)
            {
                company.Owners = new List<ApplicationUserCompany>();
            }
            this._repository.ApplicationUserCompanyRepository.Create(entity);
            this._repository.ApplicationUserCompanyRepository.Save();
            company.Owners.Add(entity);
            this.Edit(company);
        }

        public void RemoveUserFromCompany(ApplicationUser user, Company company)
        {
            var entity = this._repository.ApplicationUserCompanyRepository.FindByCondition(a => a.CompanyId == company.Id && a.UserId == user.Id).FirstOrDefault();
            if (entity != null)
            {
                //company.Owners.Remove(entity);
                //this.Edit(company);
                //user.Companies.Remove(entity);
                //this._repository.ApplicationUserRepository.Save();
                this._repository.ApplicationUserCompanyRepository.Delete(entity);
                this._repository.ApplicationUserCompanyRepository.Save();
            }
        }
    }
}
