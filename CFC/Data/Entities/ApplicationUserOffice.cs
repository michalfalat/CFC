using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Entities
{
    public class ApplicationUserOffice
    {
        public ApplicationUserOffice()
        {

        }
        public int Id { get; set; }
        public ApplicationUser User { get; set; }
        public virtual string UserId { get; set; }

        public Office Office { get; set; }
        public virtual int OfficeId { get; set; }
        public decimal Percentage { get; set; }
    }
}
