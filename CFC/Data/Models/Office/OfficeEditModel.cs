using CFC.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class OfficeEditModel
    {
        public OfficeEditModel()
        {

        }

        [Required]
        public int OfficeId { get; set; }
        [Required]
        [MinLength(5)]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public DateTime RegistrationDate { get; set; }
        [Required]
        public OfficeStatus Status { get; set; }
    }
}
