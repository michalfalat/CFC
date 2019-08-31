using CFC.Data.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Entities
{
    public class MoneyRecord : IEntity
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime EditedAt { get; set; }



        public string CreatorId { get; set; }
        public virtual ApplicationUser Creator { get; set; }
        public int CompanyId { get; set; }
        public virtual Company Company { get; set; }


        public int? OfficeId { get; set; }
        public virtual Office Office { get; set; }
        public MoneyRecordType Type { get; set; }

        public decimal Amount { get; set; }

        public string Description { get; set; }
        public bool Obsolete { get; set; }

    }
}
