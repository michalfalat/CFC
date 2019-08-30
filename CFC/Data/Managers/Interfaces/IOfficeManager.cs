using CFC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Managers
{
    public interface IOfficeManager : IManager<Office>
    {
        void AddCompanyToOffice(CompanyOffice entity, Office office);
        void RemoveCompanyFromOffice(int companyId, int officeId);
    }
}
