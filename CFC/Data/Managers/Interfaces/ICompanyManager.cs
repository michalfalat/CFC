using CFC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Managers
{
    public interface ICompanyManager : IManager<Company>
    {
        void AddUserToCompany(ApplicationUserCompany entity, Company company);
    }
}
