using CFC.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class CompanyAddModel
    {
        [Required]
        [MinLength(5)]
        public string Name { get; set; }

        public string IdentificationNumber { get; set; }

    }
}
