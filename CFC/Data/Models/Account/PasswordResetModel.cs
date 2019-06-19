using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class PasswordResetModel
    {
        public PasswordResetModel()
        {

        }
        [Required]
        public Guid Link { get; set; }
        [Required]

        public string Token { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
