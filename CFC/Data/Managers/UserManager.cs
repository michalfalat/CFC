using CFC.Data.Entities;
using CFC.Data.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Managers
{
    public class ApplicationUserManager : IApplicationUserManager
    {
        public IRepositoryWrapper Repository { get; set; }
        public ApplicationUserManager(IRepositoryWrapper repository)
        {
            this.Repository = repository;
        }
        public void Create(ApplicationUser entity)
        {
            this.Repository.ApplicationUserRepository.Create(entity);
            this.Repository.Save();
        }

        public Task<ApplicationUser> FindById(string id)
        {
            return this.Repository.ApplicationUserRepository.FindByCondition(u => u.Id == id).FirstOrDefaultAsync();
        }
    }
}
