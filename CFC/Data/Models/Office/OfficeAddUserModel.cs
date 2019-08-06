using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class OfficeAddUserModel
    {
        [Required]
        public string UserId { get; set; }
        [Required]
        public int OfficeId { get; set; }
        [Required]
        public decimal Percentage { get; set; }
    }
}
