using CFC.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class MoneyRecordExtendedAddModel
    {
        public int? CompanyId { get; set; }

        public int? OfficeId { get; set; }
        public string CreatorId { get; set; }


        [Required]
        public MoneyRecordType Type { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        [MinLength(5)]
        public string Description { get; set; }
    }
}
