using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Entities
{
    public class ApplicationUserCompany
    {
        public ApplicationUserCompany()
        {

        }

        public int Id { get; set; }
        public ApplicationUser User { get; set; }
        public Company Company { get; set; }
        public decimal Precentage { get; set; }

    }
}
