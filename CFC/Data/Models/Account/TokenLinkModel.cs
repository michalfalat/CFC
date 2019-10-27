using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class TokenLinkModel
    {
        [Required]
        public string Token { get; set; }
    }
}
