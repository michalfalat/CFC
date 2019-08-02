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
        public virtual string UserId { get; set; }

        public Company Company { get; set; }
        public virtual int CompanyId { get; set; }
        public decimal Percentage { get; set; }

    }
}
