using CFC.Data.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class OfficeViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTimeOffset RegistrationDate { get; set; }

        public OfficeStatus Status { get; set; }
        public bool Obsolete { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }

        public int OwnersCount { get; set; }
    }
}
