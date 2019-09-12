using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class AdminDashboardViewModel
    {
        public ICollection<UserExtendedDetailModel> Users { get; set; }
        public ICollection<CompanyViewModel> Companies { get; set; }
        public ICollection<OfficeViewModel> Offices { get; set; }

    }
}
