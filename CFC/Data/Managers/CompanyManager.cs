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
            return this._companyRepository.FindByCondition(a => a.Id == id).FirstOrDefaultAsync();
        }

        public Task<List<Company>> GetAll()
        {
            return this._companyRepository.FindAll().ToListAsync();
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
    }
}
