using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class OfficeEditCompanyModel
    {
        [Required]
        public int CompanyId { get; set; }
        [Required]
        public int OfficeId { get; set; }
        [Required]
        public decimal Percentage { get; set; }
    }
}
