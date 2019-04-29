using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Entities
{
    public class Company
    {
        public Company()
        {

        }

        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<CompanyOffice> Offices { get; set; }
        public ICollection<ApplicationUserCompany> Owners { get; set; }


    }
}
