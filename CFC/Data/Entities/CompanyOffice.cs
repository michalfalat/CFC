using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Entities
{
    public class CompanyOffice
    {

        public CompanyOffice()
        {

        }

        public int Id { get; set; }
        public Company Company { get; set; }
        public virtual int CompanyId{ get; set; }
        public Office Office { get; set; }
        public virtual int OfficeId { get; set; }
        public decimal Percentage { get; set; }

    }
}
