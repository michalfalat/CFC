using CFC.Data.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class MoneyRecordViewModel
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime EditedAt { get; set; }

        public string CreatorId { get; set; }
        public string CreatorName { get; set; } // 
        public int CompanyId { get; set; }
        public string CompanyName { get; set; } // 

        public int? OfficeId { get; set; }
        public string OfficeName { get; set; } // 
        public MoneyRecordType Type { get; set; }

        public decimal Amount { get; set; }

        public string Description { get; set; }
        public bool Obsolete { get; set; }
    }
}
