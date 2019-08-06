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
                .Include(a => a.Owners)
                .ThenInclude(b => b.User)
                .Include(a => a.Company).FirstOrDefaultAsync();
        }

        public Task<List<Office>> GetAll()
        {
            return this._officeRepository.FindAll()
                .Include(s => s.Owners)
                .Include(s => s.Company)
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

        public void AddUserToOffice(ApplicationUserOffice entity, Office office)
        {
            if (office.Owners == null)
            {
                office.Owners = new List<ApplicationUserOffice>();
            }
            this._repository.ApplicationUserOfficeRepository.Create(entity);
            this._repository.ApplicationUserOfficeRepository.Save();
            office.Owners.Add(entity);
            this.Edit(office);
        }

        public void RemoveUserFromOffice(ApplicationUser user, Office office)
        {
            var entity = this._repository.ApplicationUserOfficeRepository.FindByCondition(a => a.OfficeId == office.Id && a.UserId == user.Id).FirstOrDefault();
            if (entity != null)
            {
                //office.Owners.Remove(entity);
                //this.Edit(office);
                //user.Companies.Remove(entity);
                //this._repository.ApplicationUserRepository.Save();
                this._repository.ApplicationUserOfficeRepository.Delete(entity);
                this._repository.ApplicationUserOfficeRepository.Save();
            }
        }
    }
}
