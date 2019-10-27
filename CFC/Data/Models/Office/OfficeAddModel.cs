using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class OfficeAddModel
    {
        [Required]
        [MinLength(5)]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public DateTimeOffset RegistrationDate { get; set; }

    }
}
