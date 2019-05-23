using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class RegisterRequestViewModel
    {
        public RegisterRequestViewModel()
        {

        }
        [Required]
        [MinLength(4)]
        [MaxLength(64)]
        public string Name { get; set; }


        [Required]
        [MinLength(4)]
        [MaxLength(64)]
        public string Surname { get; set; }

        [Required]
        [MinLength(4)]
        [MaxLength(128)]
        [EmailAddress]
        public string Email { get; set; }


        [MinLength(4)]
        [MaxLength(64)]
        public string Phone { get; set; }
    }
}
