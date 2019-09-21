using CFC.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class CompanyEditUserModel
    {
        [Required]
        public string UserId { get; set; }
        [Required]
        public int CompanyId { get; set; }
        [Required]
        public decimal Percentage { get; set; }
        [Required]
        public CompanyOwnerRole Role { get; set; }
    }
}
