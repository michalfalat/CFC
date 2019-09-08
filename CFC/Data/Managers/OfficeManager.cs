using CFC.Data.Entities;
using CFC.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CFC.Data.Managers
{
    public class OfficeManager : IOfficeManager
    {
        private IRepositoryWrapper _repository { get; set; }
        private IOfficeRepository _officeRepository { get; set; }
        public OfficeManager(IRepositoryWrapper repository, IOfficeRepository officeRepository)
        {
            this._repository = repository;
            this._officeRepository = officeRepository;
        }
        public void Create(Office entity)
        {
            this._officeRepository.Create(entity);
            this._officeRepository.Save();
        }

        public void Edit(Office entity)
        {
            this._officeRepository.Update(entity);
            this._officeRepository.Save();
        }

        public Task<Office> FindById(int id)
        {
            return this._officeRepository.FindByCondition(a => a.Id == id)
                .Include(a => a.Companies).ThenInclude(b => b.Company)
                .FirstOrDefaultAsync();
        }

        public Task<List<Office>> GetAll()
        {
            return this._officeRepository.FindAll()
                .Include(s => s.Companies)
                .ToListAsync();
        }

        public void Remove(Office entity)
        {
            entity.Obsolete = true;
            this.Edit(entity);
        }

        public void Unremove(Office entity)
        {
            entity.Obsolete = false;
            this.Edit(entity);
        }

        public void AddCompanyToOffice(CompanyOffice entity, Office office)
        {
            if (office.Companies == null)
            {
                office.Companies = new List<CompanyOffice>();
            }
            this._repository.CompanyOfficeRepository.Create(entity);
            this._repository.CompanyOfficeRepository.Save();
            office.Companies.Add(entity);
            this.Edit(office);
        }

        public void RemoveCompanyFromOffice(int companyId, int officeId)
        {
            var office = this._officeRepository.FindByCondition(a => a.Id == officeId).FirstOrDefault();
            var company = this._repository.CompanyRepository.FindByCondition(a => a.Id == companyId).FirstOrDefault();
            var entity = this._repository.CompanyOfficeRepository.FindByCondition(a => a.OfficeId == officeId && a.CompanyId == companyId).FirstOrDefault();
            if (entity != null)
            {
                //office.Companies.Remove(entity);
                //this.Edit(office);
                //company.Offices.Remove(entity);
                //this._repository.CompanyRepository.Save();
                this._repository.CompanyOfficeRepository.Delete(entity);
                this._repository.CompanyOfficeRepository.Save();
            }
        }

        public async Task<List<Office>> GetOfficesByOwner(string ownerId)
        {
            var companies = await this._repository.CompanyRepository.FindByCondition(c => c.Owners.Select(o => o.UserId).Contains(ownerId) && !c.Obsolete)
              .Include(s => s.Owners)
              .Include(s => s.Offices).ThenInclude(o => o.Office)
              .ToListAsync();

            var offices = companies.SelectMany(c => c.Offices).Select(o => o.Office).Where(o => !o.Obsolete).ToList();
            return offices;
        }


        //public void AddUserToOffice(ApplicationUserOffice entity, Office office)
        //{
        //    if (office.Owners == null)
        //    {
        //        office.Owners = new List<ApplicationUserOffice>();
        //    }
        //    this._repository.ApplicationUserOfficeRepository.Create(entity);
        //    this._repository.ApplicationUserOfficeRepository.Save();
        //    office.Owners.Add(entity);
        //    this.Edit(office);
        //}

        //public void RemoveUserFromOffice(ApplicationUser user, Office office)
        //{
        //    var entity = this._repository.ApplicationUserOfficeRepository.FindByCondition(a => a.OfficeId == office.Id && a.UserId == user.Id).FirstOrDefault();
        //    if (entity != null)
        //    {
        //        //office.Owners.Remove(entity);
        //        //this.Edit(office);
        //        //user.Companies.Remove(entity);
        //        //this._repository.ApplicationUserRepository.Save();
        //        this._repository.ApplicationUserOfficeRepository.Delete(entity);
        //        this._repository.ApplicationUserOfficeRepository.Save();
        //    }
        //}
    }
}
