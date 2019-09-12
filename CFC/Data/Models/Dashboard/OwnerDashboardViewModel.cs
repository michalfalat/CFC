using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class OwnerDashboardViewModel
    {
        public ICollection<CompanyViewModel> Companies { get; set; }
        public ICollection<OfficeViewModel> Offices { get; set; }

        public decimal TotalAvailable { get; set; }

        public decimal TotalDeposit { get; set; }
        public decimal TotalWithdraw { get; set; }
    }
}
