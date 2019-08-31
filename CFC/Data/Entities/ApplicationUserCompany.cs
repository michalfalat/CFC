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
        public virtual ApplicationUser User { get; set; }
        public string UserId { get; set; }

        public virtual Company Company { get; set; }
        public int CompanyId { get; set; }
        public decimal Percentage { get; set; }

    }
}
