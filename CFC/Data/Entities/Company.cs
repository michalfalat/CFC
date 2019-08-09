using CFC.Data.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Entities
{
    public class Company : IEntity
    {
        public Company()
        {

        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string IdentificationNumber { get; set; }

        public DateTimeOffset RegistrationDate { get; set; }

        public CompanyStatus Status { get; set; }

        public bool Obsolete { get; set; }


        public ICollection<CompanyOffice> Offices { get; set; }
        public ICollection<ApplicationUserCompany> Owners { get; set; }


    }
}
