using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class OfficeCompanyViewModel
    {
        public int Id { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string CompanyIdentificationNumber { get; set; }
        public int OfficeId { get; set; }
        public string OfficeName { get; set; }
        //public DateTime RegistrationDate { get; set; }
        public decimal Percentage { get; set; }
    }
}
